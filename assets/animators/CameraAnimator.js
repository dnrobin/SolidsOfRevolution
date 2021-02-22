/**
 * @author daniel robin / 
 */

var CameraAnimator = function ( parameters ) {

	this.parameters = parameters || {};

	this.initialize = function () {

		camera.position.fromArray( this.parameters.startPosition );
		camera.up = new THREE.Vector3( 0, 1, 0 );
		camera.lookAt( this.parameters.startTarget );

	};
	
	this.finalize = function () {
		
		camera.position.fromArray( this.parameters.endPosition );
		camera.lookAt( this.parameters.endTarget );
		
	};

	this.update = function ( t ) {

		var p = this.parameters;

		camera.position.fromArray( WARP.Math.interpolate( p.startPosition, p.endPosition, t, p.positionMotion ) );
		camera.lookAt( (new THREE.Vector3).fromArray(WARP.Math.interpolate( p.startTarget, p.endTarget, t, p.targetMotion )) );

	};
};
