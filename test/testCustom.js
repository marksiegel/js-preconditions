(function () {

	test("Custom: Before success, by reference", function () {
		expect(2);
		function validator () { ok(true); return true; }
		var func = $$().Custom(validator).$$(function () { ok(true); });
		func();
	});

	test("Custom: Before success, on class by reference", function () {
		expect(2);
		function Obj () {}
		Obj.prototype.validator = function () { ok(true); return true; }
		Obj.prototype.func = $$().Custom(Obj.prototype.validator).$$(function () { ok(true); });

		var instance = new Obj();
		instance.func();
	});

	test("Custom: Before success, on class by name", function () {
		expect(2);
		function Obj () {}
		Obj.prototype.validator = function () { ok(true); return true; }
		Obj.prototype.func = $$().Custom('validator').$$(function () { ok(true); });

		var instance = new Obj();
		instance.func();
	});

	test("Custom: Before failure", function () {
		expect(2);
		function validator () { ok(true); return false; }
		var func = $$().Custom(validator).$$(function () { ok(false); });
		try {
			func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Custom: After success, by reference", function () {
		expect(2);
		function validator () { ok(true); return true; }
		var func = $$().CustomAfter(validator).$$(function () { ok(true); });
		func();
	});

	test("Custom: After success, on class by reference", function () {
		expect(2);
		function Obj () {}
		Obj.prototype.validator = function () { ok(true); return true; }
		Obj.prototype.func = $$().CustomAfter(Obj.prototype.validator).$$(function () { ok(true); });

		var instance = new Obj();
		instance.func();
	});

	test("Custom: After success, on class by name", function () {
		expect(2);
		function Obj () {}
		Obj.prototype.validator = function () { ok(true); return true; }
		Obj.prototype.func = $$().CustomAfter('validator').$$(function () { ok(true); });

		var instance = new Obj();
		instance.func();
	});

	test("Custom: After failure", function () {
		expect(3);
		function validator () { ok(true); return false; }
		var func = $$().CustomAfter(validator).$$(function () { ok(true); });
		try {
			func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

})();