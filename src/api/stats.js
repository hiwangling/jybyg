import request from '@/utils/request'
// 统计
export function statscheck(data) {
  return request({
    url: '/statistics/check',
    method: 'post',
    data
  })
}
export function statscarsend(data) {
  return request({
    url: '/statistics/carsend',
    method: 'post',
    data
  })
}
export function statsobituary(data) {
  return request({
    url: '/statistics/obituary',
    method: 'post',
    data
  })
}
export function statscarmonth(data) {
  return request({
    url: '/statistics/carmonth',
    method: 'post',
    data
  })
}
export function statderate(data) {
  return request({
    url: '/statistics/derate',
    method: 'post',
    data
  })
}

export function statsunknown(data) {
  return request({
    url: '/statistics/unknown',
    method: 'post',
    data
  })
}
export function statservices(data) {
  return request({
    url: '/statistics/services',
    method: 'post',
    data
  })
}
export function statsupplies(data) {
  return request({
    url: '/statistics/supplies',
    method: 'post',
    data
  })
}
export function statswreath(data) {
  return request({
    url: '/statistics/wreath',
    method: 'post',
    data
  })
}
export function statswreathList(data) {
  return request({
    url: '/statistics/wreathList',
    method: 'post',
    data
  })
}
export function excelobituary(data) {
  return request({
    url: '/statistics/excelobituary',
    method: 'post',
    data
  })
}

export function excelderateAll(data) {
  return request({
    url: '/statistics/excelderateAll',
    method: 'post',
    data
  })
}

export function excelderate(data) {
  return request({
    url: '/statistics/excelderate',
    method: 'post',
    data
  })
}

export function carsendper(data) {
  return request({
    url: '/carsend/per',
    method: 'post',
    data
  })
}
export function coldobituary(data) {
  return request({
    url: '/cold/obituary',
    method: 'post',
    data
  })
}
export function statisticsgather(data) {
  return request({
    url: '/statistics/gather',
    method: 'post',
    data
  })
}
export function statisticsuid(data) {
  return request({
    url: '/statistics/uid',
    method: 'post',
    data
  })
}

