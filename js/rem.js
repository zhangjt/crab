// rem自适应设置
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
var recalc = function() {
    //设置根字体大小
    var docEl = document.documentElement;
    docEl.style.fontSize = 20 * (docEl.clientWidth / 320) + 'px';
    //设置舞台高度为设备屏幕高度
    var container = document.getElementById('container');
    container.style.height = window.screen.height + 'px';
}
//加载完页面图片后开始游戏页面
var startApear = function() { 
    var srcs = [
            'img/begin.png',
            'img/background_1.png',
            'img/myPlane.gif',
            'img/bullet1.png'
        ],
        loading = document.getElementById('loading'),
        len = srcs.length,
        num = 0;
    for (var i = 0; i < len; i++) {

        var img = new Image();
        img.onload = function() {
            num++;
            if (num == len) {
                loading.style.display = 'none';
                container.style.display = 'block';
            }
        }
        img.src = srcs[i];
    }
    //禁止(触摸)页面滑动
    document.body.addEventListener('touchmove', function(e) {
        e.stopPropagation();   //手势在页面滑动时禁止事件默认动作和事件传播
        e.preventDefault();
    });
};
//引入加载Jweixin.js(暂时无用,先放着呗)
var addJweixin=function(callback){
	var script=document.createElement('script');
	script.type="text/javascript";
	script.src="js/jweixin-1.2.0.js";
	script.charset = "UTF-8";
	document.getElementsByTagName('head')[0].appendChild(script);
	script.onload=script.onreadystatechange=function(){
		//!readyState为FF下加载完的判断语句,因为在FF下不存在;IE肯定有值,readyState值为loaded或者complete作为IE下加载完的判断语句.
		if (!this.readyState ||this.readyState=='loaded'||this.readyState=='complete') {
			script.onload=script.onreadystatechange=null;//清除方法,释放内存(js回收机制)
			callback&&callback();
		}
	}
}
var first=true;  //第一次执行true,之后不执行;

//微信下自动播放音乐
var autoPlayMusic=function(url){

 	var musicDiv=document.createElement('div'),
 		audio=document.createElement('audio');
 	musicDiv.className=musicDiv.id="music";
 	musicDiv.classList.add('rotate');
 	audio.id=audio.className='audio';
 	audio.loop="loop";
 	// audio.autoplay="autoplay";
 	audio.src="FC_BGM.mp3";
 	if (url) {
 		audio.src=url;
 	}
 	
 	musicDiv.appendChild(audio);
 	audio.load();//ios需要,不然'canplaythrough'事件不触发;直接play也不让播放

 	//监听(canplaythrough)audio加载完成后显示.ps:video|audio用onload无效
 	audio.addEventListener("canplaythrough", function(){
 		// alert("canplaythrough");
 	 	document.body.appendChild(musicDiv);
 	 	if (first) {
 	 		var result=confirmWindow('是否开启音乐⊙▽⊙',0);
 	 		first=false;
 	 	}
 	 	this.volume = 1;
 	 	if (isPlay) {
 	 		this.play();
 	 	}	
 	},false)

 	audio.volume = 0.5;

 	document.addEventListener("WeixinJSBridgeReady", function () {
 		// alert("WeixinJSBridgeReady");
 		
 		if (isPlay) {
 			audio.play();
 		}
 	}, false);
 	//music按钮点击
 	musicDiv.addEventListener('click', function(e) {
	     e.stopPropagation();  
	     if (audio.paused) {
	     	audio.play();  //audio标签自带的方法play()&&pause()
	     	audio.parentNode.classList.add('rotate');
	     }else{
	     	audio.pause();
	     	audio.parentNode.classList.remove('rotate');
	     }

	});

}

document.addEventListener("DOMContentLoaded", function() {
    recalc();
    startApear();
    autoPlayMusic();
}, false)

window.addEventListener(resizeEvt, recalc, false);