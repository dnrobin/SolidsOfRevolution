/**
 * @author daniel robin / 
 */

var VolumeOfRevolutionAnimator = function ( parameters ) {

	this.parameters = parameters || {};
	this.object = objects.volumeOfRevolution;

	this.initialize = function () {

		this.object.material.opacity = this.parameters.startOpacity;
		this.object.visible = true;
		
	};
	
	this.finalize = function () {
		
		this.update ( 1 );
		
		this.object.visible = true;
		
	};

	this.update = function ( t ) {

		if ( t >= 0 ) this.object.visible = true;

		var p = this.parameters;

		this.object.material.opacity = WARP.Math.interpolate( p.startOpacity, p.endOpacity, t, p.motion );

	};

};