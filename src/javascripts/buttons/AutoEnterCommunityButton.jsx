import $ from 'jquery'
import React from 'react';
import ReactDOM from 'react-dom';
import Buttons from "../buttons/Buttons"
import IdHolder from "../modules/IdHolder";
import PageType from "../modules/PageType";
import Storage from "../modules/Storage";

export default class AutoEnterCommunityButton extends React.Component {
  constructor() {
    super();
    this.state = { isToggledOn: null };
    this._className      = 'auto_enter_community_button';
    this._label          = `(このコミュニティに) 自動入場`;
    this._balloonMessage = `このコミュニティ・チャンネルが放送を始めたとき自動で枠を新しいタブで開きます．
                            [⚠️負荷軽減のため最大登録数は5を目安にしてください]
                            [💡自動次枠移動を ON にすると自動入場しません]`;
    this._balloonPos    = 'up';
    this._balloonLength = 'xlarge';
    this.onClick        = this.onClick.bind(this);
  }

  componentDidMount() {
    this.setUp();
  }

  setUp() {
    chrome.runtime.sendMessage({
        purpose: 'getFromNestedLocalStorage',
        key: 'autoEnterCommunityList'
      },
      (response) => {
        const idHolder = new IdHolder();
        if (response[idHolder.communityId]) {
          this.setState({ isToggledOn: true });
        } else {
          this.setState({ isToggledOn: false });
        }
      }
    );
  }

  toggle() {
    if (this.state.isToggledOn) {
      this.setState({ isToggledOn: false });
    } else {
      this.setState({ isToggledOn: true });
    }
  }

  onClick(e) {
    if (this.state.isToggledOn) {
      this.removeAsAutoEnter();
    } else {
      this.saveAsAutoEnter();
    }
    this.toggle();
  }

  saveAsAutoEnter() {
    const idHolder  = new IdHolder();
    const id        = idHolder.communityId;
    const thumbnail = $('meta[property="og:image"]').attr('content');
    const pageType  = PageType.get();
    const openDate  = null;
    let title, owner;
    switch(pageType) {
      case 'COMMUNITY_PAGE':
        title = $('div.communityData > h2.title > a').text().replace(/[ ]/, '');
        owner = $('div.communityData tr.row:first-child > td.content > a').text().replace(/[ ]/, '');
        break;
      case 'CHANNEL_PAGE':
        title = $('h3.cp_chname').text();
        owner = $('p.cp_viewname').text();
        break;
      case 'NORMAL_CAST_PAGE':   // PAIR A
      case 'OFFICIAL_CAST_PAGE':  // PAIR A
        title = $($('.commu_info').find('a').get(0)).html() || $('.ch_name').html();
        owner = $('.nicopedia_nushi').find('a').text() || $('.company').text();
        break;
      case 'MODERN_CAST_PAGE':
        title = $('.program-community-name').text();
        owner = $($('.program-broadcaster-name').find('a').get(0)).text();
        break;
      default:
    }
    Storage.saveToNestedLocalStorage('autoEnterCommunityList', id, {
      state: 'init',
      thumbnail: thumbnail,
      title: title,
      openDate: openDate,
      owner: owner
    });
  }

  removeAsAutoEnter() {
    const idHolder = new IdHolder();
    const id = idHolder.communityId;
    Storage.removeFromNestedLocalStorage('autoEnterCommunityList', id);
  }

  render() {
    return (
      <span className={this._className + (' on_off_button')} onClick={this.onClick}>
          <a className={'link ' + (this.state.isToggledOn ? 'switch_is_on' : 'switch_is_off')}
            data-balloon={this._balloonMessage}
            data-balloon-pos={this._balloonPos}
            data-balloon-length={this._balloonLength}>
            {(this.state.isToggledOn ? `${this._label}ON` : `${this._label}OFF`)}
          </a>
      </span>
    );
  }
}
