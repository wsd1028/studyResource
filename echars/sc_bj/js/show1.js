// 日期排序
function getLatestDays(num) {
    var currentDay = new Date();
    var returnDays = [];
    for (var i = 0; i < num; i++) {
        currentDay.setDate(currentDay.getDate() - 1);
        returnDays.push((currentDay.getMonth() + 1) + "/" + currentDay.getDate());
    }
    var tempdays = [];
    for (var j = returnDays.length - 1; j >= 0; j--) {
        tempdays.push(returnDays[j]);
    }
    return tempdays;
}

// 时间排序
function get10MinutesScale() {
    var currDate = new Date();
    var odd = currDate.getMinutes() % 10;
    var returnArr = new Array();
    currDate.setMinutes(currDate.getMinutes() - odd);
    for (var i = 0; i < 7; i++) {
        returnArr.push(currDate.getHours() + ":" + (currDate.getMinutes() < 10 ? ("0" + currDate.getMinutes()) : currDate.getMinutes()));
        currDate.setMinutes(currDate.getMinutes() - 10);
    }
    return returnArr;
}

// 随机取数组
function getchatData(num, max) {
    var data = [];
    for (var i = 0; i < num; i++) {
        data.push((Math.random() * max).toFixed(2));
    }
    return data;
}

var dom = document.getElementById("show1");
var myChart = echarts.init(dom);

// option
option = {
    title: {
        text: '刻度大小',
        top: 0,
        left: '9%',
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#12a87f'
            }
        }
    },
    legend: {
        top: 0,
        right: 0,
        textStyle: {
            color: 'white'
        },
        //orient: 'vertical',
        data: [
            {name: '网络', icon: 'circle'},
            {name: '内存', icon: 'circle'},
            {name: 'CPU', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: true
        },
        data: get10MinutesScale()
    },
    yAxis: {
        type: 'value',

        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    series: [{
        name: '网络',
        type: 'line',
        //smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        data: getchatData(31, 1000)//[120, 132, 101, 134, 90, 230, 210]
    }, {
        name: '内存',
        type: 'line',
        //smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        data: getchatData(31, 500)//[220, 182, 191, 234, 290, 330, 310]
    }, {
        name: 'CPU',
        type: 'line',
        //smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#ffffff'}, {
                    offset: 1,
                    color: '#ffffff'
                }], false),
                opacity: 0.3
            }
        },
        itemStyle: {
            normal: {
                color: '#F154B1'
            },
            lineStyle: {
                normal: {
                    color: '#F154B1',
                    opacity: 1
                }
            }
        },
        data: getchatData(31, 800)//[150, 232, 201, 154, 190, 330, 410]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
window.onresize = myChart.resize; // 自适应窗口大小

var dom = document.getElementById("show2");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 6000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 300)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
window.onresize = myChart.resize;
var dom = document.getElementById("show3");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 8000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 300)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show4");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 5000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 200)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show5");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 6000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 100)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show6");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 8000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 400)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show7");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 7000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 200)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show8");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 8000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 300)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
var dom = document.getElementById("show9");
var myChart = echarts.init(dom);
// option
option = {
    title: {
        text: '端口流量（单位：Mbps）',
        top: 0,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            color: 'white',
            fontSize: 12 //刻度大小
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 0,
        right: 230,
        textStyle: {
            color: 'white'
        },
        //orient:'',
        data: [
            {name: '流入端口流量', icon: 'circle'},
            {name: '流出端口流量', icon: 'circle'}
        ]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLatestDays(31),
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            },
            //rotate: 45,
            interval: 2
        },
        axisTick: {show: true},
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFF',
                width: 1,
                type: 'solid'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {show: true},
        axisLabel: {
            textStyle: {
                fontWeight: 'normal',
                color: "white", //刻度颜色
                fontSize: 12 //刻度大小
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#FFFFFF',
                width: 1,
                type: 'solid'
            }
        },
        splitLine: {
            show: false
        }
    },
    tooltip: {
        formatter: '{c}',
        backgroundColor: '#FE8501'
    },
    series: [{
        name: '流入端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#12A87F'}, {
                    offset: 1,
                    color: '#12A87F'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#03E2E2'
            },
            lineStyle: {
                normal: {
                    color: '#03E2E2',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 7000)//[48, 52, 45, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }, {
        name: '流出端口流量',
        type: 'line',
        smooth: true,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#2196F3'}, {
                    offset: 1,
                    color: '#2196F3'
                }], false),
                opacity: 0.9
            }
        },
        itemStyle: {
            normal: {
                color: '#0655F4'
            },
            lineStyle: {
                normal: {
                    color: '#0655F4',
                    opacity: 1
                }
            }
        },
        symbol: 'none',
        data: getchatData(31, 200)// [30, 20, 10, 46, 89, 120, 110, 100, 88, 96, 88, 45, 78, 67, 89, 103, 104, 56, 45, 104, 112, 132, 120, 110, 89, 95, 90, 89, 102, 110, 110]
    }]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
