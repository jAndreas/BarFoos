/* 
 * core_plugin_communication.js
 * ------------------------------
 * Core plugin: Intermodule communication (mediator)
 * 
 * Message object structure:
 * {
 * 		name: <name of event>,
 * 		data: <any data>
 * }
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-06-18
 */

!(function _core_plugin_communication_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		Private.messagePool = { };

		Public.dispatch = function _dispatch( messageInfo ) {
			if( Object.type( messageInfo ) === 'Object' ) {
				if( typeof messageInfo.name === 'string' ) {
					if( messageInfo.name in Private.messagePool ) {
						Private.messagePool[ messageInfo.name ].forEach(function _forEach( listener ) {
							try {
								listener.callback.apply( listener.scope, [ messageInfo ] );
							} catch( ex ) {
								Public.error({
									type:	'error',
									origin:	'Core COM',
									name:	'_dispatch -> _forEach',
									msg:	'unable to dispatch event "' + messageInfo.name + '". Original error: "' + ex.message + '"'
								});
							}
						});	
					}
				}
				else {
					Public.error({
						type:	'syntax',
						origin:	'Core COM',
						name:	'_dispatch',
						msg:	'expected an event type as string'
					});
				}
			}
			else {
				Public.error({
					type:	'syntax',
					origin:	'Core COM',
					name:	'_dispatch',
					msg:	'expected an object'
				});
			}
			
			return Public;
		};

		Public.listen = function _listen( eventName, callback, scope ) {
			if( Object.type( eventName ) !== 'Array' ) {
				eventName = [ eventName ];
			}
			
			eventName.forEach(function _forEach( event ) {
				if( typeof event === 'string' ) {
					if( typeof Private.messagePool[ event ] === 'undefined' ) {
						Private.messagePool[ event ] = [ ];
					}
						
					if( typeof callback === 'function' ) {
						Private.messagePool[ event ].push( { callback: callback, scope: scope || null } );
					}
				} else {
					Public.error({
						type:	'syntax',
						origin:	'Core COM',
						name:	'_listen',
						msg:	'expected a string value (or an Array of strings), received "' + typeof event + '" instead'
					});
				}
			});
			
			return Public;
		};
		
		Public.forget = function _forget( eventName, callback ) {
			if( Object.type( eventName ) !== 'Array' ) {
				eventName = [ eventName ];
			}
			
			eventName.forEach(function( event ) {
				if( typeof event === 'string' ) {
					if( Private.messagePool[ event ] && Object.type( Private.messagePool[ event ] ) === 'Array' ) {
						if( callback === undef ) {
							Private.messagePool[ event ] = [ ];
						}
						else {
							Private.messagePool[ event ] = Private.messagePool[ event ].filter(function( eventObj ) {
								return eventObj.callback !== callback;
							});
						}
					}
				}
				else {
					Public.error({
						type:	'syntax',
						origin:	'Core COM',
						name:	'_forget',
						msg:	'expected a string value (or an Array of strings)'
					});
				}
			});
			
			return Public;
		};
	});
}());