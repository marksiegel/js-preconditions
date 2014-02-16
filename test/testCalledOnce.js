(function () {

	var testModule = window.$$TestModule;
	
	test("CalledOnce: Call method once", function () {
		expect(2);

		var func = $$().Test().CalledOnce().$$(function () { ok(true); });
		func();

		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledOnce: Call a class method once", function () {
		expect(2);

		function Obj() {}
		Obj.prototype.func = $$().Test().CalledOnce().$$(function () { ok(true); });

		var obj = new Obj();
		obj.func();
		
		ok(testModule.checkAfter.state.called, "Called flag set on state");
	});

	test("CalledOnce: Call a method twice", function () {
		expect(2);

		var func = $$().Test().CalledOnce().$$(function () { ok(true); });
		func();
		try {
			func();
			ok(false, "Second call should have thrown an exception.");
		} catch (e) {
			ok(true);
		}
	});

	test("CalledOnce: Call a class method twice", function () {
		expect(2);

		function Obj() {}
		Obj.prototype.func = $$().Test().CalledOnce().$$(function () { ok(true); });

		var obj = new Obj();
		obj.func();
		try {
			obj.func();
			ok(false, "Second call should have thrown an exception.");
		} catch (e) {
			ok(true);
		}
	});
})();