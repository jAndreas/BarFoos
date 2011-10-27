/* 
 * init.js (ExampleApp)
 * ------------------------------
 * Application init script, creates more App specific methods and abstractions.
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-06-18
 */

!(function _init_wrap( win, doc, undef ) {
	"use strict";
	var	BF = win.BarFoos = win.BarFoos || { },
		BFapps = BF.apps = BF.apps || { },
		Core = BF.Core,

	ExampleApp = (function _ExampleApp() {
		var	Public				= { },
			Private				= {
				isJSON:	/^(?:\{.*\}|\[.*\])$/	// JSON validation regex
			};

		Public.name			= 'An example application init script';
		Public.version			= 0.01;
	
		// copy and shortcut some native methods
		Public.toStr			= Object.prototype.toString;
		Public.hasOwn			= Object.prototype.hasOwnProperty;
		Public.type			= Object.type;
		Public.ua			= navigator.userAgent;
				
		// createCSS returns a cross-browser compatible CSS string. For instance, .createCSS('boxShadow') returns "MozBoxShadow" in FF<4 while in WebKit browsers the result is just "boxShadow"
		Public.createCSS = (function _createCSS() {
			var div				= doc.createElement( 'div' ),
				divStyle		= div.style,
				ret				= null,
				cache			= { };
	
			return function _createCSSClosure( name ) {
				// convert names like "font-width" into css camelCase form like "fontWidth"
				name = name.replace( /-(\w)/, function _replace( $1, $2 ) {
					return $2.toUpperCase();
				});
				
				// check if we already got that css string in our lookup-cache table
				if( name in cache ) { return cache[ name ]; }

				// now check if "name" can get found by looping over propertys from our testDiv style object 
				for( var prop in divStyle ) {
					if( prop.toLowerCase() === name.toLowerCase() ) {
						cache[ name ] = prop;
						return prop;
					}
				}
				
				// at this point, do another check for WebKit browsers
				if( name in divStyle ) {
					cache[ name ] = name;
					return name;
				}

				// still no match, try to lookup things with vendor prefixes, again any match will get cached in our closured lookup table object.
				name = name.replace( /^./, name.charAt( 0 ).toUpperCase() );
				'Moz Webkit ms O'.split( ' ' ).some(function _some( prefix ) {
					ret = prefix + name;

					if( name in divStyle ) {
						ret = cache[ name ] = name;
						return true;
					}
					
					if( name.toLowerCase() in divStyle ) {
						ret = cache[ name ] = name.toLowerCase();
						return true;
					}

					if( ret in divStyle ) {
						cache[ name ] = ret;
						return true;
					}

					for( var prop in divStyle ) {
						if( prop.toLowerCase() === ret.toLowerCase() ) {
							ret = cache[ name ] = prop;
							return true;
						}
					}

					// we tried, we tried really hard but we could not resolve anything for that css string.
					ret = null;
				});

				return ret;
			};
		}());

	if( Core ) {
		Core.registerApplication( BFapps.ExampleApp = ExampleApp );
	}
	else {
		throw new TypeError( 'ExampleApp init: Core not available - aborting.' );
	}
}( window, window.document ));