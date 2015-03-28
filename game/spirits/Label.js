var Label=Spirit.extend({
	text:"",
	size:30,
	fontSize:30+"px",
	color:"#f00",
	fillStyle:"#f00",
	font:this.fontSize,
	height:30,
	init:function () {
		this._super();
		
		this.setFontSize(30);
	},
	_updateFont:function () {
		this.font=this.fontSize+" Droid Sans";
		this.fillStyle=this.color;
		main.ctx.font=this.font;
		this.width=main.ctx.measureText(this.text).width/main.scale_x;
	},
	setFontSize:function (size) {
		this.size=Math.round(size*main.scale_y);
		this.height=this.size;
		this.fontSize=this.size+"px";
		this._updateFont();
	},
	setColor:function (color) {
		this.color=color;
		this._updateFont();
	},
	setText:function (text) {
		this.text=text;
		this._updateFont();
	},
	drawImg:function (x,y,w,h) {
		main.ctx.shadowBlur=5;
		main.ctx.shadowColor="#f00";
		main.ctx.font=this.font;
		main.ctx.fillStyle=this.fillStyle;
		main.ctx.fillText(this.text,x,y+h);
	}
});


Label.create=function (x,y,text,speedX,speedY,width,height,marginX,marginY) {
	var l1=new Label();
	l1.initAttr(x,y,"",speedX,speedY,width,height,marginX,marginY);
	l1.setText(text);
	return l1;
}