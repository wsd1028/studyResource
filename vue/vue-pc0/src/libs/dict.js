/* *
 * 今日巡检状态字典表
 * 索引 0:整改中 1:待审核 2:已结案
 * */
export const todayCheckStateDict = [
  { label: '整改中', code: '5120', type: 'primary' },
  { label: '待审核', code: '5130', type: 'warning' },
  { label: '已结案', code: '5140', type: 'success' }
]

/* *
 * 指派点检状态字典表
 * 索引 0:整改中 1:待审核 2:已结案 3:已作废
 * */
export const commandCheckStateDict = [
  { label: '整改中', code: '5210', type: 'primary' },
  { label: '待审核', code: '5220', type: 'warning' },
  { label: '已结案', code: '5230', type: 'success' },
  { label: '已作废', code: '5240', type: 'danger' }
]

/* *
 * 账号类型
 * 索引 0:政府 1:项目 2:消纳站
 * */
export const workStationDict = [
  { label: '政府', code: '6000' },
  { label: '项目', code: '6008' },
  { label: '消纳站', code: '6009' }
]

/* *
 * 告警记录状态字典表
 * 索引 0:待审核 1:已审核
 * */
export const warningStateDict = [
  { label: '待审核', code: '5050', type: 'warning' },
  { label: '已审核', code: '5070', type: 'success' }
]

/* *
 * 工期状态字典表
 * 索引 0:筹备 1:立项 2.在建 3.完工 4.停工
 * */
export const projectStateDict = [
  { label: '筹备', code: '740', type: 'info', markerIcon: '/project-preparation.png' },
  { label: '立项', code: '741', type: '', markerIcon: '/project-approval.png' },
  { label: '在建', code: '742', type: 'warning', markerIcon: '/project-build.png' },
  { label: '完工', code: '743', type: 'success', markerIcon: '/project-success.png' },
  { label: '停工', code: '744', type: 'danger', markerIcon: '/project-danger.png' }
]

/* *
 * 政府创建用户类型字典表
 * */
export const userDict = [
  { label: '主管部门', code: '50' },
  { label: '消纳员', code: '60' },
  { label: '运输公司', code: '70' },
  { label: '设备厂商', code: '80' }
]
