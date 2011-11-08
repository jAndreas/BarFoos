/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-11-08 - added tiny connection validator
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.4 ******** *******/
		/****** ************************************************** *******/
		var errorCount			= 0,
			connectionStates	= { OK: 0, BAD: 1 },
			state				= connectionStates.OK;

		Public.ajax = function _ajax() {
			return $.ajax.apply( null, arguments ).done(function _done() {
				errorCount = 0;
				
				switch( state ) {
					case connectionStates.OK:
						break;
					case connectionStates.BAD:
						Public.dispatch({ name: 'CORE_CONNECTION_RESTORED'});
						state = connectionStates.OK;
						break;
				}
			}).fail(function _fail() {
				if( ++errorCount >= 3 ) {
					Public.dispatch({ name: 'CORE_CONNECTION_LOST', data: {
						errorCount:	errorCount
					}});
					
					state		= connectionStates.BAD;
				}
			});
		};		
		
		Public.getJSON = function _getJSON( ) {
			return $.getJSON.apply( null, arguments );
		};
	});
}());
