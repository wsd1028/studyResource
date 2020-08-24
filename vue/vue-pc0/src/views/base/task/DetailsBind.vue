<template>
  <el-row>
    <el-col>
      <el-row :gutter="10" class="details-container" align="stretch">
        <el-col :md="24" :lg="24" style="flex-flow:column nowrap">
          <!-- 派单信息 -->
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">基本信息</span>
            </div>
            <div class="content" style="display:block;font-size: 14px">
              <div class="content-item">
                <span>处理人:</span>
                <span class="value" v-text="task.manager"></span>
              </div>
              <div class="content-item">
                <span>电话:</span>
                <span class="value" v-text="taskDetails.phone"></span>
              </div>
              <div class="content-item">
                <span>部门:</span>
                <span class="value" v-text="taskDetails.dept"></span>
              </div>
              <div class="content-item">
                <span>所属地区:</span>
                <span class="value" v-text="taskDetails.areaName"></span>
              </div>
              <div class="content-item">
                <span>地址:</span>
                <span class="value" v-text="task.address"></span>
              </div>
              <div class="content-item">
                <span>时间:</span>
                <span class="value" v-text="task.createDate"></span>
              </div>
            </div>
          </el-card>
          <!-- 督办描述 -->
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">督办描述</span>
            </div>
            <div class="content">
              <span v-text="taskDetails.startDescription"></span>
            </div>
          </el-card>
          <!-- 督办图片 -->
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">图片</span>
            </div>
            <div class="content">
              <el-image
                v-for="(item, key) in taskDetails.startImageList"
                :key="key"
                :src="$store.state.config.convertImgUrl(item)"
                :preview-src-list="taskDetails.startImageList.map(item => $store.state.config.convertImgUrl(item))"
                style="height:100px;width:100px;background-color:black;margin:2px"
                fit="contain"
              >
                <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-card>
          <!-- 进度 -->
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">处理进度</span>
            </div>
            <div class="content">
              <el-steps :active="[0, 1, 2, 3, 3, 3][stateConvert(taskDetails.state).index] + 1" style="flex:1">
                <el-step title="待处理" icon="iconfont iconfont-form-receive"></el-step>
                <el-step title="处理中" icon="iconfont iconfont-form-receive"></el-step>
                <el-step title="待审核" icon="iconfont iconfont-form-review"></el-step>
                <el-step
                  :title="['已结案', '已结案', '已结案', '已驳回', '已结案', '已作废'][stateConvert(taskDetails.state).index]"
                  :icon="
                    ['el-icon-check', 'el-icon-check', 'el-icon-check', 'el-icon-close', 'el-icon-check', 'el-icon-close'][
                      stateConvert(taskDetails.state).index
                    ]
                  "
                  :status="stateConvert(taskDetails.state).type"
                ></el-step>
              </el-steps>
            </div>
          </el-card>
          <!-- 督办处理结果 -->
          <el-card v-if="[3, 4, 5].includes(stateConvert(taskDetails.state).index)" class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">督办处理结果描述</span>
            </div>
            <div class="content">
              <span v-text="taskDetails.resDescription"></span>
            </div>
          </el-card>
        </el-col>
        <el-col :md="24" :lg="24" style="flex-flow:column nowrap">
          <!-- 督办处理结果图片 -->
          <el-card v-if="[3, 4, 5].includes(stateConvert(taskDetails.state).index)" class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">督办处理结果图片</span>
            </div>
            <div class="content">
              <el-image
                v-for="(item, key) in taskDetails.resultImageList"
                :key="key"
                :src="item"
                :preview-src-list="taskDetails.resultImageList"
                style="height:100px;width:100px;background-color:black"
                fit="contain"
              >
                <div slot="error" class="image-slot" style="width:100px;height:100px;text-align:center;line-height:100px">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-card>
        </el-col>
        <el-col :md="24" :lg="24">
          <!-- 督办经过 -->
          <el-card class="box-card" shadow="hover" style=";height:100%;overflow:visible">
            <div slot="header" class="clearfix title">
              <span style="font-weight: bold;line-height: 18px">督办经过</span>
            </div>
            <div class="content">
              <el-steps :active="9999999" style="flex:1" direction="vertical" :space="160">
                <el-step v-for="(item, key) in taskProcess" :key="key">
                  <div slot="title">
                    <el-tag
                      :color="nowStateDict[item.nowState].color"
                      v-text="nowStateDict[item.nowState].label"
                      style="margin:0 0 4px 0;color:white;font-size: 14px;font-weight: bold"
                    ></el-tag>
                  </div>
                  <div class="process-wrap" slot="description" style="color: #666666;font-size: 14px">
                    <div class="item" style="margin-bottom:4px">
                      <span>处理人:</span>
                      <span v-text="item.procesor"></span>
                    </div>
                    <div class="item" style="margin-bottom:4px">
                      <span>部门:</span>
                      <span v-text="item.dept"></span>
                    </div>
                    <div class="item" style="margin-bottom:4px">
                      <span>电话:</span>
                      <span v-text="item.phone"></span>
                    </div>
                    <div class="item" style="margin-bottom:4px">
                      <span>市区县:</span>
                      <span v-text="item.areaName"></span>
                    </div>
                  </div>
                </el-step>
              </el-steps>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <!-- 按钮区域 -->
    <el-col style="margin-top:20px">
      <!-- 底部按钮区 -->
      <div style="display:flex;justify-content:center">
        <!-- 只对接收人显示,并且状态在处理中或已驳回 -->
        <el-button
          v-if="taskDetails.receiverId == user.id && [1, 3].includes(stateConvert(taskDetails.state).index)"
          type="primary"
          @click="taskMakeShow = true"
        >
          立即处理
        </el-button>

        <!-- 只对接收人显示,并且状态在处理中或已驳回 -->
        <el-button
          v-if="taskDetails.taskButtonStateVO && taskDetails.taskButtonStateVO.transmitButton"
          type="primary"
          @click="taskTransmitShow = true"
          v-text="'转 发'"
        />

        <!-- 撤回督办派单 -->
        <el-button v-if="taskDetails.taskButtonStateVO && taskDetails.taskButtonStateVO.withdrawButton" type="warning" @click="withdrawTask" v-text="'撤 回'" />

        <!-- 拒绝督办派单 -->
        <el-button v-if="taskDetails.taskButtonStateVO && taskDetails.taskButtonStateVO.refuseButton" type="warning" @click="refuseTask" v-text="'拒 绝'" />

        <!-- 接受督办派单 -->
        <el-button v-if="taskDetails.taskButtonStateVO && taskDetails.taskButtonStateVO.receiveButton" type="success" @click="receiveTask" v-text="'接 受'" />

        <!-- 只对发起人显示,并且状态在审核中 -->
        <el-button
          v-if="taskDetails.sponsorId == user.id && [2].includes(stateConvert(taskDetails.state).index)"
          type="primary"
          @click="review(1)"
          v-text="'任务完成'"
        />
        <el-button
          v-if="taskDetails.sponsorId == user.id && [2].includes(stateConvert(taskDetails.state).index)"
          type="danger"
          @click="review(0)"
          v-text="'任务未完成'"
        />
        <el-button
          v-if="taskDetails.sponsorId == user.id && [2].includes(stateConvert(taskDetails.state).index)"
          type="warning"
          @click="review(false)"
          v-text="'驳 回'"
        />
        <el-button v-if="taskDetails.taskButtonStateVO && taskDetails.taskButtonStateVO.invalidButton" type="danger" @click="invalid()" v-text="'作 废'" />
        <el-button @click="close" v-text="'返 回'"></el-button>
      </div>
    </el-col>
    <!-- 处理督办派单弹窗 -->
    <el-dialog v-if="taskMakeShow" :visible="true" :show-close="false" append-to-body top="10vh" width="30vw">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div>
          <span>处理督办派单</span>
          <el-tag type="primary" size="mini" v-text="task.title" style="margin-left:4px"></el-tag>
          <el-tag type="success" size="mini" v-text="task.address" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="taskMakeShow = false" style="cursor:pointer"></i>
      </div>
      <task-make :task-details="taskDetails" :close="close"></task-make>
    </el-dialog>
    <!-- 转发督办派单弹窗 -->
    <el-dialog v-if="taskTransmitShow" :visible="true" :show-close="false" append-to-body top="10vh" width="30vw">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div>
          <span>转发督办派单</span>
          <el-tag type="success" size="mini" v-text="task.address" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="taskTransmitShow = false" style="cursor:pointer"></i>
      </div>
      <task-transmit :task-details="taskDetails" :close="close"></task-transmit>
    </el-dialog>
  </el-row>
