/**
 * @author daniel robin / 
 */

var VolumeFractionsAnimator = function ( parameters ) {

	this.parameters = parameters || {};
	this.object = objects.volumeFractions;

	this.initialize = function () {

		var _this = this;

		var startOpacity = _this.parameters.startOpacity;

		var i = _this.object.children.length - 1;
		
		do {
			
			_this.object.children[ i ].material.opacity = startOpacity;
			_this.object.children[ i ].visible = true;
			
		} while ( --i >= 0 );

	};
	
	this.finalize = function () {
		
		this.update ( 1 );
		
		this.object.visible = false;
		
	};

	this.update = function ( t ) {

		var _this = this;
		
		var p = _this.parameters;
		
		var opacity = WARP.Math.interpolate( p.startOpacity, p.endOpacity, t, p.motion );
		
		var i = _this.object.children.length - 1;
		
		do {
			
			_this.object.children[ i ].material.opacity = opacity;
			_this.object.children[ i ].visible = t != 1;
			
		} while ( --i >= 0 );

	};

};