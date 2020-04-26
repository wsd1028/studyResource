function method(tableid,filename) {
  if (getExplorer() == "ie" || getExplorer() == undefined) {
    // HtmlExportToExcelForIE(tableid, filename);
  } else {
    HtmlExportToExcelForEntire(tableid, filename);
  }
}
//IE浏览器导出Excel
function HtmlExportToExcelForIE(tableid, filename) {
  try {
    var curTbl = document.getElementById(tableid);
    var oXL;
    try {
      oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
    } catch (e) {
      alert(
        "无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" +
          "那么请调整IE的安全级别。\n\n具体操作：\n\n" +
          "工具 → Internet选项 → 安全 → 自定义级别 → 对未标记为可安全执行脚本的ActiveX初始化并脚本运行 → 启用"
      );
      return false;
    }
    var oWB = oXL.Workbooks.Add(); //获取workbook对象
    var oSheet = oWB.ActiveSheet; //激活当前sheet
    var sel = document.body.createTextRange();
    sel.moveToElementText(curTbl); //把表格中的内容移到TextRange中
    try {
      sel.select(); //全选TextRange中内容
    } catch (e1) {
      e1.description;
    }
    sel.execCommand("Copy"); //复制TextRange中内容
    oSheet.Paste(); //粘贴到活动的EXCEL中
    oXL.Visible = true; //设置excel可见属性
    var fname = oXL.Application.GetSaveAsFilename(
      filename + ".xls",
      "Excel Spreadsheets (*.xls), *.xls"
    );
    oWB.SaveAs(fname);
    oWB.Close();
    oXL.Quit();
  } catch (e) {
    alert(e.description);
  }
}

//非IE浏览器导出Excel
var HtmlExportToExcelForEntire = (function() {
  var uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
      "<head>" +
      '<meta charset="UTF-8">' +
      "</head>" +
      "<body>" +
      '<table border="1">{table}</table>' +
      "</body>" +
      "</html>",
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      });
    };
  return function(table, name) {
    console.log('0',name);
    if (!table.nodeType) {
      table = document.getElementById(table);
      console.log("table.innerHTML", table.innerHTML);
    }
    var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
    window.location.href = uri + base64(format(template, ctx));
    window.location.download = name + ".xls";
    // window.location.click();
  };
})();

function getExplorer() {
  var explorer = window.navigator.userAgent;
  //ie
  if (explorer.indexOf("MSIE") >= 0) {
    return "ie";
  }
  //firefox
  else if (explorer.indexOf("Firefox") >= 0) {
    return "Firefox";
  }
  //Chrome
  else if (explorer.indexOf("Chrome") >= 0) {
    return "Chrome";
  }
  //Opera
  else if (explorer.indexOf("Opera") >= 0) {
    return "Opera";
  }
  //Safari
  else if (explorer.indexOf("Safari") >= 0) {
    return "Safari";
  }
}

function formatJsonfunction(ShowLabel, JSONData) {
  //先转化json
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  var excel = "";
  //设置表头
  var row = "<tr align='left'>"; //设置Excel的左居中
  for (var i = 0, l = ShowLabel.length; i < l; i++) {
    for (var key in ShowLabel[i]) {
      row += "<td>" + ShowLabel[i][key] + "</td>";
    }
  }
  //换行
  excel += row + "</tr>";
  //设置数据
  for (var i = 0; i < arrData.length; i++) {
    var rowData = "<tr align='left'>";
    for (var y = 0; y < ShowLabel.length; y++) {
      for (var k in ShowLabel[y]) {
        if (ShowLabel[y].hasOwnProperty(k)) {
          rowData +=
            "<td style='vnd.ms-excel.numberformat:@'>" +
            (arrData[i][k] === null ? "" : arrData[i][k]) +
            "</td>";
          //vnd.ms-excel.numberformat:@ 输出为文本
        }
      }
    }
    excel += rowData + "</tr>";
  }
  return excel;
}
