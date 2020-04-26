function method(ShowLabel, JSONData, filename) {
  if (getExplorer() == "ie" || getExplorer() == undefined) {
    HtmlExportToExcelForIE(ShowLabel, JSONData, filename);
  } else {
    HtmlExportToExcelForEntire(ShowLabel, JSONData, filename);
  }
}
//IE浏览器导出Excel
function HtmlExportToExcelForIE(ShowLabel, JSONData, filename) {
  try {
    let excelDom = formatJsonfunction(ShowLabel, JSONData);
    $("body").append(excelDom);
    var curTbl = document.getElementById("download_table");
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
function HtmlExportToExcelForEntire(ShowLabel, JSONData, filename) {
  var excel = formatJsonfunction(ShowLabel, JSONData);
  var excelFile =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";
  var uri =
    "data:application/vnd.ms-excel;charset=utf-8," +
    encodeURIComponent(excelFile);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = filename + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
  var excel = "<table border='1' id='download_table'>";
  //设置表头
  var row = "<tr align='left'>"; //设置Excel的左居中
  for (var k in ShowLabel) {
    row += "<td>" + ShowLabel[k] + "</td>";
  }
  //换行
  excel += row + "</tr>";
  //设置数据
  for (var i = 0; i < arrData.length; i++) {
    var rowData = "<tr align='left'>";
    for (var k in ShowLabel) {
      rowData +=
        "<td style='vnd.ms-excel.numberformat:@'>" +
        (arrData[i][k] === null ? "" : arrData[i][k]) +
        "</td>";
    }
    excel += rowData + "</tr>";
  }
  excel += "</table>";
  return excel;
}
