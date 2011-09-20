/* 
 * core_plugin_extensions.js
 * ------------------------------
 * Core plugin: abstracts base library extensions (plugins)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-14
 * Changed: 2011-06-14
 */

!(function _core_plugin_extensions_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		if( Object.type( Private.DOM ) === 'Object' ) {
			Public.extend( Private.DOM, {
				autocomplete:	function _autocomplete() {
					var res = $.fn.autocomplete.apply( this, arguments );
					
					return arguments.length > 1 ? res : this;
				},
				effect:			function _effect() {
					$.fn.effect.apply( this, arguments );
					
					return this;
				},
				draggable:		function _draggable() {
					$.fn.draggable.apply( this, arguments );
					
					return this;
				},
				slider:			function _slider() {
					$.fn.slider.apply( this, arguments );
					
					return this;
				}
			});
		}
	});
}());