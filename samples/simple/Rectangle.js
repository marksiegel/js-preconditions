define(['$$'], function ($$) {

	$$.addType('positiveNumber', function (value) { return value > 0; });
	
	function Rectangle (width, height) {
		this.setSize(width, height);
	}

	Rectangle.prototype.setPosition = $$().Argument(0, 'number').Argument(1, 'number').$$(
	function setPosition (x, y) {
		this.x = x;
		this.y = y;
	});

	Rectangle.prototype.setSize = $$().Argument(0, 'positiveNumber').Argument(1, 'positiveNumber').$$(
	function setSize (width, height) {
		this.width = width;
		this.height = height;
	});

	Rectangle.prototype.setColor = $$().Argument(0, 'string').$$(
	function setColor (color) {
		this.color = color;
	});

	Rectangle.prototype.getSVG = $$().PropertyAfter('_svg', 'jquery').Returns('jquery').$$(
	function getSVG () {
		if (!this._svg) { this._svg = this._makeSVG(); }
		return this._svg;
	});

	Rectangle.prototype._makeSVG = $$().CalledOnce().Property('width', 'positiveNumber').Property('height', 'positiveNumber').Returns('jquery').$$(
	function makeSVG () {
		var node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		var rect = $(node).attr("width", this.width).attr("height", this.height);
		rect.attr("x", this.x || 0).attr("y", this.y || 0);
		if (this.color) {
			rect.attr("fill", this.color);
		}
		return rect;
	});

	Rectangle.prototype.destroySVG = $$().CalledAfter('_makeSVG').Property('_svg', 'jquery').PropertyAfter('_svg', 'unset').$$(
	function destroySVG () {
		this._svg.remove();
		delete this._svg;
	});

	return Rectangle;

});