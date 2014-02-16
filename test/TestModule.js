window.$$TestModule = {};
(function (ns) {

	$$.addModule({
		name: "Test",
		setter: function () {},
		checkBefore: function (state, obj, args) {
			ns.checkBefore = {
				$$: this,
				state: state,
				obj: obj,
				args: args
			};
		},
		checkAfter: function (state, obj, returnValue) {
			ns.checkAfter = {
				$$: this,
				state: state,
				obj: obj,
				returnValue: returnValue
			};
		}
	});
	
})(window.$$TestModule);