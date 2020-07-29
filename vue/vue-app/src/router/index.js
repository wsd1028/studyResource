import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    //测试页
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/main/demo.vue')
  },
  {
    //登录页
    path: '/',
    name: 'login',
    redirect: '/login'
  },
  {
    //登录页
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    //登录页（中转登录页面）
    path: '/loginModel',
    name: 'loginModel',
    component: () => import('@/views/login/LoginModel.vue')
  },
  {
    //登录页-惠工云-消纳站（中转登录页面）
    path: '/GarbageLogin',
    name: 'GarbageLogin',
    component: () => import('@/views/login/GarbageLogin.vue')
  },
  {
    //惠工云-企业首页
    path: '/huigong/company/home',
    name: 'HuigongCompanyHome',
    component: () => import('@/views/home/huigong/company-home.vue')
  },
  {
    //惠工云-政府首页
    path: '/huigong/government/home',
    name: 'HuigongGovernmentHome',
    component: () => import('@/views/home/huigong/government-home.vue')
  },
  //工作台事务 企业
  {
    path: '/work/company/workBusiness',
    name: 'work-workBusiness',
    component: () => import('@/views/work/company/WorkBusiness.vue')
  },
  //工作台待办事务 企业
  {
    path: '/work/company/workBusinessWait',
    name: 'work-workBusinessWait',
    component: () => import('@/views/work/company/WorkBusinessWait.vue')
  },
  //工作台我发起的事务 企业
  {
    path: '/work/company/workBusinessMine',
    name: 'work-workBusinessMine',
    component: () => import('@/views/work/company/WorkBusinessMine.vue')
  },
  //工作台已处理事务 企业
  {
    path: '/work/company/workBusinessFinish',
    name: 'work-workBusinessFinish',
    component: () => import('@/views/work/company/WorkBusinessFinish.vue')
  },
  //工作台事务 政府
  {
    path: '/work/government/workBusiness',
    name: 'workGov-workBusiness',
    component: () => import('@/views/work/government/WorkBusiness.vue')
  },
  //工作台待办事务 政府
  {
    path: '/work/government/workBusinessWait',
    name: 'workGov-workBusinessWait',
    component: () => import('@/views/work/government/WorkBusinessWait.vue')
  },
  //工作台我发起的事务 政府
  {
    path: '/work/government/workBusinessMine',
    name: 'workGov-workBusinessMine',
    component: () => import('@/views/work/government/WorkBusinessMine.vue')
  },
  //工作台已处理事务 政府
  {
    path: '/work/government/workBusinessFinish',
    name: 'workGov-workBusinessFinish',
    component: () => import('@/views/work/government/WorkBusinessFinish.vue')
  },
  //工作台车辆识别 企业
  {
    path: '/work/company/carIdentify',
    name: 'work-carIdentify',
    component: () => import('@/views/work/company/CarIdentify.vue')
  },
  //工作台车辆识别 政府
  {
    path: '/work/government/carIdentify',
    name: 'workGov-carIdentify',
    component: () => import('@/views/work/government/CarIdentify.vue')
  },
  //工作台车辆识别搜索 政府
  {
    path: '/work/government/carIdentifySearch',
    name: 'workGov-carIdentifySearch',
    component: () => import('@/views/work/government/CarIdentifySearch.vue')
  },
  //工作台车辆识别详情-项目列表 政府
  {
    path: '/work/government/carIdentifyDetailList',
    name: 'workGov-carIdentifyDetailList',
    component: () => import('@/views/work/government/CarIdentifyDetailList.vue')
  },
  //工作台车辆识别详情 政府
  {
    path: '/work/government/carIdentifyDetail',
    name: 'workGov-carIdentifyDetail',
    component: () => import('@/views/work/government/CarIdentifyDetail.vue')
  },
  //工作台排放监管项目 政府
  {
    path: '/work/government/dischargeSupervise',
    name: 'workGov-dischargeSupervise',
    component: () => import('@/views/work/government/DischargeSupervise.vue')
  },
  //工作台消纳监管 政府
  {
    path: '/work/government/absorption',
    name: 'workGov-absorption',
    component: () => import('@/views/work/government/Absorption.vue')
  },
  //工作台消纳监管搜索 政府
  {
    path: '/work/government/absorptionSearch',
    name: 'workGov-absorptionSearch',
    component: () => import('@/views/work/government/AbsorptionSearch.vue')
  },
  //工作台消纳监管详情 政府
  {
    path: '/work/government/absorptionDetail',
    name: 'workGov-absorptionDetail',
    component: () => import('@/views/work/government/AbsorptionDetail.vue')
  },
  //工作台工期管理 政府
  {
    path: '/work/government/duration',
    name: 'workGov-duration',
    component: () => import('@/views/work/government/Duration.vue')
  },
  //工作台工期管理搜索 政府
  {
    path: '/work/government/durationSearch',
    name: 'workGov-durationSearch',
    component: () => import('@/views/work/government/DurationSearch.vue')
  },
  //工作台工期管理详情 政府
  {
    path: '/work/government/durationDetail',
    name: 'workGov-durationDetail',
    component: () => import('@/views/work/government/DurationDetail.vue')
  },
  //工作台电子联单 企业
  {
    path: '/work/company/electronicForm',
    name: 'work-electronicForm',
    component: () => import('@/views/work/company/ElectronicForm.vue')
  },
  //工作台电子联单 政府
  {
    path: '/work/government/electronicForm',
    name: 'workGov-electronicForm',
    component: () => import('@/views/work/government/ElectronicForm.vue')
  },
  //工作台电子联单 政府
  {
    path: '/work/government/electronicFormSearch',
    name: 'workGov-electronicFormSearch',
    component: () => import('@/views/work/government/ElectronicFormSearch.vue')
  },
  //工作台电子联单列表 政府
  {
    path: '/work/government/electronicFormList',
    name: 'workGov-electronicFormList',
    component: () => import('@/views/work/government/ElectronicFormList.vue')
  },
  //工作台电子联单详情 政府
  {
    path: '/work/government/electronicFormDetail',
    name: 'workGov-electronicFormDetail',
    component: () => import('@/views/work/government/ElectronicFormDetail.vue')
  },
  //工作台工期管理 企业
  {
    path: '/work/company/duration',
    name: 'work-duration',
    component: () => import('@/views/work/company/Duration.vue')
  },
  //项目详情
  {
    path: '/home/company/projectDetail',
    name: 'company-projectDetail',
    component: () => import('@/views/home/company/ProjectDetail.vue')
  },
  //项目详情
  {
    path: '/home/company/projectDetail',
    name: 'company-projectDetail',
    component: () => import('@/views/home/company/ProjectDetail.vue')
  },
  //曝光台  企业
  {
    path: '/home/company/exposure',
    name: 'company-exposure',
    component: () => import('@/views/home/company/Exposure.vue')
  },
  //曝光台详情  企业
  {
    path: '/home/company/exposureDetail',
    name: 'company-exposureDetail',
    component: () => import('@/views/home/company/ExposureDetail.vue')
  },
  //曝光台  政府
  {
    path: '/home/government/exposure',
    name: 'government-exposure',
    component: () => import('@/views/home/government/Exposure.vue')
  },
  //曝光台详情  政府
  {
    path: '/home/government/exposureDetail',
    name: 'government-exposureDetail',
    component: () => import('@/views/home/government/ExposureDetail.vue')
  },
  //今日告警  企业
  {
    path: '/home/company/todayWarn',
    name: 'company-todayWarn',
    component: () => import('@/views/home/company/TodayWarn.vue')
  },
  //扬尘噪声  企业
  {
    path: '/home/company/DustNoise',
    name: 'company-dustNoise',
    component: () => import('@/views/home/company/DustNoise.vue')
  },
  //扬尘历史数据  企业
  {
    path: '/home/company/DustAgoData',
    name: 'company-dustAgoData',
    component: () => import('@/views/home/company/DustAgoData.vue')
  },
  //扬尘实时数据  企业
  {
    path: '/home/company/DustNowData',
    name: 'company-dustNowData',
    component: () => import('@/views/home/company/DustNowData.vue')
  },
  //今日扬尘告警  企业
  {
    path: '/home/company/deviceDustWarn',
    name: 'company-DeviceDustWarn',
    component: () => import('@/views/home/company/DeviceDustWarn.vue')
  },
  //扬尘告警  政府
  {
    path: '/home/government/dustWarn',
    name: 'government-dustWarn',
    component: () => import('@/views/home/government/DustWarn.vue')
  },
  //扬尘告警设备  政府
  {
    path: '/home/government/dustDevice',
    name: 'government-dustDevice',
    component: () => import('@/views/home/government/DustDevice.vue')
  },
  //扬尘告警信息  政府
  {
    path: '/home/government/deviceDustWarn',
    name: 'government-deviceDustWarn',
    component: () => import('@/views/home/government/DeviceDustWarn.vue')
  },
  //非名录车告警  政府
  {
    path: '/home/government/directoriesWarn',
    name: 'government-directoriesWarn',
    component: () => import('@/views/home/government/DirectoriesWarn.vue')
  },
  //非名录车告警详情  政府
  {
    path: '/home/government/directoriesWarnDetail',
    name: 'government-directoriesWarnDetail',
    component: () => import('@/views/home/government/DirectoriesWarnDetail.vue')
  },
  //今日巡检  企业
  {
    path: '/home/company/todayCheck',
    name: 'company-todayCheck',
    component: () => import('@/views/home/company/TodayCheck.vue')
  },
  //今日巡检  政府
  {
    path: '/home/government/todayCheck',
    name: 'government-todayCheck',
    component: () => import('@/views/home/government/TodayCheck.vue')
  },
  //今日巡检详情  企业
  {
    path: '/home/company/todayCheckDetail',
    name: 'company-todayCheckDetail',
    component: () => import('@/views/home/company/TodayCheckDetail.vue')
  },
  //今日巡检详情 政府
  {
    path: '/home/government/todayCheckDetail',
    name: 'government-todayCheckDetail',
    component: () => import('@/views/home/government/TodayCheckDetail.vue')
  },
  //今日巡检创建  整改
  {
    path: '/home/company/todayCheckUpdate',
    name: 'company-todayCheckUpdate',
    component: () => import('@/views/home/company/TodayCheckUpdate.vue')
  },
  //今日巡检创建  企业
  {
    path: '/home/company/todayCheckCreat',
    name: 'company-todayCheckCreat',
    component: () => import('@/views/home/company/TodayCheckCreat.vue')
  },
  //今日巡检创建  政府
  {
    path: '/home/government/todayCheckCreate',
    name: 'government-todayCheckCreate',
    component: () => import('@/views/home/government/TodayCheckCreate.vue')
  },
  //今日巡检审核  政府
  {
    path: '/home/government/todayChecking',
    name: 'government-todayChecking',
    component: () => import('@/views/home/government/TodayChecking.vue')
  },
  //督办派单  企业
  {
    path: '/home/company/dispatch',
    name: 'company-dispatch',
    component: () => import('@/views/home/company/Dispatch.vue')
  },
  //督办派单  政府
  {
    path: '/home/government/dispatch',
    name: 'dispatch',
    component: () => import('@/views/home/government/Dispatch.vue')
  },
  //督办派单新建  政府
  {
    path: '/home/government/dispatchCreate',
    name: 'dispatchCreate',
    component: () => import('@/views/home/government/DispatchCreate.vue')
  },
  //督办派单详情  企业
  {
    path: '/home/company/dispatchDetail',
    name: 'company-dispatchDetail',
    component: () => import('@/views/home/company/DispatchDetail.vue')
  },
  //督办派单详情  政府
  {
    path: '/home/government/dispatchDetail',
    name: 'dispatchDetail',
    component: () => import('@/views/home/government/DispatchDetail.vue')
  },
  //督办派单立即处理  企业
  {
    path: '/home/company/dispatchFix',
    name: 'company-dispatchFix',
    component: () => import('@/views/home/company/DispatchFix.vue')
  },
  //督办派单立即处理  政府
  {
    path: '/home/government/dispatchFix',
    name: 'dispatchFix',
    component: () => import('@/views/home/government/DispatchFix.vue')
  },
  //督办派单转发  政府
  {
    path: '/home/government/dispatchForward',
    name: 'dispatchForward',
    component: () => import('@/views/home/government/DispatchForward.vue')
  },
  //指派点检  企业
  {
    path: '/home/company/appointCheck',
    name: 'company-appointCheck',
    component: () => import('@/views/home/company/AppointCheck.vue')
  },
  //指派点检 政府
  {
    path: '/home/government/appointCheck',
    name: 'government-appointCheck',
    component: () => import('@/views/home/government/AppointCheck.vue')
  },
  //指派点检详情  企业
  {
    path: '/home/company/appointCheckDetail',
    name: 'company-appointCheckDetail',
    component: () => import('@/views/home/company/AppointCheckDetail.vue')
  },
  //指派点检详情  政府
  {
    path: '/home/government/appointCheckDetail',
    name: 'government-appointCheckDetail',
    component: () => import('@/views/home/government/AppointCheckDetail.vue')
  },
  //指派点检处理
  {
    path: '/home/company/appointCheckSetting',
    name: 'company-appointCheckSetting',
    component: () => import('@/views/home/company/AppointCheckSetting.vue')
  },
  //指派点检审核 政府
  {
    path: '/home/government/appointChecking',
    name: 'government-appointChecking',
    component: () => import('@/views/home/government/AppointChecking.vue')
  },
  //指派点检创建  政府
  {
    path: '/home/government/appointCheckCreate',
    name: 'government-appointCheckCreate',
    component: () => import('@/views/home/government/AppointCheckCreate.vue')
  },
  //问题上报  企业
  {
    path: '/home/company/problemReport',
    name: 'company-problemReport',
    component: () => import('@/views/home/company/ProblemReport.vue')
  },
  //问题上报 政府
  {
    path: '/home/government/problemReport',
    name: 'government-problemReport',
    component: () => import('@/views/home/government/ProblemReport.vue')
  },
  //问题上报详情  企业
  {
    path: '/home/company/problemReportDetail',
    name: 'company-problemReportDetail',
    component: () => import('@/views/home/company/ProblemReportDetail.vue')
  },
  //问题上报详情 政府
  {
    path: '/home/government/problemReportDetail',
    name: 'government-problemReportDetail',
    component: () => import('@/views/home/government/ProblemReportDetail.vue')
  },
  //新建问题上报  政府
  {
    path: '/home/government/problemReportCreat',
    name: 'government-problemReportCreat',
    component: () => import('@/views/home/government/ProblemReportCreat.vue')
  },
  //新建问题上报  企业
  {
    path: '/home/company/problemReportCreat',
    name: 'company-problemReportCreat',
    component: () => import('@/views/home/company/ProblemReportCreat.vue')
  },
  //关于我们
  {
    path: '/mine/aboutUs',
    name: 'aboutUs',
    component: () => import('@/views/mine/AboutUs.vue')
  },
  //个人信息
  {
    path: '/mine/mineMsg',
    name: 'mineMsg',
    component: () => import('@/views/mine/MineMsg.vue')
  },
  //修改密码
  {
    path: '/mine/password',
    name: 'password',
    component: () => import('@/views/mine/Password.vue')
  },
  //用户反馈
  {
    path: '/mine/feedback',
    name: 'feedback',
    component: () => import('@/views/mine/Feedback.vue')
  },
  //协议与说明
  {
    path: '/mine/protocol',
    name: 'protocol',
    component: () => import('@/views/mine/Protocol.vue')
  },
  //版本更新记录
  {
    path: '/mine/versionHistory',
    name: 'versionHistory',
    component: () => import('@/views/mine/VersionHistory.vue')
  },
  //设置
  {
    path: '/mine/setting',
    name: 'setting',
    component: () => import('@/views/mine/Setting.vue')
  },
  {
    //电子联单详情
    path: '/from/projectFormDetail',
    name: 'projectFormDetail',
    component: () => import('@/views/form/ProjectFormDetail.vue')
  },
  {
    //创建联单
    path: '/main/createForm',
    name: 'createForm',
    component: () => import('@/views/form/CreateForm.vue')
  },
  {
    //车牌识别
    path: '/main/licensePlate',
    name: 'licensePlate',
    component: () => import('@/views/form/LicensePlate.vue')
  },
  {
    //联单点检
    path: '/main/formDetail',
    name: 'formDetail',
    component: () => import('@/views/form/FormDetail.vue')
  },
  {
    //联单点检(详情/消纳员)
    path: '/main/formDetailGiven',
    name: 'formDetailGiven',
    component: () => import('@/views/form/FormDetailGiven.vue')
  },
  {
    //底部菜单栏
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/Main.vue'),
    children: [
      {
        //首页  企业
        path: '/main/company/home',
        name: 'company-home',
        component: () => import('@/views/home/company/Home.vue')
      },
      {
        //首页  政府
        path: '/main/government/home',
        name: 'government-home',
        component: () => import('@/views/home/government/Home.vue')
      },
      {
        //我的
        path: '/main/mine',
        name: 'mine',
        component: () => import('@/views/mine/Mine.vue')
      },
      {
        //工作台  企业
        path: '/main/company/work',
        name: 'company-work',
        component: () => import('@/views/work/company/Work.vue')
      },
      {
        //工作台  游客
        path: '/main/visitor/work',
        name: 'visitor-work',
        component: () => import('@/views/work/visitor/Work.vue')
      },
      {
        //工作台  政府
        path: '/main/government/work',
        name: 'government-work',
        component: () => import('@/views/work/government/Work.vue')
      }
    ]
  }
]

// 禁止全局路由错误处理打印
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/carp-app/' : '/',
  routes
})

export default router
