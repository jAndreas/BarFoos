/* 
 * app.js ( Example )
 * ------------------------------
 * Example Application - Wire things up
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-06-18
 * Changed: 2011-06-18
 */
 
!(function _application_wrap( win ) {
	"use strict";
	var	ROOT = win.ROOT = win.ROOT || { },
		ROOTcomponents = ROOT.components = ROOT.components || { },
		ROOTapps =ROOT.apps = ROOT.apps || { };

	if( Object.hasKeys( ROOTcomponents, 'Core Sandbox' ) && Object.hasKeys( ROOTapps, 'ExampleApplication' ) ) {
		var	Core		= ROOTcomponents.Core,
			Sandbox		= ROOTcomponents.Sandbox,
			Modules		= ROOTcomponents.Modules;
	
		Core.registerSandbox( Sandbox );
		
		Core.registerModule( 'ExampleModule', Modules.ExampleModule );
		
		Core.startAll();		
	}
	else {
		throw new ReferenceError( 'ExampleApp: unable to resolve necessary application object' ); 
	}
	
}( window ));
