import request from '@/utils/request'
// 接运任务
export function listCartask(data) {
  return request({
    url: '/carsend/task',
    method: 'post',
    data
  })
}

export function editCarstatus(data) {
  return request({
    url: '/carsend/state',
    method: 'post',
    data
  })
}

export function editsend(data) {
  return request({
    url: '/carsend/edit',
    method: 'post',
    data
  })
}

export function createcarcommon(query) {
  return request({
    url: '/carsend/common',
    method: 'get',
    params: query
  })
}

export function editinfoService(query) {
  return request({
    url: '/carsend/editinfo',
    method: 'get',
    params: query
  })
}
// 礼宾任务

export function protocollist(data) {
  return request({
    url: '/protocol/list',
    method: 'post',
    data
  })
}
export function protocolinfo(data) {
  return request({
    url: '/protocol/info',
    method: 'post',
    data
  })
}

