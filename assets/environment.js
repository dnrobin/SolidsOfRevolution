/**
 * @author daniel robin / 
 */

var animator, objects, scene, camera, renderer, controls;

var animating = false, mousedrag = false;

var mathFunctions = [
	function( x ) { return 0.25 * ( 3 + Math.cos(5*x) + Math.cos(0.8*x) ); }
];

var AnimationPlayer = function ( ) {
	
	this.html = [
	"<div id=\"animator-controls\" class=\"overlay unselectable\">",
	"	<div class=\"inner\">",
	"		<div id=\"play-button\" class=\"animator-control-button\"></div>",
	"		<div id=\"group\">",
	"			<div id=\"time-line\">",
	"				<div id=\"time-button\" class=\"animator-control-button\"></div>",
	"				<div id=\"time-line-line\"></div>",
	"			</div>",
	"			<div id=\"stop-button\" class=\"animator-control-button\"></div>",
	"		</div>",
	"	</div>",
	"</div>"
	].join("\n");

	this.css = [
	"<style type=\"text/css\">",
	"@keyframes animator_controls_fade_in { from { opacity:0.3; } to { opacity:0.6; } }",
	"@-webkit-keyframes animator_controls_fade_in { from { opacity:0.6; } to { opacity:0.3; } }",
	"#animator-controls { position:absolute; bottom:0; height:76px; opacity:1; }",
	"#animator-controls:hover { opacity:1; }",
	"#animator-controls .inner { position:relative; opacity:0.5; height:48px; min-width:58px; width:58px; margin:0 auto; background-color:rgba(0,0,0,0.3); -webkit-border-radius:8px; -moz-border-radius:8px; border-radius:8px; }",
	"#animator-controls .animator-control-button { display:inline-block; margin:6px 2px 0; width:34px; height:34px; background-image:url('img/controls_light_nb.png'); background-repeat:no-repeat; background-position:0 0; cursor:pointer; }",
	"#animator-controls div.animator-control-button:hover, ",
	"#animator-controls div.animator-control-button:active { opacity:0.7 !important; }",
	"#animator-controls #group { display:none; position:relative; margin:0 12px 0 56px; }",
	"#animator-controls #time-line { position:relative; display:inline-block; cursor:pointer; height:34px; margin-top:6px; background:none; }",
	"#animator-controls #time-line-line { background-color:#cfcfcf; height:7px; width:100%; border-radius:4px; border:1px solid #f0f0f0; margin-top:14px; }",
	"#animator-controls #time-button { background-position:-177px 0; position:absolute; top:-5px; zindex:111; }",
	"#animator-controls #play-button { background-position:-35px 0; position:absolute; left:12px; }",
	"#animator-controls #stop-button { background-position:-106px 0; position:absolute; right:0; }",
	"</style>"
	].join("\n");
	
	this.init = function ( ) {
		
		$(document.body).append( this.html );
		$('head').append( this.css );
		
		$("#animator-controls #play-button").click(function(){

			if ( ! animating ) {
				
				$("#animator-controls .inner").animate({width:"364px"},500);
				$("#animator-controls #time-line").animate({width:"248px"},500);
				$("#animator-controls #group").animate({opacity:"toggle"},500);
				
				// Set animation initial state
				hideObjects ( objects );
				lockControls = true;
				
				animating = true;
			}
			
			animator.togglePlay();
			
			$(this).css("background-position", animator.animating ? "-72px 0" : "-35px 0");
			
		});
		
		$("#animator-controls #stop-button").click(function(){

			if ( animating ) {

				animator.stop();
				
				// Set non-animation state
				hideObjects ( objects );
				var objToShow = [];
				if ( figure.parameters.showCurve ) { objToShow.push( objects.curve ); objToShow.push( objects.curveSurface ); }
				if ( figure.parameters.showVolume ) objToShow.push( objects.volumeOfRevolution );
				if ( figure.parameters.showVolumeFractions ) objToShow.push( objects.volumeFractions );
				showObjects ( objToShow );
				objects.volumeOfRevolution.material.opacity = figure.parameters.volumeOpacity;
				for ( i in objects.volumeFractions.children ) {
					objects.volumeFractions.children[i].material.opacity = figure.parameters.volumeFractionsOpacity;
				}
				objects.curveSurface.material.opacity = 0.8;
				// HACK TO PREVENT CONTROLS FROM OVERWRITING CAM STATE!
				lockControls = false;
				controls.update();
				// END HACK
				camera.position.set( figure.parameters.cameraPosition[0], figure.parameters.cameraPosition[1], figure.parameters.cameraPosition[2] );
				camera.rotation.set( figure.parameters.cameraRotation[0], figure.parameters.cameraRotation[1], figure.parameters.cameraRotation[2] );
				camera.up = new THREE.Vector3( 0, 1, 0 );
				
				$("#animator-controls .inner").animate({width:"58px"},500);
				$("#animator-controls #time-line").animate({width:"0px"},500);
				$("#animator-controls #group").animate({opacity:"toggle"},500);
				
				animating = false;
			}
			
			$("#animator-controls #play-button").css("background-position", "-35px 0");
			
		});
		
		$("#animator-controls #time-line").mousedown(function(e){
			
			var pos = ( e.pageX - $(this).offset().left ) / $(this).width();
			
			// Set animation initial state
			hideObjects ( objects );
			
			animator.setTime( pos * animator.duration );
		});
		
		$("#animator-controls #time-button").mousedown(function(){ mousedrag = true; });
		
		$("#animator-controls #time-line").mousemove(function(e){

			if ( mousedrag && e.pageX < $(this).offset().left + $(this).width() && e.pageX > $(this).offset().left ) {
				
				var timeline = $("#animator-controls #time-line");
				
				$("#animator-controls #time-button").offset({
					top:  timeline.offset().top,
					left: e.pageX - 17
				});
				
				var pos = ( e.pageX - $(this).offset().left ) / $(this).width();

				// Set animation initial state
				hideObjects ( objects );

				animator.setTime( pos * animator.duration );
				
			}

		});
		
		$(document).mouseup(function(){ mousedrag = false; });
		
	};
	
};

