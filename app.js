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
	
		// register Sandbox
		Core.registerSandbox( Sandbox );
		
		// register Modules
		Core.registerModule( 'ExampleModule', Modules.ExampleModule );
		
		// startup all registered Modules
		Core.startAll();

		// register Modules which are not loaded immediately
		Core.registerModule( 'Journal', Modules.Journal );
		
		// All pure application specific stuff on events 
		Core.listen( [ 'SomeSpecialEvent' ], function _applicationEvents( event ) {
			var eventData = event.data;
			
			Core.start( 'ExampleModule', eventData );
		}, null);		
	}
	else {
		throw new ReferenceError( 'ExampleApp: unable to resolve necessary application object' ); 
	}
	
}( window ));
