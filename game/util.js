function removeArrItem (arr,item) {
	var arrTmp=[];
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]!==item){
			arrTmp.push(arr[i]);
		}
	}
	return arrTmp;
}
function removeArrIndex (arr,index) {
	var arrTmp=[];
	for (var i = 0; i < arr.length; i++) {
		if(i!==index){
			arrTmp.push(arr[i]);
		}
	}
	return arrTmp;
}