(function () {

	test("Return: Correct type", function () {
		var func = $$().Returns('string').$$(function () { ok(true); return "ok"; });
		func();
	});

	test("Return: Correct type - no return value", function () {
		var func = $$().Returns('nothing').$$(function () { ok(true); });
		func();
	});

	test("Return: Incorrect type", function () {
		var func = $$().Returns('number').$$(function () { ok(true); return "ok"; });
		try {
			func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Return: Incorrect type - no return value", function () {
		var func = $$().Returns('number').$$(function () { ok(true); });
		try {
			func();
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

	test("Return: Correct type - multiple types allowed", function () {
		var func = $$().Returns('string', 'number').$$(function (arg) { ok(true); return arg; });
		func(1);
		func("ok");
	});

	test("Return: Incorrect type - multiple types allowed", function () {
		var func = $$().Returns('string', 'number').$$(function (arg) { ok(true); return arg; });
		try {
			func(true);
			ok(false);
		} catch (e) {
			ok(true);
		}
	});

})();