const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = 958;
const height = canvas.height = 715;

ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 5;
ctx.shadowColor = 'rgba(0,0,0,0.5)';

var img_dartBoard = new Image();
img_dartBoard.src = 'dartBoard.png';
// var img_crossHairs = new Image();
// img_crossHairs.src = 'crossHairs.png';
img_dartBoard.onload = function() {
	ctx.drawImage(img_dartBoard,0,0);
}
// img_crossHairs.onload = function() {
// 	ctx.drawImage(img_crossHairs,0,0);
// }
canvas.addEventListener('mousemove',(event) =>{
	// console.log(event.offsetX + "-"+event.offsetY);

});



//计算分数
var BaseNum = function(x,y){
	/* 计算分数 */
	/* 计算以靶心为中点的象限 */
	let pointX = pointY = 350;   //圆心点坐标
	let tempX = x - pointX;
	let tempY = y - pointY;

	let score = new Number();
	let sector = new Number(); //储存点所在的象限
	let section = new Number(); //储存点所在的扇区

	let sectionLimit = [0.16,0.51,1.00,1.96,6.31]  //扇区的界限
	let scoreEachSection =[[6,13,4,18,1,20],[11,14,9,12,5,20],[11,8,16,7,19,3],[6,10,15,2,17,3]];

	//计算所在象限
	if (!tempX) {
		if (tempY <=0) score = 20;   //考虑分母为零情况
		else score = 3;
	}else if(!tempY){
		if (tempX <= 0) score = 11;  //考虑分子为零情况
		else score = 6;
	}else if(tempX > 0 && tempY < 0) sector = 0;  //面向数组下标
	else if(tempX < 0 && tempY < 0) sector = 1;
	else if(tempX < 0 && tempY > 0) sector = 2;
	else if(tempX > 0 && tempY > 0) sector = 3;

	//计算所在扇区
	if(tempX && tempY){
		let slope = Math.abs(tempY) / Math.abs(tempX);
		if (slope <= sectionLimit[0]) section = 0 ;
		else if (slope <= sectionLimit[1]) section = 1;
		else if (slope <= sectionLimit[2]) section = 2;
		else if (slope <= sectionLimit[3]) section = 3;
		else if (slope <= sectionLimit[4]) section = 4;
		else section =5;
		score = scoreEachSection[sector][section];
	}
	return score;

}

var multiple = function(x,y) {
	let pointX = pointY = 350;   //圆心点坐标

	/* 计算倍率 */
	let times = new Number();   //倍率
	let radius = Math.sqrt(Math.pow((x-pointX),2)+Math.pow((y-pointY),2));
	radius = Math.round(radius);
	if (radius <= 10) times= 4;         //4 代表红心
	else if(radius <= 25) times = 5;    //5 代表绿心
	else if(radius <= 150) times = 1;
	else if(radius <= 174) times = 3;
	else if(radius <= 248) times = 1;
	else if(radius <= 270) times = 2;
	else times = 0;    //靶外

	return times;
}

var caculate = function(x,y){
	let score = new Number();
	let times = multiple(x,y);
	if (!times) score = 0;
	else if (times === 4) score = 50;
	else if (times === 5) score = 25;
	else score = times * BaseNum(x,y);

	return score;

}

canvas.addEventListener('click',(event) =>{
	let score = caculate(event.offsetX,event.offsetY);
	console.log("当前区域分值："+score);
	alert("当前区域分值："+score);
});