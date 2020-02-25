/**
 * @file: PAGE_NAME/index.js
 * @author: YOUR_NAME
 * @date: 2018/1/22
 * @description:
 */

import {
    observable,
    urlsync,
    BaseModel,
    bindView as bind
} from '@fe/utils/dev-pattern-vm'

import View from './View'

@bind(View)
class State extends BaseModel {

    @observable
    isFullScreen = false;

    init(props) {

    }
}

export default State