</template>

<script>
import taskMake from './TaskMake'
import taskTransmit from './TaskTransmit'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 当前登录用户信息
      user,
      // 督办派单详情
      taskDetails: {},
      // 督办派单过程
      taskProcess: [],
      // 处理督办派单弹窗控制器
      taskMakeShow: false,
      // 转发督办派单弹窗控制器
      taskTransmitShow: false,

      // 当前状态字典表
      nowStateDict: {
        7000: {
          color: '#409EFF',
          label: '督办派单'
        },
        7010: {
          color: '#0099CC',
          label: '案件转发'
        },
        7020: {
          color: '#FF0033',
          label: '案件撤回'
        },
        7030: {
          color: '#FF0033',
          label: '案件拒绝'
        },
        7040: {
          color: '#E6A23C',
          label: '案件处理中'
        },
        7050: {
          color: '#67C23A',
          label: '案件完成'
        },
        7060: {
          color: '#F56C6C',
          label: '案件驳回'
        },
        7070: {
          color: '#67C23A',
          label: '案件结案'
        },
        7080: {
          color: '#F56C6C',
          label: '案件作废'
        }
      }
    }
  },
  props: {
    task: Object,
    state: Array,
    close: {
      type: Function,
      default: () => {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    /* *
     * 初始化
     * * */
    init() {
      /* *
       * 获取督办派单详情和督办派单进度
       * * */
      this.$http
        .get('/carp/business/a/q/task/pass', {
          params: {
            accountId: this.user.id,
            taskId: this.task.id
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            this.taskDetails = data
          } else {
            this.taskDetails = {}
            this.$message.error('获取督办派单详情失败')
          }
        })
      this.$http.get(`/carp/business/a/q/task/process/${this.task.id}`).then(({ code, data }) => {
        if (code === 0) {
          this.taskProcess = data.taskVOList
        } else {
          this.taskProcess = []
          this.$message.error('获取督办过程失败')
        }
      })
    },
    /* *
     * 督办派单进度转换为序列号
     * 0:待处理 1:待接单 2:待审核 3:已驳回 4:已结案 5:已作废
     * @return { index:序列号 , label:标签 }
     * * */
    stateConvert(state) {
      let result = {}
      this.state.every((item, i) => {
        if (item.code == state) {
          result = {
            index: i,
            label: item.label
          }
          return false
        } else {
          return true
        }
      })
      return result
    },

    // 作废督办派单
    invalid() {
      this.$prompt('请填写原因', '作废当前派单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.$http
            .post(
              '/carp/business/a/q/task/invaildTask',
              {},
              {
                params: {
                  taskId: this.taskDetails.id,
                  accountId: this.user.id,
                  remark: value
                }
              }
            )
            .then(({ code }) => {
              if (code === 0) {
                this.$message.success('当前派单已作废')
                // 关闭派单详情窗口
                this.close()
              } else {
                this.$message.error('请求出错')
              }
            })
        })
        .catch(() => {})
    },

    // 政府人员审核操作
    // param state: 1:任务完成 0:任务未完成 其余值:驳回
    review(state) {
      // 审核通过,督办派单结案
      if ([1, 0].includes(state)) {
        this.$confirm(`确定督办内容无误,${state ? '任务已完成' : '任务未完成'}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http
            .post(
              '/carp/business/a/q/task/checkTask',
              {},
              {
                params: {
                  taskId: this.taskDetails.id,
                  accountId: this.user.id,
                  finishType: state
                }
              }
            )
            .then(({ code }) => {
              if (code === 0) {
                this.$message.success(this.taskDetails.address + ' 审核完成')
                // 关闭派单详情窗口
                this.close()
              } else {
                this.$message.error('请求出错')
              }
            })
        })
      }
      // 驳回
      else {
        this.$prompt('请填写原因', '驳回当前派单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.$http
              .post(
                '/carp/business/a/q/task/rejectTask',
                {},
                {
                  params: {
                    taskId: this.taskDetails.id,
                    remark: value,
                    accountId: this.user.id
                  }
                }
              )
              .then(({ code }) => {
                if (code === 0) {
                  this.$message.success('派单已驳回')
                  // 关闭派单详情窗口
                  this.close()
                } else {
                  this.$message.error('请求出错')
                }
              })
          })
          .catch(() => {})
      }
    },

    // 撤回督办派单
    withdrawTask() {
      this.$confirm(`确定撤回督办派单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .post(
            '/carp/business/a/q/task/withdrawTask',
            {},
            {
              params: {
                taskId: this.taskDetails.id,
                accountId: this.user.id
              }
            }
          )
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success(this.taskDetails.address + ' 督办派单已撤回')
            } else {
              this.$message.error('请求出错')
            }
          })
      })
    },

    // 拒绝督办派单
    refuseTask() {
      this.$confirm(`确定拒绝督办派单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .post(
            '/carp/business/a/q/task/refuseTask',
            {},
            {
              params: {
                taskId: this.taskDetails.id,
                accountId: this.user.id
              }
            }
          )
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success(this.taskDetails.address + ' 已拒绝督办派单')
              // 关闭派单详情窗口
              this.close()
            } else {
              this.$message.error('请求出错')
            }
          })
      })
    },

    // 接单督办派单
    receiveTask() {
      this.$confirm(`接单督办派单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .post(
            '/carp/business/a/q/task/receiveTask',
            {},
            {
              params: {
                taskId: this.taskDetails.id,
                accountId: this.user.id
              }
            }
          )
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success(this.taskDetails.address + ' 已接单督办派单')
            } else {
              this.$message.error('请求出错')
            }
          })
      })
    }
  },
  components: {
    taskMake,
    taskTransmit
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
</style>
