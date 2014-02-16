(function () {

	test("Property: Before with property right type", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop', 'string').$$(function () { ok(true); });

		var instance = new Obj();
		instance.prop = "ok";
		instance.func();
	});

	test("Property: Before with subproperty right type", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop.test', 'string').$$(function () { ok(true); });

		var instance = new Obj();
		instance.prop = { test: "ok" };
		instance.func();
	});

	test("Property: Before with subproperty wrong type", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop.test', 'string').$$(function () { ok(false); });

		var instance = new Obj();
		instance.prop = {test: true};
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: Before with subproperty missing", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop.test', 'string').$$(function () { ok(false); });

		var instance = new Obj();
		instance.prop = "ok";
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: Before with property wrong type", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop', 'string').$$(function () { ok(false); });

		var instance = new Obj();
		instance.prop = true;
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: Before with property unset", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop', 'string').$$(function () { ok(false); });

		var instance = new Obj();
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: After with property right type", function () {
		function Obj () {}
		Obj.prototype.func = $$().PropertyAfter('prop', 'string').$$(function () { this.prop = "ok"; ok(true); });

		var instance = new Obj();
		instance.func();
	});

	test("Property: After with property wrong type", function () {
		function Obj () {}
		Obj.prototype.func = $$().PropertyAfter('prop', 'string').$$(function () { this.prop = true; ok(true); });

		var instance = new Obj();
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: After with property unset", function () {
		function Obj () {}
		Obj.prototype.func = $$().PropertyAfter('prop', 'string').$$(function () { ok(true); });

		var instance = new Obj();
		try {
			instance.func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Property: Before and after with property different type", function () {
		function Obj () {}
		Obj.prototype.func = $$().Property('prop', 'string').PropertyAfter('prop', 'number').$$(function () { this.prop = 1; ok(true); });

		var instance = new Obj();
		instance.prop = "ok";
		instance.func();
	});

	test("Property: Non class method", function () {
		var func = func = $$().Property('prop', 'string').$$(function () { ok(false); });
		try {
			func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

})();