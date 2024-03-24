import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKS: AppRouteRecordRaw = {
  path: '/works',
  name: 'works',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.works',
    requiresAuth: true,
    icon: 'icon-brush',
    order: 0,
  },
  children: [
    {
      path: 'pixel',
      name: 'pixel',
      component: () => import('@/views/works/pixel/index.vue'),
      meta: {
        locale: 'menu.works.pixel',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default WORKS;
