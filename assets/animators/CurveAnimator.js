/**
 * @author daniel robin / 
 */

var CurveAnimator = function ( parameters ) {

	this.parameters = parameters || {};
	this.object = objects.curve;

	this.initialize = function () {

		var p = this.parameters, object = this.object;

		p.offset = 0;
		p.length = object.geometry.vertices.length;

		for ( var i = 0, il = p.length; i < il; i ++ ) {

			object.geometry.colors[ i ].setHex( p.startColor );

		}
		
		object.visible = true;

	};
	
	this.finalize = function () {
		
		this.update ( 1 );
		
		this.object.visible = true;
		
	};

	this.update = function ( t ) {

		var p = this.parameters;
	
		var length = Math.ceil( t * p.length ), object = this.object;

		for ( var i = p.offset; i < length; i ++ ) {

			object.geometry.colors[ i ].setHex( p.endColor );
		
		}
		
		p.offset = i;
		
		object.geometry.colorsNeedUpdate = true;

	};

};