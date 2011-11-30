/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-11-30 - getJSON() now calls .ajax() explicitly - added timeout for requests
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.7.0 ******** *******/
		/****** ************************************************** *******/
		var errorCount			= 0,
			timeout				= 5000,
			connectionStates	= { OK: 0, BAD: 1 },
			state				= connectionStates.OK;

		function connectionRestored() {
			errorCount = 0;

			switch( state ) {
				case connectionStates.OK:
					break;
				case connectionStates.BAD:
					Public.dispatch({ name: 'CORE_CONNECTION_RESTORED'});
					state = connectionStates.OK;
					break;
			}
		}

		function badConnection() {
			if( ++errorCount === 3 ) {
				Public.dispatch({ name: 'CORE_BAD_CONNECTION', data: {
					errorCount:	errorCount
				}});
				
				state		= connectionStates.BAD;
			}
		}

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
		
		Public.getJSON = function _getJSON( url ) {
			return $.ajax({
				url:		url,
				dataType:	'json',
				cache:		false,
				timeout:	timeout,
			}).done(function _done() {
				connectionRestored();
			}).fail(function _fail( jXhr, status, message ) {
				if( message !== 'Not Found' ) {
					badConnection();
				} else {
					connectionRestored();
				}
			});
		};
	});
}());
