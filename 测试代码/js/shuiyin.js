function watermark(settings) {
  //默认设置
  var defaultSettings = {
    watermarl_element: "body",
    watermark_txt: "",
    watermark_x: 20, //水印起始位置x轴坐标
    watermark_y: 20, //水印起始位置Y轴坐标
    watermark_rows: 2000, //水印行数
    watermark_cols: 2000, //水印列数
    watermark_x_space: 70, //水印x轴间隔
    watermark_y_space: 30, //水印y轴间隔
    watermark_color: "#aaa", //水印字体颜色
    watermark_alpha: 0.4, //水印透明度
    watermark_fontsize: "12px", //水印字体大小
    watermark_font: "微软雅黑", //水印字体
    watermark_width: 240, //水印宽度
    watermark_height: 80, //水印长度
    watermark_angle: 24, //水印倾斜度数
    domWidth: 0, //元素宽度
    domHeight: 0 //元素高度
  };
  //采用配置项替换默认值，作用类似jquery.extend
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
        continue;
      else if (src[key]) defaultSettings[key] = src[key];
    }
  }

  var oTemp = document.createDocumentFragment();

  var maskElement =
    document.getElementById(defaultSettings.watermarl_element) || document.body;

  //获取页面最大宽度
  var page_width = Math.max(maskElement.scrollWidth, maskElement.clientWidth);

  //获取页面最大高度
  var page_height = Math.max(
    maskElement.scrollHeight,
    maskElement.clientHeight
  );
  if (defaultSettings.domWidth) page_width = defaultSettings.domWidth;
  if (defaultSettings.domHeight) page_height = defaultSettings.domHeight;
  //水印数量自适应元素区域尺寸
  defaultSettings.watermark_cols = parseInt(
    page_width /
      (defaultSettings.watermark_x_space + defaultSettings.watermark_width)
  );

  defaultSettings.watermark_rows = parseInt(
    page_height /
      (defaultSettings.watermark_y_space + defaultSettings.watermark_height)
  );

  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y =
      defaultSettings.watermark_y +
      (defaultSettings.watermark_y_space + defaultSettings.watermark_height) *
        i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x =
        defaultSettings.watermark_x +
        (defaultSettings.watermark_width + defaultSettings.watermark_x_space) *
          j;
      var mask_div = document.createElement("div");
      mask_div.id = "mask_div" + i + j;
      mask_div.className = "mask_div";
      mask_div.innerHTML = defaultSettings.watermark_txt;
      //设置水印div倾斜显示
      mask_div.style.webkitTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.MozTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.msTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.OTransform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.transform =
        "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.position = "absolute";
      mask_div.style.left = x + "px";
      mask_div.style.top = y + "px";
      mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "9999";
      mask_div.style.pointerEvents = "none"; //pointer-events:none  让水印不遮挡页面的点击事件 //兼容IE9以下的透明度设置
      //mask_div.style.border="solid #eee 1px";
      mask_div.style.filter = "alpha(opacity=50)";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = "center";
      mask_div.style.width = defaultSettings.watermark_width + "px";
      mask_div.style.height = defaultSettings.watermark_height + "px";
      mask_div.style.display = "block";
      oTemp.appendChild(mask_div);
    }
  }
  maskElement.appendChild(oTemp);
}

function getNow() {
  var d = new Date();
  var year = d.getFullYear();
  var month = change(d.getMonth() + 1);
  var day = change(d.getDate());
  var hour = change(d.getHours());
  var minute = change(d.getMinutes());
  var second = change(d.getSeconds());

  function change(t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  }
  var time =
    year +
    "年" +
    month +
    "月" +
    day +
    "日 " +
    hour +
    "时" +
    minute +
    "分" +
    second +
    "秒";
  return time;
}
