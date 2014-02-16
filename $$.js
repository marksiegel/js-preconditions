(function () {
	var $ = window.$;

	// The debug flag is read from the $$.debug state at the time this module is loaded.
	var debug = window.$$ && window.$$.debug;

	// Validator modules - can be contribued via $$.addModule(module)
	// A module will be called when a method is executed to determine if the program state is correct
	// 
	// module.name - identifier for the module & the function name that it will put onto $$
	// module.alwaysActive - [optional] always execute the checkBefore/checkAfter calls even if the setter was
	//                                  never called on this function (defaults false for optimization)
	// module.setter - setter function for when $$.{module.name} gets called
	//               - 'this' will be the $$ object being configured
	//               - arguments can be anything the module wants to accept as configuration
	// module.checkBefore(state, obj, args)
	//               - [optional] function to call before the function is executed
	//               - 'this' will be the $$ object that belongs to the function
	//               - state = a state object pertaining to this function (specific to the object invoked)
	//                         that can be populated with any data the module requires
	//                         e.g. state.called stores whether the method was ever called before (via Called module)
	//               - obj   = the 'this' object that will be passed to the function (an object or window)
	//               - args  = the arguments object that will be passed to the function
	// module.checkAfter(state, obj, returnValue)
	//               - [optional] function to call after the function is executed
	//               - 'this' will be the $$ object that belongs to the function
	//               - state = a state object pertaining to this function (specific to the object invoked)
	//                         that can be populated with any data the module requires
	//                         e.g. state.called stores whether the method was ever called before (via Called module)
	//               - obj   = the 'this' object that will be passed to the function (an object or window)
	//               - returnValue = the value returned from the function or undefined if there was no return value

	var modules = [];
	function addModule (module) {
		modules.push(module);
		$$ = undefined; // Reset $$ so that it gets re-initialized next call
	}

	// Types - can be contributed via $$.case type, validatorFunction)
	// A type is used to identify correct state of a piece of program state and is, for example, used to match function
	// arguments, return values, object properties, etc.
	//
	// type - a string reference that can be used in a variety of modules to associate a variable with a type
	// validatorFunction(value) - function that will be called to assess whether value matches the type
	//                          - 'this' will be the 'this' object that the function will receive (an object or window)
	//                          - value - the value to validate

	var types = {};
	function addType (type, validator) {
		types[type] = validator;
	}

	// Create the $$ class object, but stub everything out - the program will run nearly as fast as it would have without the
	// $$ calls since all the setters do nothing and the function never gets wrapped.
	function makeStubClass () {
		function $$ () {};
		function noop () { return this; }
		modules.forEach(function (module) { this[module.name] = noop; }, $$.prototype);
		$$.prototype.$$ = function (func) { return func; };
		return $$;
	}

	// Mark the module as active on $$, as an optimization to determine which modules should be checked
	function activateModule ($$, module) {
		$$.$$activatedModules = $$.$$activatedModules || {};
		if ($$.$$activatedModules[module.name]) { return; }
		$$.$$activatedModules[module.name] = true;
		if (module.checkBefore) { ($$.$$checkBefore || ($$.$$checkBefore = [])).push(module.checkBefore); }
		if (module.checkAfter) { ($$.$$checkAfter || ($$.$$checkAfter = [])).push(module.checkAfter); }
	}

	// From http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	function getParamNames(func) {
		var fnStr = func.toString().replace(STRIP_COMMENTS, '');
		var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
		if(result === null) {
			result = [];
		}
		return result;
	}

	// Create the $$ class object, wiring up the setters modules and wrapping the function with validation logic
	function makeClass () {
		var idIndex = 0;
		function $$ (name) { 
			this.$$validator = new $$Validator(name);
			modules.filter(function (module) { return module.alwaysCheck; }).forEach(function (module) { activateModule(this.$$validator, module); }, this);
		}
		modules.forEach(function (module) {
			this[module.name] = function () { module.setter.apply(this.$$validator, arguments); activateModule(this.$$validator, module); return this; };
		}, $$.prototype);
		$$.prototype.$$ = function (func) {
			var that = this.$$validator;
			if (that.id) { throw "Error: This $$ was already used to wrap a function."; }

			// Generate a name and a unique id for this method
			Object.defineProperty(that, 'name', {
				value: that.name || func.name || "Unnamed function",
				writeable: false
			});
			Object.defineProperty(that, 'id', {
				value: ++idIndex,
				writeable: false
			});

			that.$$functionParameterNames = getParamNames(func);

			// TOOD - create new wrapped object (that doesn't have setters on it, and could have helper methods that wouldn't be available to the setters)
			//        above: module.setter.apply(this.inner$$, arguments)...
			var wrapped = function () {
				// Wrapped function retrieves the function state on the object
				var state = that.getState(this);
				// Validates before
				checkBefore(that, state, this, arguments);
				// Executes the real function
				var returnValue = func.apply(this, arguments);
				// Validates after
				checkAfter(that, state, this, returnValue);
				// Returns
				return returnValue;
			};
			// Add a back reference from the function to this $$ object
			wrapped.$$ = that;
			return wrapped;
		};
		return $$;
	}

	function make$$ () {
		// Decide which $$ class to make based on the debug flag
		return debug ? makeClass() : makeStubClass();
	}

	function $$Validator(name) {
		this.name = name;
	}

	$$Validator.prototype.getState = function (obj) {
		if (obj && obj !== window) {
			// If obj is a real object, then store the state on it.  The state will be a map of
			// $$.ids since the object will likely have several functions on it
			var obj$$ = obj._$$_ = obj._$$_ || {};
			return obj$$[this.id] || (obj$$[this.id] = {});
		} else {
			// If obj is not a real object, the method is not a class method and we don't need
			// to store state on a per-object basis.  Store the state on the $$ object for
			// ease of access
			return this.$$state || (this.$$state = {});
		}
	}

	$$Validator.prototype.getFunc = function(obj, nameOrFunc) {
		return typeof nameOrFunc === 'string' ? obj[nameOrFunc] : nameOrFunc;
	};

	$$Validator.prototype.PROPERTY_NOT_FOUND = {};
	$$Validator.prototype.getProperty = function(obj, propertyNames) {
		var value = obj[propertyNames[0]];
		var i, len = propertyNames.length;
		for (i=1; i<len; ++i) {
			if (!value) { return this.PROPERTY_NOT_FOUND; }
			value = value[propertyNames[i]];
		}
		return value;
	};

	$$Validator.prototype.getArg = function (args, namesOrIndex) {
		if (Array.isArray(namesOrIndex)) {
			var nameParts = namesOrIndex;
			var index = this.$$functionParameterNames.indexOf(nameParts[0]);
			var value = args[index];
			var i, len = nameParts.length;
			for (i=1; i<len; ++i) {
				if (!value) { return this.PROPERTY_NOT_FOUND; }
				value = value[nameParts[i]];
			}
			return value;
		}
		return args[namesOrIndex];
	};

	function checkBefore ($$, state, obj, args) {
		var validators = $$.$$checkBefore;
		if (!validators) { return; }
		for (var i=0, len=validators.length; i<len; ++i) {
			validators[i].call($$, state, obj, args);
		}
	}

	function checkAfter ($$, state, obj, returnValue) {
		var validators = $$.$$checkAfter;
		if (!validators) { return; }
		for (var i=0, len=validators.length; i<len; ++i) {
			validators[i].call($$, state, obj, returnValue);
		}
	}

	function validateType (type, value) {
		switch(type) {
			case 'string': return typeof value === 'string';
			case 'number': return typeof value === 'number';
			case 'boolean': return value === true || value === false;
			case 'truthy': return value;
			case 'falsy': return !value;
			case 'unset': return value === undefined;
			case 'nothing': return value === undefined;
			case 'this': return value === this;
			default: if (types[type]) { return types[type].call(this, value); }
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	// CALLED MODULES
	///////////////////////////////////////////////////////////////////////////////////////////////

	var CalledOnceModule = {
		name: "CalledOnce",
		alwaysCheck: true,
		setter: function () { this.checkCalledOnce = true; },
		checkBefore: function (state) {
			if (this.checkCalledOnce && state.called) { throw "Error: " + this.name + " should only be called once."; }
			state.called = true;
		}
	};

	var CalledBeforeModule = {
		name: "CalledBefore",
		setter: function (nameOrFunc) {
			this.checkCalledBefore = this.checkCalledBefore || [];
			this.checkCalledBefore.push(nameOrFunc);
		},
		checkBefore: function (state, obj) {
			if (this.checkCalledBefore) {
				this.checkCalledBefore.forEach(function (nameOrFunc) {
					var func = this.getFunc(obj, nameOrFunc);
					if (!func.$$) { throw "Error: " + this.name + " expected to be called before method that wasn't wrapped."; }
					var otherState = func.$$.getState(obj);
					if (otherState.called) { throw "Error: " + this.name + " expected to be called before " + func.$$.name + "."; }
				}, this);
			}
		}
	};

	var CalledAfterModule = {
		name: "CalledAfter",
		setter: function (nameOrFunc) {
			this.checkCalledAfter = this.checkCalledAfter || [];
			this.checkCalledAfter.push(nameOrFunc);
		},
		checkBefore: function (state, obj) {
			if (this.checkCalledAfter) {
				this.checkCalledAfter.forEach(function (nameOrFunc) {
					var func = this.getFunc(obj, nameOrFunc);
					if (!func.$$) { throw "Error: " + this.name + " expected to be called after method that wasn't wrapped."; }
					var otherState = func.$$.getState(obj);
					if (!otherState.called) { throw "Error: " + this.name + " expected to be called after " + func.$$.name + "."; }
				}, this);
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////////
	// ARGUMENT MODULES
	///////////////////////////////////////////////////////////////////////////////////////////////

	var ArgumentModule = {
		name: "Argument",
		setter: function (nameOrIndex) {
			this.checkArgument = this.checkArgument || [];
			this.checkArgument.push({nameOrIndex: nameOrIndex, splitNamesOrIndex: typeof nameOrIndex === 'string' ? nameOrIndex.split('.') : nameOrIndex, types: Array.prototype.slice.call(arguments, 1)});
		},
		checkBefore: function (state, obj, args) {
			if (this.checkArgument) {
				this.checkArgument.forEach(function (arg) {
					var value = this.getArg(args, arg.splitNamesOrIndex);
					if (value === this.PROPERTY_NOT_FOUND) { throw "Error: " + this.name + "'s argument " + arg.nameOrIndex + " wasn't found.";}
					if (!arg.types.some(function (type) {
						return validateType(type, value);
					})) {
						throw "Error: " + this.name + "'s argument " + arg.nameOrIndex + " didn't match types.";
					}
				}, this);
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////////
	// PROPERTY MODULES
	///////////////////////////////////////////////////////////////////////////////////////////////

	function checkProperty (checkPropertyArgs, obj) {
		if (!checkPropertyArgs) { return; }
		if (obj === window) { throw "Error: Cannot check property for non-class method: " + this.name + "."; }
		checkPropertyArgs.forEach(function (arg) {
			var value = this.getProperty(obj, arg.splitPropertyNames);
			if (value === this.PROPERTY_NOT_FOUND) { throw "Error: " + this.name + "'s propert " + arg.propertyName + " wasn't found.";}
			if (!arg.types.some(function (type) {
				return validateType(type, value);
			})) {
				throw "Error: " + this.name + "'s property '" + arg.propertyName + "' didn't match types after method execution.";
			}
		}, this);
	}

	var PropertyModule = {
		name: "Property",
		setter: function (propertyName) {
			this.checkProperty = this.checkProperty || [];
			this.checkProperty.push({propertyName: propertyName, splitPropertyNames: propertyName.split('.'), types: Array.prototype.slice.call(arguments, 1)});
		},
		checkBefore: function (state, obj) {
			checkProperty.call(this, this.checkProperty, obj);
		}
	};

	var PropertyAfterModule = {
		name: "PropertyAfter",
		setter: function (propertyName) {
			this.checkPropertyAfter = this.checkPropertyAfter || [];
			this.checkPropertyAfter.push({propertyName: propertyName, splitPropertyNames: propertyName.split('.'), types: Array.prototype.slice.call(arguments, 1)});
		},
		checkAfter: function (state, obj) {
			checkProperty.call(this, this.checkPropertyAfter, obj);
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////////
	// RETURN MODULES
	///////////////////////////////////////////////////////////////////////////////////////////////

	var ReturnsModule = {
		name: "Returns",
		setter: function () {
			this.checkReturns = this.checkReturns || [];
			this.checkReturns.push({types: Array.prototype.slice.call(arguments, 0)});
		},
		checkAfter: function (state, obj, returnValue) {
			if (this.checkReturns) {
				this.checkReturns.forEach(function (arg) {
					if (!arg.types.some(function (type) {
						return validateType.call(obj, type, returnValue);
					})) {
						throw "Error: " + this.name + "'s return value didn't match types.";
					}
				}, this);
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////////
	// CUSTOM MODULES
	///////////////////////////////////////////////////////////////////////////////////////////////

	function customChecks (customChecksArgs, obj) {
		if (!customChecksArgs) { return; }
		customChecksArgs.forEach(function (arg) {
			var func = this.getFunc(obj, arg.nameOrFunc);
			if (!func.call(obj)) {
				if (arg.description) {
					throw "Error: " + this.name + " custom validation failed: " + arg.description + ".";
				}
			 	throw "Error: " + this.name + " custom validation failed.";
			}
		}, this);
	}

	var CustomModule = {
		name: "Custom",
		setter: function (nameOrFunc, description) {
			this.customChecks = this.customChecks || [];
			this.customChecks.push({
				nameOrFunc: nameOrFunc,
				description: description || (typeof nameOrFunc === 'string' ? nameOrFunc : nameOrFunc.name)
			});
		},
		checkBefore: function (state, obj) {
			customChecks.call(this, this.customChecks, obj);
		}
	};

	var CustomAfterModule = {
		name: "CustomAfter",
		setter: function (nameOrFunc, description) {
			this.customAfterChecks = this.customChecks || [];
			this.customAfterChecks.push({
				nameOrFunc: nameOrFunc,
				description: description || (typeof nameOrFunc === 'string' ? nameOrFunc : nameOrFunc.name)
			});
		},
		checkAfter: function (state, obj) {
			customChecks.call(this, this.customAfterChecks, obj);
		}
	};

	addModule(CalledOnceModule);
	addModule(CalledBeforeModule);
	addModule(CalledAfterModule);
	addModule(ArgumentModule);
	addModule(PropertyModule);
	addModule(PropertyAfterModule);
	addModule(ReturnsModule);
	addModule(CustomModule);
	addModule(CustomAfterModule);

	if ($) {
		addType('jquery', function (value) { return value instanceof $; });
	}

	var $$;
	function $$external (name) {
		if (!$$) { $$ = make$$(); }
		return new $$(name);
	}

	$$external.addModule = addModule;
	$$external.addType = addType;
	$$external.validateType = validateType;

	if (window.require && window.define) {
		window.define(function () { return $$external; });
	} else {
		window.$$ = $$external;
	}
})();