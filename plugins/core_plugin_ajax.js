/* 
 * core_plugin_ajax.js
 * ------------------------------
 * Core plugin: Ajax communication (jQuery abstaction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-06-18
 */

!(function _core_plugin_ajax_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
		/****** ************************************************** *******/
		Public.ajax = function _ajax() {
			return $.ajax.apply( null, arguments );
		};		
		
		Public.getJSON = function _getJSON( ) {
			return $.getJSON.apply( null, arguments );
		};
	});
}());
