//app对象必须含有create(),update()字段,将会在main对象中调用
var app = {
	_blockSize : 16,
	blockList : [],
	lastBlock : null,
	firstBlockIndex : 0,
	updateFistBlockIndex : function() {
		this.firstBlockIndex++;
		if (this.firstBlockIndex >= this._blockSize) {
			this.firstBlockIndex = 0;
		}
	},
	/**
	 * 分数为map类型,
	 * key为<gameMode>_<column>,value为分数
	 */
	score : {},
	scoreLabel : null,
	gameMode : 0,
	maxColumn : 4,
	defaultSpeedY : 100 / 1000,
	speedY : 100 / 1000,
	getSpeedYStr : function() {
		return this.getSpeedStr(this.speedY);
	},
	getSpeedStr : function(speed) {
		return new Number(speed * 1000 / 100).toFixed(3) + "/s";
	},
	getRandX : function(b) {
		//0或者1,从0开始
		var column = Math.floor(this.maxColumn * Math.random());
		var x = (config.dev_width - this.maxColumn * (b.width + 2 * b.marginX)) / 2 + column * (b.width + 2 * b.marginX);
		return x;
	},
	getRandBlockType : function() {
		return Math.floor(4 * Math.random());
	},
	//	_colorList:["#428bca","#47a447","#5bc0de","#f0ad4e","#d9534f"],
	_colorList : ["#f30", "#3f3", "#09f", "#03f", "#f90"],
	lastRandColorIndex : 0,
	getRandColor : function() {
		var colorIndex = 0;
		while (colorIndex === this.lastRandColorIndex) {
			colorIndex = Math.floor(5 * Math.random());
		}
		this.lastRandColorIndex = colorIndex;
		return this._colorList[colorIndex];
	},
	touchstart : function(e) {
		var t=e.touches[0];
		this.startX = t.pageX;
		this.startY = t.pageY;
	},
	touchmove : function(e) {
		var t=e.touches[0];
		this.endX = t.pageX;
		this.endY = t.pageY;
	},
	touchend : function(e) {
		var diffX = this.endX - this.startX;
		var diffY = this.endY - this.startY;
		var moved = Math.sqrt(diffX * diffX + diffY * diffY);
		if (moved > 4) {
			var cos = diffX / moved;
			var sin = -diffY / moved;

			var a = Math.acos(cos);

			if (sin < 0) {
				a = 2 * Math.PI - a;
			}
			var blockType = 0;
			if (a < Math.PI / 8 * 2 || a >= Math.PI / 8 * 14) {
				blockType = BlockType.right;
				blockType = BlockTypeMap["right"];
				//					}else if(a<Math.PI/8*3&&a>Math.PI/8*1){
				//						blockType=BlockType.upright;
			} else if (a < Math.PI / 8 * 6 && a >= Math.PI / 8 * 2) {
				blockType = BlockType.up;
				blockType = BlockTypeMap["up"];
				//					}else if(a<Math.PI/8*7&&a>Math.PI/8*5){
				//						blockType=BlockType.upleft;
			} else if (a < Math.PI / 8 * 10 && a >= Math.PI / 8 * 6) {
				blockType = BlockType.left;
				blockType = BlockTypeMap["left"];
				//					}else if(a<Math.PI/8*11&&a>Math.PI/8*9){
				//						blockType=BlockType.downleft;
			} else if (a < Math.PI / 8 * 14 && a >= Math.PI / 8 * 10) {
				blockType = BlockType.down;
				blockType = BlockTypeMap["down"];
				//					}else if(a<Math.PI/8*15&&a>Math.PI/8*13){
				//						blockType=BlockType.downright;
			}
			var firstBlock = app.blockList[app.firstBlockIndex];
			if (blockType === firstBlock.blockType) {
				console.log("blockType:" + blockType);
				firstBlock.recycle();
				app.updateFistBlockIndex();
			} else {
				app.gameOver();
			}
		}
	},
	/**
	 * 绑定手势事件
	 */
	bindGesture : function() {
//		main.canvas.addEventListener("down", this.touchstart, false);
//		main.canvas.addEventListener("move", this.touchmove, false);
//		main.canvas.addEventListener("up", this.touchend, false);
		TouchFix.bind(main.canvas,"touchstart",this.touchstart);
		TouchFix.bind(main.canvas,"touchmove",this.touchmove);
		TouchFix.bind(main.canvas,"touchend",this.touchend);
	},
	create : function() {

		main.canvas.width = main.win_width;
		main.canvas.height = main.win_height;

		for (var i = 0; i < this._blockSize; i++) {

			var b = Block.create(0, 0, this.getRandBlockType(), 0, this.speedY, 100, 100);
			b.marginX = 5;
			b.marginY = 5;
			b.x = app.getRandX(b);
			b.bgColor = app.getRandColor();
			b.y = -(i + 1) * (b.height + 2 * b.marginY);

			this.blockList.push(b);
		}
		this.firstBlockIndex = 0;
		this.lastBlock = this.blockList[this.blockList.length - 1];

		this.bindGesture();

		this.scoreLabel = Label.create(20, 20, this.getSpeedYStr());

		this.dialog_gameOver_str = $("#dialog-gameOver").remove().html();
	},
	speedIncrement : 1 / 500000,
	update : function() {
		this.speedY += this.speedIncrement * main.interval;
		this.scoreLabel.setText(this.getSpeedYStr());
	},
	/**
	 * 产生0,1,2,...,n-1
	 */
	getRand : function(n) {
		return Math.floor((n * Math.random()));
	},
	dialogTime : 5000,
	showTime : 3000,
	showBlockTypeMap : function(gameMode) {
		var dialog_showBlockTypeMap_str = $("#dialog-showBlockTypeMap").remove().html();
		var imgMap = {};
		function showDialog(afterShow, time) {
			new Dialog(dialog_showBlockTypeMap_str, {
				title : "查看对应关系",
				beforeShow : function() {
					var parent = $(".dialog-showBlockTypeMap");
					imgMap["forup"] = parent.find(".forup");
					imgMap["fordown"] = parent.find(".fordown");
					imgMap["forleft"] = parent.find(".forleft");
					imgMap["forright"] = parent.find(".forright");
					$(".dialog .close").css("display", "none");
					return true;
				},
				afterShow : afterShow,
				time : time,
				afterClose : function() {
					main.run(app);
				}
			}).show();
		}

		BlockTypeMap["up"] = BlockType.up;
		BlockTypeMap["down"] = BlockType.down;
		BlockTypeMap["left"] = BlockType.left;
		BlockTypeMap["right"] = BlockType.right;
		switch (gameMode) {
			case 0:
				//普通版,不用设置
				main.run(app);
				break;
			case 1:
				//有点难
				showDialog(function() {
					imgMap["forup"].attr("src", "img/iconfont-down.png");
					imgMap["fordown"].attr("src", "img/iconfont-up.png");
					imgMap["forleft"].attr("src", "img/iconfont-right.png");
					imgMap["forright"].attr("src", "img/iconfont-left.png");
					BlockTypeMap["up"] = BlockType.down;
					BlockTypeMap["down"] = BlockType.up;
					BlockTypeMap["left"] = BlockType.right;
					BlockTypeMap["right"] = BlockType.left;
				}, this.showTime);
				break;
			case 2:
				showDialog(function() {
					var start = new Date().getTime();
					var t = setInterval(function() {
						var rand = app.getRand(2);
						if (rand === 0) {
							imgMap["forup"].attr("src", "img/iconfont-down.png");
							imgMap["fordown"].attr("src", "img/iconfont-up.png");
							imgMap["forleft"].attr("src", "img/iconfont-left.png");
							imgMap["forright"].attr("src", "img/iconfont-right.png");
						} else {
							imgMap["forup"].attr("src", "img/iconfont-up.png");
							imgMap["fordown"].attr("src", "img/iconfont-down.png");
							imgMap["forleft"].attr("src", "img/iconfont-right.png");
							imgMap["forright"].attr("src", "img/iconfont-left.png");
						}
						var now = new Date().getTime();
						if (now - start >= app.dialogTime - app.showTime) {
							clearInterval(t);
							if (rand === 0) {
								BlockTypeMap["up"] = BlockType.down;
								BlockTypeMap["down"] = BlockType.up;
							} else {
								BlockTypeMap["left"] = BlockType.right;
								BlockTypeMap["right"] = BlockType.left;
							}
						}
					}, 60);
				}, app.dialogTime);

				break;
			case 3:
				showDialog(function() {
					var start = new Date().getTime();
					var t = setInterval(function() {
						var rand4 = app.getRand(4);
						var rand3 = app.getRand(3);
						var rand2 = app.getRand(2);
						var typeArr = ["down", "up", "right", "left"];

						var type = typeArr[rand4];
						imgMap["forup"].attr("src", "img/iconfont-" + type + ".png");
						var typeArr = removeArrIndex(typeArr, rand4);
						BlockTypeMap["up"] = BlockType[type];

						type = typeArr[rand3];
						imgMap["fordown"].attr("src", "img/iconfont-" + type + ".png");
						typeArr = removeArrIndex(typeArr, rand3);
						BlockTypeMap["down"] = BlockType[type];

						type = typeArr[rand2];
						imgMap["forleft"].attr("src", "img/iconfont-" + type + ".png");
						typeArr = removeArrIndex(typeArr, rand2);
						BlockTypeMap["left"] = BlockType[type];

						type = typeArr[0];
						imgMap["forright"].attr("src", "img/iconfont-" + type + ".png");
						BlockTypeMap["right"] = BlockType[type];

						var now = new Date().getTime();
						if (now - start > app.dialogTime - app.showTime) {
							clearInterval(t);
						}
					}, 60);
				}, app.dialogTime);
				break;
			default:
				break;
		}
	},
	dialog_gameOver_str : "",
	dialog_gameOver : null,
	gameOver : function() {
		if (main.isRunning) {
			main.pause();
			setTimeout(function() {
				/*
				 * 在调用pause之后还可能会更新一次，所以为避免冲突，在完全停止之后再减去多增加的那次
				 */
				app.speedY -= app.speedIncrement * main.interval;

				var scoreKey = app.gameMode;
				app.score[scoreKey] = app.speedY;

				var lastScoreStr = localStorage["score"];
				var lastScore = eval("(" + lastScoreStr + ")") || {};

				for (var i in app.score) {
					if (!lastScore[i] || app.score[i] > lastScore[i]) {
						lastScore[i] = app.score[i];
					}
				}
				localStorage["score"] = JSON.stringify(lastScore);

				var content = "<center>游戏结束</center><div>本次成绩:" + app.getSpeedYStr() + "</div>";
				if (lastScore[scoreKey]) {
					content += "<div>最高成绩:" + app.getSpeedStr(lastScore[scoreKey]) + "</div>";
				}
				content = app.dialog_gameOver_str.replace("%s", content);
				app.dialog_gameOver = new Dialog(content, {
					title : "提示"
				});
				app.dialog_gameOver.show();
			}, main.interval);
		}
	},
	gameStart : function() {
		$("#startpage").css("display", "none");
		this.showBlockTypeMap(this.gameMode);
	},
	gameRestart : function() {
		for (var i = 0; i < main.spiritList.length; i++) {
			var sp = main.spiritList[i];
			if (sp.recycle && sp.y >= -(sp.height + 2 * sp.marginY)) {
				sp.recycle();
				app.updateFistBlockIndex();
			}
		}
		app.speedY = this.defaultSpeedY;
		this.dialog_gameOver.close();
		main.start();
	}
};

