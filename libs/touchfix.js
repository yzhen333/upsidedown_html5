/**
 * 兼容ie10，11和android、ios的触摸事件，只需要和android,ios一样使用函数就可以了，
 */
var TouchFix = {};
(function() {
	var MSPointerType={
		start:"MSPointerOver",
		move:"MSPointerMove",
		end:"MSPointerOut"
	},
	pointerType={
		start:"pointerover",
		move:"pointermove",
		end:"pointerout"
	},
	touchType={
		start:"touchstart",
		move:"touchmove",
		end:"touchend"
	},
	mouseType={
		start:"mousedown",
		move:"mousemove",
		end:"mouseup",
		out:"mouseout"
	};
	function isTouch() {
		return typeof window.ontouchstart !== "undefined";
	}

	function isMSPointer() {
		return window.navigator.msPointerEnabled;
	}

	function isPointer() {
		return window.navigator.pointerEnabled;
	}

	function bindStart(el,cb) {
		el.addEventListener(pointerType.start,
			function (e) {
				pointerHandler(e,cb);
			});
		el.addEventListener(MSPointerType.start, 
			function (e) {
				MSPointerHandler(e,cb);	
			});
		el.addEventListener(touchType.start,  
			function (e) {
				touchHandler(e,cb);
			});
		if (!isTouch() && !isMSPointer() && !isPointer()) {
			el.addEventListener(mouseType.start,  
			function (e) {
				mouseHandler(e,cb);
			});
		}
	}

	function bindMove(el,cb) {
		el.addEventListener(pointerType.move,  
			function (e) {
				pointerHandler(e,cb);
				cb(e);
			});
		el.addEventListener(MSPointerType.move,  
			function (e) {
				MSPointerHandler(e,cb);
				cb(e);
			});
		el.addEventListener(touchType.move,  
			function (e) {
				touchHandler(e,cb);
			});
		
		if (!isTouch() && !isMSPointer() && !isPointer()) {
			el.addEventListener(mouseType.move,  
			function (e) {
				mouseHandler(e,cb);
			});
		}
	}

	function bindEnd(el,cb) {
		el.addEventListener(pointerType.end,  
			function (e) {
				pointerHandler(e,cb);
			});
		el.addEventListener(MSPointerType.end,  
			function (e) {
				MSPointerHandler(e,cb);
			});
		el.addEventListener(touchType.end,  
			function (e) {
				touchHandler(e,cb);
			});
		
		if (!isTouch() && !isMSPointer() && !isPointer()) {
			el.addEventListener(mouseType.end,  
			function (e) {
				mouseHandler(e,cb);
			});
			el.addEventListener(mouseType.out,  
			function (e) {
				mouseHandler(e,cb);
			});
		}
	}
	
	TouchFix.bind = function(el,type,cb) {
		switch (type) {
			case touchType.start:
				bindStart(el,cb);
				break;
			case touchType.move:
				bindMove(el,cb);
				break;
			case touchType.end:
				bindEnd(el,cb);
				break;
			default:
				break;
		}
	}
	var hasTouchStart=false;
	function commonHandler (e) {
		if(e.type===MSPointerType.start
			||e.type===pointerType.start
			||e.type===mouseType.start){
			e.type=touchType.start;				
		}else if(e.type===MSPointerType.move
			||e.type===pointerType.move
			||e.type===mouseType.move){
			e.type=touchType.move;				
		}else if(e.type===MSPointerType.end
			||e.type===pointerType.end
			||e.type===mouseType.end
			||e.type===mouseType.out){
			e.type=touchType.end;				
		}
			
		e.touches=[];
		e.pageX=e.clientX;
		e.pageY=e.clientX;
		e.touches[0]=e;
	}
	function MSPointerHandler(e,cb) {
		commonHandler(e);
		cb(e);
	}
	function pointerHandler (e,cb) {
		commonHandler(e);
		cb(e);
	}
	function touchHandler (e,cb) {
		cb(e);
	}
	
	function mouseHandler (e,cb) {
		commonHandler(e);
		cb(e);
	}

})();
