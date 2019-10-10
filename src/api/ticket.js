import request from '@/utils/request'
// 花圈列表
export function listwreath(data) {
  return request({
    url: 'http://byg.dybzgls.com/ytj/v1/wreath/list',
    method: 'post',
    data
  })
}
