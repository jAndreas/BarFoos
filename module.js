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
 * Changed: 2011-06-16
 */

!(function _module_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },

	ModuleCtor = function _ModuleCtor( Sandbox, AppRef, secret ) {
		secret	= secret || { };
		
		var	Public	= { },
			Private	= { },
			$$		= Sandbox.$;
		
		// extend shared "secret" object
		Sandbox.extend( secret, {
			nodes:			{ },
			findCachedNode:	function _getNode( nodeRef ) {
				var thisRef = this,
					result	= null;
				
				Object.keys( thisRef.nodes ).some(function _some( name ) {
					result = thisRef.nodes[ name ];
					
					return result[ 0 ] === nodeRef;
				});
				
				return result;
			},
			highlight: function _highlight( node, originNode ) {
				if( Object.type( node ) === 'Node' ) {
					node = $$( node );
				}
				
				if( node && node.length ) {
					var orig = node.css( 'boxShadow' );
					
					if( !node.is( 'animated' ) && node.is( ':visible' ) ) {
						node.animate({
							boxShadow: '0 0 2px 1px rgba(20, 20, 240, 0.8)'
						}, 400, function _animateCallback() {
							node.animate({
								boxShadow: orig
							}, 400);
						});
						
						if( originNode ) {
							if( Object.type( originNode ) === 'Node' ) {
								originNode = $$( originNode );
							}
							
							if( originNode.is( ':visible' ) ) {
								originNode.jQstop().effect( 'transfer', {
									to:			node[ 0 ],
									className:	'transferBorder'
								}, 400);
							}
						}
					}
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
		
		// A module has to decide if it may launched multiple times
		Public.multipleInstances = false;
		
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
		
		Public.moduleErrorHandler = function _moduleErrorHandler( ) {
			var err		= 'Module error:\n',
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
							
							err += '\n' + data[ 4 ] + '\n' + data[ 10 ];
						}
					}
				});
				
				Sandbox.dispatch({ name: 'AppError', data: err });
			}
		};
		
		/* -------------------------------------------------------------- */

		// static module setup. On DOMContentLoaded retrieve the modules base node and return the reference. Invokes a promise maker to keeps things asyncronously.
		Private.setupStatic = function _setupStatic( data ) {
			console.log('setupStatic()');
			
			return Sandbox.Promise(function _setupStaticPromise( promise ) {
				Sandbox.ready(function _ready() {
					if( data.rootNode ) {
						switch( Object.type( data.rootNode ) ) {
							case 'Function':
								promise.resolve( data.rootNode() );
								break;
							case 'String':
								promise.resolve( $$( data.rootNode ) );
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
							msg:	'deployment data for a static module requires a root node as method or selector string'
						});
					}
				});
			}).promise();
		};
		
		Private.setupDynamic = function _setupDynamic() {
			console.log('setupDynamic()');
		};
		
		Private.setupWorker = function _setupWorker() {
			console.log('setupWorker()');
		};
			
		return Public;
	};
	
	IRcomponents.ModuleCtor = ModuleCtor;
}( window, window.document ));
