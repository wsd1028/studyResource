//document.writeln("<style type=\"text/css\">");
//document.writeln("#ie6-warning{position:absolute; top:0; left:0; width:100%; padding: 5px 0; text-align:center; font-size:12px; color:#333; background:rgb(255,255,225); z-index:9999;}");
//document.writeln("</style>");
document.writeln("<div id=\"ie6-warning\">您正在使用 Internet Explorer 6，该浏览器在本页面的显示效果可能有差异。建议您升级到 <a href=\"http:\/\/www.microsoft.com\/china\/windows\/internet-explorer\/\" target=\"_blank\">Internet Explorer<\/a>最新 或以下浏览器： <a href=\"http:\/\/www.mozillaonline.com\/\">Firefox<\/a> \/ <a href=\"http:\/\/www.google.com\/chrome\/?hl=zh-CN\">Chrome<\/a> \/ <a href=\"http:\/\/www.apple.com.cn\/safari\/\">Safari<\/a> \/ <a href=\"http:\/\/www.operachina.com\/\">Opera<\/a>");
document.writeln("<\/div>");
	function position_fixed(el, eltop, elleft){  
		// check if this is IE6  
		if(!window.XMLHttpRequest)  
		window.onscroll = function(){  
			el.style.top = (document.documentElement.scrollTop + eltop)+"px";  
			el.style.left = (document.documentElement.scrollLeft + elleft)+"px";  
		}  
		 else el.style.position = "fixed";  
	}
	position_fixed(document.getElementById("ie6-warning"),0, 0);