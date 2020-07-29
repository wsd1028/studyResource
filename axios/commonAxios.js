import axios from 'axios'
import store from '@/store'
import { Dialog } from 'vant'
import { dictionaries } from './dictionaries'

async function getArea() {
  let arr = await new Promise(async (resolve, reject) => {
    let areaList = []
    let code = store.state.user.user.accountTypeDto.code
    let resp0 = await axios.get('/carp/business/a/q/area/leading/level/page/3?parentId=' + dictionaries.mainAreaId)
    let resp = resp0.data
    if (resp.code == 0) {
      resp.data = resp.data.filter(item => {
        return item.code.includes(code)
      })
      if (store.state.user.user.accountTypeDto.code == 5115) {
        resp.data.unshift({
          id: 511500000000,
          code: 5115,
          name: '宜宾市'
        })
      }
      for (let i = 0; i < resp.data.length; i++) {
        areaList.push({
          text: resp.data[i].name,
          value: resp.data[i].code,
          areaId: resp.data[i].id
        })
      }
      resolve(areaList)
    } else {
      reject(areaList)
      Dialog.alert({
        message: '获取地区失败:' + resp.message,
        confirmButtonColor: 'red'
      })
    }
  })
  return arr
}

export { getArea }
