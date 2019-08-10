<template>
    <div
            v-loading.fullscreen="loading"
            element-loading-background="rgba(0, 0, 0, 0.2)"
            class="rackKeyApp"
    >
        <el-button type="primary" icon="el-icon-plus" @click="clickCreateNew" class="rackKeyCreateButton">新增</el-button>
        <template>
            <el-table :data="tableData" border style="width: 100%" :header-cell-style="getHeaderRowStyle"
                      :cell-style="getCellStyle">
                <el-table-column prop="type" label="形状类型"></el-table-column>
                <el-table-column prop="svgPath" label="svg路径"></el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button
                                @click="clickEdit(scope.row)"
                                type="primary"
                                size="small"
                                icon="el-icon-edit"
                        >修改
                        </el-button>
                        <el-button
                                @click="clickDelete(scope.row.id)"
                                type="danger"
                                size="small"
                                icon="el-icon-delete"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="rackKeyPageNation"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 15, 30]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalCount"
            ></el-pagination>
        </template>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="centerDialogVisible"
                width="30%"
                center
                @closed="clickQuick"
        >
            <el-form :label-position="labelPosition" label-width="80px">
                <el-form-item label="形状类型">
                    <el-input v-model="shape.type"></el-input>
                </el-form-item>
                <el-form-item label="svg路径">
                    <el-input v-model="shape.svgPath"></el-input>
                </el-form-item>
                <el-form-item label="预览">
                    <div>
                        <svg t="1554169555150" class="icon" viewBox="0 0 200 200" version="1.1"
                             fill="lightgray"
                             xmlns="http://www.w3.org/2000/svg" p-id="14631" xmlns:xlink="http://www.w3.org/1999/xlink"
                             width="200" height="200">
                            <defs></defs>
                            <path :d="shape.svgPath" p-id="14632"></path>
                        </svg>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="clickQuick">取 消</el-button>
        <el-button type="primary" @click="clickOk">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {Config} from "../core/config";
    import ElementUI from "element-ui";
    import Linq from "linq";
    import Axios from "axios";
    import S from "../../../node_modules/string";
    import VueKonva from "../../../node_modules/vue-konva";
    import "element-ui/lib/theme-chalk/index.css";
    import {ElNode} from "../core/elNode";
    import {INode} from "../core/iNode";
    import {Area} from "../core/area";
    import {AreaElement} from "../core/areaElement";
    import {Room2dShape} from "../core/shape";
    import {privateDecrypt} from "crypto";

    Vue.use(ElementUI);
    Vue.use(VueKonva);

    @Component
    export default class ShapeManager extends Vue {
        private loading: boolean = false;
        private tableData = [];
        private centerDialogVisible: boolean = false;
        private labelPosition: string = "right";
        private dialogTitle: string = "新增图例";
        private isCreateOrEdit: boolean = true;
        private shape: Room2dShape = new Room2dShape(); //形状
        private totalCount: number = 0;
        private currentPage: number = 1;
        private pageSize: number = 10;

        mounted() {
            this.getData();
        }

        private async getData(): void {
            let _this = this;
            _this.loading = true;
            let url =
                `${Config.baseUrl}/api/ShapeManager/GetShapes?r=` +
                Math.random() +
                "&pageIndex=" +
                _this.currentPage +
                "&pageSize=" +
                _this.pageSize;
            try {
                _this.loading = false;
                let resp = await Axios.get(url);
                if (resp.data) {
                    _this.tableData = resp.data;
                }
            } catch (error) {
                _this.loading = false;
                _this.$message({
                    message: error,
                    type: "error"
                });
            }
        }

        private clickEdit(row): void {
            let _this = this;
            _this.dialogTitle = "修改图例";
            _this.isCreateOrEdit = false;
            _this.initialDialog();
            _this.shape.id = row.id;
            _this.shape.type = row.type;
            _this.shape.svgPath = row.svgPath;
            _this.centerDialogVisible = true;
        }

        private initialDialog(): void {
            let _this = this;
            _this.shape = new Room2dShape();
        }

        private clickCreateNew(): void {
            let _this = this;
            _this.dialogTitle = "新增图例";
            _this.isCreateOrEdit = true;
            _this.initialDialog();
            _this.centerDialogVisible = true;
        }

        private async clickDelete(id): void {
            let _this = this;
            try {
                let url =
                    `${Config.baseUrl}/api/ShapeManager/DeleteShape?shapeId=` +
                    parseInt(id) +
                    "&r=" +
                    Math.random();
                let resp = await Axios.get(url);
                if (resp.data) {
                    console.log(resp.data);
                    _this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    _this.getData();
                } else {
                    _this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                }
            } catch (error) {
                _this.$message({
                    message: error,
                    type: "error"
                });
            }
        }

        private clickQuick(): void {
            let _this = this;
            _this.initialDialog();
            _this.centerDialogVisible = false;
        }

        private async clickOk(): void {
            let _this = this;
            if (_this.isCreateOrEdit) {
                let url = `${Config.baseUrl}/api/ShapeManager/InsertShape`;
                try {
                    let resp = await Axios.post(url, _this.shape);
                    if (resp.data) {
                        _this.$message({
                            message: "新增成功",
                            type: "success"
                        });
                        _this.initialDialog();
                        _this.centerDialogVisible = false;
                        _this.getData();
                    } else {
                        _this.$message({
                            message: "新增失败",
                            type: "error"
                        });
                    }
                } catch (error) {
                    _this.$message({
                        message: error,
                        type: "error"
                    });
                }
            } else {
                let url = `${Config.baseUrl}/api/ShapeManager/EditShape`;
                try {
                    let resp = await Axios.post(url, _this.shape);
                    if (resp.data) {
                        _this.$message({
                            message: "修改成功",
                            type: "success"
                        });
                        _this.initialDialog();
                        _this.centerDialogVisible = false;
                        _this.getData();
                    } else {
                        _this.$message({
                            message: "修改失败",
                            type: "error"
                        });
                    }
                } catch (error) {
                    _this.$message({
                        message: error,
                        type: "error"
                    });
                }
            }
        }

        private handleSizeChange(val): void {
            this.pageSize = val;
            this.getData();
        }

        private handleCurrentChange(val): void {
            this.currentPage = val;
            this.getData();
        }

        private getCellStyle({row, column, rowIndex, columnIndex}): string {
            return "text-align:center";
        }

        private getHeaderRowStyle({row, rowIndex}): string {
            return "text-align:center";
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .rackKeyApp {
        padding: 10px;
    }

    .rackKeyCreateButton {
        margin-bottom: 10px;
    }

    .rackKeyPageNation {
        float: right;
        margin-right: 10px;
        margin-top: 10px;
    }
</style>
