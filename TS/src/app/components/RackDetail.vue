<template>
  <div
    v-loading.fullscreen="loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    class="rackKeyApp"
  >
    <div class="pos_nav">
      <el-breadcrumb separator-class="el-icon-arrow-right" id="navRack">
        <el-breadcrumb-item :to="{ path: '' }">资源管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '' }">{{parentPage}}</el-breadcrumb-item>
        <el-breadcrumb-item>机柜背板图</el-breadcrumb-item>
      </el-breadcrumb>
     <template v-if="$route.params.pagetype==2">
       <el-button style="float:right;margin-right:20px;margin-top:-20px" v-on:click="backUp" type="primary" size="mini" icon="el-icon-back" round>返 回</el-button>

     </template>
      
    </div>
    <el-card id="elCardContent">
      <el-row type="flex">
        <el-col :span="9">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>机架信息</span>
            </div>
            <div>
              <table>
                <tr>
                  <td style="width: 100px;">机柜:</td>
                  <td style="width:300px;">{{roomName}}/{{rackName}}</td>
                </tr>
                <tr>
                  <td style="width: 100px;">机柜类型:</td>
                  <td style="width:300px;">{{rackType}}</td>
                </tr>
                <tr>
                  <td>机柜容量(U):</td>
                  <td>{{rackVolume}}</td>
                </tr>
                <tr>
                  <td>设备数:</td>
                  <td>{{deviceNumber}}</td>
                </tr>
                <!-- <tr>
                  <td>所属客户:</td>
                  <td>
                    {{customerName}}
                  </td>
                </tr>-->
              </table>
              <el-row type="flex" justify="center">
                <el-col :span="12" style="text-align:center;">
                  <template>
                    <ve-gauge :data="chartDataFillLevel" :settings="chartSettingFillLevel" height="250px"></ve-gauge>
                  </template>
                  <span>机柜饱满度</span>
                </el-col>
              </el-row>
              <template v-if="isShowButton">
                <el-button style="float: left;" type="primary" size="mini">上架设备</el-button>
                <el-button style="float: left;" type="primary" size="mini">下架设备</el-button>
                <el-button
                  style="float: right;"
                  type="primary"
                  size="mini"
                  v-on:click="saveImage2Server"
                >提交</el-button>
              </template>
            </div>
          </el-card>

          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>设备信息</span>
            </div>
            <div>
              <table v-if="currentElement">
                <tr>
                  <td style="width: 100px;">设备型号：</td>
                  <td style="width:300px;">{{currentElement.serverModel}}</td>
                </tr>
                <tr>
                  <td style="width: 100px;">设备类型：</td>
                  <td style="width:300px;">{{currentElement.serverTypeName}}</td>
                </tr>
                <tr>
                  <td style="width: 100px;">设备名称：</td>
                  <td style="width:300px;">{{currentElement.name}}</td>
                </tr>
                <tr>
                  <td>起始U位:</td>
                  <td>{{currentElement.location}}</td>
                </tr>
                <tr>
                  <td>设备高度：</td>
                  <td>{{currentElement.height}}(U)</td>
                </tr>
                <tr
                  v-if="currentElement.customer!=null&&currentElement.customer.customerName!=null"
                >
                  <td style="width: 100px;">所属客户:</td>
                  <td style="width:300px;">{{currentElement.customer.customerName}}</td>
                </tr>
              </table>
              <!-- <el-button
                v-if="currentElement"
                style="float: left;"
                type="primary"
                size="mini"
                v-on:click="applyCurrentElement"
              >应用</el-button>
              <el-button
                style="float: right;"
                type="primary"
                size="mini"
                v-on:click="saveImage2Server"
              >提交</el-button>-->
              
              
              <el-row>
                <el-col :span="12" style="text-align:center;">
                  <template>
                    <ve-gauge :data="chartDataMemory" :settings="chartSettingsMemory" height="250px"></ve-gauge>
                  </template>
                  <span>内存占用率</span>
                </el-col>
                <el-col :span="12" style="text-align:center;">
                  <template>
                    <ve-gauge :data="chartDataCpu" :settings="chartSettingsCpu"   height="250px"></ve-gauge>
                  </template>
                  <span>CPU利用用率</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="block" style="display:none">
              <span class="demonstration">缩放</span>
              <el-slider
                v-model="scalePercent"
                :show-tooltip="false"
                v-on:change="onZoom"
                style="width: 200px;"
              ></el-slider>
            </div>
            <v-stage :config="stageConfig" ref="areaStage" v-on:mouseenter="changeCursor">
              <v-layer>
                <v-rect :config="cabinet"></v-rect>
                <!-- <v-rect :config="cabinetHead"></v-rect> -->
                <v-arc :config="cabinetHead"></v-arc>
                <v-rect :config="cabinetHeadLeft"></v-rect>
                <v-rect :config="cabinetHeadRight"></v-rect>
                <!-- <v-rect :config="cabinetLineHead"></v-rect> -->
                <!-- <v-rect :config="cabinetU"></v-rect> -->
                <v-rect :config="cabinetLineFoot"></v-rect>
                <v-rect :config="cabinetFoot"></v-rect>
                <v-rect :config="cabinetFootLeft"></v-rect>
                <v-rect :config="cabinetFootRight"></v-rect>
                <v-rect :config="cabinetFootLeft2"></v-rect>
                <v-rect :config="cabinetFootRight2"></v-rect>
                <v-rect :config="cabinetLineFooter"></v-rect>
                <v-rect :config="cabinetFooter"></v-rect>
                <template v-for="(item,index) in rackVolemes">
                  <v-rect :config="item.u"></v-rect>
                  <v-text :config="item.t"></v-text>
                </template>
                <v-group
                  v-for="item in rackDevices"
                  :config="item"
                  v-on:dragend="dragElement($event,item)"
                  v-on:click="clickElement($event,item)"
                  v-on:dragstart="dragstart($event,item)"
                >
                  <v-rect :config="item.rect"></v-rect>
                  <v-text :config="item.text"></v-text>
                </v-group>
                <v-text :config="cabinetFootText"></v-text>
              </v-layer>
            </v-stage>
          </div>
        </el-col>
        <el-col :span="9">
          <template v-if="isShowCustomerTable">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>客户列表</span>
              </div>
              <div>
                <el-table
                  border
                  :data="customersTable"
                  style="width: 100%;margin-bottom:20px"
                  @row-click="clickCustomer"
                  :header-cell-style="rowClass"
                  :cell-style="cleeStyle" 
                >
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column property="customerName" label="节点"></el-table-column>
                  <el-table-column property="nodeName" label="客户经理"></el-table-column>
                  <el-table-column property="customerLevel" label="客户等级"></el-table-column>
                </el-table>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[4]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount" style="float:right"
                ></el-pagination>
              </div>
            </el-card>
          </template>
          <template v-if="isShowCustomerDetail">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>客户详情</span>
              </div>
              <div>
                <div style="float:left">
                  <table style="padding-bottom:20px">
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户编码：</td>
                      <td class="tdright">{{currentCustomer.customerCode}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户名称：</td>
                      <td class="tdright">{{currentCustomer.customerName}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">节点：</td>
                      <td class="tdright">{{currentCustomer.nodeName}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户经理：</td>
                      <td class="tdright">{{currentCustomer.customerManager}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户经理电话：</td>
                      <td class="tdright">{{currentCustomer.customerManagerPhone}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户等级：</td>
                      <td class="tdright">{{currentCustomer.customerLevel}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户SLA等级：</td>
                      <td class="tdright">{{currentCustomer.slaLevelName}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户邮箱：</td>
                      <td class="tdright">{{currentCustomer.customerEmail}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户地址：</td>
                      <td class="tdright">{{currentCustomer.customerAddress}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">客户联系人：</td>
                      <td class="tdright">{{currentCustomer.contactPerson}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">联系电话：</td>
                      <td class="tdright">{{currentCustomer.telephone}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">维护对接人：</td>
                      <td class="tdright">{{currentCustomer.cmDer}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">维护对接人电话：</td>
                      <td class="tdright">{{currentCustomer.cmdTel}}</td>
                    </tr>
                    <tr v-if="currentCustomer">
                      <td class="tdleft">维护对接人邮箱：</td>
                      <td class="tdright">{{currentCustomer.cmdEmail}}</td>
                    </tr>
                  </table>
                </div>
                <div
                  v-if="currentCustomer"
                  style="float:left;width: 158px;height: 300px;line-height: 300px;text-align: center;"
                >
                  <template v-if="currentCustomer.logo">
                    <img :src="currentCustomer.logo">
                  </template>
                  <template v-else>
                    <div
                      style="border:1px solid #ddd;width:158px;height:300px;text-align:center;line-height:300px"
                    >无</div>
                  </template>
                </div>
              </div>
            </el-card>
          </template>
        </el-col>
      </el-row>
    <!-- </el-card> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import VueKonva from "../../../node_modules/vue-konva";
import "element-ui/lib/theme-chalk/index.css";
import { AreaPoint } from "../core/point";
import { nearer } from "q";
import { clearTimeout } from "timers";
import { Config } from "../core/config";
import { truncate } from "fs";
import VCharts from "../../../node_modules/v-charts";
import Echart from "../../../node_modules/echarts";
import { fail } from "assert";

Vue.use(VCharts)
Vue.use(Echart)

@Component
export default class RackDetail extends Vue {
  private devicesLegend = [
    {
      type: "设备类型a",
      fill: "green"
    },
    {
      type: "设备类型b",
      fill: "blue"
    }
  ];
  private loading: boolean = false;
  private configKonva: object = {
    width: 550,
    height: 1500
  };
  private cabinet: object = {
    width: 300,
    height: 510,
    fill: "#888888",
    x: 0,
    y: 39,
  };
  private cabinetHead: object = {
    x: 150,
    y: 1000,
    innerRadius: 1000,
        outerRadius: 975,
        angle: 16,
        fill: '#595757',
        stroke: 'black',
        strokeWidth: 0,
        rotation: -98
  };
  private cabinetHeadLeft: object = {
    width: 20,
    height: 30,
    x: 0,
    y: 9,
    fill: "#3E3A39"
  };
  private cabinetHeadRight: object = {
    width: 20,
    height: 30,
    x: 280,
    y: 9,
    fill: "#3E3A39"
  };
  private cabinetLineHead: object = {
    width: 260,
    height: 5,
    x: 20,
    y: 20,
    fill: "#fff"
  };
  private cabinetU: object = {
    width: 260,
    height: 476,
    x: 20,
    y: 39,
    fill: "#fff"
  };
  private cabinetLineFoot: object = {
    width: 260,
    height: 5,
    x: 20,
    y: 510,
    fill: "#fff"
  };
  private cabinetFoot: object = {
    width: 260,
    height: 60,
    x: 20,
    y: 515,
    fill: "#737171"
  };
  private cabinetFootLeft: object = {
    width: 20,
    height: 60,
    x: 0,
    y: 515,
    fill: "#3E3A39"
  };
  private cabinetFootRight: object = {
    width: 20,
    height: 60,
    x: 280,
    y: 515,
    fill: "#3E3A39"
  };
   private cabinetFootLeft2: object = {
    width: 20,
    height: 55,
    x: 0,
    y: 520,
    fill: "#595757"
  };
  private cabinetFootRight2: object = {
    width: 20,
    height: 55,
    x: 280,
    y: 520,
    fill: "#595757"
  };
  private cabinetFooter: object = {
    width: 280,
    height: 10,
    x: 10,
    y: 580,
    fill: "#595757"
  };
  private cabinetLineFooter: object = {
    width: 280,
    height: 5,
    x: 10,
    y: 575,
    fill: "#3E3A39"
  };
  private cabinetFootText: object = {
    fontSize: 20,
    x: 20,
    y: 520,
    text: "机柜名称",
    fill: "#fff"
  };
  private stageConfig: object = {
    x: 0,
    y: 0,
    width: 430,
    height: 880
  };
  private arrDevicesResource = [];
  private scalePercent: number = 90;
  private lastScalePercent: number = 90;
  private rackVolume: number = 0;
  private rackName:string="";
  private roomName:string="";
  private deviceNumber:number=0;
  private rackType:string="";
  private customerName:string="";
  private uHeight: number = 0;
  private baseHeight:number=39;
  private rackHeight:number=480;
  private rackVolemes = [];
  private rackDevices = [];
  private currentElement = null;
  private currentLocation: number = 0;
  private currentHeight: number = 0;
  private screenW:number=window.screen.width;
  private colorsArray=[];
  private isShowCustomerTable:boolean=false;
  private isShowCustomerDetail:boolean=false;
  private currentCustomer=null;
  private customersTable=[];
  private customers=[];
  private mark:number=0;//0为机房平面图跳转来 传入的id为roomid 1为从其他页面跳转来 传入的是rackid
  private deviceCanDrag=false;//是否可以移动设备
  private isShowButton:boolean=false;
  //分页
  private pageSize:number=4;
  private currentPage:number=1;
  private totalCount:number=0;

  private parentPage:string='';//父页面
  private parentPageUrl:string='';//父页面地址
  private chartDataMemory={
          columns: ['type', 'value'],
          rows: [
            { type: '内存占用率', value: 0 }
          ]
        };
  private chartSettingsMemory={
    dataName: {
          '内存占用率': '%',
        },
        seriesMap:{
        '内存占用率':{
          title: {
              show: false
            },detail: {
            show: false
          }
        }
      }
  }
  private chartDataCpu={
          columns: ['type', 'value'],
          rows: [
            { type: 'CPU利用用率', value: 0 }
          ]
        };
         private chartSettingsCpu={
    dataName: {
          'CPU利用用率': '%',
        },
        seriesMap:{
        'CPU利用用率':{
          title: {
              show: false
            },detail: {
            show: false
          }
        }
      }
  }

  private chartDataFillLevel={
      columns: ['type', 'value'],
          rows: [
            { type: '机柜饱满度', value: 0 }
          ]
  }

  private chartSettingFillLevel={
 dataName: {
          '机柜饱满度': '%',
        },
        seriesMap:{
        '机柜饱满度':{
          title: {
              show: false
            },detail: {
            show: false
          }
        }
      }
  }


  private getPageData(){
    this.customersTable=[];
    this.customers.forEach((item,index)=>{
      if((index+1)>this.pageSize*(this.currentPage-1)&&(index+1)<=this.pageSize*this.currentPage){
        this.customersTable.push(item);
      }
    })
  }
  private handleSizeChange(val){
    this.pageSize=val;this.getPageData();
  }
  private handleCurrentChange(val){
    this.currentPage=val;this.getPageData();
  }
  private createColorsArray():void{
    for(let i=0;i<100;i++){
      this.colorsArray.push({"color":this.getColor()})
    }
    console.log( this.colorsArray)
  }
  private getColor():string{
    let str = ''
    var r =  parseInt(Math.random() * 255);
    var g =  parseInt(Math.random() * 255);
    var b =  parseInt(Math.random() * 255);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
  private getCharSize(str, style) {
    let span = document.createElement("span");
    span.style.font = `${style.fontSize} ${style.fontFamily}`;
    span.style.lineHeight = style.fontSize;
    span.innerHTML = str;
    document.body.appendChild(span);
    let rect = span.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    document.body.removeChild(span);
    return {
      width,
      height: style.fontSize
    };
    private getDragable():boolean{
      this.$route.params.id!=undefined?true:false
      if(this.$route.params.id!=undefined){
        return true;
      }else{
        if(this.$route.params.taskid!=undefined&&this.$route.params.rackid!=undefined){
          return false;
        }else{
          return true;
        }
      }
    }
    //计算空闲机位
    private calcFreeUseat(arr){
      let arrFree=[];
      for(var i=1;i<=this.rackVolume;i++){
        arrFree.push(i);
      }
      let arrUsed=[];
      for(let i=0;i<arr.length;i++){
        let start=parseInt(arr[i]._data.location);
        let end=parseInt(arr[i]._data.height)+start-1;
        for(let j=start;j<=end;j++){
          arrUsed.push(j);
        }
      }
      arrFree=Linq.from(arrFree).where(s=>!Linq.from(arrUsed).contains(s)).toArray();
      return arrFree;
    }

    private getShowButton():boolean{
      if(this.$route.params.id!=undefined){
        return false;
      }else{
        if(this.$route.params.taskid==undefined){
          return false;
        }else{
          return true;
        }
      }
    }
  private async getData(): void {
    this.currentElement = null;
    this.currentCustomer=null;
    this.customers=[];
    this.loading=true;
    this.isShowButton= this.getShowButton();
    let url =
      `${Config.baseUrl}/api/Room2D/GetRackInfo?elementId=` +this.$route.params.id+`&rackId=` +this.$route.params.rackid;
    try {
      let resp = await Axios.get(url);
      if (resp.data) {
        if(resp.data.typeUseId==1){
          this.isShowCustomerTable=false;
          this.isShowCustomerDetail=false;
        }else if(resp.data.typeUseId==3){
          this.isShowCustomerTable=false;
          this.isShowCustomerDetail=true;
          this.currentCustomer=resp.data.customer;
        }else{
          this.isShowCustomerTable=true;
          this.isShowCustomerDetail=true;
          this.customers=resp.data.customers;
          this.getPageData();
          this.totalCount=this.customers.length;
          this.currentCustomer=this.customersTable.length>0?this.customersTable[0]:null;
        }
        if(resp.data==null){
          this.isShowCustomerTable=false;
          this.isShowCustomerDetail=false;
        }
        var textSize = this.getCharSize(resp.data.name, {
          fontSize: 20,
          fontFamily: "SimSun"
        });
        this.cabinetFootText = {
          fontSize: 20,
          x: 20 + (260 - textSize.width) / 2,
          y: 515 + (60 - textSize.height) / 2,
          text: resp.data.name,
          fill: "#fff"
        };
        var arr = [];
        this.rackVolume = resp.data.volume;
        this.rackName = resp.data.name;
        this.roomName=resp.data.jfName
        this.rackType = resp.data.type;
        this.customerName = resp.data.customerName;
        this.uHeight = Math.floor(this.rackHeight / this.rackVolume);
        var height = this.uHeight;
        var y = this.uHeight;
        for (let index = resp.data.volume - 1; index >= 0; index--) {
          let element = {
            width: 260,
            height: this.uHeight,
            x: 20,
            y: this.baseHeight + this.uHeight * (resp.data.volume - 1 - index),
            fill: "#eeeeee",
            stroke: "#ddd",
            strokeWidth: 1
          };
          let text = {
            fontSize: 11,
            x: 20,
            y: this.baseHeight + this.uHeight * (resp.data.volume - 1 - index),
            text: index + 1 + "U",
            fill: "black"
          };
          arr.push({
            id: index + 1,
            u: element,
            t: text
          });
        }
        this.rackVolemes = arr;
        if (resp.data.devices != [] || resp.data.devices.length > 0) {
          this.arrDevicesResource = resp.data.devices;
          let sumHeight = Linq.from(this.arrDevicesResource).sum(s => s.height);
          let arrNewDevice=Linq.from(this.arrDevicesResource).where(x=>x.location==0).toArray();
          this.arrDevicesResource = Linq.from(this.arrDevicesResource)
            .where(x => x.location != 0)
            .orderBy(s => s.location)
            .toArray();
          if (sumHeight > this.rackVolume) {
            this.$message({
              message: "设备总U数超过机柜总U数",
              type: "error"
            });
            return;
          }
          let arrDevices = [];
          let draggableG=this.getDragable();
          for (let index = 0; index < this.arrDevicesResource.length; index++) {
            const element = this.arrDevicesResource[index];
            var textDeviceSize = this.getCharSize(element.serverModel+"("+element.height+"U)", {
              fontSize: 8,
              fontFamily: "SimSun"
            });
            let group = {
              _data: element,
              x: 20,
              y: Linq.from(this.rackVolemes).firstOrDefault(
                s => s.id == element.location + element.height - 1
              ).u.y, // (this.rackVolume-(element.location+element.height-1))*this.uHeight,
              draggable:draggableG,
              dragBoundFunc: function(pos) {
                return {
                  x: this.absolutePosition().x,
                  y: pos.y
                };
              },
              rect: {
                width: 260,
                height: element.height * this.uHeight,
                x: 0,
                y: 0,
                fill:element.fillColor!=null?element.fillColor:"#eeeeee",//element.serverType<this.colorsArray.length? this.colorsArray[element.serverType-1].color:"#eeeeee",
                stroke: "#ddd",
                strokeWidth: 1
              },
              text: {
                fontSize: 8,
                x:0, //(260 - textDeviceSize.width) / 2,
                y: (element.height * this.uHeight - textDeviceSize.height) / 2,
                text: element.serverModel+"("+element.height+"U)",
                fill: "#fff"
              }
            };
            arrDevices.push(group);
          }
          let arrFree=this.calcFreeUseat(arrDevices);
          if(arrFree.length>=arrNewDevice.length){
          for(let i=0;i<arrNewDevice.length;i++){
             const element = arrNewDevice[i];
            var textDeviceSize = this.getCharSize(element.serverModel+"("+element.height+"U)", {
              fontSize: 8,
              fontFamily: "SimSun"
            });
            element.location=arrFree[i];
            element.height=1;
             let group = {
              _data: element,
              x: 20,
              y: Linq.from(this.rackVolemes).firstOrDefault(
                s => s.id == element.location + element.height - 1
              ).u.y, // (this.rackVolume-(element.location+element.height-1))*this.uHeight,
              draggable:draggableG,
              dragBoundFunc: function(pos) {
                return {
                  x: this.absolutePosition().x,
                  y: pos.y
                };
              },
              rect: {
                width: 260,
                height: element.height * this.uHeight,
                x: 0,
                y: 0,
                fill:element.fillColor!=null?element.fillColor:"#eeeeee",//element.serverType<this.colorsArray.length? this.colorsArray[element.serverType-1].color:"#eeeeee",
                stroke: "#ddd",
                strokeWidth: 1
              },
              text: {
                fontSize: 8,
                x: 0,//(260 - textDeviceSize.width) / 2,
                y: (element.height * this.uHeight - textDeviceSize.height) / 2,
                text: element.serverModel+"("+element.height+"U)",
                fill: "#fff"
              }
            };
            //arrDevices.push(group);
          }}
           
           this.rackDevices = arrDevices;
           this.deviceNumber=this.rackDevices.length;
           this.currentElement=this.rackDevices.length>0?this.rackDevices[this.rackDevices.length-1]._data:null;
           this.drawVChart();
        this.clacFillLevel();
        } else {
          this.arrDevicesResource = [];
          this.rackDevices = [];
        }
        //var arrDevicesResource=res.data.devices;
      } else {

        this.$message({
          message: "获取机柜信息失败",
          type: "error"
        });
      }
    } catch (error) {
      this.$message({
        message: error,
        type: "error"
      });
    }
      
    
    this.loading=false;
    if(this.screenW==1366){
      this.scalePercent=46;
      this.lastScalePercent=46;
      this.onZoom(46);
    }else if(this.screenW==1920){
      
      this.scalePercent=68;
      this.lastScalePercent=68;
      this.onZoom(68);
    }else if(this.screenW==1440){
      
      this.scalePercent=49;
      this.lastScalePercent=49;
      this.onZoom(49);
    }else if(this.screenW==1600){
      
      this.scalePercent=55;
      this.lastScalePercent=55;
      this.onZoom(55);
    }else if(this.screenW==1680){
      
      this.scalePercent=58;
      this.lastScalePercent=58;
      this.onZoom(58);
    }
  }

  private clacFillLevel():void{
    var _this=this;
    var arrTmp=Linq.from(_this.arrDevicesResource).orderBy(x=>x.location).toArray();
    var sumFree=0;
    for(var i=0;i< arrTmp.length;i++){
      var ele=arrTmp[i];
      if(i==0){
        //与1u进行比较
        var location=parseInt(ele.location);
        if(location!=1){
          var diff=location-1;
          var num=Math.floor(diff/2);
          sumFree+=num; 
        }
      }else if(i==arrTmp.length-1){
        //与最大U进行比较
         var location=parseInt(ele.location) +parseInt(ele.height)-1;
        if(location!=_this.rackVolume){
          var diff=_this.rackVolume-location;
          var num=Math.floor(diff/2); 
          sumFree+=num; 
        }
      }else{
        //设备间比较
        var eleNext=arrTmp[i-1];
        var locationCurrent=parseInt(ele.location);
        var locationNext=parseInt(eleNext.location)+parseInt(eleNext.height)-1;
        var diff=locationCurrent-locationNext;
        var num= Math.floor((diff-1)/2);
          sumFree+=num; 
      }
    }
    var sum=sumFree+arrTmp.length;
    var percent=sum==0?0: parseFloat((arrTmp.length/sum).toFixed(2))*100;
    _this.chartDataFillLevel={
      columns: ['type', 'value'],
          rows: [
            { type: '机柜饱满度', value: percent }
          ]
  }
  }

  private drawVChart():void{
    
    var _this=this;
    if(_this.currentElement!=null&& _this.currentElement.ipAddress!=null&&_this.currentElement.ipAddress!=""){
        Axios.get('/v5/AutoInspectionManage/AutoInspection.aspx?m=GetServerInfo&nodeId='+_this.currentElement.nodeId+'&ip='+_this.currentElement.ipAddress+'&r='+Math.random()).then(function(resp,status){
          console.log(resp);
          if ('success' !== status) {
                            return;
                        }
                        _this.chartDataMemory={
          columns: ['type', 'value'],
          rows: [
            { type: '内存占用率', value: resp.ram }
          ]
        };
       _this.chartDataCpu={
          columns: ['type', 'value'],
          rows: [
            { type: 'CPU利用用率', value:  resp.cpu}
          ]
        };
        }).catch(function(error){
          _this.$message({
        message: error,
        type: "error"
      });
        })
      }
  }
  private clickElement(event, item): void {
    var _this=this;
    try {
      this.currentElement = event.currentTarget.VueComponent.config._data;
      this.currentLocation = parseInt(this.currentElement.location);
      this.currentHeight = parseInt(this.currentElement.height);
      console.log(event.currentTarget.VueComponent.config._data);
      this.drawVChart();
    } catch (error) {}
  }
  private applyCurrentElement(): void {
    var loaction = parseInt(this.currentElement.location);
    var height = parseInt(this.currentElement.height);
    var U = Linq.from(this.rackVolemes).firstOrDefault(s => s.id == loaction);
    if (U == null) {
      this.currentElement.location = this.currentLocation;
      this.currentElement.height = this.currentHeight;
      this.$message({
        message: "设备U数超出可使用范围或与其他设备U位冲突",
        type: "error"
      });
      return;
    }
    var yNumber = U.u.y;
    var item = Linq.from(this.rackDevices).firstOrDefault(
      s => s._data.id == this.currentElement.id
    );

    let nearByU = this.getNearByU(yNumber, item);
    let isCan = this.getNearByElement1(nearByU.ap.y, item);
    if (!isCan) {
      this.currentElement.location = this.currentLocation;
      this.currentElement.height = this.currentHeight;
      this.$message({
        message: "设备U数超出可使用范围或与其他设备U位冲突",
        type: "error"
      });
      return;
    }
    var textDeviceSize = this.getCharSize(this.currentElement.name, {
      fontSize: 11,
      fontFamily: "SimSun"
    });
    var arr = Linq.from(this.rackDevices)
      .select(s => {
        if (s._data.id == this.currentElement.id) {
          s._data.name = this.currentElement.name;
          s._data.location = this.currentElement.location;
          s._data.height = this.currentElement.height;
          s.y = Linq.from(this.rackVolemes).firstOrDefault(
            s =>
              s.id ==
              parseInt(this.currentElement.location) +
                parseInt(this.currentElement.height) -
                1
          ).u.y;
          s.rect.height = parseInt(this.currentElement.height) * this.uHeight;
          s.text.x = 20 + (260 - textDeviceSize.width) / 2;
          s.text.y =
            (parseInt(this.currentElement.height) * this.uHeight -
              textDeviceSize.height) /
            2;
        }
        return s;
      })
      .toArray();

    let delay = window.setTimeout(() => {
      this.rackDevices = arr;
      this.currentElement = null;
      window.clearTimeout(delay);
    }, 10);
  }

  private async saveImage2Server(): void {
    var devices = Linq.from(this.rackDevices)
      .select(s => s._data)
      .toArray();
    let url = `${Config.baseUrl}/api/Resource/UpdateDevices`;
    
    try {
      let resp = await Axios.post(url, devices);
      if (resp.data) {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.getData();
      } else {
        this.$message({
          message: "保存失败",
          type: "error"
        });
        this.getData();
      }
    } catch (error) {
      this.$message({
        message: error,
        type: "error"
      });
      this.getData();
    }
  }

  private dragstart(event, item): void {
    event.currentTarget.moveToTop();
  }
  /***
   * 当光标进入到画布的时候,更改鼠标指针
   * @param dom
   * @param elem
   */
  private dragElement(event, item): void {
    try {
      let nowPoint = new AreaPoint(0, event.currentTarget.getY());
      event.currentTarget.VueComponent.config.y = nowPoint.y;
      let nearByU = this.getNearByU(nowPoint.y, item);
      let isCan = this.getNearByElement(nearByU.ap.y, item);
      if (isCan.isCan) {
        let delay = window.setTimeout(() => {
          event.currentTarget.VueComponent.config.y = nearByU.ap.y;
          event.currentTarget.VueComponent.config.x = 20;
          item._data.location = nearByU.uNumber - item._data.height + 1;
          window.clearTimeout(delay);
        }, 10);
      } else {
        if (isCan.mark == 1 || isCan.mark == 4) {
          let delay = window.setTimeout(() => {
            event.currentTarget.VueComponent.config.y = Linq.from(
              this.rackVolemes
            ).firstOrDefault(
              s =>
                s.id ==
                parseInt(item._data.location) + parseInt(item._data.height) - 1
            ).u.y;
            event.currentTarget.VueComponent.config.x = 20;
            window.clearTimeout(delay);
          }, 10);
          return;
        }
        // let sumV =Linq.from(this.rackDevices).where(x=>x._data.id!=item._data.id).sum(s =>
        //   parseInt(s.rect.height)
        // ); //
        // let sumH = this.uHeight * this.rackVolume;
        // let difH = sumH - sumV;
        // if (difH < parseInt(item.rect.height)) {
        //1、剩余U位不足以移动设备、机柜已满 直接交换
        var itemss = Linq.from(this.rackDevices)
          .where(
            s =>
              s._data.id != item._data.id &&
              s.y >= parseInt(isCan.nearByE.y) &&
              ((s.y <
                this.baseHeight +
                  this.uHeight *
                    (this.rackVolume - parseInt(item._data.location)) &&
                s.y + parseInt(s.rect.height) <=
                  this.baseHeight +
                    this.uHeight *
                      (this.rackVolume - parseInt(item._data.location))) ||
                (s.y < event.currentTarget.VueComponent.config.y &&
                  s.y + parseInt(s.rect.height) >
                    event.currentTarget.VueComponent.config.y))
            //&& s.y + this.uHeight > event.currentTarget.VueComponent.config.y
            // || (s.y+this.uHeight>event.currentTarget.VueComponent.config.y+item.rect.height&&s.y<event.currentTarget.VueComponent.config.y+item.rect.height)
            // ||(s.y+this.uHeight>event.currentTarget.VueComponent.config.y&&s.y+s.rect.height<event.currentTarget.VueComponent.config.y+item.rect.height)
            // ||(s.y>event.currentTarget.VueComponent.config.y&&s.y+s.rect.height<item.rect.height)
          )
          .toArray();
        var items = Linq.from(itemss).select(x => x._data.id);
        if (items.length == 0) {
          let delay = window.setTimeout(() => {
            event.currentTarget.VueComponent.config.y = Linq.from(
              this.rackVolemes
            ).firstOrDefault(
              s =>
                s.id ==
                parseInt(item._data.location) + parseInt(item._data.height) - 1
            ).u.y;
            event.currentTarget.VueComponent.config.x = 20;
            window.clearTimeout(delay);
          }, 10);
        } else {
          var arrTmp = Linq.from(this.rackDevices)
            .select(s => {
              if (s._data.id == item._data.id) {
                if (
                  parseInt(isCan.nearByE._data.height) >
                  parseInt(s._data.height)
                ) {
                  s._data.location =
                    parseInt(isCan.nearByE._data.location) +
                    (parseInt(isCan.nearByE._data.height) -
                      parseInt(s._data.height));
                  if (parseInt(s._data.height) != 1) {
                    s.y =
                      this.baseHeight +
                      this.uHeight *
                        (this.rackVolume -
                          parseInt(s._data.location) +
                          1 -
                          parseInt(s._data.height));
                  } else {
                    s.y =
                      this.baseHeight +
                      this.uHeight *
                        (this.rackVolume - parseInt(s._data.location));
                  }
                } else if (
                  parseInt(isCan.nearByE._data.height) ==
                  parseInt(s._data.height)
                ) {
                  s._data.location = parseInt(isCan.nearByE._data.location);
                  s.y =
                    this.baseHeight +
                    this.uHeight *
                      (this.rackVolume -
                        parseInt(s._data.location) -
                        parseInt(s._data.height) +
                        1);
                } else {
                  s._data.location =
                    parseInt(isCan.nearByE._data.location) +
                    parseInt(isCan.nearByE._data.height) -
                    parseInt(s._data.height);
                  s.y =
                    this.baseHeight +
                    this.uHeight *
                      (this.rackVolume -
                        parseInt(s._data.location) -
                        parseInt(s._data.height) +
                        1);
                }
              }
              return s;
            })
            .toArray();
          arrTmp = Linq.from(arrTmp)
            .select(s => {
              if (Linq.from(items).contains(s._data.id)) {
                s.y = s.y + parseInt(item.rect.height);
                s._data.location =
                  parseInt(s._data.location) - parseInt(item._data.height);
              }
              // else if (s._data.id == item._data.id) {
              //   s.y = 25 + this.uHeight * (this.rackVolume - 1 -  isCan.nearByE._data.location);
              //   s._data.location = isCan.nearByE._data.location - s._data.height;
              // }
              return s;
            })
            .toArray();
          this.rackDevices = arrTmp;
        }
        // } else {
        //   let delay = window.setTimeout(() => {
        //     event.currentTarget.VueComponent.config.y = Linq.from(
        //       this.rackVolemes
        //     ).firstOrDefault(
        //       s =>
        //         s.id ==
        //         parseInt(item._data.location) + parseInt(item._data.height) - 1
        //     ).u.y;
        //     event.currentTarget.VueComponent.config.x = 20;
        //     window.clearTimeout(delay);
        //   }, 10);
        // }
      }
    } catch (error) {
      console.log(error);
    }
     this.$confirm('是否保存修改？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改'
        })
          .then(() => {
           this.saveImage2Server();
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: "放弃修改"
            })
           this.getData();
          });
  }

  private clickCustomer(row):void{
    this.currentCustomer=row;
  }

  private getNearByU(y, item): object {
    let nearByU = Linq.from(this.rackVolemes).firstOrDefault(
      s => y >= s.u.y && y < s.u.y + this.uHeight
    );
    if (nearByU != null) {
      return {
        ap: new AreaPoint(nearByU.u.x, nearByU.u.y),
        uNumber: nearByU.id
      };
    }
    return { ap: new AreaPoint(item.x, item.y), uNumber: 0 };
  }
  //移动获取临近设备
  //返回值mark
  //0:有交叉设备 只判断移动设备的上边界是否在可能交叉的设备内
  //1:无交叉设备 且移动的设备超出了机柜边界
  //2：无交叉设备 可以正常移动
  //3：有交叉设备 在只判断上边界获取不到交叉设备时
  //4:有交叉设备的时候 只能由下向上移动设备
  private getNearByElement(y, item): object {
    let nearBy = Linq.from(this.rackDevices)
      .where(s => s._data.id != item._data.id)
      .toArray();
    let nearByE = Linq.from(nearBy).firstOrDefault(
      x => y >= x.y && y < x.y + parseInt(x.rect.height)
      // ||(y + parseInt(item.rect.height) - this.uHeight >= x.y &&
      //   y + parseInt(item.rect.height) - this.uHeight < x.y + parseInt(x.rect.height)) ||
      // (y <= x.y && y + parseInt(item.rect.height) - this.uHeight >= x.y + parseInt(x.rect.height))
    );
    if (nearByE != undefined || nearByE != null) {
      if (
        y >
          this.baseHeight +
            this.uHeight * (this.rackVolume - parseInt(item._data.location)) ||
        y >
          this.baseHeight +
            this.uHeight *
              (this.rackVolume -
                parseInt(item._data.location) -
                parseInt(item._data.height))
      ) {
        return { isCan: false, nearByE: nearByE, mark: 4 };
      } else {
        return { isCan: false, nearByE: nearByE, mark: 0 };
      }
    }
    nearByE = Linq.from(nearBy).firstOrDefault(
      x =>
        (y >= x.y && y < x.y + parseInt(x.rect.height)) ||
        (y + parseInt(item.rect.height) - this.uHeight >= x.y &&
          y + parseInt(item.rect.height) - this.uHeight <
            x.y + parseInt(x.rect.height)) ||
        (y <= x.y &&
          y + parseInt(item.rect.height) - this.uHeight >=
            x.y + parseInt(x.rect.height))
    );
    if (nearByE != undefined || nearByE != null) {
      if (
        y >
          this.baseHeight +
            this.uHeight * (this.rackVolume - parseInt(item._data.location)) ||
        y >
          this.baseHeight +
            this.uHeight *
              (this.rackVolume -
                parseInt(item._data.location) -
                parseInt(item._data.height))
      ) {
        return { isCan: false, nearByE: nearByE, mark: 4 };
      } else {
        return { isCan: false, nearByE: nearByE, mark: 3 };
      }
    }

    if (
      y < this.rackVolemes[0].u.y ||
      y + parseInt(item.rect.height) - this.uHeight >
        this.rackVolemes[this.rackVolemes.length - 1].u.y ||
      y > this.rackVolemes[this.rackVolemes.length - 1].u.y ||
      y + parseInt(item.rect.height) - this.uHeight < this.rackVolemes[0].u.y
    ) {
      return { isCan: false, nearByE: null, mark: 1 };
    }
    return { isCan: true, nearByE: null, mark: 2 };
  }
  //设置高度获取临近设备
  private getNearByElement1(y, item): boolean {
    let nearBy = Linq.from(this.rackDevices)
      .where(s => s._data.id != item._data.id)
      .toArray();
    let nearByE = Linq.from(nearBy).firstOrDefault(
      x =>
        (y >= x.y && y < x.y + x.rect.height) ||
        (y - (parseInt(this.currentElement.height) - 1) * this.uHeight >= x.y &&
          y - (parseInt(this.currentElement.height) - 1) * this.uHeight <
            x.y + x.rect.height)
    );
    if (nearByE != undefined || nearByE != null) {
      return false;
    }
    if (
      y - (parseInt(this.currentElement.height) - 1) * this.uHeight <
        this.rackVolemes[0].u.y ||
      y > this.rackVolemes[this.rackVolemes.length - 1].u.y ||
      y - (parseInt(this.currentElement.height) - 1) * this.uHeight >
        this.rackVolemes[this.rackVolemes.length - 1].u.y ||
      y < this.rackVolemes[0].u.y
    ) {
      return false;
    }
    return true;
  }
  /***
   * 放大缩小
   * @param value
   */
  private onZoom(value) {
    let stage = this.$refs.areaStage.getStage();
    let percent = 1.0 + (value - 50.0) / 50.0;
    stage.scaleX(percent);
    stage.scaleY(percent);
    this.lastScalePercent = value;
  }

  /***
   * 当光标进入到画布的时候,更改鼠标指针
   * @param item
   * @param event
   */
  private changeCursor() {
    this.$refs.areaStage.getStage().container().style.cursor = "pointer";
  }
  private rowClass({ row, rowIndex }) {
                    return 'text-Align:center';
  }
  //单元格样式
  private cleeStyle({ row, column, rowIndex, columnIndex }) {
                    return 'text-Align:center';
  }

  private backUp():void{
    window.open('/v5/ResourceMN/CabinetResMN.aspx','_self');
  }
  // @Watch("$route.params.taskid")
  // async onChildChanged(val: string, oldVal: string) {
  //   await this.getData();
  // }
  @Watch("$route.params.rackid")
  async onChildChanged(val: string, oldVal: string) {
    await this.getData();
  }
  @Watch("$route.params.id")
  async onChildChanged(val: string, oldVal: string) {
    await this.getData();
  }
  async mounted() {
    var pageType=this.$route.params.pagetype;
    if(pageType!=undefined){
      if(parseInt(pageType)==1){
        this.parentPage='机房平面图';
      }else if(parseInt(pageType)==2){
        this.parentPage='机柜管理';
        
      }else if(parseInt(pageType)==3){
        this.parentPage='机房平面图';
        
      }
    }
    await this.getData();
  }
}
</script>
<style  lang="scss">
.rackKeyApp {
  //padding: 10px;
}
.grid-content {
  margin-left: 10px;
  // margin-right: auto;
  // width: 50%;
}
.box-card {
  margin-top: 10px;
  min-height: 400px;
}
.pos_nav {
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.el-dialog__header {
  padding: 0px 40px 0px !important;
}
.el-dialog__body {
  padding: 10px 0px !important;
  color: #606266;
  font-size: 14px;
}
#elCardContent {
  margin: 20px 20px;
}
#navRack {
  margin-left: 20px;
}

table .tdleft {
  text-align: right;
  width: 115px;
}
table .tdright {
  text-align: left;
  width: 150px;
}
table .tdleft,
table .tdright {
  font-size: 14px;
}
</style>

