(function () {

	var tests = [
		{ result: true,		type: "string", 	value: "hello"},
		{ result: true,		type: "string", 	value: ""},
		{ result: false,	type: "string", 	value: 1},
		{ result: false,	type: "string", 	value: undefined},
		{ result: false,	type: "string", 	value: null},
		{ result: false,	type: "string", 	value: true},
		{ result: false,	type: "string", 	value: {}},
		{ result: false,	type: "string", 	value: ["hello"]},

		{ result: true,		type: "number", 	value: -1},
		{ result: true,		type: "number", 	value: Math.PI},
		{ result: true,		type: "number", 	value: Infinity},
		{ result: false,	type: "number", 	value: "hi"},
		{ result: false,	type: "number", 	value: undefined},
		{ result: false,	type: "number", 	value: null},
		{ result: false,	type: "number", 	value: true},
		{ result: false,	type: "number", 	value: {}},

		{ result: true,		type: "unset", 		value: undefined},
		{ result: false,	type: "unset", 		value: null},
		{ result: false,	type: "unset", 		value: 0},
		{ result: false,	type: "unset", 		value: false},

		{ result: true,		type: "nothing", 	value: undefined},
		{ result: false,	type: "nothing", 	value: null},
		{ result: false,	type: "nothing", 	value: 0},
		{ result: false,	type: "nothing", 	value: false},

		{ result: true,		type: "boolean",	value: true},
		{ result: true,		type: "boolean",	value: false},
		{ result: false,	type: "boolean",	value: 0},
		{ result: false,	type: "boolean",	value: undefined},
		{ result: false,	type: "boolean",	value: null},
		{ result: false,	type: "boolean",	value: {}}
	];

	test("$$.validateType", function () {
		tests.forEach(function (test) {
			ok($$.validateType(test.type, test.value) === test.result, test.type + " validation failed on " + test.value + ", expected " + test.result);
		});
	});

	test("$$.validateType: this", function () {
		var obj = {};
		var obj2 = {};
		ok($$.validateType.call(obj, "this", obj), "this validation passed for object that was correct");
		ok(!$$.validateType.call(obj, "this", obj2), "this validation failed for object that was incorrect");
	});

})();