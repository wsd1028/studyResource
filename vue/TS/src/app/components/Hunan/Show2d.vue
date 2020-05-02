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
                    <el-row  type="flex" justify="center">
  <el-col :span="6"><template v-if="currentArea!=null"> {{currentArea.label}}</template></el-col>
</el-row>
                    <div class="block">
                        <span class="demonstration">缩放</span>
                        <el-slider v-model="scalePercent" :show-tooltip="false" v-on:change="onZoom"
                                   style="width: 200px;"></el-slider>
                        <el-autocomplete
                                class="inline-input"
                                v-model="currentCustomer"
                                value-key="customerName"
                                label="customerName"
                                value="customerId"
                                clearable
                                v-on:clear="filterByCustomer"
                                :fetch-suggestions="queryCustomer"
                                placeholder="请输入内容"
                                @select="filterByCustomer"
                        ></el-autocomplete>
                    </div>
                    <div class="canvas" ref="canvasContainer">
                        <div class="image-key">
                            <table>
                                <tr v-for="key in imageKeys">
                                    <td><span v-bind:style="{ backgroundColor: key.fillColor }"
                                              style="display: inline-block;border: black solid 1px;width: 60px;height: 18px;margin-top: 2px;"></span>
                                    </td>
                                    <td><span v-text="key.name" style="display: inline-block"></span></td>
                                </tr>
                            </table>
                        </div>
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
                        <v-stage ref="areaStage" v-on:mouseenter="changeCursor" :config="imageConfig.stageConfig">
                            <v-layer ref="layer">
                                <v-line :config="locationZero.vertical"></v-line>
                                <v-line :config="locationZero.horizontal"></v-line>
                                <v-group :config="item" v-for="item in imageConfig.elements" ref="group"
                                         v-on:mouseover="showItemToolTips($event,item._data)"
                                         v-on:mouseleave="fadeToolTips"
                                         v-on:click="showRackView(item._data)">
                                    <v-rect v-if="item._data.shape.type==='矩形'" :config="item.rect" ref="rect"></v-rect>
                                    <v-path v-else-if="item._data.shape.type==='SVG'" :config="item.path"
                                            ref="svg"></v-path>
                                    <v-text :config="item.text" ref="txt"></v-text>
                                </v-group>
                            </v-layer>
                        </v-stage>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog  :visible.sync="rackViewDialogVisible" :fullscreen="true" :close-on-click-modal="false">
            <div>
                <router-view></router-view>
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
    import VueKonva from '../../../../node_modules/vue-konva';
    import 'element-ui/lib/theme-chalk/index.css'
    import {ElNode} from "../../core/elNode";
    import {INode} from "../../core/iNode";
    import {Area} from "../../core/area";
    import {AreaElement} from "../../core/areaElement";
    import {AreaPoint} from "../../core/point";
    import {Customer} from "../../core/customer";
    // import RackKey from 'RackKey.vue';

    Vue.use(ElementUI);
    Vue.use(VueKonva);

    // @Component({
    //     components: {
    //         RackKey
    //     }
    // })

    @Component
    export default class Show2d extends Vue {
        private loading: boolean = false;
        private rackViewDialogVisible: boolean = false;
        private toolTipsVisible: boolean = false;//控制tooltip的显示隐藏
        private toolTipPosition: AreaPoint = new AreaPoint(0, 0);
        private areaTreeVisible: boolean = false;//控制区域树节点显示隐藏
        private nodeTree: Array<ElNode> = [];//节点树
        private currentArea: Area;//当前选中树节点
        private scaleBy: number = 1.2;
        private scalePercent: number = 50;
        private lastScalePercent: number = 50;
        private currentElements: Array<AreaElement>;//当前区域的元素集合
        private currentElement: AreaElement;
        private imageKeys: Array<> = [];
        private rackCustomers: Array<Customer> = [];
        private currentCustomer: string = "";
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

        private locationZero: object = {
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
            await this.loadImageKeys();
            await this.loadNodeTree();
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
         * 显示机柜视图
         * @param element
         */
        private showRackView(element: AreaElement) {
            if (element.resource) {
                clearTimeout(this.fadeTimeout);
                this.toolTipsVisible = false;
                this.rackViewDialogVisible = true;
                this.$router.replace(`/show2d/${element.id}/1/rack`);
            }
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
                    this.imageConfig.elements = [];
                    this.drawImage();
                    this.rackCustomers = Linq.from(this.currentElements).where(x => !!(x.resource && x.resource.customerName)).select(x => {
                        return new Customer(x.resource.customerId, x.resource.customerName);
                    }).toArray();
                }
            } catch (e) {
                console.log(e);
            }
            this.loading = false;
        }

        /***
         * 显示元素的tooltip
         * @param $event
         * @param elmt
         */
        private showItemToolTips($event, elmt: AreaElement) {
            this.toolTipPosition = new AreaPoint($event.evt.x + 3, $event.evt.y + 3);
            this.currentElement = elmt;
            this.toolTipsVisible = true;
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
            let svtData = null;//elmt.shape && elmt.shape.svgPath;
            let key = elmt.resource && keys.firstOrDefault(x => x.name === elmt.resource.type);
            if (elmt.shape.svgPath) svtData = elmt.shape.svgPath;
            let group = {
                _data: elmt,
                x: elmt.x,
                y: elmt.y,
                path: {
                    _data: elmt,
                    x: 0, y: 0,
                    rotation: elmt.rotation,
                    data: svtData,
                    stroke: 'black',
                    strokeWidth: 0.3,
                    fill: key ? key.fillColor : elmt.fillColor
                },
                rect: {
                    _data: elmt,
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
        private changeCursor(item, event) {
            this.$refs.areaStage.getStage().container().style.cursor = 'pointer';
            //console.log(stage);
        }

        /***
         * 通过选中的客户筛选客户的机柜
         * @param item
         */
        private filterByCustomer(item: Customer) {
            let keys = Linq.from(this.imageKeys);
            Linq.from(this.$refs['rect']).forEach(x => {
                let elmt = x.config._data;
                if (elmt.resource && (!item || elmt.resource.customerName === item.customerName)) {
                    let strokeColor = 'black';
                    let key = elmt.resource && keys.firstOrDefault(x => x.name === elmt.resource.type);
                    let fillColor = key ? key.fillColor : elmt.fillColor;
                    x.config.stroke = strokeColor;
                    x.config.fill = fillColor;
                } else {
                    x.config.stroke = 'lightgray';
                    x.config.fill = 'lightgray';
                }
            });
            Linq.from(this.$refs['svg']).forEach(x => {
                let elmt = x.config._data;
                if (elmt.resource && (!item || elmt.resource.customerName === item.customerName)) {
                    let strokeColor = 'black';
                    let key = elmt.resource && keys.firstOrDefault(x => x.name === elmt.resource.type);
                    let fillColor = key ? key.fillColor : elmt.fillColor;
                    x.config.stroke = strokeColor;
                    x.config.fill = fillColor;
                } else {
                    x.config.stroke = 'lightgray';
                    x.config.fill = 'lightgray';
                }
            });
            Linq.from(this.$refs['txt']).forEach(x => {
                let elmt = x.config._data;
                if(!item){
                    x.config.fill = 'black';
                    return;
                }
                if (elmt.resource && elmt.resource.customerName === item.customerName) {
                    x.config.fill = 'black';
                } else {
                    x.config.fill = 'lightgray';
                }
            });
        }

        /***
         * 关键字,回调函数
         * @param queryString
         * @param cb
         */
        private queryCustomer(queryString, cb) {
            var results = Linq.from(this.rackCustomers).where(x => x.customerName.indexOf(queryString) > -1).groupBy(x => x.customerId).select(x => x.firstOrDefault()).toArray();
            cb(results);
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
        width: 300px;
        z-index: 10000 !important;
    }
</style>
