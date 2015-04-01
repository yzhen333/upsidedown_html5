/**
 * simpleH5: 
 * 自己为这个小游戏实现的一个非常轻量级的游戏引擎
 * main 文件，用于控制框架的主逻辑
 */
var main={
	canvas:null,
	ctx:null,
	app:null,
	
	baseInterval:1000/20,
	interval:1000/20,
	
	
	resList:{},
	win_width:config.dev_width,
	win_height:config.dev_height,
	scale_x:1,
	scale_y:1,
	backColor:"#fff",
	spiritList:[],
	init:function () {
		this.win_width=window.innerWidth;
		this.win_height=window.innerHeight;
		
		this.scale_x=this.win_width/config.dev_width;
		this.scale_y=this.win_height/config.dev_height;
		
		this.canvas=document.getElementById("canvas");
		
		//这种宽高指定不会引起整体缩放，用style会使图片也整体缩放
		this.canvas.width=this.win_width;
		this.canvas.height=this.win_height;
		this.backColor=this.canvas.style.backgroundColor;
		
		this.ctx=this.canvas.getContext("2d");
		
		
		this.loadRes(config.resSrcList);
		
	},
	touchedSpirit:null,
	touchHandler:function (e) {
		var e=e||window.event;
		var t=e.touches[0];
		switch (e.type){
			case "touchstart":
				for (var i = 0; i < main.spiritList.length; i++) {
					var sp=main.spiritList[i];
					
					var diffX=t.pageX-sp.getX();
					var diffY=t.pageY-sp.getY();
					
					if(!sp.handleTouch){
						continue;
					}
					
					if(diffX>0&&diffX<sp.getWidth()
						&&diffY>0&&diffY<sp.getHeight()){
						sp.touchstart(t);
						this.touchedSpirit=sp;
						return ;
					}
				}
				break;
			case "touchmove":
				if(this.touchedSpirit!=null){
					this.touchedSpirit.touchmove(t);
				}
				return ;
				break;
			case "touchend":
				if(this.touchedSpirit!=null){
					this.touchedSpirit.touchend(t);
					this.touchedSpirit=null;
				}
				return ;
				break;
			default:
				break;
		}
	},
	loadRes:function(resSrcList){
		for (i in resSrcList) {
			var resSrc=resSrcList[i];
			var res=null;
			switch (resSrc.type){
				case "img":
					res=new Image();
					res.src=resSrc.src;
					break;
				default:
					break;
			}
			this.resList[i]=res;
		}
	},
	
	isRunning:true,
	start:function(){
		this.isRunning=true;
		
	//定义贞管理类，兼容
		var requestAnimationFrame = window.requestAnimationFrame
							|| window.mozRequestAnimationFrame
							|| window.webkitRequestAnimationFrame
							|| function(cb){setTimeout(cb,main.baseInterval)};
							
		var startTime=0,endTime=0,
			matchTime=0//补偿时间;
		requestAnimationFrame(function(){
			
			
			var _arguments=arguments;
			if(main.isRunning){
				setTimeout(function () {
					requestAnimationFrame(_arguments.callee);
				},matchTime);
			}
			
			
			endTime=new Date().getTime();
			
			var realInterval=endTime-startTime;
			if(startTime!=0){
				if(realInterval<main.baseInterval){
					matchTime=main.baseInterval-realInterval;
					main.interval=main.baseInterval;
				}else{
					matchTime=0;
					main.interval=realInterval;
				}
			}
			startTime=endTime;
			
//			main.ctx.clearRect(0,0,main.win_width,main.win_height);
//			main.canvas.width=main.canvas.width;


			/**
			 * clearRect性能最好，但是会和绘制颜色,透明png图片层叠(block.drawImg)冲突,
			 * 原因不详，只能选择重置width或者不透明背景.
			 * 重置width据说部分机型卡，所以只能选择不透明背景
			 */
//			main.ctx.fillStyle=main.backColor;
//			main.ctx.fillRect(0,0,main.win_width,main.win_height);

			
			for (var i = 0; i < main.spiritList.length; i++) {
				var sp=main.spiritList[i];
				if(sp.isShown){
					//清除原来画的
					var lastDrawedX=sp.lastDrawedX||sp.getX();
					var lastDrawedY=sp.lastDrawedY||sp.getY();
					
					var buffer=20;
					main.ctx.clearRect(lastDrawedX-buffer,lastDrawedY-buffer,
						sp.getWidth()+sp.getMarginX()*2+2*buffer,
						sp.getHeight()+sp.getMarginY()*2+2*buffer);
				}
			}
			
			for (var i = 0; i < main.spiritList.length; i++) {
				var sp=main.spiritList[i];
				if(sp.isShown){
					//画上当前的
					sp.draw();
				}
			}
			if(main.app&&main.app.update){
				main.app.update();
			}
		});
		
	},
	pause:function(){
		this.isRunning=false;	
	},
	run:function (app) {
		this.app=app;

		main.canvas.addEventListener("touchstart",main.touchHandler,false);			
		main.canvas.addEventListener("touchmove",main.touchHandler,false);
		main.canvas.addEventListener("touchend",main.touchHandler,false);		
		
		if(app&&app.create){
			app.create();
		}
		
		main.start();
	}
}


