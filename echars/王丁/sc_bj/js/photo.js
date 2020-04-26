/*
 * Author:wdder™
 * Mail:wdder@163.com
 * Blog:http://story.wdder.com©
 * QQ:601168065/wdder@163.com
 * Creat Date:2016-07-28®
 * jQuery wdderSlide v2.1.1
 * http://www.SuperSlide2.com
 */

//全局变量
var url_path = location.href;
var slide_t = 4000;
jQuery.extend({
	photo_slide:function(obj){
		var obj = $("#" + obj);
		var photo = obj.find(".photo");
		var info = obj.find(".info-list");
		var prev = photo.find(".prev");
		var next = photo.find(".next");
		var scrl_prev = obj.find(".scrl-prev");
		var scrl_next = obj.find(".scrl-next");
		var list_thumb = obj.find(".list-thumb");
		var n = list_thumb.find("a").length;
		var li_width = list_thumb.find("li").outerWidth(true);
		var i = 0;
		var r = 0;
		var present = obj.find(".present");
		var total = obj.find(".total");
		list_thumb.css("width",li_width*n);
		present.html(i + 1);
		total.html(n);
		next.click(function(){
			i++;
			if(i == n){i = 0;}
			player(i);
			if(i > 2 && i < n - 2){
				list_thumb.animate({marginLeft: -li_width * (i - 2)},800);
			}
			if(i == 0){
				list_thumb.animate({marginLeft: 0},800);
			}
			present.html(i + 1);
		});
		prev.click(function(){
			i--;
			if(i > 1 && i < n - 3){
				list_thumb.animate({marginLeft: -li_width * (i - 2)},800);
			}
			if(i < 0){
				list_thumb.animate({marginLeft: -li_width * (n - 5)},800);
			}
			if(i < 0){i = n - 1;}
			player(i);	
			present.html(i + 1);
		});
		scrl_prev.click(function(){
			r--;
			if(r <= 0){r = 0}
				list_thumb.animate({marginLeft: -(li_width * 5) * r},800);
		});
		scrl_next.click(function(){
			r++;
			if(r < Math.ceil(n/5)){
				list_thumb.animate({marginLeft: -(li_width * 5) * r},800);
			}
			if(r >= Math.ceil(n/5)){r = Math.ceil(n/5) - 1;}
		});
		list_thumb.find("li").each(function(s){
			$(this).click(function(){
				i = s;
				player(i);
				present.html(i + 1);
			});
		});		
		function player(i){
			thumb_src = list_thumb.find("a").eq(i).attr("href");
			n_src = thumb_src.replace("#","");
			photo.find("img").attr("src",n_src);
			//photo.find("a.link").attr("href",n_src);
			list_thumb.find("li").eq(i).addClass("current")
			.siblings("li").removeClass("current");
			info.find("li").eq(i).show()
			.siblings("li").hide();
		}
	}
});
