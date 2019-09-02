// canvas基础样式
let itemWidth = 80; //每一项的宽
let itemHeight = 40; //每一项的高
let rowWidth = 30; //行间距
let coleWidth = 40; //列间距
let color = "green"; //颜色

//绘制开始结束
function drawStartEnd(context, item) {
  let x = (item.cole - 1) * (itemWidth + coleWidth);
  let y = (item.row - 1) * (itemHeight + rowWidth);
  context.beginPath();
  context.arc(x, y + itemHeight / 2, itemHeight / 2, 0, 2 * Math.PI, true);
  context.fillStyle = color;
  context.fill();
  context.closePath();
  context.beginPath();
  context.arc(
    x + itemWidth,
    y + itemHeight / 2,
    itemHeight / 2,
    0,
    2 * Math.PI,
    true
  );
  context.fillStyle = color;
  context.fill();
  context.closePath();
  context.strokeStyle = color;
  context.stroke();
  drawStep(context, item);
}

//绘制文字
function drawText(context, item, width) {
  let x = (item.cole - 1) * (itemWidth + coleWidth);
  let y = (item.row - 1) * (itemHeight + rowWidth);
  context.textAlign = "center";
  context.font = "normal 10px 微软雅黑 ";
  context.fillStyle = "#fff";
  context.lineWidth = 1;
  var str = item.text;
  var lineWidth = 0;
  var canvasWidth = width; //计算canvas的宽度
  var initHeight = y + itemHeight / 2 + 6; //绘制字体距离canvas顶部初始的高度
  var lastSubStrIndex = 0; //每次开始截取的字符串的索引
  lineWidth += context.measureText(str).width;
  if (lineWidth > canvasWidth) {
    initHeight = y + 6;
  }
  for (let i = 0; i < str.length; i++) {
    lineWidth += context.measureText(str[i]).width;
    if (lineWidth > canvasWidth) {
      context.fillText(
        str.substring(lastSubStrIndex, i),
        x + itemWidth / 2,
        initHeight
      ); //绘制截取部分
      initHeight += 10; //20为字体的高度
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i == str.length - 1) {
      //绘制剩余部分
      context.fillText(
        str.substring(lastSubStrIndex, i + 1),
        x + itemWidth / 2,
        initHeight
      );
    }
  }
}
//绘制矩形
function drawStep(context, item) {
  let x = (item.cole - 1) * (itemWidth + coleWidth);
  let y = (item.row - 1) * (itemHeight + rowWidth);
  context.strokeStyle = color;
  context.strokeRect(x, y, itemWidth, itemHeight);
  context.fillStyle = color;
  context.fillRect(x, y, itemWidth, itemHeight);
  drawText(context, item, 46);
}
//画菱形
function drawRhombus(context, item) {
  let x = (item.cole - 1) * (itemWidth + coleWidth);
  let y = (item.row - 1) * (itemHeight + rowWidth);
  context.beginPath();
  context.moveTo(x, y + itemHeight / 2);
  context.lineTo(x + itemWidth / 2, y);
  context.lineTo(x + itemWidth, y + itemHeight / 2);
  context.lineTo(x + itemWidth / 2, y + itemHeight);
  context.closePath();
  context.strokeStyle = color; //边框颜色
  context.fillStyle = color; //背景颜色
  context.fill();
  drawText(context, item, 20);
  context.stroke();
}
//画三角形
function drawTriangle(context, x, y, direction) {
  context.beginPath();
  if (direction == "top") {
    x1 = x - 5;
    y1 = y;
    x2 = x + 5;
    y2 = y;
    x3 = x;
    y3 = y - 5;
  }
  if (direction == "bottom") {
    x1 = x - 5;
    y1 = y;
    x2 = x + 5;
    y2 = y;
    x3 = x;
    y3 = y + 5;
  }
  if (direction == "left") {
    x1 = x;
    y1 = y - 5;
    x2 = x;
    y2 = y + 5;
    x3 = x - 5;
    y3 = y;
  }
  if (direction == "right") {
    x1 = x;
    y1 = y - 5;
    x2 = x;
    y2 = y + 5;
    x3 = x + 5;
    y3 = y;
  }
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context["fillStyle"] = color;
  context.closePath();
  context["fill"]();
}
//画线条
function drawLine(context, startLocation, endLocationx) {
  let { x1, y1 } = startLocation;
  let { x2, y2 } = endLocationx;
  console.log(startLocation,endLocationx)
  context.beginPath();
  //设置笔触的颜色
  context.strokeStyle = color;
  //设置开始坐标
  context.moveTo(x1, y1);
  //设置结束坐标
  context.lineTo(x2, y2);
  //绘制线条
  context.stroke();
}
