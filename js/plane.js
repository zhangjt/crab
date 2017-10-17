
//螃蟹类
function Plane(){
	this.plane = null;
	this.life = true;
	this.armor = 1;
	this.position = {x:0,y:0};
	this.class = null; 
	this.direction = "up";
	this.bullets = null;
	this.lv = 1;
	this.isShowTip=0;
	
	
}
//显示螃蟹(创建新螃蟹节点)
Plane.prototype.show = function(){
	this.plane = document.createElement("p");
	this.plane.score = 0;   //与npc.score即this.score不一样
	this.plane.className = this.class;
	if (this.class=="myPlane") {
		this.plane.id=this.class;
	};
	document.getElementById("container").appendChild(this.plane);
};
//螃蟹爆炸
Plane.prototype.bang = function(){
	
	var x = this.plane.offsetLeft,
		y = this.plane.offsetTop,
		w = this.plane.offsetWidth,
		h = this.plane.offsetHeight,
		NO = this.class.match(/\d/g)==null? '':this.class.match(/\d/g).join(''),
		timer = null,
		bangObj = null;	
				
	this.die();
	//创建爆炸动画
	bangObj = document.createElement("span");
	bangObj.style.left = x+"px";
	bangObj.style.top = y+"px";
	bangObj.style.width = w+"px";
	bangObj.style.height = h+"px";
	bangObj.className = "bang"+NO;	
	document.getElementById("container").appendChild(bangObj);	
	//0.3秒后移除爆炸动画
	window.setTimeout(timer);
	timer = window.setTimeout(function(){
		document.getElementById("container").removeChild(bangObj);
	},300);			
};
//螃蟹销毁
Plane.prototype.die = function(){
	
	if(this.plane){
	document.getElementById("container").removeChild(this.plane);
	}
	this.outside = true;		
};
//出现新类型敌机提示语
Plane.prototype.tipShow=function(html){
	var tip=document.createElement('p');
	var no=Math.ceil(Math.random()*1000);
	tip.className="tip flash tip"+no;
	// tip.setAttribute('rel','1');
	tip.innerHTML=html+'';
	document.getElementById("tipMess").appendChild(tip);	
	//0.3秒后移除爆炸动画
	var timer = window.setTimeout(function(){		
			document.getElementById('tipMess').removeChild(tip);
	},1500);
	window.setTimeout(timer);
}
//我机螃蟹
function myPlane(){}
myPlane.prototype = new Plane();
//螃蟹开火--
myPlane.prototype.fire = function(){
	//1.设置初始this.lv的三种子弹的位置
	if(this.lv == 1){
		this.position = {
			x:this.plane.offsetLeft + this.plane.offsetWidth/2 - 4,
			y:this.plane.offsetTop + 40
		};
	}
	if(this.lv == 2){
		this.position = {
			x:this.plane.offsetLeft + this.plane.offsetWidth/2 - 10,
			y:this.plane.offsetTop + 20
		};
	}	
	if(this.lv == 3){
		this.position = {
			x:this.plane.offsetLeft + this.plane.offsetWidth/2 - 25,
			y:this.plane.offsetTop
		};
	}	
	//2.实例化子弹,并赋值属性值
	var b = new Bullet();
	this.bullets = b;
	this.bullets.power = this.lv;
	this.bullets.domClass = "lv" + this.lv;
	    //子弹方向等于螃蟹方向
	this.bullets.direction = this.direction; 
	    //子弹初始坐标等于螃蟹position值
	this.bullets.startPos = this.position;		
	//3.执行通过bullet.fire()方法,创建/添加子弹节点
	this.bullets.fire();	
};
//螃蟹跟随鼠标移动
myPlane.prototype.move = function(state){
	var _this = this;
	_this.stage = document.getElementById("container");
	 //螃蟹跟随鼠标移动
	 
	 //1.移动端上的鼠标移动跟随移动
	_this.plane.addEventListener( 'touchmove',function(event){
		 // event.stopPropagation();  ////不能阻止事件冒泡,不然整个屏幕也会随着螃蟹一起移动
	     //如果这个元素的位置内只有一个手指的话
	     if( event.targetTouches.length == 1 ){
	            var touch = event.targetTouches[ 0 ];
	            //把元素放在手指所在的位置
				_this.position.x = touch.pageX- _this.stage.offsetLeft - _this.plane.offsetWidth/2;
				_this.position.y = touch.pageY- _this.stage.offsetTop - _this.plane.offsetHeight/2;
				_this.plane.style.left = _this.position.x + "px";
				_this.plane.style.top = _this.position.y + "px";	
				//螃蟹移动,离开舞台时的规避处理:上右下左	
				if(_this.plane.offsetLeft>_this.stage.offsetWidth-_this.plane.offsetWidth){
					_this.plane.style.left = _this.stage.offsetWidth-_this.plane.offsetWidth + "px";
				}
				if(_this.plane.offsetLeft<0){
					_this.plane.style.left = 0;
				}
				if(_this.plane.offsetTop<0){
					_this.plane.style.top = 0;
				}
				if(_this.plane.offsetTop>_this.stage.offsetHeight-_this.plane.offsetHeight){
					_this.plane.style.top = _this.stage.offsetHeight-_this.plane.offsetHeight + "px";
				}
	      }
	}, false );

	//2.pc上的鼠标移动跟随移动
	// _this.stage.onmouseover = function(e){
	// 	_this.stage.onmousemove = function(e){
	// 		var E = e||event;
	// 		_this.position.x = E.clientX- _this.stage.offsetLeft - _this.plane.offsetWidth/2;
	// 		_this.position.y = E.clientY- _this.stage.offsetTop - _this.plane.offsetHeight/2;
	// 		_this.plane.style.left = _this.position.x + "px";
	// 		_this.plane.style.top = _this.position.y + "px";	
	// 		//螃蟹移动,离开舞台时的规避处理:上右下左	
	// 		if(_this.plane.offsetLeft>_this.stage.offsetWidth-_this.plane.offsetWidth){
	// 			_this.plane.style.left = _this.stage.offsetWidth-_this.plane.offsetWidth + "px";
	// 		}
	// 		if(_this.plane.offsetLeft<0){
	// 			_this.plane.style.left = 0;
	// 		}
	// 		if(_this.plane.offsetTop<0){
	// 			_this.plane.style.top = 0;
	// 		}
	// 		if(_this.plane.offsetTop>_this.stage.offsetHeight-_this.plane.offsetHeight){
	// 			_this.plane.style.top = _this.stage.offsetHeight-_this.plane.offsetHeight + "px";
	// 		}
	// 	};
	// 	_this.stage.onmouseout = function(){
	// 		_this.stage.onmousemove = null;
	// 	};
	// };

};
//螃蟹停止跟随鼠标移动
myPlane.prototype.stop = function(){
	this.stage.onmouseover = null;
	this.stage.onmousemove = null;
};
//敌机
function npcPlane(){}
npcPlane.prototype = new Plane();
npcPlane.prototype.direction = "down";
npcPlane.prototype.outside = false;

npcPlane.prototype.appear = function(){
	var _this = this;
	//设置敌机以随机横坐标位置出现
	//left值在[0,container.offsetWidth-plane.offsetWidth)的写法
	_this.position.x = Math.random()*(document.getElementById("container").offsetWidth-_this.plane.offsetWidth);
	_this.plane.style.left = _this.position.x + "px";		
	_this.plane.style.top = -_this.plane.offsetHeight + "px";	
};


