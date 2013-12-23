---
layout: post
title: "黑客雨效果"
description: ""
category: ""
tags: ["other","fun"]
date: 2013-12-23 21:51:16 +0800
---

上次写到了一个显示快速编码的界面，然后就想到了之前黑客帝国里看到的字符雨。

之前有看到过C写的一个版本，还把它编译出来当成了屏保一段时间。然后就在想能不能搞一个网页版的，或者说用JS怎么写。

经过一个晚上的奋斗还是把它给搞了出来。效果如下

<a href="http://zhangsheng.github.io/web/sample/2/test.html" target="_blank">http://zhangsheng.github.io/web/sample/2/test.html</a>

首先是一个随机字符串的函数，每条字符雨都是一个随机的字符串，里面的字符数让char用0～255进行随机的，所以可能会看起来有点奇怪。

		function getRandomStr(){
			var str = "";
			var length = Math.round(Math.random()*50);
			for(i=0;i<length;i++){
				var c = String.fromCharCode(Math.round(Math.random()*256))+"<br>";
				str+=c;				
			}
			str+="<span style='color:#66ccff'>"+String.fromCharCode(Math.round(Math.random()*26)+96)+"</spam>"
			return str;
		}

然后就是定义了一个大小为40的数组，里面用来存放随机的字符串，还有它们下降的速度，也就是说，字符雨最多为40条，是写死了的。

最后就是要有一个不断循环的函数，来表示字符雨的下降。也就是说，字符雨的下降只是不断的刷新界面上的元素的显示，从而造成一种下降的效果。对于下降到底部的元素进行删除操作，同时对于每一列进行判断是否已经有字符雨在往下落，如果没有的话，则随机生成一个。具体代码如下：

		function getRun(){
			for(var k = 0; k<40; k++){
				if(typeof(str[k]) != "undefined"){
					if(str[k].top > window.screen.height){
						str[k].span.innerHTML="";
						$("#span_"+k).remove();
						delete str[k];
					}else{
						str[k].top += str[k].speed;
						str[k].span.css("top", str[k].top+"px");
					}
				}
				else if(Math.random()<0.25){
					str[k] = new Object();
					str[k].content = getRandomStr();
					str[k].speed = Math.random()*20+3;
					$("#hacker").append("<span id=\"span_"+k+"\" ></span>");					
					str[k].span = $("#span_"+k);
					str[k].span.hide();
					str[k].span.html(str[k].content);
					str[k].top = 0-str[k].span.innerHeight();
					str[k].span.css("position","absolute");
					str[k].span.css("left", (k*avg+Math.round(Math.random()*10))+"px");
					str[k].span.css("top", str[k].top+"px");
					str[k].span.show();
				}
			}
		}

然后只要在界面加载好的时候去循环调用这个函数就好了。

		$(document).ready(function(){
			inter = setInterval("getRun()", 50);
		});