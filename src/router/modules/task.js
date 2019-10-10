/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const taskRouter = {
  path: '/task',
  component: Layout,
  alwaysShow: true,
  name: 'Vuetask',
  meta: { title: '任务中心', icon: 'star' },
  children: [
    {
      path: '/cartask',
      name: 'Vuecartask',
      component: () => import('@/views/task/cartask'),
      meta: {
        title: '接运管理',
        noCache: true,
        perms: ['post /api/v1/carsend/task']
      }
    },
    {
      path: '/fire',
      name: 'Vuefire',
      component: () => import('@/views/task/fire'),
      meta: {
        title: '火化管理',
        noCache: true,
        perms: ['post /api/v1/cremation/list']
      }
    },
    {
      path: '/protocol',
      name: 'Vueprotocol',
      component: () => import('@/views/task/protocol'),
      meta: {
        title: '礼宾管理',
        noCache: true,
        perms: ['post /api/v1/protocol/list']
      }
    }

  ]
}
export default taskRouter
