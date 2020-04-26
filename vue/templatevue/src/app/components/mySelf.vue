<template>
  <div class="mySelf">
    <el-dialog title="修改" :visible.sync="updateVisible" width="520px">
      <el-form :model="updateForm" :rules="formRules" ref="updateForm" label-width="80px">
        <el-form-item label="用户名" prop="empty">
          <el-input v-model="updateForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="empty">
          <el-input v-model.number="updateForm.bandwidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="updateForm.email" type="email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.number="updateForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分公司" prop="empty">
          <el-input v-model.number="updateForm.flux" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateYes('updateForm')">确认</el-button>
          <el-button @click="updateNo('updateForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="updatePsdVisible" width="520px">
      <el-form
        :model="updatePsdForm"
        status-icon
        :rules="psdRules"
        ref="updatePsdForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="updatePsdForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="updatePsdForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="updatePsdForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updatePsdYes('updatePsdForm')">提交</el-button>
          <el-button @click="updatePsdNo('updatePsdForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <section>
      <div class="header">
        <h2>基本信息</h2>
      </div>
      <div class="section">
        <div class="top">
          <div class="left">
            <img src alt class="img" />
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button plain>更换头像</el-button>
            </el-upload>
          </div>
          <div class="right">
            <div class="msgItem">
              <span class="title">用户名：</span>
              <span class="msg"></span>
            </div>
            <div class="msgItem">
              <span class="title">邮箱：</span>
              <span class="msg">de</span>
            </div>
            <div class="msgItem">
              <span class="title">手机：</span>
              <span class="msg"></span>
            </div>
            <div class="msgItem">
              <span class="title">上一次登录时间：</span>
              <span class="msg"></span>
              <span class="aLink">登录日志</span>
            </div>
            <div class="msgItem">
              <span class="title">微信登录：</span>
              <span class="msg"></span>
              <span class="aLink">修改</span>
            </div>
            <div class="msgItem">
              <span class="title"></span>
              <el-button type="primary" style="marginLeft:10px" v-on:click="handleUpdate">修改基本信息</el-button>
            </div>
          </div>
        </div>
        <div class="bottom">
          <h3>安全设置</h3>
          <div class="psd">
            <div class="left">
              <h4>登录密码：</h4>
              <div>
                <p>安全性高的密码可以使账号更安全。</p>
                <p>建议您定期跟换密码，设置一个长度8-20位包含字母、数字和特殊符号的密码。</p>
              </div>
            </div>

            <div class="right">
              <span>已设置</span>
              <span>|</span>
              <span class="aLink" v-on:click="handleUpdatePsd">修改密码</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="footer"></div>
    <footer>
      <p>Copyright &copy; 2019中国电信股份有限公司云计算分公司版权所有</p>
      <p>V0.1版</p>
    </footer>
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
export default class MySelf extends Vue {
  //表单验证
  private checkPhone(rule, value, callback) {
    if (!value) {
      callback(new Error("手机号不能为空"));
    } else {
      if (/^(13[0-9]{9})|(15[89][0-9]{8})$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    }
  }
  private checkEmail(rule, value, callback) {
    if (!value) {
      callback(new Error("邮箱不能为空"));
    } else {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(value)) {
        callback(new Error("请输入有效的邮箱"));
      } else {
        callback();
      }
    }
  }
  private formRules = {
    empty: [{ required: true, message: "输入不能为空", trigger: "blur" }],
    phone: [{ validator: this.checkPhone, trigger: "blur" }],
    email: [{ validator: this.checkEmail, trigger: "blur" }]
  };
  //修改密码
  private updatePsdVisible: boolean = false;
  private validatePass(rule, value, callback) {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else {
      if (this.updatePsdForm.checkPass !== "") {
        this.$refs.updatePsdForm.validateField("checkPass");
      }
      callback();
    }
  }
  private validatePass2(rule, value, callback) {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.updatePsdForm.pass) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  }
  private updatePsdForm = {
    pass: "",
    checkPass: "",
    newPass: ""
  };
  private psdRules = {
    oldPass: [{ required: true, message: "输入不能为空", trigger: "blur" }],
    pass: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }]
  };
  private handleUpdatePsd() {
    this.updatePsdVisible = true;
  }
  private updatePsdYes(formName) {
    this.$refs[formName].validate(valid => {
      if (valid) {
        this.$refs[formName].resetFields();
        this.updatePsdVisible = false;
      }
    });
  }
  private updatePsdNo(formName) {
    this.$refs[formName].resetFields();
    this.updatePsdVisible = false;
  }
  //修改信息
  private updateVisible: boolean = false;
  private updateForm = {};
  private handleUpdate() {
    this.updateVisible = true;
  }
  private updateYes(formName) {
    this.$refs[formName].validate(valid => {
      if (valid) {
        this.$refs[formName].resetFields();
        this.updateVisible = false;
      }
    });
  }
  private updateNo(formName) {
    this.$refs[formName].resetFields();
    this.updateVisible = false;
  }

  private handleRemove(file, fileList) {
    console.log(file, fileList);
  }
  private handlePreview(file) {
    console.log(file);
  }
  mounted() {}
}
</script>

<style  lang="scss">
html,
body {
  height: 100%;
  box-sizing: border-box;
  // background-color: #f5f5f5;
}
* {
  font-family: "\5FAE\8F6F\96C5\9ED1", "\5B8B\4F53", "\9ED1\4F53";
  font-size: 14px;
}
div,
footer,section {
  box-sizing: border-box;
}
p {
  margin: 0;
  padding: 0;
}
.aLink {
  cursor: pointer;
  color: #ff6a00;
}
span {
  display: inline-block;
}
header {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  color: #333;
  p {
    font-size: 18px;
  }
}
.mySelf {
  height: 100%;
  box-sizing: border-box;
  section {
    height: 100%;
    padding: 20px;
    padding-top: 0;
    box-sizing: border-box;
    .header {
      padding-bottom: 14px;
      h2 {
        font-size: 20px;
        color: #646464;
        font-weight: normal;
      }
    }
    .section {
      border-radius: 4px;
      border: 1px solid #ededee;
      background-color: #fff;

      .top {
        display: flex;
        height: 318px;
        flex-direction: row;
        align-items: center;
        .left {
          margin-left: 115px;
          text-align: center;
          .img {
            display: block;
            width: 100px;
            height: 100px;
            border-radius: 100%;
            border: 1px solid black;
            margin-bottom: 18px;
          }
        }
        .right {
          margin-left: 115px;
          .msgItem {
            margin-bottom: 26px;
            .title {
              text-align: right;
              color: #333333;
              width: 130px;
            }
            .msg {
              color: #8c8c8c;
              text-indent: 10px;
            }
            .aLink {
              margin-left: 12px;
              color: #ff6a00;
            }
          }
        }
      }
      .bottom {
        padding: 0 20px;
        padding-bottom: 300px;
        h3 {
          font-size: 20px;
          color: #646464;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #d2d6de;
        }
        .psd {
          padding-left: 8px;
          display: flex;
          justify-content: space-between;
          .left {
            display: flex;
            h4 {
              font-size: 16px;
              color: #646464;
            }
            p {
              color: #8c8c8c;
              line-height: 2em;
              font-size: 16px;
            }
          }
          .right {
            color: #8c8c8c;
          }
        }
      }
    }
  }
  .footer{
    height: 50px;
  }
  footer {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    padding: 0 20px;
    left: 0;
    background-color: #fff;
    border-top: 1px solid #d2d6de;
    justify-content: space-between;
    height: 50px;
    p {
      line-height: 50px;
      color: #666666;
    }
  }
}
</style>
