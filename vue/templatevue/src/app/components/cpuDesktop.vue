<template>
  <div class="cpuDesktop">
    <el-dialog :visible.sync="addDialogVisible" width="30%" title="新增">
      <el-form
        :model="addForm"
        status-icon
        :rules="fromRules"
        ref="addForm"
        label-width="150px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="系列名称" prop="empty">
          <el-input v-model="addForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU" prop="contactPerson">
          <el-input v-model="addForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存(G)" prop="contactPhone">
          <el-input v-model="addForm.contactgPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统盘SATA(G)" prop="contactPhone">
          <el-input v-model="addForm.contactPghone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vGPU" prop="contactPerson">
          <el-input v-model="addForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="显存" prop="contactPerson">
          <el-input v-model="addForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="包月标准价格(元/月)" prop="number0">
          <el-input v-model="addForm.number0" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="addYes('addForm')">确 定</el-button>
          <el-button  @click="addNo('addForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateDialogVisible" width="30%" title="修改">
      <el-form
        :model="updateForm"
        status-icon
        :rules="fromRules"
        ref="updateForm"
        label-width="150px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="系列名称" prop="custName">
          <el-input v-model="updateForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU" prop="contactPerson">
          <el-input v-model="updateForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存(G)" prop="contactPhone">
          <el-input v-model="updateForm.contactgPhone" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="系统盘SATA(G)" prop="contactPhone">
          <el-input v-model="updateForm.contactPghone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vGPU" prop="contactPerson">
          <el-input v-model="updateForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="显存" prop="contactPerson">
          <el-input v-model="updateForm.contactPergson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="包月标准价格(元/月)" prop="number0">
          <el-input v-model="updateForm.number0" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="updateYes('updateForm')">确 定</el-button>
          <el-button  @click="updateNo('updateForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <header>
      <h1>GPU云桌面系列资费管理</h1>
    </header>
    <el-button icon="el-icon-plus" type="success" @click="handleAdd" style="marginBottom:20px">新增</el-button>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border>
      <el-table-column prop="date" label="系列名称"></el-table-column>
      <el-table-column prop="name" label="vCPU"></el-table-column>
      <el-table-column prop="address" label="内存(G)"></el-table-column>
      <el-table-column prop="address" label="系统盘SATA(G)"></el-table-column>
      <el-table-column prop="address" label="vGPU"></el-table-column>
      <el-table-column prop="address" label="显存"></el-table-column>
      <el-table-column prop="address" label="包月标准价格(元/月)"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-setting" @click="handleUpdate(scope.$index, scope.row)" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
export default class CpuDesktop extends Vue {
  private tableData = [
    {
      date: "ij"
    }
  ];
  //表单验证
  private checkNumber(rule, value, callback) {
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
        //     type: "warning"
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
        //     type: "warning"
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
  mounted() {}
}
</script>

<style  lang="scss">
.cpuDesktop {
  padding: 20px;
  header {
    text-align: center;
    margin-bottom: 20px;
    h1 {
      color: #333333;
    }
    div {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      p {
        margin: 0 20px;
        color: #646464;
      }
    }
  }
}
</style>
