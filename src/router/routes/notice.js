/*
 * @Author: jiapeng.Zheng
 * @Date: 2018-06-07 17:08:16
 * @Last Modified by: jiapeng.Zheng
 * @Last Modified time: 2019-01-09 15:50:30
 * @description: 消息中心路由
 *    1、路由的全路径 componentUrl 要和 component 的路径匹配，用于动态加载组件
 *       因为动态路由生成器$VueRouterGenerator.generator 是根据'@views/${componentUrl}'加载组件的
 *    2、所有的路由必须属于主框架'@views/Frame'路由下，
 *       因为$VueRouterGenerator.generator生成的路由统一挂载在 '@views/Frame' 组件下
 */
// import Frame from '@views/Frame'
import { $utils } from '@helper'

export default [
  {
    path: '/notice',
    component: resolve => require.ensure([], () => resolve(require('@views/Frame')), 'frame'),
    // component: resolve => require(['@views/Frame'], resolve),
    ...$utils.titleLang('通知管理', 'Notice Manager'),
    children: [
      {
        path: 'list',
        ...$utils.titleLang('通知中心', 'Notice Center'),
        meta: {
          title: $utils.titleLang('通知中心', 'Notice Center'),
          ignoreAuth: false
        },
        component: resolve => require.ensure([], () => resolve(require('@views/notice/list')), 'noticeList'),
        // component: resolve => require(['@views/notice/list'], resolve),
        componentUrl: 'notice/list'
      }
    ]
  }
]
