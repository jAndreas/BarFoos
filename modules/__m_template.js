/**
 * Javascript Module (Layer 3)
 * -----------------------------------------
 * TEMPLATE <NAME> <DESCRIPTION> 
 *
 * This code runs in strict mode (if supported by the environment).
 * -----------------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-08
 * Changed: 2011-06-16
 */

!(function _module_TEMPLATE_wrap( win, doc, undef ) {
	"use strict";
	var IR = win.ir = win.ir || { },
		IRcomponents = IR.components = IR.components || { },
		Modules = IRcomponents.Modules = IRcomponents.Modules || { },
	
	TEMPLATE = function _TEMPLATE( Sandbox, PagePreview, secret ) {
		secret	= secret || { };
		
		var	Public	= IRcomponents.ModuleCtor( Sandbox, PagePreview, secret ) || { }, // inherit from "Module Base Pattern"
			Private	= { 
				deploymentData: { 
					rootNode: <METHOD> or <SELECTOR STRING>
					}
				},
				nodes: { }
			};

		/****** Core Methods (called by the core only) *********** *******/
		/****** ************************************************** *******/
		Public.init = function _init() {
			Public.deployAs( 'static', Private.deploymentData ).done( Private.cacheElements );
			
			Sandbox.listen( [ 'EXAMPLE_EVENT_1', 'EXAMPLE_EVENT_2' ], Private.eventHandler, this );
		};
		
		Public.destroy = function _destroy() {
			Private.nodes = { };
			Sandbox.forget( [ 'EXAMPLE_EVENT_1', 'EXAMPLE_EVENT_2' ], Private.eventHandler );
		};
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		
		// eventHandler takes care of application level events
		Private.eventHandler = function _eventHandler( event ) {
			var	originalEv	= event.data.originalEvent,
				rootNode	= secret.nodes.rootNode;
			
			switch( event.name ) {
				case 'EXAMPLE_EVENT_1':
					rootNode.show().css({});
					break;
				case 'EXAMPLE_EVENT_2':
					originalEv.relatedTarget.EXAMPLE();
					break;
			}
		};
		
		// cacheElements() extends Private.nodes with DOM element references
		Private.cacheElements = function _cacheElements( rootNode ) {
			Sandbox.extend( Private.nodes, (function _acquireNodes() {
				var EXAMPLE_NODE	= rootNode.find('#EXAMPLE_NODE'),
					FOO_BAR			= rootNode.find('#FOO_BAR');
					
				return {
					rootNode:		rootNode,
					EXAMPLE_NODE:	EXAMPLE_NODE,
					FOO_BAR:		FOO_BAR
				};
			}()));
			
			Private.bindDOMevents();
			Private.initElements();
		};
		
		// bindDOMevents will take care of browser DOM level events
		Private.bindDOMevents = function _bindDOMevents() {
			var nodes = secret.nodes;
			
			if( nodes ) {
				nodes.rootNode.bind( 'mouseleave', function( event ) {
					Sandbox.dispatch({ name: 'DISPATCH_EXAMPLE_EVENT', data: {
						targetNode:		nodes.rootNode,
						originalEvent:	event
					}});
				});
			}
		};
		
		Private.initElements = function _initElements() {
		};
			
		return Public;
	};
	
	Modules.TEMPLATE = TEMPLATE;
}( window, window.document ));
