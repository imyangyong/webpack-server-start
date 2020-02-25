/**
 * @file APP_NAME 用于
 * @author YOURNAME
 */

import {
  BaseModel,
  BaseAppView,

  bindView as bind,
  observable,
} from '@fe/utils/dev-pattern-vm';

@bind(BaseAppView)
class AppState extends BaseModel {
}

export default AppState;
