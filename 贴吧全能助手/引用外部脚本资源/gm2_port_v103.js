// ==UserScript==
// @name        GM 2 port - Function Override Helper
// @Description Not yet.
// @namespace   org.jixun.gm2.port
// @version     1.0.4

// unsafeWindow required to use `exportFunction`.
// @grant       unsafeWindow

// @run-at      document-start
// ==/UserScript==

// Check if is GM 2.x
if (typeof exportFunction == 'undefined') {
	// For GM 1.x backward compatibility, should work.
	var exportFunction = (function (foo, scope, defAs) {
		if (defAs && defAs.defineAs) {
			scope[defAs.defineAs] = foo;
		}
		return foo;
	}).bind(unsafeWindow);

	// Well.. It's not going to do anything.
	var cloneInto = (function (obj, scope, opt) {
		return obj;
	}).bind(unsafeWindow);
}

/**
 * unsafeObject:
 * Basically cloneInto but could without scope (Default: unsafeWindow)
 * 
 * @param  {Object} obj   Object to pass through
 * @param  {Object} scope Scope where object is going to be applied.
 * @param  {Object} opt   Options
 * @return {Object}       A reference to the cloned object.
 */
var unsafeObject = function (obj, scope, opt) {
	return cloneInto (obj, scope || unsafeWindow, opt || {});
};

/**
 * unsafeDefineFunction
 * @param  {String} fooName Target name
 * @param  {Function} foo   The function to override
 * @param  {Object} scope   unsafeWindow
 * @return {Function}       The placeholder function which has been created in the target context.
 */
var unsafeDefineFunction = function (fooName, foo, scope) {
	// @throw TypeError: can't redefine non-configurable property
	// @throw Error: First argument must be a function
	return exportFunction (foo, scope || unsafeWindow, {defineAs: fooName});
};

/**
 * unsafeOverwriteFunction
 * @param  {Object} fooMapping {name: foo}
 * @param  {Object} scope      unsafeWindow
 * @param  {String} scopeName  Optional, required if target is not `window`.
 *                             e.g. The target is window.api.xxx, '.api' would
 *                             be the scopeName.
 * @return {HTML Element}      Script Tag
 */
var unsafeOverwriteFunction = function (fooMapping, scope, scopeName) {
	var argMapping = {}, tmpName;

	// Mapping new random names.
	for (var x in fooMapping) {
		if (fooMapping.hasOwnProperty(x)) {
			try {
				tmpName = 'u_w_f_' + Math.random().toString().slice(2) + +new Date();
				
				// Export function
				// unsafeDefineFunction will take care of null values.
				unsafeDefineFunction (tmpName, fooMapping[x], scope);
				argMapping[x] = tmpName;
			} catch (e) {
				console.error ('Error at `unsafeOverwrite`:', e);
			}
		}
	}

	var tmpScript = document.createElement ('script');
	tmpScript.textContent = ';('+ (function (j, x) {
		for (x in j)
			if (j.hasOwnProperty(x))
				// Map everything.
				// If Object with custom function / Function 
				// passed in it will throw CloneNonReflectorsWrite.
				// Use unsafeOverwriteFunctionSafeProxy if you need to bypass that.
				// However, it's going to be slower.
				window/**/[x] = window/**/[j[x]];
		
		// TODO: Maybe remove this script tag after finish?
	}).toString().replace(/\/\*\*\//g, scopeName ? scopeName : '') +')(' + JSON.stringify(argMapping) + ');';
	document.head.appendChild (tmpScript);

	return tmpScript;
};

/**
 * ErrorUnsafe:
 * An error class for unsafeOverwriteFunctionSafeProxy.
 * 
 * @param {String} name    Error Name
 * @param {String} message Error Message
 */
var ErrorUnsafe = function (name, message) {
	return cloneInto ({
		name: name || 'ErrorUnsafe',
		message: message || 'Unknown error.'
	}, scope || unsafeWindow);
};

/**
 * ErrorUnsafeSuccess:
 * An Error Class for unsafeOverwriteFunctionSafeProxy.
 * Inform proxy to execute origional function with its full arguments.
 * 
 * @param {[type]} message [description]
 * @param {[type]} scope   [description]
 */
var ErrorUnsafeSuccess = function (message, scope) {
	return cloneInto ({
		name: 'ErrorUnsafeSuccess: ProxyFinish',
		success: true,
		message: message || ''
	}, scope || unsafeWindow);
};

/**
 * unsafeOverwriteFunctionSafeProxy
 * Similar to unsafeOverwriteFunction, but its a proxy instead.
 * It will strip all functions before pass in to sandboxed function.
 * So, it can prevent CloneNonReflectorsWrite error.
 * 
 * @param  {[type]} fooMapping [description]
 * @param  {[type]} scope      [description]
 * @param  {[type]} scopeName  [description]
 * @return {[type]}            [description]
 */
var unsafeOverwriteFunctionSafeProxy = function (fooMapping, scope, scopeName) {
	var argMapping = {}, tmpName;

	// Mapping new random names.
	for (var x in fooMapping) {
		if (fooMapping.hasOwnProperty(x)) {
			try {
				tmpName = 'u_w_f_' + Math.random().toString().slice(2) + +new Date();
				
				// Export function
				// unsafeDefineFunction will take care of null values.
				unsafeDefineFunction (tmpName, fooMapping[x], scope);
				argMapping[x] = tmpName;
			} catch (e) {
				console.error ('Error at `unsafeOverwrite`:', e);
				alert (e);
			}
		}
	}

	var tmpScript = document.createElement ('script');
	tmpScript.textContent = ';('+ (function (j, x) {
		for (x in j)
			if (j.hasOwnProperty(x)) {
				(function (x, bak, foo) {
					// Assign variable to our proxy function.
					window/**/[x] = function () {
						// console.info (arguments);
						for (var i = 0, y, args = []; i < arguments.length; i++) {
							// Array - Sure we can handle this right?
							if (arguments[i] instanceof Array) {
								args.push (arguments[i].slice());
							} else if (arguments[i] instanceof Object) {
								// Strip off all prototype functions, if possible.
								
								// TODO: maybe try-catch the following line?
								args.push (JSON.parse(JSON.stringify (arguments[i])));
							} else if ('function' == typeof arguments[i]) {
								// Function can't be sandboxied :<
								args.push (null);
							} else {
								// idk... should be safe to pass through?
								args.push (arguments[i]);
							}
						}

						try {
							// Try to call our function!
							return foo.apply(this, args);
						} catch (err) {
							// We throw this error on purpose,
							// if we need to do the complete callback.
							
							// If the error don'e have success flag, we'll 
							// throw the error to console.

							if (!err.success) console.error (err);
							return bak.apply (this, arguments);
						}
					};
				}) (x, window/**/[x], window/**/[j[x]]);
			}

		// TODO: Maybe remove this script tag after finish?
	}).toString().replace(/\/\*\*\//g, scopeName ? scopeName : '') +')(' + JSON.stringify(argMapping) + ');';
	document.head.appendChild (tmpScript);

	return tmpScript;
};

/**
 * Execute function anonymously
 * @param  {Function} foo
 * @param  {Any} Any arguments to be passed in.
 * @return {ScriptNode}
 */
var unsafeExec = function (foo) {
	var tmpScript = document.createElement ('script');

	// Now supports arguments!
	tmpScript.textContent =
		';(' + foo + ').apply (null, ' +
			JSON.stringify([].slice.call(arguments, 1)) + ');';

	document.head.appendChild (tmpScript);
	return tmpScript;
};