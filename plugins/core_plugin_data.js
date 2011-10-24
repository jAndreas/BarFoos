/* 
 * core_plugin_data.js
 * ------------------------------
 * Core plugin: Data handling (jQuery abstaction level)
 * jQuery data expandos, HTML5 data- Attributes, localStorage & sessionStorage.
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-10-23 - added lsRemove()
 */

!(function _core_plugin_data_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.1 ******** *******/
		/****** ************************************************** *******/
		var	storageObject	= { },
			buffer		= { },
			access		= App.name || 'BarFoos';
		
		if( Object.type( win.localStorage ) === 'Storage' ) {
			storageObject = win.localStorage;
		}
		else {
			// read cookie into storageObject
		}
		
		if( storageObject[ access ] ) {
			buffer = win.JSON.parse( storageObject[ access ] );
		}
		
		Public.data = function _data( elem, key, value ) {
			var rVal = $.data( elem, key, value );
			
			return value ? this : rVal;
		};
		
		Public.removeData = function _removeData( elem, key ) {
			$.removeData( elem, key );
			return Public;
		};
		
		Public.hasData = function _hasData( elem ) {
			return $.hasData( elem );
		};
		
		Public.lsWrite = function _lsWrite( key, value ) {
			buffer[ key ] = value;
			return Public;
		};
		
		Public.lsRead = function _lsRead( key ) {
			return buffer[ key ];
		};
		
		Public.lsRemove = function _lsRemove( key ) {
			delete buffer[ key ];
			return Public;
		};
		
		Public.lsStore = function lsStore() {
			storageObject[ access ] = win.JSON.stringify( buffer );
			return Public;
		};
		
		Public.lsClear = function _clear() {
			buffer = { };
			storageObject[ access ] = null;
			return Public;
		};
		
		$( win ).bind( 'beforeunload', function _beforeUnload() {
			Public.lsStore();
		});
	});
}());
