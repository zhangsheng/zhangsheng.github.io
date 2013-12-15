---
layout: post
title: "快速编程效果"
description: ""
category: ""
tags: ["hacker", "fun"]
date: 2013-12-15 21:45:58 +0800
---

前几天室友推荐了个很好玩的网站，<a href="http://www.webtwt.com/new/hackertyper/" target="_blank">hackertyper</a>，模拟了一些电影或电视中经常出现的比较厉害的人物快速编程的效果，觉得非常好玩，所以就照着做了一个。

首先是要写的文件，因为不想浪费github的空间，所以就扔给了百度应用的云存储，感觉效果还算是不错，感谢`竹林`的推荐。这里随便找了Linux内核里的一份源代码。

其实整个网页没有太多技术含量的地方，首先定义了一个Typer的对象，然后使用ajax的方法将整个文件读取过来，存到一个变量里。
	 	

	 	$.get(Typer.file, function (data) {// get the text file
            Typer.text = data;// save the textfile in Typer.text
        });

然后就是定义了一个`keydown`函数，对应每次按键操作，然后将刚才读取进来的文件显示出来，另外可以设置一下打字的速度，也就是对应每个按键输出多少字符，样例中采用了6，从而形成快速的效果。

另外觉得比较好玩的一点就是那个闪动的光标，看了一下源代码之后发现是使用了`setInterval`函数，然后一会将`|`符号显示出来，一会将其删掉。

大致内容就是这些，下面给出自己做的一个样例链接

<a href="http://zhangsheng.github.io/web/sample/1/test.html" target="_blank">http://zhangsheng.github.io/web/sample/1/test.html</a>