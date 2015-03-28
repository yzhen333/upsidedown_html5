var Block=Spirit.extend({
	
	offsetX:0,
	offsetY:0,
	startX:0,
	startY:0,
	lastX:0,
	lastY:0,
	endX:0,
	endY:0,	
	
	speedYtmp:0,
	handleTouch:false,
	touchstart:function (t) {
		
		this.offsetX=t.pageX-this.x;
		this.offsetY=t.pageY-this.y;
		
		this.startX=t.pageX;
		this.startY=t.pageY;
		
		this.lastX=t.pageX;
		this.lastY=t.pageY;
		
		this.speedYtmp=this.speedY;
		this.speedY=0;
		
	},
	TOUCH_ACCURACY:4,
	touchmove:function (t) {
		
		this.endX=t.pageX;
		this.endY=t.pageY;
					
		var diffX=this.endX-this.lastX;
		var diffY=this.endY-this.lastY;
		var absDiffX=Math.abs(diffX);
		var absDiffY=Math.abs(diffY);
		
		if(absDiffX>=this.TOUCH_ACCURACY
			||absDiffY>=this.TOUCH_ACCURACY){
//			this.x+=diffX;
//			this.y+=diffY;
			this.x=this.endX-this.offsetX;
			this.y=this.endY-this.offsetY;
		}
		console.log("touchmove");
	},
	touchend:function (t) {
		var diffX=this.endX-this.startX;
		var diffY=this.endY-this.startY;
		var moved=Math.sqrt(diffX*diffX+diffY*diffY);
		if(moved>this.TOUCH_ACCURACY){
			var cos=diffX/moved;
			var sin=diffY/moved;
			var baseSpeed=700/1000;
			
			
			this.speedX=baseSpeed*cos;
			this.speedY=baseSpeed*sin;
			
		}else{
			this.speedY=this.speedYtmp;
		}
		
		
		
	},
	bgColor:"#f00",
	blockType:1,
	setBlockType:function (blockType) {
		this.blockType=blockType;
		this.img=main.resList[BlockTypeArr[blockType]];
		return BlockTypeArr[blockType];
	},
	lastDrawedX:0,
	lastDrawedY:0,
	drawImg:function (x,y,w,h) {
		main.ctx.fillStyle=this.bgColor;
		main.ctx.fillRect(x,y,w,h);
		main.ctx.drawImage(this.img,x,y,w,h);
		this.lastDrawedX=x;
		this.lastDrawedY=y;
	},
	update:function () {
//		if((this.y<-(this.height+2*this.marginY)&&this.speedY<0)
//			||this.y>config.dev_height
//			||this.x<-(this.width+2*this.marginX)
//			||this.x>config.dev_width){
		this.speedY=app.speedY;
		if(this.y>=config.dev_height){				
			this.recycle();
			app.gameOver();
		}
			
	},
	recycle:function () {
		//这种会有时延
//		this.y=app.lastBlock.y-(this.height+2*this.marginY);
	
		this.y=this.y-(this.height+2*this.marginY)*app._blockSize;
		
		this.x=app.getRandX(this);
		this.setBlockType(app.getRandBlockType());
		this.bgColor=app.getRandColor();
		this.speedX=0;
		this.speedY=app.speedY;
		app.lastBlock=this;
	}
});

Block.create=function (x,y,blockType,speedX,speedY,width,height) {
	var b1=new Block();
	
	var resName=b1.setBlockType(blockType);
	
	b1.initAttr(x,y,resName,speedX,speedY,width,height);
	return b1;
}

var BlockType={
	up:0,
	down:1,
	left:2,
	right:3/*,
	downleft:5,
	downright:6,
	upleft:7,
	upright:8*/
}

var BlockTypeArr=["up","down","left","right"/*,"downleft","downright","upleft","upright"*/];
var BlockTypeMap={
	up:BlockType.up,
	down:BlockType.down,
	left:BlockType.left,
	right:BlockType.right
};

