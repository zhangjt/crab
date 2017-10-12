var game = {
	myPlane:null,
	allPlane:[],                     //所有敌机
	allBullet:[],					 //所有子弹对象(节点)												
	planeSpeed:[4,3,2,1],            //敌机速度
	planeDensity:[20,200,600,1000],  //敌机密度
	interval:1000/10,                //生产频率
	scores:0,
	gameTime:0,
	num:0,
	stageBgY:0,
	gameSet:null,
	stage:null,
	killBossCount:0
};
//初始化我机
game.initMyPlane = function(){
	this.myPlane = new myPlane();
	this.myPlane.class = "myPlane";
	this.myPlane.position = {x:"45%",y:'50%'};
	this.myPlane.show();	  //显示我机
	this.myPlane.move();      //开启鼠标移动
};
//运行游戏，一切运动皆依赖此函数
game.run = function(){
	
	this.num++;
	this.stage = document.getElementById("container");
	
	//控制开火节奏
	if(this.num%3==0){
		//我机开火,push子弹(创建/添加子弹节点)		
		this.myPlane.fire();
		this.allBullet.push(this.myPlane.bullets);
	}
	//获取、遍历所有子弹对象
	var allBulletLen = this.allBullet.length;
	for(var i=0;i<allBulletLen;i++){
		//判断子弹销毁或飞出界面
		if( this.allBullet[i].bullet.offsetTop<0){
			this.allBullet[i].die();			
		}		
		if(this.allBullet[i].outside){
			//spllice(a,b):添加/删除数组元素.a:从何处添加/删除元素,是下标值;b:删除元素个数;当b=0时,删除元素个数0个,即不删除,是添加操作
			this.allBullet.splice(i,1);   //删除当前位置的当前元素 ,会返回当前删除的所有元素; 
			i--;
			allBulletLen--;
		}
	}	
	//创建敌机,(通过时间间隔)控制不同敌机出现的频率
	if(this.num%this.planeDensity[0] == 0){	
		var npc = new npcPlane();
		npc.class = "npc1";
		npc.armor = npc.score = 1;
		npc.speed = this.planeSpeed[0];
		npc.show();    //创建敌机(节点)
		npc.appear();   //设置敌机出现位置(横向随机位置)
		this.allPlane.push(npc);
	}
	if(this.num%this.planeDensity[1] == 0){
		var npc = new npcPlane();
		npc.class = "npc2";	
		npc.armor = npc.score = 5;
		npc.speed = this.planeSpeed[1];	
		npc.show();
		npc.appear();		
		this.allPlane.push(npc);
	}
	if(this.num%this.planeDensity[2] == 0){
		var npc = new npcPlane();
		npc.class = "npc3";		
		npc.armor = npc.score = 10;
		npc.speed = this.planeSpeed[2];	
		npc.show();
		npc.appear();
		this.allPlane.push(npc);		
	}
	if(this.num%this.planeDensity[3] == 0){
		var npc = new npcPlane();
		npc.class = "npc4";		
		npc.armor = npc.score = 20;
		npc.speed = this.planeSpeed[3];	
		npc.show();
		npc.appear();
		this.allPlane.push(npc);
		this.num = 0;		
	}	

	//获取、遍历所有敌机对象
	var len = this.allPlane.length;
	for(var i=0;i<len;i++){
		//判断敌机飞出界面
		if( this.allPlane[i].plane.offsetTop>this.stage.offsetHeight){
			this.allPlane[i].die();
		}	
		//我机敌机碰撞
		if(getCollision(this.myPlane.plane,this.allPlane[i].plane)){
			this.over();
		}
		//从数组清理出界或销毁的敌机	
		if(this.allPlane[i].outside){
			this.allPlane.splice(i,1);
			i--;
			len--;
		}
	}
	//敌机移动
	for(var i=0;i<this.allPlane.length;i++){
		this.allPlane[i].plane.style.top = this.allPlane[i].plane.offsetTop + this.allPlane[i].speed + "px";
	}
	//敌机与子弹碰撞
	for(var j=0;j<this.allBullet.length;j++){
		//子弹移动
		this.allBullet[j].bullet.style.top = this.allBullet[j].bullet.offsetTop - this.allBullet[j].speed + "px";
		//命中
		for(var i=0;i<this.allPlane.length;i++){
			//子弹敌机相撞
			if(getCollision(this.allBullet[j].bullet,this.allPlane[i].plane)){
				//子弹销毁
				this.allBullet[j].die();
				//敌机护甲减少
				this.allPlane[i].armor-=this.allBullet[j].power;
				if(this.allPlane[i].armor<=0){
					//游戏得分
					this.scores += this.allPlane[i].score;
					//击杀boss获得奖励
					if(this.allPlane[i].class == "npc4"){
						//第一次击杀
						if(this.myPlane.lv == 1){
							this.myPlane.lv++;
						}
						this.killBossCount++;
						//击杀n次boss得到最终武器
						if(this.killBossCount == 9){
							this.myPlane.lv++;   //有待完善哈
						}
					}					
					//敌机爆炸销毁
					this.allPlane[i].bang();						
				}				
				
			}
		}
	}		
	//记分板
	document.getElementById("score").innerHTML = "得分：" + this.scores*100;
	//背景运动(背景样式background:url() repeat-y)
	this.stageBgY++;
	this.stage.style.backgroundPositionY = this.stageBgY + "px";
	//游戏进度
	if(this.scores>20 && this.scores<40){
		this.planeSpeed = [5,4,3,2];              //敌机飞下来的速度
		this.planeDensity = [15,200,600,1000];    //敌机生产的频率
	}
	if(this.scores>40 && this.scores<80){
		this.planeSpeed = [6,5,4,3];
		this.planeDensity = [15,100,400,2000];
	}
	if(this.scores>80 && this.scores<100){
		this.planeSpeed = [7,6,5,4];
		this.planeDensity = [10,200,500,1500];
	}
	if(this.scores>150){
		this.planeSpeed = [10,8,6,5];
		this.planeDensity = [10,150,300,1000];
	}
	if(this.scores>300){
		this.planeSpeed = [12,10,8,4];
		this.planeDensity = [8,100,200,800];
	}	
};
//游戏开始，初始化我机，场景运动开始
game.begin = function(){
	var _this=this;
	if(!this.myPlane){
		this.initMyPlane();
	}else{
		this.myPlane.move();
	}
	this.gameSet = window.setInterval(function(){
		_this.run();
	},this.interval);	
};
//游戏暂停
game.pause = function(){
	
	this.myPlane.stop();   //停止跟随鼠标移动
	window.clearInterval(this.gameSet);   //停止一切运动
};
//游戏结束
game.over = function(){
	var _this=this;
	this.myPlane.stop();
	this.myPlane.bang();
	window.clearInterval(this.gameSet);   
	//得分统计
	window.setTimeout(function(){
		window.clearInterval(this.gameSet);
		var info = document.getElementById("info"),
			endScroe = document.getElementById("endScroe");
		info.style.display = "block";
		endScroe.innerHTML = _this.scores*100;
	},1500);
};
//文件载入
onload = function(){
	var begin_btn = document.getElementById("begin_btn"),
		goon_btn = document.getElementById("goon_btn"),
		rest_btn = document.getElementById("rest_btn"),
		stage = document.getElementById("container");
	begin_btn.onclick = function(e){
		var E = e||event;
		begin.style.display = "none";
		game.begin();
		E.stopPropagation();   //取消事件冒泡
		E.cancelBubble = true;  //取消事件冒泡Ie
	};

	stage.onclick = function(e){
		var E = e||event;
		goon_btn.parentNode.style.display = "block";
		game.pause();
		E.stopPropagation();
		E.cancelBubble = true;			
	};
	goon_btn.onclick = function(e){
		var E = e||event;	
		game.begin();
		goon_btn.parentNode.style.display = "none";
		E.stopPropagation();
		E.cancelBubble = true;		
	};
	rest_btn.onclick = function(){
		window.location.reload();
	};
	
	
};

	//碰撞检测
	function getCollision(obj1,obj2){
		// obj1:我机;obj2:敌机
		var l1 = obj1.offsetLeft;
		var r1 = obj1.offsetLeft + obj1.offsetWidth;
		var t1 = obj1.offsetTop;
		var b1 = obj1.offsetTop+ obj1.offsetHeight;
		var l2 = obj2.offsetLeft;
		var r2 = obj2.offsetLeft + obj2.offsetWidth;
		var t2 = obj2.offsetTop;
		var b2 = obj2.offsetTop+ obj2.offsetHeight;				
		if(r1<l2 || l1>r2 || t1>b2 || b1<t2){
			return false;
		}else{
			return true;
		}
	}
