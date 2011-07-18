/* 
 * toolkit.js
 * ------------------------------
 * General initialization of helper methods. Most of the methods here are described in ECMAscript Edition 5. If there is
 * a native version available we just copy that, otherwise we create it here. Some methods are based on https://developer.mozilla.org/en/JavaScript/Reference
 * However, I modified  the code like a lot (some of the methods event created infinite loops in there available form)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-15
 * Modified: 2011-07-15 Modified Object.lookup()
 */

!(function _toolkit_wrap( win, doc, undef ) {
	"use strict";
	
	var ToStr = Object.prototype.toString,
		lastError = [ ];
	
	// Date.now()
	Date.now = Date.now || function _now() {
		return ( new Date() ).getTime();
	};
	
	// Object.keys()
	Object.keys = Object.keys || function _keys( o ) {
		var ret=[], p, has = Object.prototype.hasOwnProperty;
		for( p in o ) {
			if( has.call( o,p ) ) { ret.push( p ); }
		}

		return ret;
	};
	
	// Object.type() - Non-standard. Returns the [[Class]] property from an object. Returns 'Node' for all HTMLxxxElement collections
	Object.type = function _type( obj ) {
		var res = ToStr.call( obj ).split( ' ' )[ 1 ].replace( ']', '' );
		
		if( obj === win ) {
			res = 'Window';
		}
		else if( res === 'Window' || res === 'Global' ) {
			res = 'Undefined';
		}
		else if( res.indexOf( 'HTML' ) === 0 ) { 
			res = 'Node';
		}
		
		return ( win.setLastError( res ) );
	};
	
	// Object.hasKeys() - Non-standard. Returns true if all keys are available in an object
	Object.hasKeys = function _hasKeys( obj, keys ) {
		if( typeof keys === 'string' ) {
			keys = keys.split( /\s/ );
		}
		
		if( Object.type( obj ) === 'Object' ) {
			if( Object.type( keys ) === 'Array' ) {
				return keys.every(function _every( prop ) {
					return prop in obj;
				});
			}
		}
		
		return false;
	};
	
	// Object.map - Non-standard. Takes an object and a transform method (which gets passed in key/values). The Method must return an Array with new key/value pair
	Object.map = function _map( obj, transform ) {
		if( Object.type( obj ) === 'Object' && Object.type( transform ) === 'Function' ) {
			Object.keys( obj ).forEach(function _forEach( key ) {
				(function _mapping( oldkey, transmuted ) {
					if( transmuted && transmuted.length ) {
						obj[ transmuted[0] || oldkey ] = transmuted[ 1 ];
						
						if( transmuted[0] && oldkey !== transmuted[0] ) { 
							delete obj[ oldkey ];
						}
					}
				}( key, transform.apply( obj, [ key, obj[ key ]] ) ));
			});
		}
	};
	
	// Object.lookup() - Non-standard. Trys to lookup a chain of objects. When finished we return two possible methods, "execute" & "get".
	Object.lookup = (function _lookup() {
		var cache = { };
		
		return function _lookupClosure( lookup, failGracefully ) {
			var check	= null,
				chain	= [ ],
				lastkey	= '';
			
			if( typeof lookup === 'string' ) {
				if( cache[ lookup ] ) {
					chain = cache[ lookup ].chain;
					check = cache[ lookup ].check;
				}
				else {
					lookup.split( /\./ ).forEach(function _forEach( key, index, arr ) {
						if( check ) {
							if( typeof check === 'object' ) {
								if( key in check ) {
									chain.push( check = check[ key ] );
									lastkey = key;
								}
								else {
									if( !failGracefully ) {
										throw new TypeError( 'cannot resolve "' + key + '" in ' + lastkey );	
									}
								}
							}
							else {
								if( !failGracefully ) {
									throw new TypeError( '"' + check + '" ' + ' does not seem to be an object' );	
								}
							}
						}
						else {
							lastkey = key;
							chain.push( check = win[ key ] );
						}
					});
					
					if( check ) {
						cache[ lookup ] = {
							chain: chain,
							check: check
						};
					}
				}
			}
			
			return {
				execute: function _execute() {
					return typeof check === 'function' ? check.apply( chain[chain.length - 2], arguments ) : null;
				},
				get: function _get() {
					return check;
				}
			};
		}
	}());
	
	// Array.prototype.indexOf()
	Array.prototype.indexOf = Array.prototype.indexOf || function _indexOf( search /*, startIndex */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.indexOf' ); 
		}
			
		var t	= this instanceof Object ? this : new Object( this ),
			len = t.length >>> 0,
			n	= 0,
			k	= 0;
			
		if( !len ) { return -1; }
		
		if( arguments.length > 1 ) {
			n = +arguments[ 1 ];
			if		( n !== n )										{ n = 0; }
			else if	( n !== 0 && n !== (1 / 0) && n !== -(1 / 0) )	{ n = (n > 0 || -1) * (~~( Math.abs( n ) )); }
		}
		
		if( n >= len ) { return -1; }
		
		k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 );
		
		for( ; k < len; k++ ) {
			if( k in t && t[ k ] === search ) {
				return k;
			}
		}
		return -1;
	};

	// Array.prototype.lastIndexOf()
	Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function _lastIndexOf( search /*, startIndex */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.lastIndexOf' ); 
		}
			
		var t	= this instanceof Object ? this : new Object( this ),
			len = t.length >>> 0,
			n	= len,
			k	= 0;
			
		if( !len ) { return -1; }
		
		if( arguments.length > 1 ) {
			n = +arguments[1];
			if		( n !== n )										{ n = 0; }
			else if	( n !== 0 && n !== (1 / 0) && n !== -(1 / 0) )	{ n = (n > 0 || -1) * (~~( Math.abs( n ) )); }
		}
		
		k = n >= 0 ? Math.min( n, len - 1 ) : len - Math.abs( n );
		
		while( k-- ) {
			if( k in t && t[ k ] === search ) {
				return k;
			}
		}
		return -1;
	};
	
	// Array.prototype.filter()
	Array.prototype.filter = Array.prototype.filter || function _filter( fnc /*, thisv */ ) {
		if( this === undef || this === null ) { 
			throw new TypeError('Array.prototype.filter'); 
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			res		= [ ],
			i		= 0,
			thisv	= arguments[ 1 ],
			stored	= null;
			
		if( typeof fnc !== 'function' ) { 
			throw new TypeError('Array.prototype.filter'); 
		}
			
		for(i = 0; i < len; i++) {
			if( i in t ) {
				stored = t[i];
				if( fnc.call(thisv, stored, i, t) ) {
					res.push(stored);
				}
			}
		}
		
		return res;
	};
	
	// Array.prototype.map()
	Array.prototype.map = Array.prototype.map || function _map(fnc /*, thisv */) {
		if( this === undef || this === null ) { 
			throw new TypeError( 'Array.prototype.map' ); 
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			res		= [ ],
			i		= 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' ) {
			throw new TypeError( 'Array.prototype.map' );
		}
			
		for(i = 0; i < len; i++) {
			if( i in t ) {
				res[ i ] = fnc.call( thisv, t[ i ], i, t );
			}
		}
		
		return res;
	};
	
	// Array.prototype.forEach()
	Array.prototype.forEach = Array.prototype.forEach || function _forEach(fnc /*, thisv */) {
		if( this === undef || this === null ) {
			throw new TypeError( 'Array.prototype.forEach' );
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			i		= 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' ) {
			throw new TypeError( 'Array.prototype.forEach' );
		}

		for(i = 0; i < len; i++) {
			if( i in t ) {
				fnc.call( thisv, t[ i ], i, t );
			}
		}
	};

	
	// Array.prototype.every()	
	Array.prototype.every = Array.prototype.every || function _every(fnc /*, thisv */) {
		if( this === undef || this === null ) {
			throw new TypeError( 'Array.prototype.every' );
		}
			
		var t		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			i		= 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' ) {
			throw new TypeError( 'Array.prototype.every' );
		}
			
		for(i = 0; i < len; i++) {
			if( i in t && !fnc.call(thisv, t[i], i, t) ) {
				return false;
			}
		}
		
		return true;
	};
	
	// Array.prototype.some()
	Array.prototype.some = Array.prototype.some || function _some(fnc /*, thisv */) {
		if( this === undef || this === null ) {
			throw new TypeError( 'Array.prototype.some' );
		}
			
		var t 		= this instanceof Object ? this : new Object( this ),
			len		= t.length >>> 0,
			i		= 0,
			thisv	= arguments[ 1 ];
			
		if( typeof fnc !== 'function' ) {
			throw new TypeError( 'Array.prototype.some' );
		}
			
		for(i = 0; i < len; i++) {
			if( i in t && fnc.call(thisv, t[i], i, t) ) {
				return true;
			}
		}
		
		return false;
	};
	
	// window.requestAnimationFrame()
	win.requestAnimFrame = (function() {
		return	win.requestAnimationFrame       || 
				win.webkitRequestAnimationFrame || 
				win.mozRequestAnimationFrame    || 
				win.oRequestAnimationFrame      || 
				win.msRequestAnimationFrame     || 
				function _animationInterval( callback ) {
					setTimeout( function() {
						if( 'hasFocus' in doc ) {
							if( doc.hasFocus() ) {
								callback();
							}
							else {
								_animationInterval( callback );
							}
						}
						else {
							callback();
						}
					}, 1000 / 60 );
				};
	}());
	
	win.getLastError = function( offset ) {
		if( typeof offset === 'number' ) {
			return lastError.slice( offset )[ 0 ];
		}
		else {
			return lastError.slice( -1 )[ 0 ];
		}
	};
	
	win.setLastError = function( err ) {
		if( err !== undef ) {
			if( lastError.length >= 10 ) {
				lastError.shift();
			}
			lastError.push( err );
			
			return err;
		}
	};
	
	// _ie_garbage_collect helps IE<=8 to garbage collect named function expressions. The function assumes that the expression name is
	// identical to the methodname, with a leading underscore.
	win._ie_garbage_collect = function( targets ) {
		if( Object.type( targets ) !== 'Array' ) {
			targets = [ targets ];
		}
		
		targets.forEach(function( obj ) {
			for( var method in obj ) {
				if( typeof obj[ method ] === 'function' ) {
					var check = '_' + method;
					if( check in obj ) {
						obj[ check ] = null;
					}
				}
			}
		});
	};
	
	// if no JSON object is available, try to load json2.js from a local server (which offers the same functionality)
	if(!( 'JSON' in win ) ) {
		var script	= doc.createElement( 'script' ),
			head	= doc.head || doc.getElementsByTagName( 'head' )[ 0 ] || doc.documentElement;
			
		script.async	= 'async';
		script.src		= '/js/components/json2.js';  // needs to get adapted
		script.type		= 'text/javascript';
		script.onload	= script.onreadystatechange = function _onload_onreadystatechange() {
			if(!script.readyState || /loaded|complete/.test( script.readyState ) ) {
				script.onload = script.onreadystatechange = null;
				script = undef;
			}
		};
		script.onerror	= function _onerror() {
			throw new Error('toolkit.js: JSON not available.');
		};
		
		head.insertBefore(script, head.firstChild);
	}
	
	
	// create a console object if not availabe and fill it with noop-methods, which the "real" console objects can offer
	// this will avoid errors, if there is an access to a console-method on browsers which don't supply a debugger
	if(!( 'console' in win ) ) {
		win.console = { };
		
		'debug info warn exception assert dir dirxml trace group groupEnd time timeEnd profile profileEnd table log error'.split( /\s/ ).forEach(function( prop ) {
			win.console[ prop ] = function() { };
		});
	}
}(window, window.document));