/* 
 * core_plugin_dommanipulation.js
 * ------------------------------
 * Core plugin: DOM Manipulation (jQuery/baseLib abstraction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-03
 * Changed: 2011-07-18
 */

!(function _core_plugin_dommanipulation_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.6.2 ******** *******/
		/****** ************************************************** *******/
		var	push	= Array.prototype.push,
			slice	= Array.prototype.slice,
			splice	= Array.prototype.splice,
			each	= Array.prototype.forEach,
			some	= Array.prototype.some,
			css		= $.fn.css;
		
		Public.$ = function _$( selector, args ) {
			function Init( sel ) {
				this.constructor = _$;
				push.apply( this, $( sel, args ).get() );
			}

			Init.prototype		= Private.DOM;
			Init.constructor	= _$;

			return new Init( selector );
		};
		
		Public.ready = function _ready( method ) {
			$.fn.ready.call( Public, method );
			return Public;
		};
		
		Public.contains = function _contains() {
			return $.contains.apply( null, arguments );
		};
		
		Private.DOM = {
			each: function _each() {
				return $.fn.each.apply( this, arguments );
			},
			map: function _map() {
				return $.fn.map.apply( this, arguments );
			},
			queue: function _queue() {
				return $.fn.queue.apply( this, arguments );
			},
			offsetParent: function _offsetParent() {
				return $.fn.offsetParent.apply( this, arguments );
			},
			pushStack: function _pushStack() {
				return $.fn.pushStack.apply( this, arguments );
			},
			domManip: function _domManip() {
				return $.fn.domManip.apply( this, arguments );
			},
			dequeue: function _dequeue() {
				return $.fn.dequeue.apply( this, arguments );
			},
			push: push,
			splice: splice,
			clone: function _clone() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				push.apply( newRef, $.fn.clone.apply( this, args ).get() );

				return newRef;
			},
			find: function _find() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.find.apply( this, arguments ).get() );
				
				return newRef;
			},
			end: function _end() {
				return this.prevRef || this.constructor( null );
			},
			prev: function _prev() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				push.apply( newRef, $.fn.prev.apply( this, arguments ).get() );
				
				return newRef;
			},
			next: function _next() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				push.apply( newRef, $.fn.next.apply( this, arguments ).get() );
				
				return newRef;
			},
			closest: function _closest() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				push.apply( newRef, $.fn.closest.apply( this, arguments ).get() );
				
				return newRef;
			},
			get: function _get( index ) {
				return $.fn.get.call( this, index );
			},
			toArray: function _toArray() {
				return $.fn.toArray.call( this );
			},
			bind: function _bind( ev, handler ) {
				$.fn.bind.call( this, ev, handler );
				return this;	
			},
			trigger: function _trigger() {
				$.fn.trigger.apply( this, arguments );
			},
			unbind: function _unbind( node, ev, handler ) {
				$.fn.unbind.call( this, ev, handler );
				return this;
			},
			hide: function _hide() {
				return this.css( 'display', 'none' );
			},
			show: function _show() {
				return this.css( 'display', 'block' );
			},
			val: function _val() {
				var result = $.fn.val.apply( this, arguments );
				
				return arguments.length > 1 ? this : result;
			},
			text: function _text() {
				var result = $.fn.text.apply( this, arguments );
				
				return arguments.length > 1 ? this : result;
			},
			html: function _html() {
				var result = $.fn.html.apply( this, arguments );
				
				return arguments.length > 1 ? this : result;
			},
			attr: function _attr() {
				$.fn.attr.apply( this, arguments );
				return this;
			},
			removeAttr: function _removeAttr() {
				$.fn.removeAttr.apply( this, arguments );
				return this;
			},
			empty: function _empty() {
				$.fn.empty.apply( this, arguments );
				return this;
			},
			select: function _select() {
				$.fn.select.apply( this, arguments );
				return this;
			},
			is: function _is( check ) {
				var confirmed = some.call( this, function( elem ) {
					return !!Public.data( elem, check );
				});
				
				return ( confirmed || $.fn.is.apply( this, arguments ) );
			},
			addClass: function _addClass() {
				$.fn._addClass.apply( this, arguments );
				return this;
			},
			removeClass: function _removeClass() {
				$.fn._removeClass.apply( this, arguments );
				return this;
			},
			toggleClass: function _toggleClass() {
				$.fn.toggleClass.apply( this, arguments );
				return this;
			},
			css: function _css( prop, value ) {
				if( value === "" || value || Object.type( prop ) === 'Object' ) {
					if( value ) {
						$.fn.css.call( slice.call( this, 0 ), App.createCSS( prop ), value );
					}
					else {
						Object.map( prop, function( prop, value ) {
							return [ App.createCSS( prop ), value ];	
						});
						
						$.fn.css.call( slice.call( this, 0 ), prop );
					}
					return this;	
				}
				else {
					return $.fn.css.call( slice.call( this, 0 ), App.createCSS( prop ) );
				}
			},
			animate: (function _animateAdvancedConditional() {
				var	transition		= App.createCSS('Transition');
				
				if(transition ) {
					return function _animate( props, duration, callback, easing ) {
						var that	= this,
							args	= arguments;

						if( Object.type( props ) === 'Object' && Object.type( duration ) === 'Number' ) {
							// map passed css propertys into browser natives
							Object.map( props, function _mapping( key, value ) {
								return [ App.createCSS( key ), value ];
							});
							
							// check if we got passed in an 'easing string' without a callback.
							if( Object.type( callback ) === 'String' ) {
								easing = callback;
							}
							
							// apply animation on each element in our wrapped set
							each.call( that, function _eaching( elem ) {
								// if the element is currently animated by us, push the arguments into it's "animQueue" array for later execution
								if( Public.data( elem, 'animated' ) ) {
									Public.data( elem, 'animQueue' ).push( args );
								}
								else {
									// apply the transition property along with the duration and easing, also set the css property for animation
									css.call( [ elem ], transition, 'all ' + duration/1000 + 's ' + (easing && typeof easing === 'string' ? easing : 'ease' ) );
									css.call( [ elem ], elem.aniprops = props );
								
									// create the data property 'animationTimier' on the current element if its not present already
									if( Object.type( Public.data( elem, 'animationTimer' ) ) !== 'Array' ) {
										Public.data( elem, 'animationTimer', [ ] );
									}
									// create the data property 'animQueue' on the current elements if its not present already
									if( Object.type( Public.data( elem, 'animQueue' ) ) !== 'Array' ) {
										Public.data( elem, 'animQueue', [ ] );
									}
									
									Public.data( elem, 'animated', true );
									elem.stopAnimation = null;
									
									// invoke a new function(-context) to avoid that all timeout callbacks would closure the same variable
									// store the timeout id in the 'animationTimer' array which is a data property
									(function _freeClosure( myElem ) {
										Public.data( myElem, 'animationTimer').push(setTimeout(function _animationDelay() {
											// TODO: initialize an interval which checks if there still are css prop deltas to be more accurate. 
											css.call( [ myElem ], transition, '' );
											
											Public.removeData( myElem, 'animated' );
											
											// if elements animQueue is available and not empty, execute outstanding animations first
											if( Object.type( Public.data( myElem, 'animQueue') ) === 'Array' && Public.data( myElem, 'animQueue' ).length ) {
												_animate.apply( that, Public.data( myElem, 'animQueue').shift() );
											}
											else {
												if( typeof callback === 'function' && !myElem.stopAnimation ) {
													callback.apply( myElem, [  ] );
												}
												else {
													myElem.stopAnimation = null;
												}
											}
										}, duration + 50));
									}( elem ));
								}
								
							});
							
							return that;
						}
						else {
							Public.error({
								type:	'type',
								origin:	'Core DOM', 
								name:	'_animate()',
								msg:	'object/number expected, received ' + win.getLastError( -2 ) + '/' + win.getLastError( -1 ) + ' instead'
							});
						}
					};
				}
				else {
					return function _animate( props, duration, callback ) {
						var that		= this;
						
						$.fn.animate.apply( that, arguments );
						
						return that;
					};
				}
			}()),
			stop: (function _stopAdvancedConditional() {
				var transition	= App.createCSS('Transition');
				
				if( transition ) {
					return function _stop( jumpToEnd ) {
						var that = this;
						
						that.each(function( index, elem ) {
							elem.stopAnimation = true;
							$.fn.css.call( [ elem ], transition, '' );
							
							// TODO: this section should probably goe into 'jumpToEnd'
							if( Object.type( Public.data( elem, 'animationTimer' ) ) === 'Array' ) {
								Public.data( elem, 'animationTimer' ).forEach(function _forEach( timerID ) {
									clearInterval( timerID );
								});
							}
							
							// clear queued animation requests
							if( Object.type( Public.data( elem, 'animQueue' ) ) === 'Array' ) {
								Public.data( elem, 'animQueue', [ ] );
							}
							
							Public.data( elem, 'animationTimer', [ ] );
							Public.removeData( elem, 'animated' );
							
							if( jumpToEnd ) {
								setTimeout(function() {
									if( elem.aniprops ) {
										for( var prop in elem.aniprops ) {
											$.fn.css.call( [ elem ], prop, elem.aniprops[prop] );
										}
									}
								}, 1);
							}
						});
						
						return that;
					};
				}
				else {
					return function _stop() {
						var that = this;
						
						$.fn.stop.apply( that, arguments );
						return that;
					};
				}
			}()),
			jQstop: function _jQstop() {
				$.fn.stop.apply( this, arguments );
				return this;
			},
			slice: function _slice() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				push.apply( newRef, ( slice.apply( this, args ) ) );
				
				return newRef;
			},
			delegate: function _delegate( selector, ev, handler ) {
				$.fn.live.call( this, ev, handler, undef, selector );
				return this;
			},
			undelegate: function _undelegate( selector, ev, handler ) {
				if( arguments.length === 0 ) {
					$.fn.unbind.call( this, 'live' );
				}
				else {
					$.fn.die.call( this, ev, null, handler, selector );
				}
				return this;
			},
			remove: function _remove() {
				$.fn.remove.call( this );
				return this;
			},
			append: function _append() {
				$.fn.append.apply( this, arguments );
				return this;
			},
			appendTo: function _appendTo() {
				$.fn.appendTo.apply( this, arguments );
				
				return this;
			},
			prepend: function _prepend() {
				$.fn.prepend.apply( this, arguments );
			},
			prependTo: function _prependTo() {
				$.fn.prependTo.apply( this, arguments );
			},
			after: function _after() {
				$.fn.after.apply( this, arguments );
				
				return this;
			},
			insertAfter: function _insertAfter() {
				$.fn.insertAfter.apply( this, arguments );
				
				return this;
			},
			before: function _before() {
				$.fn.before.apply( this, arguments );
				
				return this;
			},
			insertBefore: function _insertBefore() {
				$.fn.insertBefore.apply( this, arguments );
				
				return this;
			},
			position: function _position() {
				return $.fn.position.apply( this, arguments );
			},
			offset: function _offset() {
				return $.fn.offset.apply( this, arguments );
			},
			width: function _width() {
				return $.fn.width.apply( this, arguments );
			},
			height: function _height() {
				return $.fn.height.apply( this, arguments );
			},
			outerWidth: function _outerWidth() {
				return $.fn.outerWidth.apply( this, arguments );
			},
			outerHeight: function _outerHeight() {
				return $.fn.outerHeight.apply( this, arguments );
			},
			scrollTop: function _scrollTop() {
				return $.fn.scrollTop.apply( this, arguments );
			},
			scrollLeft: function _scrollLeft() {
				return $.fn.scrollLeft.apply( this, arguments );
			},
			delay: function _delay( duration, method /* , arguments */ ) {
				var that	= this,
					args	= slice.apply( arguments, [2] );
					
				if( typeof method === 'string' ) {
					method = that[ method ];
				}
				
				setTimeout(function() {
					method.apply( that, args );
				}, duration);
				
				return that;
			}
		};
		/*
		Private.DOM.snapshot = function _snapshot( root ) {
			if( Object.type( root ) === 'Node' ) {
				var snap 	= [ ],
					$root 	= $( root );
					
				$root.children().each(function _snapshot_each( node ) {
					
				});
			}
			else {
				Public.error({
					type:	'type',
					msg:	'Core: snapshot() expects a DOM node'
				});
			}
		};*/
		/*^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
		/*^^^^^ ^^^^^^^^^^^^^^ BLOCK END ^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^*/
	});
}());
