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
 * Changed: 2011-08-11 - added "flaggedForRemoval" property to public module object on .stop()
 */

!(function _core_wrap( win, doc, $, undef ) {
	"use strict";
	var BF = win.BarFoos = win.BarFoos || { },
	
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
			}
			else {
				Public.error({
					type:	'type',
					origin:	'Core',
					name:	'_registerApplication',
					msg:	'object was expected, received ' + getLastError() + ' instead'
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
					msg:	'function was expected, received ' + getLastError() + ' instead'
				});
			}
			
			return Public;
		};
		
		Public.registerModule = function _registerModule( moduleID, creator ) {
			if( Object.type( moduleID ) === 'String' && Object.type( creator ) === 'Function' ) {
				if( !(moduleID in moduleData) ) {
					moduleData[ moduleID ] = {
						creator: creator,
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
					msg:	'string/function pair expected, received ' + getLastError( -2 ) + '/' + getLastError( -1 ) + ' instead'
				});
			}
			
			return Public;
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
						instances.push( data.creator( Sandbox( this ), Application, args ) );
						instances[ 0 ].moduleKey = Private.globalModuleKey;
						initResult = instances[ 0 ].init();
						data.multipleInstances = instances[ 0 ].multipleInstances;
						
						if( initResult === -1 ) {
							Public.stop( moduleID, instances[ 0 ].moduleKey );
						}
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
					throw new TypeError( 'Core: error(). String expected - received "' + getLastError() + '" instead.' );
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
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^BLOCK END^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		Private.globalModuleKey = 0;
		
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
