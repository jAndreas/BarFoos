/**
 * Javascript Application Core (Layer 1)
 * -----------------------------------------
 * The core is the only part from the application which has direct access to the base library.
 * Any access to the base library (from a Module) is marshaled down through the Sandbox.
 * Furthermore, the Core is responsible for Module lifecycles, communication between modules,
 * error handling and extensions.
 * 
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-17
 * Changed: 2011-11-30 - loadModule is now IE compliant
 */

!(function _core_wrap( win, doc, $, undef ) {
	"use strict";
	var BF		= win.BarFoos = win.BarFoos || { },
		Modules	= BF.Modules = BF.Modules || { },
	
	Core = (function _Core() {
		var moduleData	= { },
			Public		= { },
			Private		= { },
			Application	= { },
			Sandbox		= function Sandbox() { };
		
		/****** CORE SPECIFIC METHODS (MODULE LIFECYCLE, SANDBOX)  *******/
		/****** ************************************************** *******/
		Public.registerApplication = function _registerApplication( app ) {
			if( Object.type( app ) === 'Object' ) {
				Application = app;

				Object.freeze( Public );
				
				if( 'environment' in Application ) {
					$.extend( Private, Application.environment );
				}
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerApplication',
					msg:	'object was expected, received ' + win.getLastError() + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.registerSandbox = function _registerSandbox( sandbox ) {
			if( typeof sandbox === 'function' ) {
				Sandbox = sandbox;
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerSandbox',
					msg:	'function was expected, received ' + win.getLastError() + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.registerModule = function _registerModule( moduleID, creator ) {
			if( Object.type( moduleID ) === 'String' ) {
				if( !(moduleID in moduleData) ) {
					moduleData[ moduleID ] = {
						creator: creator || Public.loadModule( moduleID ),
						instances: [ ]
					};
				}
				else {
					Public.error({
						type:	'custom',
						origin:	'Core',
						name:	'_registerModule',
						msg:	'Module name "' + moduleID + '" already registered'
					});
				}
				
				return Public;
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerModule',
					msg:	'string expected, received ' + win.getLastError() + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.loadModule = function _loadModule( moduleID ) {
			if( Object.type( moduleID ) === 'String' ) {
				var scr		= doc.createElement( 'script' ),
					head	= doc.head || doc.getElementsByTagName( 'head' )[ 0 ] || doc.documentElement;
			
				return $.Deferred( function _createDeferred( promise ) {
					scr.onload		= scr.onreadystatechange = function _onload() {
						if( !scr.readyState || /complete|loaded/.test( scr.readyState ) ) {
							scr.onload = scr.onreadystatechange = null;
							scr = undef;
						
							promise.resolve( moduleID, Modules[ moduleID ] );
						}
					};
					
					scr.onerror		= function _onerror( err ) {
						promise.reject( moduleID, err );
					};
					
					scr.type		= 'text/javascript';
					scr.async		= true;
					scr.defer		= true;
					scr.src			= Private.modulePath + Private.modulePrefix + moduleID.toLowerCase() + '.js';
					
					head.insertBefore( scr, head.firstChild );
				}).promise();
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_loadModule',
					msg:	'string was expected, received ' + getLastError() + ' instead'
				});
			}
		};
		
		Public.start = function _start( moduleID, args ) {
			if( moduleID in moduleData ) {
				var data		= moduleData[ moduleID ],
					args		= args || { },
					instances	= data.instances,
					initResult	= null;
					
				$.extend( args, {
					moduleID:		moduleID,
					moduleIndex:	instances.length,
					moduleKey:		++Private.globalModuleKey
				});
				
				try {
					if( instances && instances.length ) {
						if( data.multipleInstances ) {
							instances.push( data.creator( Sandbox( this ), Application, args ) );
							instances.slice( -1 )[ 0 ].moduleKey = Private.globalModuleKey;
							initResult = instances.slice( -1 )[ 0 ].init();
							
							if( initResult === -1 ) {
								Public.stop( moduleID, instances.slice( -1 )[ 0 ].moduleKey );
							}
						}
						else {
							throw new Error( 'Module "' + moduleID + '" does not allow multiple instances' );
						}
					}
					else {
						$.when( data.creator ).then(function _done( moduleName, moduleCreator ) {
							data.creator = moduleCreator || data.creator;
					
							instances.push( data.creator( Sandbox( Core ), Application, args ) );
							instances[ 0 ].moduleKey	= Private.globalModuleKey;
							initResult					= instances[ 0 ].init();
							data.multipleInstances		= instances[ 0 ].multipleInstances;
							
							if( initResult === -1 ) {
								Public.stop( moduleID, instances[ 0 ].moduleKey );
							}
						}, function _fail( moduleName, err ) {
							// TODO: I did not decide what to do here. Try reloading the module ? Throw ? Warn? 
						});
					}
				} catch( ex ) {
					Public.error({
						type:	'Unknown',
						origin:	'Core',
						name:	'_start',
						msg:	'unable to load module "' + moduleID + '". Error was: ' + ex.message + '\n\n' + 'Stacktrace:\n' + Private.formatStacktrace( ex.stack || ex.stacktrace )
					});
				}
			}
			
			return Public;
		};
		
		Public.stop = function _stop( moduleID, key ) {
			if( moduleID in moduleData ) {
				var data	= moduleData[ moduleID ],
					mIndex	= -1;
					
				try {
					if( data.instances && data.instances.length ) {
						if( key === undef ) {
							data.instances.forEach(function _forEach( inst ) {
								inst.flaggedForRemoval = true; // flag the Modules "Public" object so it has a chance to skip/cancel running requests
								inst.destroy();
								inst = null;	
							});
							
							data.instances = [ ];
						}
						else {
							data.instances.some(function _some( inst, index ) {
								if( inst.moduleKey === key ) {
									mIndex = index;
									inst.destroy();
									inst = null;
									return true;
								}
							});
							
							if( mIndex > -1 ) {
								data.instances.splice( mIndex, 1 );
							}
						}
					}
				} catch( ex ) {
					Public.error({
						type:	'Unknown',
						origin:	'Core',
						name:	'_stop',
						msg:	'unable to unload module "' + moduleID + '". Error was: ' + ex.message + '\n\n' + 'Stacktrace: ' + Private.formatStacktrace( ex.stack || ex.stacktrace )
					});
				}
			}
			
			return Public;
		};
		
		Public.startAll = function _startAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.start( moduleID );
			});
			
			return Public;
		};
		
		Public.stopAll = function _stopAll() {
			Object.keys( moduleData ).forEach(function _forEach( moduleID ) {
				Public.stop( moduleID );
			});
			
			return Public;
		};
		
		Public.error = function _error( err ) {
			if( Object.type( err ) === 'Object' ) {
				if( typeof err.type === 'string' ) {
					var output = '\nApplication error\n\n' + 'Origin: ' + (err.origin || 'General') + '\n' + 'Calling context: ' + (err.name || 'Unknown') + '\n' + 'Message: ' +  (err.msg || '');

					// backup output. If for some reason the base library lays an outer try/catch around a handler, we've lost our chance to bubble our error
					win[ 'console' ].group('App Failure');
					win[ 'console' ].info( output );
					win[ 'console' ].groupEnd('App Failure');
					
					switch( err.type.toLowerCase() ) {
						case 'type':
							throw new TypeError( output );
						case 'reference':
							throw new ReferenceError( output );
						case 'syntax':
							throw new SyntaxError( output );
						default:
							throw new Error( err.type + output );
					}
				}
				else {
					throw new TypeError( 'Core: error(). String expected - received "' + win.getLastError() + '" instead.' );
				}
			}
			
			return Public;
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Public.trim = function _trim() {
			return $.trim.apply( null, arguments );
		};
		
		Public.Promise = function _Promise() {
			return $.Deferred.apply( null, arguments );
		};
		
		Public.when	= function _when() {
			return $.when.apply( null, arguments );
		};
		
		Public.extend = function _extend() {
			return $.extend.apply( null, arguments );
		};
		
		Public.plugin = function _plugin( ext ) {
			if( typeof ext === 'function' ) {
				ext.apply( Public, [win, doc, $, Private, Public, Sandbox, Application] );
			}
			
			return Public;
		};
		
		// createCSS returns a cross-browser compatible CSS string. For instance, .createCSS('boxShadow') returns "MozBoxShadow" in FF<4 while in WebKit browsers the result is just "boxShadow"
		Public.createCSS = (function _createCSS() {
			var div				= doc.createElement( 'div' ),
				divStyle		= div.style,
				ret				= null,
				cache			= { };
	
			return function _createCSSClosure( name ) {
				// convert names like "font-width" into css camelCase form like "fontWidth"
				name = name.replace( /-(\w)/g, function _replace( $1, $2 ) {
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
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		$.extend(Private, {
			globalModuleKey:	0,
			jsPath:				'/js',
			modulePath:			'/js/modules/',
			modulePrefix:		'm_'
		});
		
		Private.formatStacktrace = function( strace ) {
			if( Object.type( strace ) === 'String' ) {
				var lines = strace.split( /\n/ );
				
				if( lines && lines.length ) {
					return lines.map(function( line ) {
						var parts = line.split( /@/ );
						
						if( parts && parts.length ) {
							if( Object.type( parts[ 1 ] ) === 'String' ) {
								return parts[0].substr(0, 40) + '\t->\t' + parts[ 1 ].substr( parts[ 1 ].lastIndexOf( '/' ) ).slice(1, 40);
							}
						}
					}).join( '\n' );
				}
			}
			
			return '';
		};
		
		

		return Public;
	}());
	
	BF.Core = Core;
}( window, window.document, jQuery ));
