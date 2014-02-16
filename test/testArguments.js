(function () {

	test("Arguments: Call with correct arguments", function () {
		var func = $$().Argument(0, 'string').$$(function (string) { ok(string); });
		func("ok");
	});

	test("Arguments: Call with too few arguments, but allowed types", function () {
		var func = $$().Argument(0, 'unset').$$(function (string) { ok(true); });
		func();
	});

	test("Arguments: Call with incorrect arguments", function () {
		var func = $$().Argument(0, 'number').$$(function (string) { ok(false); });
		try {
			func("ok");
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with correct and incorrect arguments", function () {
		var func = $$().Argument(0, 'number').Argument(1, 'string').$$(function (number, string) { ok(false); });
		try {
			func(1, 2);
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with too few arguments", function () {
		var func = $$().Argument(0, 'number').Argument(1, 'string').$$(function (number, string) { ok(false); });
		try {
			func(1);
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with correct multiple type matching", function () {
		var func = $$().Argument(0, 'number', 'string').$$(function (numberOrString) { ok(numberOrString); });
		func(1);
		func("ok");
	});

	test("Arguments: Call with incorrect multiple type matching", function () {
		var func = $$().Argument(0, 'number', 'string').$$(function (numberOrString) { ok(false); });
		try {
			func(true);
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with correct arguments, reference by name", function () {
		var func = $$().Argument('arg1', 'string').$$(function (arg1) { ok(arg1); });
		func("ok");
	});

	test("Arguments: Call with correct arguments, reference by name with subproperties", function () {
		var func = $$().Argument('arg1.test', 'string').Argument('arg1.test2.test3', 'number').$$(function (arg1) { ok(arg1); });
		func({
			test: "ok",
			test2: {
				test3: 3
			}
		});
	});

	test("Arguments: Call with incorrect arguments, reference by name", function () {
		var func = $$().Argument('arg1', 'string').$$(function (arg1) { ok(arg1); });
		try {
			func(true);
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with incorrect arguments, reference by name with subproperties", function () {
		var func = $$().Argument('arg1.test', 'string').Argument('arg1.test2.test3', 'number').$$(function (arg1) { ok(false); });
		try {
			func({
				test: "ok",
				test2: {
					test3: "not ok"
				}
			});
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with no subproperties, reference by name with subproperties", function () {
		var func = $$().Argument('arg1.test', 'string').Argument('arg1.test2.test3', 'number').$$(function (arg1) { ok(false); });
		try {
			func("ok");
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Arguments: Call with missing subproperties, reference by name with subproperties", function () {
		var func = $$().Argument('arg1.test', 'string').Argument('arg1.test2.test3', 'number').$$(function (arg1) { ok(false); });
		try {
			func({
				test: "ok",
				test2: "not ok"
			});
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

})();