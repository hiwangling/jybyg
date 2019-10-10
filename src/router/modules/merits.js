/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const meritsRouter = {
  path: '/merits',
  component: Layout,
  alwaysShow: true,
  name: 'Vuemerits',
  meta: { title: '车间绩效', icon: 'tab' },
  children: [
    {
      path: '/merits_days',
      name: 'Vuemerits',
      component: () => import('@/views/merits/merits_days'),
      meta: {
        title: '油量日统计',
        noCache: true,
        perms: ['post /api/v1/oil/list']
      }
    },
    {
      path: '/merits_mons',
      name: 'Vuemons',
      component: () => import('@/views/merits/merits_mons'),
      meta: {
        title: '油量月统计',
        noCache: true,
        perms: ['post /api/v1/oil/liststat']
      }
    },
    {
      path: '/oil',
      name: 'Vueoil',
      component: () => import('@/views/merits/oil'),
      meta: {
        title: '油量总统计',
        noCache: true,
        perms: ['post /api/v1/oil/statlist']
      }
    },
    {
      path: '/merits_stats',
      name: 'Vue_stats',
      component: () => import('@/views/merits/merits_stats'),
      meta: {
        title: '人员绩效',
        noCache: true,
        perms: ['post /api/v1/statistics/uid']
      }
    }

  ]
}
export default meritsRouter
