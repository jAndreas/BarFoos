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
				name = name.replace( /^./, name.charAt( 0 ).toUpperCase() ).replace( /-/, '' );
				
				if( name in cache ) { return cache[ name ]; }

				for( var prop in divStyle ) {
					if( prop.toLowerCase() === name.toLowerCase() ) {
						cache[ name ] = prop;
						return prop;
					}
				}

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

					ret = null;
				});

				return ret;
			};
		}());
		
		return Public;
	}());

	if( Core ) {
		Core.registerApplication( BFapps.ExampleApp = ExampleApp );
	}
	else {
		throw new TypeError( 'ExampleApp init: Core not available - aborting.' );
	}
}( window, window.document ));