<template>
    <div v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-container>
            <!--<el-header>Header</el-header>-->
            <el-container>
                <el-aside width="200px" class="aside" v-if="areaTreeVisible">
                    <el-tree :data="nodeTree"
                             style="height: 100%;"
                             node-key="id"
                             default-expand-all
                             v-on:node-click="elNodeClick"
                             :expand-on-click-node="false">
                        <template>
                        <span class="custom-tree-node" slot-scope="scope">
                            <span v-if="scope.data.selected" v-text="scope.node.label"
                                  style="color: #ce7b29 !important;font-weight:bold !important;"></span>
                            <span v-else v-text="scope.node.label"></span>
                        </span>
                        </template>
                    </el-tree>
                </el-aside>
                <el-main class="main" v-bind:class="{ width100: !areaTreeVisible }">
                    <i v-if="areaTreeVisible" class="el-icon-d-arrow-left collapse"
                       v-on:click="areaTreeVisible=!areaTreeVisible"></i>
                    <i v-else class="el-icon-d-arrow-right collapse" v-on:click="areaTreeVisible=!areaTreeVisible"></i>
                    <div class="block">
                        <span class="demonstration">缩放</span>
                        <el-slider v-model="scalePercent" :show-tooltip="false" v-on:change="onZoom"
                                   style="width: 200px;"></el-slider>
                    </div>
                    <el-row style="height: 100%;">
                        <el-col :span="3">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>工具箱</span>
                                    <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                                </div>
                                <div>
                                    <el-checkbox v-model="editSetting.autoPin2Grid"
                                                 v-on:change="editSettingPin2GridChange">自动网格对齐
                                    </el-checkbox>
                                    <el-checkbox v-model="editSetting.autoTopPin2Grid"
                                                 v-on:change="editSettingLeftPin2GridChange">水平方向网格对齐
                                    </el-checkbox>
                                    <el-checkbox v-model="editSetting.autoLeftPin2Grid"
                                                 v-on:change="editSettingTopPin2GridChange">垂直方向网格对齐
                                    </el-checkbox>
                                    <hr>
                                    <template v-for="s in room2dShapes">
                                        <div style="width: 30px;height: 30px;display: inline-block;overflow: hidden;margin-left: 10px;"
                                             v-if="s.base64"
                                             draggable='true'
                                             v-on:dragover="dragOverToolbox($event,s)"
                                             v-on:dragend="dragEndToolbox($event,s)">
                                            <img v-bind:src="'data:image/jpeg;base64,'+s.base64" style="width: 30px;" />
                                            <!--<svg t="1554169555150" class="icon" viewBox="0 0 50 40" version="1.1"-->
                                                 <!--fill="lightgray"-->
                                                 <!--xmlns="http://www.w3.org/2000/svg" p-id="14631"-->
                                                 <!--xmlns:xlink="http://www.w3.org/1999/xlink">-->
                                                <!--<defs></defs>-->
                                                <!--<path :d="s.svgPath" p-id="14632"></path>-->
                                            <!--</svg>-->
                                        </div>
                                        <div style="width: 30px;height: 30px;border: black 1px solid;display: inline-block;margin-left: 10px;"
                                             v-else-if="s.type==='矩形'"
                                             draggable='true'
                                             v-on:dragover="dragOverToolbox($event,s)"
                                             v-on:dragend="dragEndToolbox($event,s)">
                                        </div>
                                        <div style="width: 30px;height: 30px;border: black 1px solid;border-radius: 50%;display: inline-block;margin-left: 10px;"
                                             v-else-if="s.type==='圆形'"
                                             draggable='true'
                                             v-on:dragover="dragOverToolbox($event,s)"
                                             v-on:dragend="dragEndToolbox($event,s)">
                                        </div>
                                        <br/>
                                    </template>
                                    <hr>
                                    <el-button size="mini" type="primary" v-on:click="showAddRack">批量添加机柜</el-button>
                                </div>
                            </el-card>
                            <hr>
                            <el-collapse v-model="helpText" accordion>
                                <el-collapse-item name="1">
                                    <template slot="title">
                                        帮助信息&nbsp;<i class="header-icon el-icon-info"></i>
                                    </template>
                                    <div>1.<span style="color:red;">鼠标双击</span>元素可调整元素的尺寸,角度,再次双击,可完成编辑</div>
                                    <div>2.<span style="color:red;">鼠标单击</span>元素在右侧会列出元素的信息,可编辑元素信息</div>
                                    <div>3.<span style="color:red;">鼠标拖动</span>元素可调整其位置</div>
                                </el-collapse-item>
                            </el-collapse>
                        </el-col>
                        <el-col :span="18" style="height: 100%;">
                            <div class="canvas" ref="canvasContainer">
                                <div v-if="toolTipsVisible && currentElement && currentElement.toolTips && currentElement.toolTips.length>0"
                                     v-show="toolTipsVisible && currentElement && currentElement.toolTips && currentElement.toolTips.length>0"
                                     v-bind:style="{ left: toolTipPosition.x+'px', top: toolTipPosition.y + 'px' }"
                                     style="position: fixed; display: none; z-index: 10000; filter: alpha(Opacity=80);">
                                    <el-card class="box-card">
                                        <div slot="header" class="clearfix">
                                            <span>详细信息</span>
                                            <el-button style="float: right; padding: 3px 0" type="text"
                                                       v-on:click="toolTipsVisible=false"> 关闭
                                            </el-button>
                                        </div>
                                        <div v-for="tip in currentElement.toolTips" class="text item">
                                            {{tip.title}}:{{tip.content}}
                                        </div>
                                    </el-card>
                                </div>
                                <v-stage ref="areaStage" v-on:mouseenter="changeCursor"
                                         :draggable="true"
                                         v-on:mousemove="dragInStageCursor"
                                         :config="imageConfig.stageConfig">
                                    <v-layer ref="layer">
                                        <v-text :config="locationZero.centerText"></v-text>
                                        <v-line :config="point" v-for="point in room2dAuxiliaries"></v-line>
                                        <v-line :config="locationZero.vertical"></v-line>
                                        <v-line :config="locationZero.horizontal"></v-line>
                                        <v-group :config="item" v-for="(item,index) in imageConfig.elements"
                                                 v-on:dragend="adsorptionTest($event,item)"
                                                 v-bind:ref="item._data.id"
                                                 v-on:mouseover="showItemToolTips($event,item._data)"
                                                 v-on:mouseleave="fadeToolTips"
                                                 v-on:dblclick="transformElement($event,item,index)"
                                                 v-on:click="onElementClick(item,item._data)"
                                        >
                                            <v-rect v-if="item._data.shape.type==='矩形'"
                                                    ref="shape"
                                                    :config="item.rect"></v-rect>
                                            <v-path v-else-if="item._data.shape.type==='SVG'"
                                                    ref="shape"
                                                    :config="item.path"></v-path>
                                            <v-text :config="item.text" v-bind:ref="'text'+item._data.id"></v-text>
                                            <v-transformer ref="transformer">
                                            </v-transformer>
                                        </v-group>
                                        <v-transformer ref="transformer"></v-transformer>
                                    </v-layer>
                                </v-stage>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>属性</span>
                                    <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                                </div>
                                <div>
                                    <table v-if="currentElement">
                                        <tr>
                                            <td style="width: 100px;">显示名称:</td>
                                            <td style="width:120px;">
                                                <el-input v-model="currentElement.name" size="mini"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>形状:</td>
                                            <td>
                                                <!--<el-select v-model="currentElement.shapeId" value="" placeholder="请选择">-->
                                                <!--<el-option v-for="shape in room2dShapes"-->
                                                <!--:key="shape.id"-->
                                                <!--:label="shape.name"-->
                                                <!--:value="shape.id">-->
                                                <!--</el-option>-->
                                                <!--</el-select>-->
                                                <el-input size="mini" v-model="currentElement.shape.type"></el-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>横坐标</td>
                                            <td>
                                                <el-input-number size="mini" v-model="currentElement.x"></el-input-number>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>纵坐标</td>
                                            <td>
                                                <el-input-number size="mini" v-model="currentElement.y"></el-input-number>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>宽度</td>
                                            <td>
                                                <el-input-number size="mini" v-model="currentElement.width"></el-input-number>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>高度</td>
                                            <td>
                                                <el-input-number size="mini" v-model="currentElement.height"></el-input-number>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>旋转角度</td>
                                            <td>
                                                <el-input-number size="mini" v-model="currentElement.rotation"></el-input-number>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>关联机柜资源</td>
                                            <td>
                                                <!--<el-input size="mini" v-if="currentElement.resource"-->
                                                <!--v-model="currentElement.resource.name"></el-input>-->
                                                <el-autocomplete
                                                        v-if="currentElement.resource"
                                                        v-model="currentElement.resource.name"
                                                        value-key="name"
                                                        :trigger-on-focus="false"
                                                        size="mini"
                                                        :fetch-suggestions="queryRack"
                                                        v-on:select="handleRackSelected"
                                                        placeholder="请输入机柜名称"
                                                ></el-autocomplete>
                                                <el-autocomplete
                                                        v-else
                                                        v-model="currentElement.autoCompleteName"
                                                        value-key="name"
                                                        :trigger-on-focus="false"
                                                        size="mini"
                                                        :fetch-suggestions="queryRack"
                                                        v-on:select="handleRackSelected"
                                                        placeholder="请输入机柜名称"
                                                ></el-autocomplete>
                                            </td>
                                        </tr>
                                    </table>
                                    <el-button v-if="currentElement" type="primary" size="mini"
                                               v-on:click="applyCurrentElement">应用
                                    </el-button>
                                    <el-button v-if="currentElement" type="primary" size="mini"
                                               v-on:click="deleteElement">删除
                                    </el-button>
                                </div>
                            </el-card>
                            <div>
                                <el-button style="float: right;" type="primary" size="mini"
                                           v-on:click="saveImage2Server">提交画布
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog title="机柜视图" :visible.sync="rackViewDialogVisible" :fullscreen="true" :close-on-click-modal="false">
            <div>
                <router-view></router-view>
            </div>
        </el-dialog>
        <el-dialog title="新增机柜信息"
                   width="600px"
                   :close-on-click-modal="false"
                   :visible.sync="dialogShowAddRack">
            <template>
                <el-checkbox v-model="isBatchAdd">批量添加</el-checkbox>
                <div>
                    <table>
                        <tr v-if="!isBatchAdd">
                            <td style="width: 120px;">显示名称:</td>
                            <td>
                                <el-input size="mini" v-model="batchAdd.displayNamePrefix"></el-input>
                            </td>
                        </tr>
                        <tr v-else>
                            <td style="width: 120px;">显示名称前缀:</td>
                            <td>
                                <el-input v-model="batchAdd.displayNamePrefix" size="mini"></el-input>
                            </td>
                        </tr>
                        <tr v-if="!isBatchAdd">
                            <td style="width: 120px;">机柜名称:</td>
                            <td>
                                <el-input size="mini" v-model="batchAdd.namePrefix"></el-input>
                            </td>
                        </tr>
                        <tr v-else>
                            <td style="width: 120px;">机柜名称前缀:</td>
                            <td>
                                <el-input v-model="batchAdd.namePrefix" size="mini"></el-input>
                            </td>
                        </tr>
                        <tr v-if="!isBatchAdd">
                            <td>机柜编码:</td>
                            <td>
                                <el-input size="mini" v-model="batchAdd.codePrefix"></el-input>
                            </td>
                        </tr>
                        <tr v-else>
                            <td>机柜编码前缀:</td>
                            <td>
                                <el-input v-model="batchAdd.codePrefix" size="mini"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>起始横坐标:</td>
                            <td>
                                <el-input-number v-model="batchAdd.x" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>起始纵坐标:</td>
                            <td>
                                <el-input-number v-model="batchAdd.y" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>宽度:</td>
                            <td>
                                <el-input-number v-model="batchAdd.width" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>高度:</td>
                            <td>
                                <el-input-number v-model="batchAdd.height" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr v-if="isBatchAdd">
                            <td>机柜数量:</td>
                            <td>
                                <el-input-number v-model="batchAdd.total" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr v-if="isBatchAdd">
                            <td>每行数量:</td>
                            <td>
                                <el-input-number v-model="batchAdd.columnCount" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr v-if="isBatchAdd">
                            <td>机柜间距:</td>
                            <td>
                                <el-input-number v-model="batchAdd.columnSpan" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr v-if="isBatchAdd">
                            <td>行间距:</td>
                            <td>
                                <el-input-number v-model="batchAdd.rowSpan" size="mini"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>机柜类型:</td>
                            <td>
                                <el-select placeholder="请选择机柜类型" size="mini" v-model="batchAdd.rackCategory" value="">
                                    <el-option
                                            v-for="item in rackTypes"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>机柜容量(U数):</td>
                            <td>
                                <el-input-number :min="0" :max="64" label="机柜容量(U数)" size="mini"
                                                 v-model="batchAdd.volume"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>额定功率(W):</td>
                            <td>
                                <el-input-number :min="0" label="额定功率(W)" size="mini"
                                                 v-model="batchAdd.electric"></el-input-number>
                            </td>
                        </tr>
                        <tr>
                            <td>最大承重(kg):</td>
                            <td>
                                <el-input-number :min="0" label="最大承重(kg)" size="mini"
                                                 v-model="batchAdd.bearingCapacity"></el-input-number>
                            </td>
                        </tr>
                    </table>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button v-on:click="dialogShowAddRack = false" size="mini">取 消</el-button>
                <el-button type="primary" v-on:click="addRack2Image" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Config} from "../../core/config"
    import ElementUI from 'element-ui'
    import Linq from "linq"
    import Axios from 'axios'
    import S from '../../../../node_modules/string'
    import Uuid from 'uuid'
    import VueKonva from '../../../../node_modules/vue-konva';
    import 'element-ui/lib/theme-chalk/index.css'
    import {ElNode} from "../../core/elNode";
    import {INode} from "../../core/iNode";
    import {Area} from "../../core/area";
    import {AreaElement} from "../../core/areaElement";
    import {AreaPoint} from "../../core/point";
    import {Room2dShape} from "../../core/shape";
    import {Rack} from "../../core/rack";
    // import RackKey from 'RackKey.vue';

    // noinspection TypeScriptUnresolvedFunction
    Vue.use(ElementUI);
    Vue.use(VueKonva);

    // @Component({
    //     components: {
    //         RackKey
    //     }
    // })

    @Component
    export default class Edit2d extends Vue {
        private loading: boolean = false;
        private rackViewDialogVisible: boolean = false;
        private dialogShowAddRack: boolean = false;//批量添加机柜视图显示隐藏
        private isBatchAdd: boolean = false;//是否批量添加机柜
        private batchAdd = {
            x: 0,
            y: 0,
            volume: 42,
            rackCategory: 1,
            width: 33,
            height: 20,
            namePrefix: '',
            displayNamePrefix: '',
            codePrefix: '',
            total: 0,
            columnCount: 5,
            rowCount: 5,
            columnSpan: 0,
            rowSpan: 1,
            electric: 0,
            bearingCapacity: 0
        };
        private rackTypes = [
            {name: "普通机架", value: 1},
            {name: "配电柜", value: 2},
            {name: "配线柜", value: 3},
            {name: "ODF机架", value: 4},
            {name: "DDF机架", value: 5}
        ]; //机柜类型
        private toolTipsVisible: boolean = false;//控制tooltip的显示隐藏
        private toolTipPosition: AreaPoint = new AreaPoint(0, 0);
        private areaTreeVisible: boolean = false;//控制区域树节点显示隐藏
        private nodeTree: Array<ElNode> = [];//节点树
        private currentArea: Area;//当前选中树节点
        private scaleBy: number = 1.2;
        private scalePercent: number = 50;
        private lastScalePercent: number = 50;
        private currentElements: Array<AreaElement>;//当前区域的元素集合
        private currentElement: AreaElement = null;
        private imageKeys: Array<> = [];
        private room2dShapes: Array<Room2dShape> = [];
        private room2dAuxiliaries: Array<> = [];//辅助线的点
        private auxiliarySpacing = 20;
        private helpText = "";
        private thumbnails = null;
        private stageMousePoint: AreaPoint = new AreaPoint(0, 0);//用来记录鼠标在画布内的指针
        private editSetting: object = {
            autoPin2Grid: true,//自动对齐到网格
            autoLeftPin2Grid: true,//自动对齐到左边网格
            autoTopPin2Grid: true,//自动对齐到上方网格
            pin2NearbyItem: true,//自动吸附到临近元素
        };
        /***
         * 平面图的canvas配置项
         */
        private imageConfig: object = {
            stageConfig: {
                x: 0,
                y: 0,
                width: 2000,
                height: 2000,
                draggable: true
            },
            elements: []
        };

        /***
         * 我们的画布的中心点坐标
         */
        private centerPoint: AreaPoint = new AreaPoint(0, 0);

        private locationZero: object = {
            centerText: {
                fontSize: 13,
                x: 5, y: 5,
                text: `(${this.centerPoint.x},${this.centerPoint.y})`,
                fill: "black"
            },
            vertical: {
                points: [0, 0, 30, 0],
                x: 0, y: 0,
                stroke: 'green',
                tension: 1
            },
            horizontal: {
                points: [0, 0, 0, 30],
                x: 0, y: 0,
                stroke: 'green',
                tension: 1
            }
        };

        async mounted() {
            this.drawAuxiliaryLine();
            await this.loadShapes();
            await this.loadImageKeys();
            await this.loadNodeTree();
            this.imageConfig.stageConfig.draggable = true;
        }

        /***
         * 作辅助线
         */
        private drawAuxiliaryLine() {
            let pCount = 2000 / this.auxiliarySpacing;
            for (let row = 0; row <= pCount; ++row) {
                this.room2dAuxiliaries.push({
                    points: [0, row * this.auxiliarySpacing, 2000, row * this.auxiliarySpacing],
                    stroke: 'gray',
                    strokeWidth: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round',
                    dash: [3, 3]
                });
                this.room2dAuxiliaries.push({
                    points: [row * this.auxiliarySpacing, 0, row * this.auxiliarySpacing, 2000],
                    stroke: 'gray',
                    strokeWidth: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round',
                    dash: [3, 3]
                })
                // for(let col =0; col <pCount;++col){
                //     this.auxiliaries.push({
                //         x: row * spacing, y: col * spacing, radius: 1, fillColor: 'black', stroke: 'black', strokeWidth: 1
                //     })
                // }
            }
        }

        private editSettingPin2GridChange() {
            if (this.editSetting.autoPin2Grid) {
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoLeftPin2Grid = true;
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoTopPin2Grid = true;
            } else {
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoLeftPin2Grid = false;
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoTopPin2Grid = false;
            }
        }

        private editSettingLeftPin2GridChange() {
            if (this.editSetting.autoLeftPin2Grid) {
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoTopPin2Grid = false;
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoPin2Grid = false;
            }
        }

        private editSettingTopPin2GridChange() {
            if (this.editSetting.autoTopPin2Grid) {
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoLeftPin2Grid = false;
                // noinspection TypeScriptUnresolvedVariable
                this.editSetting.autoPin2Grid = false;
            }
        }

        /***
         *加载所有的形状
         */
        private async loadShapes() {
            let url = `${Config.baseUrl}/api/ShapeManager/GetShapes?r=${Math.random()}&pageIndex=1&pageSize=10000`;
            let resp = await Axios.get(url);
            if (!resp.data) return;
            this.room2dShapes = resp.data;
        }

        /***
         * 远程查询机柜信息
         */
        private remoteRacks = [];
        private queryRackDelay;

        private async queryRack(keyword, cb) {
            if (S(keyword).isEmpty()) {
                return;
            }
            clearTimeout(this.queryRackDelay);
            let url = `${Config.baseUrl}/api/Resource/GetRacks?keyword=${encodeURIComponent(keyword)}`;
            this.queryRackDelay = setTimeout(async () => {
                let resp = await Axios.get(url);
                cb(resp.data);
            }, 300);
        }

        private handleRackSelected(rack) {
            this.currentElement.resource = rack;
        }

        /***
         * 加载图例
         */
        private async loadImageKeys(): void {
            let url = `${Config.baseUrl}/api/Room2D/GetCabinetLegend`;
            let resp = await Axios.get(url);
            if (!resp.data) return;
            this.imageKeys = resp.data;
        }

        /***
         * 加载节点区域树
         */
        private async loadNodeTree(): void {
            let url = `${Config.baseUrl}/api/Room2D/GetNodeTree`;
            let resp = await Axios.get(url);
            if (resp.data) {
                this.nodeTree = resp.data;

                //获取第一个区域用于页面加载时默认选中第一个
                function getFirstArea(tree: Array<ElNode>) {
                    if (!tree || tree.length < 1) return null;
                    for (let i = 0; i < tree.length; ++i) {
                        let item = tree[i];
                        if (item.areas && item.areas.length > 0) return item.areas[0];
                        if (item.children && item.children.length > 0) {
                            let first = getFirstArea(<Array<ElNode>>item.children);
                            if (first) return first;
                        }
                    }
                    return null;
                }

                Linq.from(this.nodeTree).forEach(x => {
                    this.buildAreaForTree(x);
                });
                let firstArea = getFirstArea(this.nodeTree);
                this.elNodeClick(firstArea);
            }
        }

        private dragOverToolbox($event, item) {
            $event.preventDefault();
        }

        private dragEndToolbox($event, item) {
            let drawShapeInStage = setTimeout(() => {
                let nowPoint = new AreaPoint(this.stageMousePoint.x, this.stageMousePoint.y);
                if (nowPoint.x < 0 || nowPoint.y < 0) return;
                let elmt = new AreaElement();
                elmt.id = Uuid.v4();
                elmt.width = 20;
                elmt.height = 20;
                elmt.x = nowPoint.x;
                elmt.y = nowPoint.y;
                elmt.fillColor = "lightgray";
                elmt.shape = item;
                // elmt.shape.type = "矩形";
                let group = this.createGroup(elmt);
                this.currentElements.push(elmt);
                this.imageConfig.elements.push(group);
                clearTimeout(drawShapeInStage);
            }, 100);
        }

        private showAddRack() {
            this.batchAdd = {
                x: 0,
                y: 0,
                volume: 42,
                rackCategory: 1,
                width: 33,
                height: 20,
                namePrefix: '',
                displayNamePrefix: '',
                codePrefix: '',
                total: 0,
                columnCount: 5,
                rowCount: 5,
                columnSpan: 0,
                rowSpan: 1,
                electric: 0,
                bearingCapacity: 0
            };
            this.dialogShowAddRack = true;
        }

        private addRack2Image() {
            if (S(this.batchAdd.namePrefix).isEmpty()) {
                this.$alert("请填写机柜名称");
                return;
            }
            if (S(this.batchAdd.displayNamePrefix).isEmpty()) {
                this.$alert("请填写机柜在平面图中的显示名称");
                return;
            }
            if (S(this.batchAdd.codePrefix).isEmpty()) {
                this.$alert("请填写机柜编码");
                return;
            }
            if (this.batchAdd.x < 0 || this.batchAdd.x > 2000 || this.batchAdd.y < 0 || this.batchAdd.y > 2000) {
                this.$alert("坐标必须是0~2000的范围");
                return;
            }
            let rectShape = Linq.from(this.room2dShapes).firstOrDefault(x => x.type === "矩形");
            let drawShapeInStage = setTimeout(() => {
                if (this.isBatchAdd) {
                    if (this.batchAdd.total < 1) {
                        this.$alert("请填写机柜数量");
                        return;
                    }
                    this.batchAdd.rowCount = Math.floor((this.batchAdd.total - 1) / this.batchAdd.columnCount + 1);
                    for (let i = 1; i <= this.batchAdd.total; ++i) {
                        let rowIndex = Math.floor((i - 1) / this.batchAdd.columnCount + 1);//计算当前机柜在第几行
                        let colIndex = Math.floor((i - 1) % this.batchAdd.columnCount + 1);//计算当前机柜在第几列
                        let elmt = new AreaElement();
                        elmt.id = Uuid.v4();
                        elmt.name = `${this.batchAdd.displayNamePrefix}${rowIndex}${colIndex}`;
                        elmt.width = this.batchAdd.width;
                        elmt.height = this.batchAdd.height;
                        elmt.x = this.batchAdd.x + (this.batchAdd.width + this.batchAdd.columnSpan) * colIndex;
                        elmt.y = this.batchAdd.y + (this.batchAdd.height + this.batchAdd.rowSpan) * rowIndex;
                        elmt.fillColor = "lightgray";
                        elmt.shape = rectShape;
                        elmt.resource = new Rack();
                        elmt.resource.name = `${this.batchAdd.namePrefix}${rowIndex}${colIndex}`;
                        let group = this.createGroup(elmt);
                        this.currentElements.push(elmt);
                        this.imageConfig.elements.push(group);
                    }
                } else {
                    let elmt = new AreaElement();
                    elmt.id = Uuid.v4();
                    elmt.name = this.batchAdd.displayNamePrefix;
                    elmt.width = this.batchAdd.width;
                    elmt.height = this.batchAdd.height;
                    elmt.x = this.batchAdd.x;
                    elmt.y = this.batchAdd.y;
                    elmt.fillColor = "lightgray";
                    elmt.shape = rectShape;
                    elmt.resource = new Rack();
                    elmt.resource.name = this.batchAdd.namePrefix;
                    let group = this.createGroup(elmt);
                    this.currentElements.push(elmt);
                    this.imageConfig.elements.push(group);
                }
                this.dialogShowAddRack = false;
                clearTimeout(drawShapeInStage);
            }, 100);
        }

        private selectedShapeName = "";

        /***
         * 处理后端过来的节点树的数据,将area添加到节点上
         * 用于element-tree显示数据
         * @param parent
         */
        private buildAreaForTree(parent: ElNode): void {
            if (parent === null) return;
            if (parent.areas && parent.areas.length > 0) {
                if (!parent.children) {
                    parent.children = [];
                    Linq.from(parent.children).forEach(x => {
                        this.buildAreaForTree(<ElNode>x);
                    })
                }
                parent.children = parent.children.concat(parent.areas);
            }
        }

        /***
         * 当树节点点击后触发的事件
         * @param area
         */
        private elNodeClick(area: INode): void {
            //非最终节点,选中不做任何处理
            if (area.children && area.children.length > 0) {
                return;
            }
            this.currentArea = <Area>area;
            this.$set(area, 'selected', true);
            this.showAreaElements(area);
        }

        /***
         * 点击元素的事件
         * @param elementConfig
         * @param element
         */
        private onElementClick(elementConfig, element: AreaElement) {
            // this.currentElementConfig=elementConfig;
            // this.remoteRacks=[element.resource];
            if (element.resource) element.autoCompleteName = element.resource.name;
            this.currentElement = element;
            // clearTimeout(this.fadeTimeout);
            // this.toolTipsVisible = false;
            // this.rackViewDialogVisible = true;
            // this.$router.replace(`/show2d/${element.id}/rack`);
        }

        /***
         * 编辑当前选中的平面图元素
         */
        private applyCurrentElement(): void {
            let group = Linq.from(this.$refs[this.currentElement.id]).firstOrDefault();
            // noinspection TypeScriptUnresolvedVariable
            group.config.x = this.currentElement.x;
            // noinspection TypeScriptUnresolvedVariable
            group.config.y = this.currentElement.y;
            let index = -1;//找到当前选中项的索引
            for (let i = 0; this.imageConfig.elements.length; ++i) {
                let elmt = this.imageConfig.elements[i];
                if (this.currentElement.id == elmt._data.id) {
                    index = i;
                    break;
                }
            }
            if (index == -1) return;
            let shape = this.$refs['shape'][index];
            shape.config.width = this.currentElement.width;
            shape.config.height = this.currentElement.height;
            shape.config.rotation=this.currentElement.rotation;
            let text = Linq.from(this.$refs['text' + this.currentElement.id]).firstOrDefault();
            if (text) {
                // noinspection TypeScriptUnresolvedVariable
                text.config.text = this.currentElement.name;
            }
        }

        private deleteElement() {
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let imageIndex = -1;
                for (let i = 0; i < this.imageConfig.elements.length; i++) {
                    let item = this.imageConfig.elements[i];
                    if (item._data.id === this.currentElement.id) {
                        imageIndex = i;
                        break;
                    }
                }
                if (imageIndex > -1) this.imageConfig.elements.splice(imageIndex, 1);
                let elementKey = -1;
                for (let i = 0; i < this.currentElements.length; i++) {
                    let item = this.currentElements[i];
                    if (item.id === this.currentElement.id) {
                        imageIndex = i;
                        break;
                    }
                }
                if (elementKey > -1) this.currentElements.splice(imageIndex, 1);
                this.currentElement = null;
            }).catch(() => {
                console.log("取消删除")
            });
        }

        /***
         * 显示区域下的所有节点
         * @param area
         */
        private async showAreaElements(area: Area): void {
            this.loading = true;
            try {
                let url = `${Config.baseUrl}/api/Room2D/GetAreaElements?areaId=${area.id}`;
                let resp = await Axios.get(url);
                if (resp.data) {
                    this.currentElements = resp.data;
                    // noinspection TypeScriptUnresolvedVariable
                    this.imageConfig.elements = [];
                    this.drawImage();
                }
            } catch (e) {
                console.log(e);
            }
            this.loading = false;
        }

        /***
         * 可视化调整物件的尺寸,旋转量
         */
        private transformElement(event, element, index) {
            if (element._data.shape.type != "矩形") {//如果形状不是矩形,不允许修改尺寸
                return;
            }
            let trans = this.$refs.transformer[index].getStage();
            let target = this.$refs.shape[index].getStage();
            if (element.isTransforming) {
                element.isTransforming = false;
                this.currentElement.rotation=Math.round(trans.rotation());
                let parentGroup = target.parent.VueComponent;
                // let delay = setTimeout(() => {
                parentGroup.config.width = trans.width();
                parentGroup.config.height = trans.height();
                let fixX = Math.round(parentGroup.config.x + trans.x());
                let fixY = Math.round(parentGroup.config.y + trans.y());
                let fixW = Math.round(target.width() * target.scaleX());
                let fixH = Math.round(target.height() * target.scaleY());
                parentGroup.config.x = fixX;
                parentGroup.config.y = fixY;
                parentGroup.config.width = fixW;
                parentGroup.config.height = fixH;
                target.VueComponent.config.width = fixW;
                target.VueComponent.config.height = fixH;
                target.VueComponent.config.scale = {x: 1, y: 1};

                element._data.x = fixX;
                element._data.y = fixY;
                element._data.width = fixW;
                element._data.height = fixH;
                trans.detach(target);
                //     clearTimeout(delay);
                // }, 10);
            } else {
                element.isTransforming = true;
                trans.attachTo(target);
            }
            this.$forceUpdate();
        }

        /***
         * 显示元素的tooltip
         * @param $event
         * @param elmt
         */
        private showItemToolTips($event, elmt: AreaElement) {
            // this.toolTipPosition = new AreaPoint($event.evt.x, $event.evt.y);
            // this.currentElement = elmt;
            // this.toolTipsVisible = true;
        }

        /***
         * 延迟5s自动隐藏tooltip
         */
        private fadeTimeout;

        private fadeToolTips() {
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = setTimeout(() => {
                this.toolTipsVisible = false;
            }, 5 * 1000);
        }

        /***
         * 绘制机房平面图
         */
        private drawImage(): void {
            let self = this;
            let elmtList = Linq.from(this.currentElements);
            elmtList.forEach(elmt => {
                if (elmt.shape === null) return;
                let group = this.createGroup(elmt);
                self.imageConfig.elements.push(group);
            });
        }

        private createGroup(elmt) {
            let keys = Linq.from(this.imageKeys);
            let svtData = elmt.shape.svgPath;
            let key = elmt.resource && keys.firstOrDefault(x => x.name === elmt.resource.type);
            let group = {
                name: elmt.id,
                draggable: true,
                _data: elmt,
                x: elmt.x,
                y: elmt.y,
                path: {
                    x: 0, y: 0,
                    scaleX: 1.1,
                    scaleY: 0.65,
                    offset: {x: -1, y: 0},
                    rotation: elmt.rotation,
                    data: svtData,
                    stroke: 'black',
                    strokeWidth: 0.3,
                    fill: key ? key.fillColor : elmt.fillColor
                },
                rect: {
                    x: 0, y: 0,
                    offset: {
                        x: elmt.offsetX,
                        y: elmt.offsetY
                    },
                    rotation: elmt.rotation,
                    width: elmt.width,
                    height: elmt.height,
                    stroke: 'black',
                    strokeWidth: 0.3,
                    fill: key ? key.fillColor : elmt.fillColor
                },
                text: {
                    fontSize: 11,
                    _data: elmt,
                    x: 0.5, y: 5,
                    text: elmt.name,
                    fill: "black"
                }
            };
            return group;
        }

        private async saveImage2Server(): void {
            let url = `${Config.baseUrl}/api/Room2D/AddOrUpdateElements?areaId=${this.currentArea.id}`;
            let resp = await Axios.post(url, this.currentElements);
            if (typeof(resp.data) === "boolean" && resp.data) {
                this.$alert("保存画布成功");
            } else {
                this.$alert("更新画布失败");
            }
        }

        /***
         * 拖动元素时,对元素进行对齐的吸附测试
         *@param event
         *@param item
         */
        private adsorptionTest(event, item): void {
            // console.log(item.currentTarget.VueComponent.config);
            let nowPoint = new AreaPoint(event.currentTarget.getX(), event.currentTarget.getY());
            event.currentTarget.VueComponent.config.x = nowPoint.x;
            event.currentTarget.VueComponent.config.y = nowPoint.y;
            let nearbyPoint = this.getNearbyPoint(nowPoint, item._data);
            let nearbyElement = this.getNearbyLeftElement(item._data, nearbyPoint);
            if (nearbyElement) {
                if (nowPoint.x >= nearbyElement.x + nearbyElement.width) {
                    nearbyPoint.x = nearbyElement.x + nearbyElement.width;
                }
                else if (nowPoint.y >= nearbyElement.y + nearbyElement.height) {
                    nearbyPoint.y = nearbyElement.y + nearbyElement.height;
                } else if ((nowPoint.x - nearbyElement.x) >= (nowPoint.y - nearbyElement.y)) {
                    nearbyPoint.x = nearbyElement.x + nearbyElement.width;
                } else {
                    nearbyPoint.y = nearbyElement.y + nearbyElement.height;
                }
            }
            // console.log(nearbyPoint);
            let delay = setTimeout(() => {
                event.currentTarget.VueComponent.config.x = nearbyPoint.x;
                event.currentTarget.VueComponent.config.y = nearbyPoint.y;
                item._data.x = nearbyPoint.x;
                item._data.y = nearbyPoint.y;
                clearTimeout(delay);
            }, 10);
        }

        /***
         * 移动机房物件
         */
        private moveItem(item) {
            // this.adsorptionTest(item);
        }

        /***
         * 放大缩小
         * @param value
         */
        private onZoom(value) {
            // noinspection TypeScriptUnresolvedVariable
            let stage = this.$refs.areaStage.getStage();
            let percent = 1.0 + (value - 50.0) / 50.0;
            stage.scaleX(percent);
            stage.scaleY(percent);
            this.lastScalePercent = value;
        }

        /***
         * 当元素进行变形操作时
         */
        private onTransformed(event) {
            console.log()
        }

        /***
         * 获取物件最近的交叉点
         */
        private getNearbyPoint(itemPoint: AreaPoint, elmt: AreaElement): AreaPoint {
            var gridSpace = this.auxiliarySpacing;
            let pX = itemPoint.x;
            let pY = itemPoint.y;
            let crossX: number = pX, crossY: number = pY;
            if (this.editSetting.autoLeftPin2Grid) {
                let remainX = pX % gridSpace;
                crossX = pX - remainX;
            }
            if (this.editSetting.autoTopPin2Grid) {
                let remainY = pY % gridSpace;
                crossY = pY - remainY;
            }
            return new AreaPoint(crossX, crossY);
        }

        /***
         * 找到和格线有碰撞的物件
         * @param item 平面图物件
         * @param cross 碰撞查找的格线交叉点
         */
        private getNearbyLeftElement(item: AreaElement, cross: AreaPoint) {
            let nearby = Linq.from(this.currentElements).firstOrDefault(x => {
                if (item.id === x.id) return false;
                let horizontal = x.x + x.width > cross.x && x.x < cross.x + this.auxiliarySpacing;
                let vertical = x.y < cross.y + this.auxiliarySpacing && x.y + x.height > cross.y;
                return horizontal && vertical;
            });
            return nearby;
        }

        /***
         * 当光标进入到画布的时候,更改鼠标指针
         * @param item
         * @param event
         */
        private changeCursor(item, event) {
            // noinspection TypeScriptUnresolvedFunction
            this.$refs.areaStage.getStage().container().style.cursor = 'pointer';
            //console.log(stage);
        }

        /***
         * 当光标进入到画布的时候,更改鼠标指针
         * @param event
         */
        private dragInStageCursor(event) {
            let transform = event.currentTarget.getAbsoluteTransform().copy();
            transform.invert();
            let mousePosition = event.currentTarget.getPointerPosition();
            let stagePos = transform.point(mousePosition);
            this.stageMousePoint.x = stagePos.x;
            this.stageMousePoint.y = stagePos.y;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .cr {
        width: 85%;
        height: 100%;
        float: left
    }

    .width100 {
        width: 100% !important;
    }

    /**/

    .li {
        height: 40px;
        overflow: hidden;
        transition: all 0.2s linear
    }

    .is-current {
        background-color: #46bcab;
    }

    .main {
        width: 85%;
        position: absolute;
        right: 0;
        padding-top: 0 !important;
        height: 98%;
    }

    .collapse {
        color: darkblue;
        cursor: pointer;
    }

    .collapse:hover {
        color: rebeccapurple;
    }

    .aside {
        height: 98%;
        overflow: auto;
        position: absolute;
        width: 15% !important;
    }

    .aside li {
        list-style: none;
        /*line-height: 45px;*/
        font-size: 14px;
        cursor: pointer;
    }

    .aside .name_span:hover {
        background: #46bcab;
        color: white;
    }

    .aside .name_span:hover .spaceSpan {
        border: 3px solid white;
    }

    .aside .name_span:hover .iconfont {
        color: white;
    }

    .aside > .content {
        margin: 0;
        padding: 0;
    }

    .aside > .content li {
        padding-left: 10px;
    }

    .active {
        background: #46bcab;
        color: white;
    }

    .active .iconfont {
        color: white;
    }

    .active .spaceSpan {
        border: 3px solid white;
    }

    .name_span {
        line-height: 45px;
    }

    .aside p {
        border-bottom: 1px solid #ddd;
        line-height: 45px;
        margin: 0;
        padding-left: 10px;
        cursor: pointer
    }

    .aside p:hover {
        background: #46bcab;
        color: white;
    }

    .spaceSpan, .borderRadiu {
        display: inline-block;
        min-width: 8px;
        height: 8px;
        border: 3px solid #333;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 8px;
        margin-left: 1px;
    }

    .nameNode {
        padding-top: 2px;
    }

    .titleDiv {
        height: 5%;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fafafa;
        color: #333;
        position: relative;
    }

    .titleDiv .title {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translate(0, -50%);
        font-weight: 600;
        font-size: 16px;
    }

    .cr .titleDiv {
        background: white;
    }

    /*content*/

    .content .homeTitle {
        line-height: 60px;
        text-align: center;
        color: white;
        background: #46bcab
    }

    .el-tree-node__content {
        height: 40px !important;
        font-size: 14px !important;
    }

    .el-tree-node:focus > .el-tree-node__content {
        background: #46bcab !important;
        color: white !important;
    }

    .el-tree-node__content:hover {
        background: #46bcab !important;
        color: white !important;
    }

    /***
    机柜背板图
     */
    .cabinet {
        width: 75%;
        margin: 0 auto;
    }

    .cabinet-head {
        width: 100%;
        height: 20px;
        border-left: 20px solid #3E3A39;
        border-right: 20px solid #3E3A39;
        background: #595757;
    }

    .cabinet-line {
        height: 5px;
        width: 100%;
        border-left: 20px solid #231815;
        border-right: 20px solid #231815;
    }

    .cabinet-u {
        width: 100%;
        height: 390px;
        border-left: 20px solid #888888;
        border-right: 20px solid #888888;
        background: #eeeeee;
        overflow-x: hidden;
    }

    .cabinet-u li {
        list-style: none;
        width: 100%;
        height: 20px;
        font: 12px/20px "\5FAE\8F6F\96C5\9ED1", "\5B8B\4F53", "\9ED1\4F53";
        border-bottom: 1px solid #e5e5e5;
        padding: 0 7px;
    }

    .cabinet-u li:hover {
        background: #12A87F;
        color: #fff;
    }

    .cabinet-u li.green {
        background: #12A87F;
        color: #fff;
        border-bottom: 1px solid #ffffff;
    }

    .cabinet-u li.blue-light {
        background: #18E6FE;
        color: #fff;
        border-bottom: 1px solid #ffffff;
    }

    .cabinet-u li.blue {
        background: #2DB2FF;
        color: #fff;
        border-bottom: 1px solid #ffffff;
    }

    .noBorder {
        border-bottom: 0 !important;
    }

    .borderHead {
        border-top: 1px solid #ffffff !important;
    }

    .cabinet-u li.black {
        background: #333333;
        color: #ffffff;
        border-bottom: 1px solid #ffffff;
    }

    .cabinet-u li.white {
        background: #ffffff;
        color: #333333;
    }

    .cabinet-foot {
        width: 100%;
        height: 60px;
        border-left: 20px solid #3E3A39;
        border-right: 20px solid #3E3A39;
        background: #595757;
        color: #fff;
        font: bold 17px/60px "\5FAE\8F6F\96C5\9ED1", "\5B8B\4F53", "\9ED1\4F53";
        text-align: center;
    }

    .cabinet-footer {
        width: 103%;
        margin-left: 5% !important;
        height: 25px;
        margin: 0 auto;
        background: #595757;
        border-top: 5px solid #231815;
    }

    .canvas {
        z-index: -1 !important;
        border: darkgray 1px solid;
        overflow: hidden;
        height: 90% !important;
    }

    .image-key {
        z-index: 100000;
        float: right;
        width: 213px;
        padding: 20px;
    }

    .box-card {
        z-index: 10000 !important;
    }
</style>
