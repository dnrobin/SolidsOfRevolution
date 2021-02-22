/**
 * @author daniel robin / 
 */

var ControlsAnimator = function ( parameters ) {

	this.parameters = parameters || {};
	this.object = null;

	this.initialize = function () {

		lockControls = this.parameters.startValue;

	};
	
	this.finalize = function () {
		
		lockControls = this.parameters.endValue;
		
	};

	this.update = function ( t ) {

		lockControls = t > 0.5 ? this.parameters.endValue : this.parameters.startValue;

	};

};