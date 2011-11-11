/**
 * Javascript Module Template (Layer 3)
 * -----------------------------------------
 * Basic Module pattern from which other Modules should inherit. A Module should use the Sandbox to complete
 * any application related task. Therefore, the Sandbox needs to abstract all necessary methods.
 * Furthermore, a module is not allowed to touch any DOM node outside its own area.
 *
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-03-23
 * Changed: 2011-10-22 - static/dynamic module creation linked with promise objects
 */

!(function _module_wrap( win, doc, undef ) {
	"use strict";
	var BF = win.BarFoos = win.BarFoos || { },

	ModuleCtor = function _ModuleCtor( Sandbox, AppRef, secret ) {
		secret	= secret || { };
		
		var	Public	= { },
			Private	= { },
			$$		= Sandbox.$;
		
		// extend shared "secret" object. This object is available between instances.
		Sandbox.extend( secret, {
			// nodes should hold references on all modules related DOM elements
			nodes:			{ },
			// findCachedNode searches the nodes object for a specific element. If found, we return the BarFoos wrapped set.
			findCachedNode:	function _getNode( nodeRef ) {
				var	thisRef = this,
					result	= null;
				
				Object.keys( thisRef.nodes ).some(function _some( name ) {
					result = thisRef.nodes[ name ];
					
					return result[ 0 ] === nodeRef;
				});
				
				return result;
			},
			clearNodeBindings:	function _clearNodeBindings( disableOnly ) {
				var	thisRef = this,
					nodes	= thisRef.nodes;
			
				Object.keys( nodes ).forEach(function _forEachNode( node ) {
					nodes[ node ].unbind().undelegate();
					
					if( Public.removeFromDOM && !disableOnly ) {
						nodes[ node ].remove();
						nodes[ node ] = null;
					}
				});
				
				if( !disableOnly ) {
					nodes = { }; secret = { };
				}
			}
		});

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Sandbox.error({
				type:	'custom',
				origin:	'Module Constructor',
				name:	'_init()',
				msg:	'missing init() implementation'
			});
		};
		
		Public.destroy = function _destroy() {
			Sandbox.error({
				type:	'custom',
				origin:	'Module Constructor',
				name:	'_destroy()',
				msg:	'missing destroy() implementation'
			});
		};
		
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// A module has to decide if it may launched multiple times. "false" by default.
		Public.multipleInstances = false;
		
		// A module has to decide if its visual representation gets removed on module stop. "false" by default.
		Public.removeFromDOM = false;
		
		// deployAs() decides how a module is installed. static = markup data already available (html,css,images,etc), dynamic = data needs to get loaded, worker = this module has no GUI 
		Public.deployAs = function _deployAs( deployment, data ) {
			switch( deployment ) {
				case 'static':
					return Private.setupStatic( data );
				case 'dynamic':
					return Private.setupDynamic( data );
				case 'worker':
					return Private.setupWorker( data );
			}
		};
		
		// moduleErrorHandler() is somekind of an "empty vessel" function. It trys to create something useful out of the parameters it gets passed in.
		Public.moduleErrorHandler = function _moduleErrorHandler( ) {
			var err		= 'Module error (' + secret.moduleID + '):\n',
				args	= Array.prototype.slice.call( arguments );
			
			if( args.length ) {
				args.forEach(function _forEach( param ) {
					if( typeof param === 'string' ) {
						err += ( '\n' + param );
					}
					else if( typeof param === 'object' ) {
						if( param.responseText ) {
							// The <center> cannot hold it is too late....
							var data = param.responseText.split( /<.*?>/ );
							
							// this part is highly specialized on apache server responses and needs to get refactored soon.
							err += '\n' + data[ 4 ] + '\n' + data[ 10 ];
						}
					}
				});
				
				Sandbox.dispatch({ name: 'AppError', data: {
					msg:	err	
				}});
			}
			
			return Public;
		};
		
		/* -------------------------------------------------------------- */

		// static module setup. On DOMContentLoaded retrieve the modules base node and return the reference. Invokes a promise maker to keeps things asyncronously.
		Private.setupStatic = function _setupStatic( data ) {
			var rootNode;
			
			return Sandbox.Promise(function _setupStaticPromise( promise ) {
				Sandbox.ready(function _ready() {
					if( data.rootNode ) {
						switch( Object.type( data.rootNode ) ) {
							case 'Function':
								rootNode = data.rootNode();
								
								if( rootNode && rootNode.length ) {
									promise.resolve( rootNode );
								}
								else {
									promise.reject( 'BarFoos: unable to resolve root node. Modules GUI interface will not be available' );
								}
								
								break;
							case 'String':
								rootNode = $$( data.rootNode );
							
								if( rootNode && rootNode.length ) {
									promise.resolve( rootNode );
								}
								else {
									promise.reject( 'BarFoos: unable to resolve root node. Modules GUI interface will not be available' );
								}
								
								break;
							default:
								promise.reject();
								
								Sandbox.error({
									type:	'reference',
									origin:	'Module Constructor',
									name:	'_setupStatic',
									msg:	'expected a function or selector string, received "' + win.getLastError() + '" instead'
								});
						}
					}
					else {
						Sandbox.error({
							type:	'reference',
							origin:	'Module Constructor',
							name:	'_setupStatic',
							msg:	'deployment data for a static module requires a method or selector string'
						});
					}
				});
			}).promise();
		};
		
		Private.setupDynamic = function _setupDynamic( data ) {
			var $$target		= null,
				connectMethod	= 'appendTo';
			
			return Sandbox.Promise(function _setupDynamicPromise( promise ) {
				if( Object.type( data ) === 'Object' ) {
					if( $$target = data.targetContainer ) {
						// if we got passed in a selector-string or a DOMNode ref, create a BarFoos Object
						if( /Node|String/.test( Object.type( data.targetContainer ) ) ) {
							$$target = $$( data.targetContainer );
						}
						
						if( Object.type( data.connectMethod ) === 'String' && typeof $$target[ data.connectMethod ] === 'function' ) {
							connectMethod = data.connectMethod
						}
						
						if( $$target && $$target.length && Object.type( $$target[ 0 ] ) === 'Node' ) {
							Public.removeFromDOM = true;
							
							Object.keys( data ).forEach(function _forEach( type ) {
								switch( type ) {
									case 'htmlString':
										promise.resolve( $$( data[ type ] )[ connectMethod ]( $$target ) );
										break;
									case 'ajax':
										break;
									case 'stream':
										break;
								}
							});
						}
						else {
							promise.reject( 'BarFoos: unable to resolve root node. Modules GUI interface will not be available' );
						}
					}
					else {
						Sandbox.error({
							type:	'reference',
							origin:	'Module Constructor',
							name:	'_setupDynamic',
							msg:	'targetContainer as selector string, node or BarFoos object required.'
						});
					}
				}
				else {
					promise.reject();
					
					Sandbox.error({
						type:	'reference',
						origin:	'Module Constructor',
						name:	'_setupDynamic',
						msg:	'expected an Object, received "' + win.getLastError() + '" instead'
					});
				}
			}).promise();
		};
		
		// TODO
		Private.setupWorker = function _setupWorker() {
			//console.log('setupWorker()');
		};
			
		return Public;
	};
	
	BF.ModuleCtor = ModuleCtor;
}( window, window.document ));
