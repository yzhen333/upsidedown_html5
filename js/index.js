$(window).load(function () {
	//fastclick
	FastClick.attach(document.body);
	document.documentElement.style.webkitTouchCallout = "none";
	main.init();
	
	startpage();
	
	//main.run(app);
});
/**
 * 开始页面的选项列表居中 
 */
function startpage () {
	var $ul=$("#startpage .center");
	$ul.css({
		"position":"absolute",
		"left":(main.win_width-$ul.width())/2+"px",
		"top":(main.win_height-$ul.height())/2+"px",
		"opacity":1
	});
	var start=0,gameMode=1,sound=2,rank=3,help=4;
	var dialog_gameMode_str=$("#dialog-gameMode").remove().html();
	
	$("select#gameMode").on("change",function () {
			app.gameMode=parseInt($(this).val());
	});
	var $lis=$ul.find("li").each(function (i,e) {
			$(this).on("touchstart",function () {
				$(this).css("background","#999");
			}).on("touchend",function () {
				$(this).css("background","#fff");
			}).on("click",function (e) {
				e.preventDefault();
				e.stopPropagation();
				switch (i){
					case start:
						app.gameStart();
						break;
					case gameMode:
						/*new Dialog(dialog_gameMode_str,{
							gameModeSelect:null,
							maxColumnSelect:null,
							
//      					 * 改成从上往下弹出的效果，增长时延，如果开快出现，会导致按钮点击冲突
//      					 * 并且运动过程中点击无效
							beforeShow:function () {
								this.gameModeSelect=$("select[name=gameMode]").val(app.gameMode+"").attr("disabled","disabled");
								this.maxColumnSelect=$("select[name=maxColumn]").val(app.maxColumn+"").attr("disabled","disabled");
								return true;
							},
							afterShow:function () {
								var _this=this;
								setTimeout(function () {
									_this.gameModeSelect.removeAttr("disabled");
									_this.maxColumnSelect.removeAttr("disabled");
								},50);
							},
							beforeClose:function () {
								try{
									app.gameMode=parseInt(this.gameModeSelect.val());
									app.maxColumn=parseInt(this.maxColumnSelect.val());
								}catch(e){
									console.error(e);
								}
								return true;
							}
						}).show();*/
					
						break;
					case sound:
						break;
					case rank:
						break;
					case help:
						break;
					default:
						break;
				}
			});
		});
	
}
