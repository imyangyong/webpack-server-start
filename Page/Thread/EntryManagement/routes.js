import { wrapState } from '@fe/utils/dev-pattern-vm';

export default {
  routes: [
    {
      path: '/home',
      alias: '/',
      component: wrapState(null, import(/* webpackChunkName: "common" */'./IndexPageVM'), {}),
    },
  ],
};
