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
	var	BF = win.BarFoos = win.BarFoos || { },
		BFapps = BF.apps = BF.apps || { };

	if( Object.hasKeys( BF, 'Core Sandbox' ) && Object.hasKeys( BFapps, 'ExampleApplication' ) ) {
		var	Core		= BF.Core,
			Sandbox		= BF.Sandbox,
			Modules		= BF.Modules;
	
		Core.registerSandbox( Sandbox );
		
		Core.registerModule( 'ExampleModule', Modules.ExampleModule );
		
		Core.startAll();		
	}
	else {
		throw new ReferenceError( 'ExampleApp: unable to resolve necessary application object' ); 
	}
	
}( window ));
