/**
 * @file PAGE_NAME 页面入口组件
 * @author YOURNAME
 */

import {
    computed,
    BaseView,
    Component,
    h,
    e,
    suh,
} from '@fe/utils/dev-pattern-vm'

import pageStyle from './style.use.less'

@suh(pageStyle)
@Component
export default class IndexPage extends BaseView {

    renderEntryBlockList() {
        const {local} = this;
        return h.div('entry-block-list', {},
            local.entryList.map(
                entry => {
                    return h.div('entry-block', {key: entry.key},
                        h.span('check-box', {},
                            e.checkbox( {
                                checked: entry.turnedOn,
                                disabled: entry.openOnDefault,
                                onChange: e => local.toggleEntry(entry, e)
                            })
                        ),
                        h.span('entry-title', {}, entry.key),
                        e.button( 'entry-button', {
                            size: 'small',
                            loading: entry.isLoading,
                            disabled: !entry.turnedOn,
                            onClick: e => local.handleEntryNavigate(entry.key)
                        }, '跳转到模块')
                    )
                }
            )
        );
    }

    render(r) {
        h.bindCreateElement(r);
        const {local} = this;

        return h.div('matriks-ui-page', {},
            h.div('matriks-title', {},
                h(local.matrixCanvasVM),
                h.div('title-text', {},
                    'Thread 工程管理面板',
                ),
            ),

            this.renderEntryBlockList(),

            h.div('copyright', {},
                'Powered by ',
                h.span('mark', {}, 'Vue'),
                ' | Author ',
                h.span('mark', {}, 'Angus Yang')
            )
        )
    }

}
