/**
 * @file DXHY_TAX    //入口文件
 * @author YOURNAME
 */

import { start } from '@fe/utils/dev-pattern-vm';

import getRoutes from './routes';
import AppState from './AppState';

const app = new AppState();

// i18n.load()
//     .then(() => start(getRoutes, app, errorRoutes));
start(getRoutes, app, document.getElementById('app'));
