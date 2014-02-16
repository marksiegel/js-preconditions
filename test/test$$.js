(function () {

	var testModule = window.$$TestModule;

	var arg1 = [1, undefined, 3];
	var arg2 = {hello: "world"}

	test("$$: Named method", function () {
		var func = $$().$$(function named (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
		});

		ok(func.$$, "Function missing $$");
		equal(func.$$.name, "named", "Function name is correct");
		ok(func.$$.id, "Function has no id");
		func(arg1, arg2);
	});

	test("$$: Method named through $$", function () {
		var func = $$("real name").$$(function named (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
		});

		ok(func.$$, "Function missing $$");
		equal(func.$$.name, "real name", "Function name is correct");
		ok(func.$$.id, "Function has no id");
		func(arg1, arg2);
	});

	test("$$: Unnamed method", function () {
		var func = $$().$$(function (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
		});

		ok(func.$$, "Function missing $$");
		ok(func.$$.name, "Function has no name");
		ok(func.$$.id, "Function has no id");
	});

	test("$$: Object method", function () {
		var instance;

		function Obj () {};
		Obj.prototype.func = $$().$$(function (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
			equal(this, instance, "This has expected value");
		});

		instance = new Obj();

		ok(instance.func.$$, "Function has $$");
		ok(instance.func.$$.name, "Function has name");
		ok(instance.func.$$.id, "Function has id");
		instance.func(arg1, arg2);
	});

	test("$$: Check parameters for method", function () {
		var rv = { test: "ok" };
		var func = $$().Test().$$(function (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
			return rv;
		});

		func(arg1, arg2);

		equal(testModule.checkBefore.$$, func.$$, "CheckBefore $$ is correct");
		equal(testModule.checkBefore.args[0], arg1, "CheckBefore argument[0] is correct");
		equal(testModule.checkBefore.args[1], arg2, "CheckBefore argument[0] is correct");
		equal(testModule.checkBefore.obj, window, "CheckBefore object is correct");
		equal(testModule.checkAfter.$$, func.$$, "CheckAfter $$ is correct");
		equal(testModule.checkAfter.obj, window, "CheckAfter object is correct");
		equal(testModule.checkAfter.returnValue, rv, "CheckAfter returnValue is correct");
	});

	test("$$: Check parameters for object method", function () {
		var instance;
		var rv = { test: "ok" };

		function Obj () {};
		Obj.prototype.func = $$().Test().$$(function (param1, param2) {
			equal(param1, arg1, "Param1 has expected value");
			equal(param2, arg2, "Param1 has expected value");
			equal(this, instance, "This has expected value");
			return rv;
		});

		instance = new Obj();
		instance.func(arg1, arg2);

		equal(testModule.checkBefore.$$, instance.func.$$, "CheckBefore $$ is correct");
		equal(testModule.checkBefore.args[0], arg1, "CheckBefore argument[0] is correct");
		equal(testModule.checkBefore.args[1], arg2, "CheckBefore argument[0] is correct");
		equal(testModule.checkBefore.obj, instance, "CheckBefore object is correct");
		equal(testModule.checkAfter.$$, instance.func.$$, "CheckAfter $$ is correct");
		equal(testModule.checkAfter.obj, instance, "CheckAfter object is correct");
		equal(testModule.checkAfter.returnValue, rv, "CheckAfter returnValue is correct");
	});

	test("$$: Check state for method is preserved", function () {
		var func = $$().Test().$$(function () {});

		func();
		var state1 = testModule.checkBefore.state;
		state1.test = true;

		func();
		var state2 = testModule.checkBefore.state;

		ok(state1 === state2, "State is preserved across function calls");
		ok(state2.test, "State values are preserved across function calls");
	});

	test("$$: Check state for different methods is separate", function () {
		var func = $$().Test().$$(function () {});
		var func2 = $$().Test().$$(function () {});

		func();
		var state1 = testModule.checkBefore.state;
		state1.test = true;

		func2();
		var state2 = testModule.checkBefore.state;

		ok(state1 !== state2, "State is distinct across different function calls");
		ok(!state2.test, "State values are distinct across different function calls");
	});

	test("$$: Check state for object method is preserved", function () {
		function Obj () {};
		Obj.prototype.func = $$().Test().$$(function () {});

		var instance = new Obj();
		instance.func();
		var state1 = testModule.checkBefore.state;
		state1.test = true;

		instance.func();
		var state2 = testModule.checkBefore.state;

		ok(state1 === state2, "State is preserved across function calls");
		ok(state2.test, "State values are preserved across function calls");
	});

	test("$$: Check state for different object methods is separate", function () {
		function Obj () {};
		Obj.prototype.func = $$().Test().$$(function () {});
		Obj.prototype.func2 = $$().Test().$$(function () {});

		var instance = new Obj();
		instance.func();
		var state1 = testModule.checkBefore.state;
		state1.test = true;

		instance.func2();
		var state2 = testModule.checkBefore.state;

		ok(state1 !== state2, "State is distinct across different function calls");
		ok(!state2.test, "State values are distinct across different function calls");
	});

	test("$$: Check state for different objects is separate", function () {
		function Obj () {};
		Obj.prototype.func = $$().Test().$$(function () {});

		var instance = new Obj();
		var instance2 = new Obj();

		instance.func();
		var state1 = testModule.checkBefore.state;
		state1.test = true;

		instance2.func();
		var state2 = testModule.checkBefore.state;

		ok(state1 !== state2, "State is distinct across different function calls");
		ok(!state2.test, "State values are distinct across different function calls");
	});
})();