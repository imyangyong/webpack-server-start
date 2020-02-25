/**
 * @file PAGE_NAME 页面入口组件
 * @author YOURNAME
 */

import {
    computed,
    Component,
    BaseView,
    h,
    e,
    suh,
} from '@fe/utils/dev-pattern-vm'

import urlUtils from 'utils/url-utils';

import pageStyle from './style.use.less'

@suh(pageStyle)
@Component
export default class IndexPage extends BaseView {
    render(r) {
        const {local} = this;

        return h.div('no-entry-page', {},
            h(local.matrixCanvasVM),
            h.div('redirect-button', {},
                h.a({href: '/_thread_/pages/_thread_.html'},
                    '模块未打开, 跳转至管理面板'
                )
            )
        )
    }
}
