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
  action,
  bindView as bind,
  toJS,
} from '@fe/utils/dev-pattern-vm';

import urlUtils from 'utils/url-utils';
import debounce from 'lodash/debounce';
import agent from '../../utils/ajaxDevPost';
import View from './View';
import MatrixCanvasVM from '../../common/MatrixCanvasVM';


@bind(View)
class State extends BaseModel {
    @observable
    entryList = [];

    matrixCanvasVM = new MatrixCanvasVM();

    constructor(...args) {
      super(...args);

      this.debounceSyncEntries = debounce(this.debounceSyncEntries, 1200, {
        trailing: true,
      });
    }

    init(props) {
      agent.devPost('/all-entries')
        .then(res => {
          const entryList = [];
          for (const key in res.data) {
            res.data[key].key = key;
            res.data[key].isLoading = false;

            entryList.push(res.data[key]);
          }
          this.assign({ entryList });
        });
    }

    @action
    toggleEntry(entry, value) {
      entry.isLoading = true;
      entry.turnedOn = value;

      this.debounceSyncEntries();
    }

    @action
    removeLoadingStatus() {
      this.entryList.forEach(entry => entry.isLoading = false);
    }

    @action
    debounceSyncEntries() {
      agent.devPost('/toggle-entries', {
        data: {
          entries: this.entryList.map(entry => ({ id: entry.key, checked: entry.turnedOn })),
        },
      }).then(() => this.removeLoadingStatus());
    }

    handleEntryNavigate(entryKey) {
      window.open(urlUtils.link('', null, entryKey));
    }
}

export default State;
