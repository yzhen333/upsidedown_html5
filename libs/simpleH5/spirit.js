/**
 *精灵父类 
 */
var Spirit=Class.extend({
	init:function(){
		main.spiritList.push(this);
	},
	
	//x,y 相对于devwidth,devheight的位置
	x:0,
	y:0,
	//getX,getY 相对于winwidth,winheight的位置
	getX:function () {
		return this.x*main.scale_x;
	},
	getY:function () {
		return this.y*main.scale_y;
	},
	marginX:0,
	getMarginX:function () {
		return this.marginX*main.scale_x;
	},
	marginY:0,
	getMarginY:function () {
		return this.marginY*main.scale_y;
	},
	speedX:0,//速度，px/ms
	speedY:0,
	isShown:true,
	destroy:function () {
		this.img=null;
		var tmpList=new Array(main.spiritList.length-1);
		for (var i = 0; i < main.spiritList.length; i++) {
			var sp=main.spiritList[i];
			if(sp!==this){
				tmpList.push(sp);
			}
		}
		main.spiritList=tmpList;
	},
	/*
	getSpeedX:function () {
			return this._speedX*main.scalex;
		,
		getSpeedY:function () {
			return this._speedY*main.scaley;
		},}
	*/
	
	img:null,
	width:0,
	height:0,
	getWidth:function () {
		return this.width*main.scale_x;
	},
	getHeight:function () {
		return this.height*main.scale_y;
	},
	
	
	/**
	 *当前角度 
	 */
	_angleNow:0,
	/**
	 *最终角度 
	 */
	_angleFinal:0,
	/**
	 *当前的角速度 
	 */
	_angleSpeed:0,
	/**
	 *旋转持续的时间 
	 */
	_rotate_duration:0,
	/**
	 * 旋转
	 * @param {number} angleSpeed:角速度
	 * @param {number} rotate_duration 持续时间，单位为豪秒，0为永久
	 */
	rotate:function (angleSpeed,rotate_duration) {
		this._angleSpeed=angleSpeed;
		this._rotate_duration=rotate_duration;
		this._angleFinal=this._angleNow+angleSpeed*rotate_duration;
	},
	
	
	/**
	 *当前的透明度 
	 */
	_alphaNow:1,
	/**
	 *最终的透明度 
	 */
	_alphaFinal:1,
	/**
	 *透明度变化速度 
	 */
	_alphaSpeed:0,
	/**
	 *达到最终的透明度所需的时间 
	 */
	_alpha_duration:0,
	/**
	 * 透明度
	 * @param {number} alphaSpeed:透明度变化速度
	 * @param {number} alpha_duration 持续时间，单位为豪秒，0为永久
	 */
	alpha:function (alphaSpeed,alpha_duration) {
		this._alphaSpeed=alphaSpeed;
		this._alpha_duration=alpha_duration;
		this._alphaFinal=this._alphaNow+alphaSpeed*alpha_duration;
	},
	
	/**
	 *内置的转换实现 
	 */
	_transform:function () {
		//实现旋转指令
		main.ctx.rotate(this._angleNow);
		
		this._angleNow+=this._angleSpeed*main.interval;
		//如果不是永久旋转并且旋转的角度到了则自动停止旋转
		if(((this._angleSpeed>0&&this._angleNow>=this._angleFinal)
			||(this._angleSpeed<0&&this._angleNow<=this._angleFinal))
			&&this._rotate_duration!=0){
			this._angleSpeed=0;
			this._rotate_duration=0;
		}
			
		//实现alpha指令
		main.ctx.globalAlpha=this._alphaNow;
		this._alphaNow+=this._alphaSpeed*main.interval;
		if(this._alphaNow>1) this._alphaNow=1;
		if(this._alphaNow<0) this._alphaNow=0;
		if((this._alphaSpeed>0&&this._alphaNow>=this._alphaFinal)
			||(this._alphaSpeed<0&&this._alphaNow<=this._alphaFinal)){
				this._alphaSpeed=1;
				this._alpha_duration=0;
			}
	},
	drawImg:function (x,y,w,h) {
		main.ctx.drawImage(this.img,
				x,y,w,h);
	},
	update:function () { },
	draw:function () {
		var ctx=main.ctx;
		ctx.save();
		
		this._transform();
		
//			console.log("getWidth"+this.getWidth());
//			console.log("y"+this.getY());
		
		if(this.isInWindow()){	
			this.drawImg(this.getX()+this.getMarginX(),this.getY()+this.getMarginY(),
				this.getWidth(),this.getHeight());
		}
		
		this.x+=this.speedX*main.interval;
		this.y+=this.speedY*main.interval;
		
		this.update();
		ctx.restore();
	},
	isInWindow:function () {
		return this.y<config.dev_height
			&&this.y>-(this.height+2*this.marginY)
			&&this.x>-(this.width+2*this.marginX)
			&&this.x<config.dev_width;
	},
	/**
	 *是否响应事件，只有为true才会响应事件 
	 */
	handleTouch:false,
	touchstart:function(t){ },
	touchmove:function(t){ },
	touchend:function(t){ },
	
	initAttr:function (x,y,resName,speedX,speedY,width,height,marginX,marginY) {
		_this=this;
		_this.x=x;
		_this.y=y;
		if(speedX){
			_this.speedX=speedX;
		}
		if(speedY){
			_this.speedY=speedY;
		}
		if(marginX){
			_this.marginX=marginX;
		}
		if(marginY){
			_this.marginY=marginY;
		}
		if(width){
			_this.width=width;
		}
		if(height){
			_this.height=height;					
		}
		_this.img=main.resList[resName];
		if(_this.img&&_this.img.width>0){
			if(width){
				_this.width=width;
			}else{
				_this.width=_this.img.width;
			}
			if(height){
				_this.height=height;					
			}else{
				_this.height=_this.img.height;
			}
		}
	}
});
Spirit.create=function(x,y,src,speedX,speedY,width,height,marginX,marginY){
	var s1=new Spirit();
	s1.initAttr(x,y,src,speedX,speedY,width,height,marginX,marginY);
	main.spiritList.push(s1);
	return s1;
}

