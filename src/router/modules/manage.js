/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageRouter = {
  path: '/manage',
  component: Layout,
  alwaysShow: true,
  name: 'Vuemanage',
  meta: { title: '接待中心', icon: 'list' },
  children: [
    {
      path: '/carsend',
      name: 'Vuecarsend',
      component: () => import('@/views/manage/carsend'),
      meta: {
        title: '接运管理',
        noCache: true,
        perms: ['post /api/v1/carsend/list']
      }
    },
    {
      path: '/vocational',
      name: 'Vuevocational',
      component: () => import('@/views/manage/vocational'),
      meta: {
        title: '业务办理',
        noCache: true,
        perms: ['post /api/v1/obituary/list']
      }
    },
    {
      path: '/save',
      name: 'Vuesave',
      component: () => import('@/views/manage/save'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['post /api/v1/check/list']
      }
    },
    {
      path: '/basic',
      name: 'Vuebasic',
      component: () => import('@/views/manage/basic'),
      meta: {
        title: '低保管理',
        noCache: true,
        perms: ['post /api/v1/financeDerate/list']
      }
    },
    {
      path: '/finance',
      name: 'Vuefinance',
      component: () => import('@/views/manage/finance'),
      meta: {
        title: '业务结算',
        noCache: true,
        perms: ['post /api/v1/finance/list']
      }
    }

  ]
}
export default manageRouter
