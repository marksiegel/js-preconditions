(function () {

	var testModule = window.$$TestModule;
	
	test("CalledAfter: Call methods in order", function () {
		expect(4);

		var first = $$().Test().$$(function () { ok(true); });
		var second = $$().Test().CalledAfter(first).$$(function () { ok(true); });
		
		first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledAfter: Call methods out of order", function () {
		expect(1);

		var first = $$().Test().$$(function () { ok(false); });
		var second = $$().Test().CalledAfter(first).$$(function () { ok(false); });
		
		try {
			second();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});

	test("CalledAfter: Call object methods in order (by reference)", function () {
		expect(4);

		function Obj () {}
		Obj.prototype.first = $$().Test().$$(function () { ok(true); });
		Obj.prototype.second = $$().Test().CalledAfter(Obj.prototype.first).$$(function () { ok(true); });
		
		var instance = new Obj();
		instance.first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		instance.second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledAfter: Call object methods out of order (by reference)", function () {
		expect(1);

		function Obj () {}
		Obj.prototype.first = $$().Test().$$(function () { ok(false); });
		Obj.prototype.second = $$().Test().CalledAfter(Obj.prototype.first).$$(function () { ok(false); });
		
		var instance = new Obj();
		try {
			instance.second();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});

		test("CalledAfter: Call object methods in order (by name)", function () {
		expect(4);

		function Obj () {}
		Obj.prototype.first = $$().Test().$$(function () { ok(true); });
		Obj.prototype.second = $$().Test().CalledAfter("first").$$(function () { ok(true); });
		
		var instance = new Obj();
		instance.first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		instance.second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledAfter: Call object methods out of order (by name)", function () {
		expect(1);

		function Obj () {}
		Obj.prototype.first = $$().Test().$$(function () { ok(false); });
		Obj.prototype.second = $$().Test().CalledAfter("first").$$(function () { ok(false); });
		
		var instance = new Obj();
		try {
			instance.second();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});
})();