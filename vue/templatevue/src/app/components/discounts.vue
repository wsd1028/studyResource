<template>
  <div class="discounts">
    <el-dialog :visible.sync="addDialogVisible" width="30%" title="新增">
      <el-form
        :model="addForm"
        status-icon
        :rules="fromRules"
        ref="addForm"
        label-width="80px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="活动标题">
          <el-input v-model="addForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="addForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input type="textarea" v-model="addForm.number0" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addYes('addForm')">确 定</el-button>
          <el-button @click="addNo('addForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateDialogVisible" width="30%" title="修改">
      <el-form
        :model="updateForm"
        status-icon
        :rules="fromRules"
        ref="updateForm"
        label-width="80px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="活动标题">
          <el-input v-model="updateForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="updateForm.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input type="textarea" v-model="updateForm.contactPghone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateYes('updateForm')">确 定</el-button>
          <el-button @click="updateNo('updateForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <header>
      <p>优惠活动管理</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>优惠活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <div class="header">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">发布活动</el-button>
        <el-input placeholder="请输入关键字" v-model="searchValue" class="search">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <el-table
        :header-cell-style="{background:'#f5f7fa'}"
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="date" label="活动标题" align="center"></el-table-column>
        <el-table-column prop="custName" label="活动时间" align="center"></el-table-column>
        <el-table-column prop="targetName" label="活动描述" align="center"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-setting"
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button @click="handleShow(scope.$index, scope.row)" size="mini">查看</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDel(scope.$index, scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div>
          <el-button type="danger" icon="el-icon-minus" @click="handleDelAll">批量删除</el-button>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleIndexChange"
          :current-page.sync="pageIndex"
          :page-sizes="[10,20,50,100]"
          :page-size="pageSize"
          align="right"
          layout="total,sizes,prev,pager,next,jumper"
          :total="dataCount"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { async } from "q";
import { constants } from "crypto";
import { Loading } from "element-ui";

Vue.use(ElementUI);

@Component
export default class Distcounts extends Vue {
  private tableData = [
    {
      id: "1",
      date: "fr"
    },
    {
      id: "2",
      date: "fr"
    }
  ];
  //表单验证
  private checkNumber(rule, value, callback) {
    console.log("value", value);
    if (!value) {
      callback(new Error("输入不能为空"));
    } else {
      if (/^[0-9]+\.[0-9]{1,}$|^(0|\+?[1-9][0-9]*)$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入数字"));
      }
    }
  }

  private fromRules = {
    empty: [{ required: true, message: "输入不能为空", trigger: "blur" }],
    custName: [
      {
        validator: this.checkNumber,
        trigger: "blur"
      }
    ]
  };
  //分页
  private pageIndex: number = 1;
  private pageSize: number = 10;
  private dataCount: number = 0;
  private handleSizeChange(val: string) {
    this.pageSize = parseInt(val);
    // this.handleSearch(1);
  }
  private handleIndexChange(val: string) {
    this.pageIndex = parseInt(val);
    // this.handleSearch(1);
  }
  //批量
  private allChoose = [];
  private handleSelectionChange(value) {
    this.allChoose = value;
  }
  private handleDelAll() {
    console.log(this.allChoose);
    if (this.allChoose.length > 0) {
      let portIds = [];
      //   for (let i = 0; i < this.allChoose.length; i++) {
      //     portIds.push(this.allChoose[i].id);
      //   }
      //   this.portIds = portIds.join(",");
      //   this.getCusts();
      //   this.custDialogVisible = true;
      //   this.custLoading = true;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择租用的端口",
        type: "warning"
      });
    }
  }
  //新增
  private addDialogVisible: boolean = false;
  private addForm = {};
  private handleAdd() {
    this.addDialogVisible = true;
  }
  private addNo(formName: any) {
    this.addDialogVisible = false;
    this.$refs[formName].resetFields();
  }

  private addYes(formName: any) {
    this.$refs[formName].validate(async valid => {
      if (valid) {
        // let randomNum = Math.round(Math.random() * 10000);
        // let url = `api/Resource/addCust?randomNum=${randomNum}`;
        // let res = await Axios.post(url, this.addForm);
        // if (res.data.code == 1) {
        //   this.handleSearch(null);
        //   this.addDialogVisible = false;
        //   this.$refs[formName].resetFields();
        //   this.$message({
        //     duration: 2000,
        //     showClose: true,
        //     type: "success",
        //     message: "修改成功"
        //   });
        // } else {
        //   this.$message({
        //     duration: 2000,
        //     showClose: true,
        //     message: res.data.descr,
        //     type: "primary"
        //   });
        // }
      } else {
        this.$message({
          duration: 2000,
          showClose: true,
          message: "信息不完整",
          type: "primary"
        });
      }
    });
  }
  //删除
  private handleDel(index, row) {
    this.$confirm("此操作将永久删除该系列, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {})
      .catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "info",
          message: "已取消删除"
        });
      });
  }
  //查看
  private handleShow(index, row) {}
  //修改
  private updateDialogVisible: boolean = false;
  private updateForm = {};
  private handleUpdate(index, row) {
    this.updateDialogVisible = true;
    this.updateForm = JSON.parse(JSON.stringify(row));
  }
  private updateNo(formName: any) {
    this.updateDialogVisible = false;
    this.$refs[formName].resetFields();
  }
  //搜索
  private searchValue = "";

  private updateYes(formName: any) {
    this.$refs[formName].validate(async valid => {
      if (valid) {
        // let randomNum = Math.round(Math.random() * 10000);
        // let url = `api/Resource/UpdateCust?randomNum=${randomNum}`;
        // let res = await Axios.post(url, this.updateForm);
        // if (res.data.code == 1) {
        //   this.handleSearch(null);
        //   this.updateDialogVisible = false;
        //   this.$refs[formName].resetFields();
        //   this.$message({
        //     duration: 2000,
        //     showClose: true,
        //     type: "success",
        //     message: "修改成功"
        //   });
        // } else {
        //   this.$message({
        //     duration: 2000,
        //     showClose: true,
        //     message: res.data.descr,
        //     type: "primary"
        //   });
        // }
      } else {
        this.$message({
          duration: 2000,
          showClose: true,
          message: "信息不完整",
          type: "primary"
        });
      }
    });
  }
  //
}
</script>

<style lang="scss">
.discounts {
  section {
    background-color: #fff;
    padding: 20px;
    .header {
      display: flex;
      margin-bottom: 20px;
      .search {
        width: 250px;
        margin-left: 20px;
      }
    }
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
  }
}
</style>