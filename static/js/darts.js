const backgroundCanvas = document.querySelector('#background');
const bgCtx = backgroundCanvas.getContext('2d');
const crosshairCanvas = document.querySelector('#crosshair');
const ctx = crosshairCanvas.getContext('2d');
backgroundCanvas.width = 1258;
const width = crosshairCanvas.width = 715;
const height = backgroundCanvas.height = crosshairCanvas.height = 715;

ctx.shadowOffsetX = bgCtx.shadowOffsetX =10;
ctx.shadowOffsetY = bgCtx.shadowOffsetY = 10;
ctx.shadowBlur = bgCtx.shadowBlur =5;
ctx.shadowColor = bgCtx.shadowColor = 'rgba(0,0,0,0.5)';

var img_dartBoard = new Image();
img_dartBoard.src = 'static/img/dartBoard.png';
var img_crossHairs = new Image();
img_crossHairs.src = 'static/img/准心1.png';
img_dartBoard.onload = function() {
	bgCtx.drawImage(img_dartBoard,0,0);
}

//绘制控制参数
let jumpValue = 3;
let count = 2;
let click = false;
let mouseX,mouseY,x,y = 0;
let score = 0;

let draw = function(){
	ctx.save();
	ctx.clearRect(0,0,958,715);
	if (click) return;
	// let x = Math.random()*913;
	// let y = Math.random()*670;
	x = x+(0.5-Math.random())*20;
	y = y+(0.5-Math.random())*20;
	ctx.translate(x,y);
	ctx.rotate(Math.random()*0.5);
	// if(x!==Ox) ctx.drawImage(image1,-45,-45);
	ctx.drawImage(img_crossHairs,-45,-45);
	// Ox=x,Oy=y;

	ctx.restore();
	// requestAnimationFrame(setTimeout(draw,1000));
	

	var i = setTimeout(draw,10);

}

crosshairCanvas.addEventListener('mousemove',(event) =>{
	x = event.offsetX + (0.5-Math.random())*20 ;
	y =event.offsetY + (0.5-Math.random())*20 ;
	// mouseX = event.offsetX;
	// mouseY = event.offsetY;
});
document.body.addEventListener('keydown',(event) =>{
	// alert(event.key);
	if(event.key === 'w') y += -10;
	if(event.key === 's') y += 10;
	if(event.key === 'a') x += -10;
	if(event.key === 'd') x += 10;
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

crosshairCanvas.addEventListener('click',(event) =>{
	//--------测试-------
	// ctx.save();
	// ctx.translate(event.offsetX,event.offsetY);
	// ctx.rotate(100);
	// ctx.drawImage(img_crossHairs,-45,-50);
	// ctx.restore();
	let scoreThis = caculate(x,y);
	score += scoreThis
	console.log("当前区域分值："+scoreThis+"\n当前得分："+score);
	alert("当前区域分值："+scoreThis+"\n当前得分："+score);
});

draw();