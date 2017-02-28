import $ from 'jquery';
import React from 'react'
import ReactDOM from 'react-dom';
import Thumbnail from '../components/Thumbnail';

const thumbParams = [];

export default class OfficialThumbnails extends React.Component {
  constructor(props) {
    super(props);
    thumbParams.length = 0;
  }

  setParams() {
    this.props.programs.forEach((program, index) => {
      const $program    = $(program);
      const thumbParam  = {};
      const communityId = $program.find('.video_text a').attr('href');
      const regexp      = /http\:\/\/ch.nicovideo.jp\/channel\/(.+)/;
      const resultarr   = regexp.exec(communityId);
      let thumbnailUrl;
      if (resultarr != null) {
        thumbnailUrl = `http://icon.nimg.jp/channel/${resultarr[1]}.jpg`;
      } else {
        thumbnailUrl = $program.find('.info a img').attr('src');
      }
      thumbParam.background = `url('${thumbnailUrl}')`;
      thumbParam.title      = $program.find('.video_title').text();
      thumbParam.id         = `lv${$program.find('.video_id').text()}`;
      thumbParam.url        = `http://live.nicovideo.jp/watch/${thumbParam.id}`;
      thumbParam.text       = thumbParam.title;
      thumbParam.index      = index;
      thumbParam.openTime   = ($program.has('.reserve').length) ? (`20${$program.find('.time').text()} 開場`) : (undefined);
      thumbParams.push(thumbParam);
    });
  }

  render() {
    this.setParams();
    const thumbs = thumbParams.map((thumbParam) =>
      <Thumbnail
        background = {thumbParam.background}
        title      = {thumbParam.title}
        url        = {thumbParam.url}
        id         = {thumbParam.id}
        text       = {thumbParam.text}
        index      = {thumbParam.index}
        openTime   = {thumbParam.openTime} />
    );
    return (
      <div id="container">{thumbs}</div>
    );
  }
}