function hideObjects ( objects ) {
	
	for ( var key in objects ) {
		
		if ( objects[ key ] instanceof THREE.Object3D ) {
			
			hideObjects( objects[ key ].children );
			
		}
		
		objects[ key ].visible = false;
	}
	
}

function showObjects ( objects ) {
	
	for ( var key in objects ) {
		
		if ( objects[ key ] instanceof THREE.Object3D ) {
			
			showObjects( objects[ key ].children );
			
		}
		
		objects[ key ].visible = true;
	}
	
}

var loadScene = function ( ) {

	objects = {};
	
	var mathFunction = mathFunctions[ figure.parameters.mathFunction ];
	var a = figure.parameters.range[0], b = figure.parameters.range[1];
	
	/* MATERIALS */
	
	var curveMaterial = new THREE.LineBasicMaterial({
		//color:figure.parameters.curveColor,
		vertexColors:THREE.VertexColors,
		linewidth:3,
		transparent:true,
		opacity:1,
		depthTest:false
	});
	
	var curveSurfaceMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side:THREE.DoubleSide,
		transparent: true,
		opacity: 0.5,
		depthTest:false
   });

	var volumeFractionsMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		ambient: 0x6f6f6f,
		specular: 0xffffff,
		shininess: 1000,
		shading: THREE.SmoothShading,
		transparent: true,
		opacity: figure.parameters.volumeFractionsOpacity,
		wireframe: false
	});
	
	var volumeOfRevolutionMaterial = new THREE.MeshPhongMaterial({
		color:figure.parameters.volumeColor,//color: 0x48aff8,
		ambient: figure.parameters.volumeColor,
		specular: 0xffffff,
		shininess: 600,
		shading: THREE.SmoothShading,
		vertexColors: THREE.FaceColors,
		transparent: true,
		opacity: figure.parameters.volumeOpacity,
		wireframe: false,
		depthTest:false
	});
	
	/* GEOMETRIES */
	
	var volumeOfRevolutionGeometry = new WARP.VolumeOfRevolutionGeometry({
		adaptive: figure.parameters.adaptive,
		resolution: figure.parameters.resolution,
		a: a,
		b: b,
		y: mathFunction,
		rotationAxis: figure.parameters.rotateAround,
		rotationPoint: figure.parameters.rotateAbout
	});
	
	var curveGeometry = new THREE.Geometry();
	
	for ( var p = 1, pl = volumeOfRevolutionGeometry.points.length - 2; p < pl; p ++ ) {
		
		var point = volumeOfRevolutionGeometry.points[ p ];
		
		curveGeometry.vertices.push ( new THREE.Vector3( point.x, point.y, 0 ) );
		curveGeometry.colors.push ( new THREE.Color( figure.parameters.curveColor ) );
		
	}
	
	var curveSurfaceGeometry = curveGeometry.clone();
	
	curveSurfaceGeometry.vertices.push ( new THREE.Vector3( curveSurfaceGeometry.vertices[ 0 ].x, 0, 0 ) );
	
	for ( var v = 1, vl = n = curveSurfaceGeometry.vertices.length - 1; v < vl; v ++ ) {
		
		var vertex = curveSurfaceGeometry.vertices[ v ];
		
		curveSurfaceGeometry.vertices.push ( new THREE.Vector3( vertex.x, 0, 0 ) );
		
		curveSurfaceGeometry.faces.push ( new THREE.Face3( v - 1, v, n++, [ 0, 0, 1 ] ) );
		curveSurfaceGeometry.faces.push ( new THREE.Face3( v, n, n - 1, [ 0, 0, 1 ] ) );
		
	}
	
	curveSurfaceGeometry.computeVertexNormals();
	curveSurfaceGeometry.computeBoundingSphere();
	/*
	var surfaceFractions = new THREE.Object3D();
	
	for ( var x = a, n = 0, d = (b - a) / 10, xl = b - d; x < xl; x += d ) {
		
		var geometry = new THREE.Geometry();
	
		geometry.vertices.push ( new THREE.Vector3( x, mathFunction( x + d / 2 ), 0.001 ) );
		geometry.vertices.push ( new THREE.Vector3( x + d, mathFunction( x + d / 2 ), 0.001 ) );
		geometry.vertices.push ( new THREE.Vector3( x + d, 0, 0.001 ) );
		geometry.vertices.push ( new THREE.Vector3( x, 0, 0.001 ) );
		geometry.vertices.push ( new THREE.Vector3( x, mathFunction( x + d / 2 ), 0.001 ) );
		
		surfaceFractions.add(
			new THREE.Line(
				geometry,
				lineMaterial
			)
		);
		
		// geometry.faces.push ( new THREE.Face3( 0, 1, 2 ) );
		// geometry.faces.push ( new THREE.Face3( 0, 2, 3 ) );
		// 
		// objects.rectangles.add(
		// 	new THREE.Mesh(
		// 		geometry,
		// 		new THREE.MeshBasicMaterial({
		// 			color: options.regionColor,
		// 			side:THREE.DoubleSide,
		// 			transparent: true,
		// 			opacity: 0
		// 		})
		// 	)
		// );
		
		
	}
	*/
	var volumeFractions = new THREE.Object3D();
	
	for ( var x = a, d = (b - a) / 10, xl = b - d; x < xl; x += d ) {
		
		if ( figure.parameters.rotateAround == 'x' ) {
		
			volumeFractions.add( new THREE.Mesh(
				new WARP.VolumeOfRevolutionGeometry({
					adaptive: figure.parameters.adaptive,
					resolution: figure.parameters.resolution,
					a: x,
					b: x + d,
					y: function () { return mathFunction( x + d / 2 ); },
					rotationAxis: 'x'
				}),
				volumeFractionsMaterial
			) );
			
		}
		
		else {
			
			volumeFractions.add( new THREE.Mesh(
				new WARP.VolumeOfRevolutionGeometry({
					adaptive: figure.parameters.adaptive,
					resolution: figure.parameters.resolution,
					a: x,
					b: x + d,
					y: function () { return mathFunction( x + d / 2 ); },
					rotationAxis: 'y'
				}),
				volumeFractionsMaterial
			) );
			
		}
		
	}
	
	objects.curve = new THREE.Line( curveGeometry, curveMaterial );
	objects.curveSurface = new THREE.Mesh( curveSurfaceGeometry, curveSurfaceMaterial );
	//objects.surfaceFractions = surfaceFractions;
	objects.volumeFractions = volumeFractions;
	objects.volumeOfRevolution = new THREE.Mesh( volumeOfRevolutionGeometry, volumeOfRevolutionMaterial );
	
	hideObjects( objects );
	
	for ( var key in objects ) {
		
		scene.add( objects[ key ] );
		
	}
	
};