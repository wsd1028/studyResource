//前端分页通用版
//  使用：
// tableData：不能与总数据变量名相同
// tableData = getPageData({
//   data: data,//总数据
//   pageSize: 10,
//   pageIndex: 1
// });
// 分页删除最后一项注意
// if (this.pageIndex - 1 == this.dataCount / this.pageSize) {
//   this.pageIndex--;
// }
function getPageData(rule) {
  let data = rule.data //总数据
  let pageData = [] //分页返回数据
  let pageIndex = rule.pageIndex - 1
  let pageSize = rule.pageSize
  let count = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i + pageIndex * pageSize]) {
      pageData.push(data[i + pageIndex * pageSize])
      count++
    } else {
      break
    }
    if (count > pageSize - 1) {
      break
    }
  }
  return pageData
}

//前端多条件搜索
// searchRules = {
//   Time: '8', //需要mianData里的字段对应
//   FileName: ''
// }
// data=tmySearch((mainData,searchRules )
function mySearch(mainData, searchRules) {
  let tableData = []
  for (let key in searchRules) {
    if (searchRules[key] == null) {
      searchRules[key] = ''
    }
    tableData = []
    for (let i = 0; i < mainData.length; i++) {
      if (mainData[i][key].indexOf(searchRules[key]) != -1) {
        tableData.push(mainData[i])
      }
    }
    mainData = tableData
  }
  return tableData
}

//获取cookie
//使用getCookie("属性名称");
function getCookie(cookieName) {
  let strCookie = document.cookie
  let arrCookie = strCookie.split('; ')
  for (let i = 0; i < arrCookie.length; i++) {
    let arr = arrCookie[i].split('=')
    if (cookieName == arr[0]) {
      return arr[1]
    }
  }
  return ''
}

//获取路由参数
//使用getQueryString("属性名称");
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

//数组中多个对象项去重
function singleArrObj(oldArr, rule) {
  let newArr = []
  for (var i = 0; i < oldArr.length; i++) {
    var flag = true
    for (var j = 0; j < newArr.length; j++) {
      let oldItem = oldArr[i]
      let newItem = newArr[j]
      if (oldItem[rule] == newItem[rule]) {
        flag = false
      }
    }
    if (flag) {
      newArr.push(oldArr[i])
    }
  }
  return newArr
}

/*
 * @parm array 排序的数组对象
 * @parm key 要根据数组对象的哪条属性排序
 * @parm updown （up 升序 down 降序）
 */
function sortByKey(array, key, updown) {
  return array.sort(function(a, b) {
    var x = a[key]
    var y = b[key]
    if (updown == 'up') {
      return x < y ? -1 : x > y ? 1 : 0
    }
    if (updown == 'down') {
      return x < y ? 1 : x > y ? -1 : 0
    }
  })
}

//过滤数组项的字符串
/*demo*/
// newdata = this.filterText({
//   arr: data,
//   key: '',
//   ruleArr: ['CQYD-023-', 'B42', 'B22']
// })

function filterText(data) {
  let { arr, key, ruleArr } = data
  if (key) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      let str = item[key]
      let newStr = ''
      for (let j = 0; j < ruleArr.length; j++) {
        newStr = str.split(ruleArr[j]).join('')
        str = newStr
      }
      arr[i][key] = newStr
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i]
      let newStr = ''
      for (let j = 0; j < ruleArr.length; j++) {
        newStr = str.split(ruleArr[j]).join('')
        str = newStr
      }
      arr[i] = newStr
    }
  }
  return arr
}

exports = {
  getPageData,
  getCookie,
  getQueryString,
  singleArrObj,
  sortByKey,
  filterText
}
