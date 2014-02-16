(function () {

	var testModule = window.$$TestModule;
	
	test("CalledBefore: Call methods in order", function () {
		expect(4);

		var second = $$().Test().$$(function () { ok(true); });
		var first = $$().Test().CalledBefore(second).$$(function () { ok(true); });
		
		first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledBefore: Call methods out of order", function () {
		expect(2);

		var second = $$().Test().$$(function () { ok(true); });
		var first = $$().Test().CalledBefore(second).$$(function () { ok(false); });
		
		second();
		try {
			first();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});

	test("CalledBefore: Call object methods in order (by reference)", function () {
		expect(4);

		function Obj () {}
		Obj.prototype.second = $$().Test().$$(function () { ok(true); });
		Obj.prototype.first = $$().Test().CalledBefore(Obj.prototype.second).$$(function () { ok(true); });
		
		var instance = new Obj();
		instance.first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		instance.second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledBefore: Call object methods out of order (by reference)", function () {
		expect(2);

		function Obj () {}
		Obj.prototype.second = $$().Test().$$(function () { ok(true); });
		Obj.prototype.first = $$().Test().CalledBefore(Obj.prototype.second).$$(function () { ok(false); });
		
		var instance = new Obj();
		instance.second();
		try {
			instance.first();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});

	test("CalledBefore: Call object methods in order (by name)", function () {
		expect(4);

		function Obj () {}
		Obj.prototype.second = $$().Test().$$(function () { ok(true); });
		Obj.prototype.first = $$().Test().CalledBefore("second").$$(function () { ok(true); });
		
		var instance = new Obj();
		instance.first();
		ok(testModule.checkAfter.state.called, "Called flag set on state");

		instance.second();
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledBefore: Call object methods out of order (by name)", function () {
		expect(2);

		function Obj () {}
		Obj.prototype.second = $$().Test().$$(function () { ok(true); });
		Obj.prototype.first = $$().Test().CalledBefore("second").$$(function () { ok(false); });
		
		var instance = new Obj();
		instance.second();
		try {
			instance.first();
			ok(false, "Second should not be callable before first");
		} catch (e) {
			ok(true);
		}
	});
})();