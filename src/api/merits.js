import request from '@/utils/request'

export function oillist(data) {
  return request({
    url: '/oil/list',
    method: 'post',
    data
  })
}

export function oiladd(data) {
  return request({
    url: '/oil/add',
    method: 'post',
    data
  })
}

export function oiledit(data) {
  return request({
    url: '/oil/edit',
    method: 'post',
    data
  })
}

export function oildel(query) {
  return request({
    url: '/oil/del',
    method: 'get',
    params: query
  })
}

export function oilstatlist(data) {
  return request({
    url: '/oil/statlist',
    method: 'post',
    data
  })
}

export function oilstatadd(data) {
  return request({
    url: '/oil/statadd',
    method: 'post',
    data
  })
}

export function oilstatedit(data) {
  return request({
    url: '/oil/statedit',
    method: 'post',
    data
  })
}

export function oilstatdel(query) {
  return request({
    url: '/oil/statdel',
    method: 'get',
    params: query
  })
}
export function oilliststat(data) {
  return request({
    url: '/oil/liststat',
    method: 'post',
    data
  })
}

