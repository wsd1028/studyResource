<template>
    <div v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-container>
            <!--<el-header>Header</el-header>-->
            <el-container>
                <el-main class="main" v-bind:class="{ width100: !areaTreeVisible }">
                    <el-button v-on:click="testA">测试post</el-button>
                    {{ajaxData}}{{currentNodeManger.id}}
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Config} from "../core/config"
    import ElementUI from 'element-ui'
    import Linq from "linq"
    import Axios from 'axios'
    import S from '../../../node_modules/string'
    import VueKonva from '../../../node_modules/vue-konva';
    import 'element-ui/lib/theme-chalk/index.css'
    import {ElNode} from "../core/elNode";
    import {INode} from "../core/iNode";
    import {Area} from "../core/area";
    import {AreaElement} from "../core/areaElement";
    import {AreaPoint} from "../core/point";
    import {Room2dShape} from "../core/shape";
    import {NodeManager} from "../core/NodeManager";

    // import RackKey from 'RackKey.vue';

    Vue.use(ElementUI);
    Vue.use(VueKonva);

    // @Component({
    //     components: {
    //         RackKey
    //     }
    // })

    @Component
    export default class TestDemo extends Vue {
        aaa="1232";
        private loading: boolean = false;
        private currentElements: Array<AreaElement>;//当前区域的元素集合
        private currentElement: AreaElement;
        private imageKeys: Array<> = [];
        private ajaxData="";
        private currentNodeMangerList:Array<NodeManager>;

        async mounted(){
            let url="/api/values";
            let resp=await Axios.get(url);
            this.ajaxData=resp.data;
        }

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
         * 当光标进入到画布的时候,更改鼠标指针
         * @param item
         * @param event
         */
        private changeCursor(item, event) {
            this.$refs.areaStage.getStage().container().style.cursor = 'pointer';
            //console.log(stage);
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
