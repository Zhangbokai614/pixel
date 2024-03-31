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
      path: 'pixel-canvas',
      name: 'pixel-canvas',
      component: () => import('@/views/works/pixel-canvas/index.vue'),
      meta: {
        locale: 'menu.works.pixel.canvas',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'pixel-grid',
      name: 'pixel-grid',
      component: () => import('@/views/works/pixel-grid/index.vue'),
      meta: {
        locale: 'menu.works.pixel.grid',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'pixel-node',
      name: 'pixel-node',
      component: () => import('@/views/works/pixel-node/index.vue'),
      meta: {
        locale: 'menu.works.pixel.node',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default WORKS;
