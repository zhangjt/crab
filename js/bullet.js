
//子弹类
function Bullet(){
	//子弹对象，速度，威力，方向，起点坐标，定时器
	this.bullet = null;
	this.speed = 30;
	this.outside = false;
	this.power = 1;        //威力:子弹敌机相撞时,敌机受到的伤害点数
	this.direction = null;
	this.startPos = {x:0,y:0};
	this.timer = null;
	this.domClass = "";
}
//子弹销毁
Bullet.prototype.die = function(){

	document.getElementById("container").removeChild(this.bullet);
	this.outside = true;	
};
//子弹发射(创建/添加子弹节点<i>)
Bullet.prototype.fire = function(){
	
	this.bullet = document.createElement("i");
	this.bullet.className = this.domClass;
	this.bullet.style.left = this.startPos.x + "px";
	this.bullet.style.top = this.startPos.y + "px";
	document.getElementById("container").appendChild(this.bullet);
	// this.bullet.style.top = this.bullet.offsetTop - this.speed + "px";		
};
