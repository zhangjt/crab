// rem自适应设置
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var recalc = function() {
	    //设置根字体大小
	    var docEl = document.documentElement;
	    docEl.style.fontSize = 20 * (docEl.clientWidth / 320) + 'px';
	    //设置舞台高度为设备屏幕高度
	    var container=document.getElementById('container');
	    container.style.height=window.screen.height+'px';
	}
	var startApear=function(){
	    //加载完页面图片后开始游戏页面
	    var srcs=[
	    'img/begin.png',
	    'img/background_1.png',
	    'img/myPlane.gif',
	    'img/bullet1.png'],
	    loading=document.getElementById('loading'),
	    len=srcs.length,
	    num=0;
	    for (var i = 0; i < len; i++) {
	    	
	    	var img= new Image();
	    	img.onload=function(){
	    		num++;
	    		if (num==len) {
	    			loading.style.display='none';
	    			container.style.display='block';
	    		}
	    	}
	    	img.src=srcs[i];
	    }   
	};

	document.addEventListener("DOMContentLoaded",function(){
	    recalc();
	    startApear();
	},false)
	    
	window.addEventListener(resizeEvt, recalc, false);