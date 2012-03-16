/* 
 * core_plugin_dommanipulation.js
 * ------------------------------
 * Core plugin: DOM Manipulation (jQuery/baseLib abstraction level)
 * 
 * This code runs in strict mode (if supported by the environment).
 * ------------------------------
 * Author: Andreas Goebel
 * Date: 2011-05-03
 * Changed: 2011-11-12 - added .on() and .off() methods as for jQuery 1.7.0
 */

!(function _core_plugin_dommanipulation_wrap() {
	"use strict";
	
	Object.lookup( 'BarFoos.Core.plugin', 0 ).execute(function( win, doc, $, Private, Public, Sandbox, App, undef ) {
		/****** BASE LIBRARY ABSTRACTIONS ## JQUERY 1.7.0 ******** *******/
		/****** ************************************************** *******/
		var	push			= Array.prototype.push,
			slice			= Array.prototype.slice,
			splice			= Array.prototype.splice,
			each			= Array.prototype.forEach,
			some			= Array.prototype.some,
			css				= $.fn.css,
			// little 'detection' for transitionend event name
			dummy			= doc.createElement( 'div' ),
			eventNameHash	= { webkit: 'webkitTransitionEnd', Moz: 'transitionend', O: 'oTransitionEnd', ms: 'MSTransitionEnd' },
			transitionEnd	= (function _getTransitionEndEventName() {
								var retValue = 'transitionend';
								
								Object.keys( eventNameHash ).some(function( vendor ) {
									if( vendor + 'TransitionProperty' in dummy.style ) {
										retValue = eventNameHash[ vendor ];
										return true;
									}
								});
								
								return retValue;
							}());
			
		
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
			triggerHandler: function _triggerHandler() {
				return $.fn.triggerHandler.apply( this, arguments );
			},
			eq: function _eq() {
				return $.fn.eq.apply( this, arguments );
			},
			on: function _on() {
				return $.fn.on.apply( this, arguments );
			},
			off: function _off() {
				return $.fn.off.apply( this, arguments );
			},
			dequeue: function _dequeue() {
				return $.fn.dequeue.apply( this, arguments );
			},
			push: push,
			splice: splice,
			add: function _add( newItem ) {
				if( Object.type( newItem ) === 'Node' ) {
					push.call( this, newItem );
				}
				else if( Object.type( newItem ) === 'Object' ) {
					if( Object.type( newItem[ 0 ] ) === 'Node' ) {
						push.call( this, newItem[ 0 ] );
					}
				}

				return this;
			},
			clone: function _clone() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.clone.apply( this, args ).get() );

				return newRef;
			},
			find: function _find() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.find.apply( this, args ).get() );
				
				return newRef;
			},
			end: function _end() {
				return this.prevRef || this.constructor( null );
			},
			prev: function _prev() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.prev.apply( this, args ).get() );
				
				return newRef;
			},
			next: function _next() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.next.apply( this, args ).get() );
				
				return newRef;
			},
			closest: function _closest() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.closest.apply( this, args ).get() );
				
				return newRef;
			},
			parent: function _parent() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.parent.apply( this, args ).get() );
				
				return newRef;
			},
			children: function _children() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.children.apply( this, args ).get() );
				
				return newRef;
			},
			filter: function _filter() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.filter.apply( this, args ).get() );
				
				return newRef;
			},
			last: function _last() {
				var newRef	= this.constructor(),
					args	= arguments;
				
				newRef.prevRef = this;
				push.apply( newRef, $.fn.last.apply( this, args ).get() );
				
				return newRef;
			},
			wrap: function _wrap() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.wrap.apply( this, args ).get() );
				
				return newRef;
			},
			wrapAll: function _wrapAll() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.wrapAll.apply( this, args ).get() );
				
				return newRef;
			},
			replaceWith: function _replaceWith() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.replaceWith.apply( this, args ).get() );
				
				return newRef;
			},
			siblings: function _siblings() {
				var newRef	= this.constructor(),
					args	= arguments;
					
				newRef.prevRef = this;
				push.apply( newRef, $.fn.siblings.apply( this, args ).get() );
				
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
			unbind: function _unbind( ev, handler ) {
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
				
				return arguments.length ? this : result;
			},
			text: function _text() {
				var result = $.fn.text.apply( this, arguments );
				
				return arguments.length ? this : result;
			},
			html: function _html() {
				var result = $.fn.html.apply( this, arguments );
				
				return arguments.length ? this : result;
			},
			attr: function _attr() {
				var result = $.fn.attr.apply( this, arguments );
				return arguments.length > 1 ? this : result;
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
			addClass: (function _addClassConditional() {
				var addClassMethod = typeof $.fn._addClass === 'function' ? $.fn._addClass : $.fn.addClass;
				
				return function _addClass() {
					addClassMethod.apply( this, arguments );
					
					return this;
				};
			}()),
			removeClass: (function _removeClassConditional() {
				var removeClassMethod = typeof $.fn._removeClass === 'function' ? $.fn._removeClass : $.fn.removeClass;
				
				return function _removeClass() {
					removeClassMethod.apply( this, arguments );
					
					return this;
				};
			}()),
			toggleClass: (function _toggleClassConditional() {
				var toggleClassMethod = typeof $.fn._toggleClass === 'function' ? $.fn._toggleClass : $.fn.toggleClass;
				
				return function _toggleClass() {
					toggleClassMethod.apply( this, arguments );
					
					return this;
				};
			}()),
			hasClass: function _hasClass() {
				return $.fn.hasClass.apply( this, arguments );
			},
			css: function _css( prop, value ) {
				if( value === 0 || value === "" || value || Object.type( prop ) === 'Object' ) {
					if( value ) {
						$.fn.css.call( slice.call( this, 0 ), Public.createCSS( prop ), value );
					}
					else {
						Object.map( prop, function( prop, value ) {
							return [ Public.createCSS( prop ), value ];	
						});
						
						$.fn.css.call( slice.call( this, 0 ), prop );
					}
					return this;	
				}
				else {
					return $.fn.css.call( slice.call( this, 0 ), Public.createCSS( prop ) );
				}
			},
			animate: (function _animateAdvancedConditional() {
				var	transition		= Public.createCSS('Transition');
				
				if(transition ) {
					return function _animate( props, duration, callback, easing ) {
						var that	= this,
							args	= arguments;

						if( Object.type( props ) === 'Object' && Object.type( duration ) === 'Number' ) {
							// map passed css propertys into browser natives
							Object.map( props, function _mapping( key, value ) {
								return [ Public.createCSS( key ), value ];
							});
							
							// check if we got passed in an 'easing string' without a callback.
							if( Object.type( callback ) === 'String' ) {
								easing = callback;
							}
						
							// apply animation on each element in our wrapped set
							each.call( that, function _eaching( elem ) {
								//win.setTimeout(function _decoupleAnimation() {
									// if the element is currently animated by us, push the arguments into it's "animQueue" array for later execution
									if( Public.data( elem, 'animated' ) ) {
										Public.data( elem, 'animQueue' ).push( args );
									}
									else {
										// apply the transition property along with the duration and easing, also set the css property for animation
										//css.call( [ elem ], transition, 'all ' + duration/1000 + 's ' + (easing && typeof easing === 'string' ? easing : 'linear' ) );
										elem.style[ transition ] = 'all ' + duration/1000 + 's ' + ( easing && typeof easing === 'string' ? easing : 'linear' );
										css.call( [ elem ], elem.aniprops = props );
									
										// create the data property 'animQueue' on the current elements if its not present already
										if( Object.type( Public.data( elem, 'animQueue' ) ) !== 'Array' ) {
											Public.data( elem, 'animQueue', [ ] );
										}
										
										Public.data( elem, 'animated', true );
										elem.stopAnimation = null;
										
										elem.transitionEndHandler = function _transitionEndHandler() {
											var animQueue = Public.data( this, 'animQueue');
										
											this.style[ transition ] = '';
											this.removeEventListener( transitionEnd, this.transitionEndHandler, false );
											this.transitionEndHandler = null;
											
											Public.removeData( this, 'animated' );
											delete this.aniprops;
											
											if( Object.type( animQueue ) === 'Array' && animQueue.length ) {
												_animate.apply( [ this ], Public.data( this, 'animQueue').shift() );
											}
											else {
												if( typeof callback === 'function' && !this.stopAnimation ) {
													callback.call( this );
												}
												else {
													this.stopAnimation = null;
												}
											}
										};
										
										elem.addEventListener( transitionEnd, elem.transitionEndHandler, false );
									}
								//}, 15);
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
				var transition	= Public.createCSS('Transition');
				
				if( transition ) {
					return function _stop( jumpToEnd, smooth ) {
						var that = this;
						
						that.each(function( index, elem ) {
							elem.stopAnimation = true;
							
							elem.style[ transition ] = 'all 0s linear';
							elem.removeEventListener( transitionEnd, elem.transitionEndHandler, false );
							elem.transitionEndHandler = null;
							
							if( elem.aniprops ) {
								for( var prop in elem.aniprops ) {
									if( prop && elem.aniprops.hasOwnProperty( prop ) ) {
										elem.style[ prop ] = win.getComputedStyle( elem, null )[ prop ];
									}
								}
							}
							
							// clear queued animation requests
							if( Object.type( Public.data( elem, 'animQueue' ) ) === 'Array' ) {
								Public.data( elem, 'animQueue', [ ] );
							}
							
							Public.removeData( elem, 'animated' );
							
							if( jumpToEnd ) {
								if( smooth ) {
									elem.style[ transition ] = 'all 0.3s linear';
									elem.addEventListener( transitionEnd, function _smoothStop() {
										elem.style[ transition ] = '';
										elem.removeEventListener( transitionEnd, _smoothStop, false );
									}, false);
								}
								
								win.setTimeout(function() {
									if( elem.aniprops ) {
										for( var prop in elem.aniprops ) {
											if( prop && elem.aniprops.hasOwnProperty( prop ) ) {
												elem.style[ prop ] = elem.aniprops[ prop ];
											}
										}
									}
								}, 15);
							}
						});
						
						return that;
					};
				}
				else {
					return function _jQstopFallback() {
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
				
				return this;
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
			data: function _data() {
				var result = $.fn.data.apply( this, arguments );
				return arguments.length > 1 ? this : result;
			},
			delay: function _delay( duration, method /* , arguments */ ) {
				var that	= this,
					args	= slice.apply( arguments, [2] );
			
				if( typeof method === 'string' ) {
					method = that[ method ];
				}
			
				win.setTimeout(function _delayedFunction() {
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
