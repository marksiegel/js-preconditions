define(['$$'], function ($$) {

	function Test () {
	}

	Test.prototype.create = $$("create").CalledOnce().Argument(0, 'jquery').PropertyAfter('_$div', 'jquery').Returns('this').$$(
	function ($parentDiv) {
		this._$div = $("<div>").appendTo($parentDiv);
		this._$div.addClass("module");
		return this;
	});

	Test.prototype.destroy = $$().CalledOnce().CalledAfter('create').Property('_$div', 'jquery').PropertyAfter('_$div', 'unset').Returns('nothing').$$(
	function destroy () {
		this._$div.remove();
		delete this._$div;
	});

	Test.prototype.setText = $$().Property('_$div', 'jquery').Argument(0, 'string').Returns('string').$$(
	function setText (text) {
		this._$div.text(text);
		return text;
	});

	Test.prototype.existsInDom = function () {
		return $.contains(document, this._$div[0]);
	};

	Test.prototype.setBold = $$().Property('_$div', 'jquery').Custom("existsInDom").Argument(0, 'boolean').$$(
	function setBold (b) {
		this._$div.css('font-weight', b ? 'bold' : null);
		return b;
	});
	
	return Test;
});