import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import usePixelStore from './modules/pixel';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, usePixelStore };
export default pinia;
