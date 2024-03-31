import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import usePixelGridStore from './modules/pixel-gird';
import usePixelCanvasStore from './modules/pixel-canvas';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, usePixelGridStore, usePixelCanvasStore };
export default pinia;
