/* 
 * core_plugin_promises.js
 * ------------------------------
 * Core plugin: This plugin implements the BarFoos promise maker
 * This is a clone from jQuerys Deferred objects written by Julian Aubourg, with some slight modifications
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-12-05
 * Changed: 2011-12-05 - created
 */

!(function _core_plugin_promises_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## Zepto *************** *******/
		/****** ************************************************** *******/
		
		Public.Promise = function _Promise() {
			return $.Deferred.apply( null, arguments );
		};
		
		Public.when	= function _when() {
			return $.when.apply( null, arguments );
		};
	});
}());
