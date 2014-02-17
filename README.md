js-preconditions
================

A declarative way to specify and enforce preconditions and postconditions for method execution in javascript

This library explores the ability to easily annotate javascript methods for execution conditions and validating those conditions at runtime.  The intent is to facilitate a developer's understanding and description for how program flow is intended to operate, as well as to easily and quickly isolate a program condition that violates the programmer's intentions.  The library has builtin conditions ranging from being able to validate that functions are called in a certain order, are called with specific argument types, return specific types, check that an object has certain properties set, and more.

Example:

var myFunc = $$().Argument('foo', 'string').Returns('boolean').$$(
  function (foo) {
    // method contents
    return true;
  });

The above pattern notifies that this function should be called such that the 'foo' argument is a string and that it will return a boolean value.

Enabling js-preconditions
=========================

The js-preconditions library operates in one of two modes: debug off (default) and debug on.  

With debug off there is no validation performed and the program will operate much in the same way (and just about as fast) it would had you not declared any preconditions.  The only overhead is the calling of the precondition functions at method declaration time which end up doing nothing in this mode anyways.

To enable debug on, before the library is loaded make sure to set $$ = {debug: true} in the global namespace.  With the library in debug mode, the program should execute similarly to how it would without preconditions, except that the library will now throw an exception whenever one of the conditions is violated.  The validation of the conditions also takes its toll in terms of performance overhead.  With a few conditions per method, the application might operate around 30-50% slower while checking conditions.

js-preconditions is accessed through the global object $$, unless require is loaded in which case the $$ object is available through require.

Usage
=====

$$(name) - Use this method to begin wrapping a function.  It will return an object with various methods available on used to describe the conditions of the function.  Each of these condition setters will return the object again for ease of chaining.  See Built-in Conditions below for a list of functions that will be available.  The name passed in is optional, and js-preconditions will use it, or the name of the function to describe the function in any debug messages.

This object also has the method: .$$(func) on it, which is used to terminate the declaration of conditions and wrap a function.

Example: 

var myFunc = $$() // Start declaring conditions
              .Argument('foo', 'string')  // Condition 1
              .Returns('boolean')         // Condition 2
              .$$(function myFunc(foo) {  // Stop declaring conditions, wrap this function
                // Method contents
              });
              
It can also be used to describe methods on an object's prototype:

MyObject.prototype.myFunc = $$().Argument('foo', 'string').Returns('boolean').$$(
  function myFunc (foo) {
    // Method contents
  });

Built-in Conditions
===================

CalledOnce()
Ensures the method is only called once.  If the method is called on an object (with a this reference), it will make sure it only gets called once on that object, but the function itself may be called on multiple different objects a single time.

e.g. $$().CalledOnce().$$(function init() {...})

CalledBefore(function)
CalledBefore(functionName)
CalledAfter(function)
CalledAfter(functionName)
Ensures the method is called either before or after the given function has been called.  In the CalledBefore case, it will make sure the referenced function has never been called before, while in the CalledAfter case it will make sure that the referenced function has been called at some point before.  The method can either be given a direct reference to a function, or if the method will be called on an object the function name on the object can be given instead.  It is expected that the function being declared and the function referenced are either both object methods ore both not object methods.

e.g. $$().CalledAfter('init').CalledBefore('destroy').$$(function render() {...})

Argument(index, type1 [, type2, type3])
Argument(name, type1 [, type2, type3])
Ensures that the method argument either at the given index or with the given name matches at least one of the types provided.  See Built-in Types below for a list of types.  If using a name, dot notation can be used to validate an object-typed argument's subproperties.

e.g. $$().Argument('text', 'string', 'unset').$$(function setText (text) {...})
e.g. $$().Argument('options.showLabel', 'boolean').$$(function setOptions(options) {...})

Returns(type1 [, type2, type3])
Ensures that the method's returns value matches at least one of the types provided.  See Built-in Types for a list of types.

e.g. $$().Returns('number').$$(function getCount() {...})

Property(name, type1 [, type2, type3])
PropertyAfter(name, type1 [, type2, type3])
Can only be used on a method called on an object (with a this reference).  Ensures that the object's property with the given name matches at least one of the types provided.  See Built-in Types below for a list of types.  If using a name, dot notation can be used to validate an object-typed property's subproperties.  Property will check the state before the method executes, while PropertyAfter checks after the method is finished executing.

e.g. $$().Property('_div', 'jquery').$$(function setLabel(text) {...})
e.g. $$().Property('_listeners.length', 'greaterThanZero').$$(function removeListener(l) {...})

Custom(function)
Custom(functionName)
CustomAfter(function)
CustomAfter(functionName)
Call a custom function to perform validation.  If this function returns a falsy object then validation fails, otherwise validation passes.  The function can either be a direct function reference or if the method is called on an object it can be the name of another function on the object.

e.g. $$().Custom('isInDom').$$(function destroy() {...})

Built-in Types
==============

The js-preconditions module has a few built in type identifiers to help with the variety of conditions that deal with type matching:

'number' - the value is a number
'string' - the value is a string
'boolean' - the value is a boolean
'truthy' - the value evaluates to true in a boolean expression
'falsy' - the value evaluates to false in a boolean expresssion
'unset' - the value is undefined
'nothing' - the value is undefined

Additional types can be added by calling:
$$.addType(typeName, evaluatorFunction(value))
typeName is the name of the new type and evaluatorFunction is a function that when given a value returns true or false based on whether the value matches the type.

e.g. $$.addType('greaterThanZero', function (value) { return value > 0; })
