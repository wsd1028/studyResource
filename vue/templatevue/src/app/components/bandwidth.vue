<template>
  <div class="bandwidth">
    <el-dialog :visible.sync="addDialogVisible" width="30%" title="新增">
      <el-form
        :model="addForm"
        status-icon
        :rules="fromRules"
        ref="addForm"
        label-width="180px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="产品规格" prop="custName">
          <el-input v-model="addForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="包月标准价格(元/M/月)" prop="number0">
          <el-input v-model="addForm.number0" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="按需标准价格(元/M/小时)" prop="number0">
          <el-input v-model="addForm.number0" auto-complete="off"></el-input>
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
        label-width="180px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="产品规格" prop="custName">
          <el-input v-model="updateForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="包月标准价格(元/M/月)" prop="number0">
          <el-input v-model="updateForm.number0" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="按需标准价格(元/M/小时)" prop="contactPhone">
          <el-input v-model="updateForm.contactPghone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateYes('updateForm')">确 定</el-button>
          <el-button @click="updateNo('updateForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <header>
      <p>公网带宽资费管理</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>公网带宽资费管理</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <el-button icon="el-icon-plus" type="success" @click="handleAdd" style="marginBottom:20px">新增</el-button>
      <el-table
        :header-cell-style="{background:'#f5f7fa'}"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        border
      >
        <el-table-column prop="date" label="产品规格"></el-table-column>
        <el-table-column prop="address" label="包月标准价格(元/M/月)"></el-table-column>
        <el-table-column prop="address" label="按需标准价格(元/M/小时)"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-setting"
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDel(scope.$index, scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Config } from "../core/config";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import qs from "qs";
import "element-ui/lib/theme-chalk/index.css";
import { constants } from "crypto";

Vue.use(ElementUI);

@Component
export default class Bandwidth extends Vue {
  private tableData = [
    {
      date: "ij"
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
    number0: [
      {
        validator: this.checkNumber,
        trigger: "blur"
      }
    ]
  };
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
          type: "warning"
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
  mounted() {}
}
</script>

<style  lang="scss">
.bandwidth {
  section {
    background-color: #fff;
    padding: 20px;
  }
}
</style>
