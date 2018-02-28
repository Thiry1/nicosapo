import store from "store";
import Common from "../common/Common";
import Time from "../common/Time";

export default class UserThumbnails {
  static getParams(programs) {
    if (programs.length === 0) {
      const message = document.createElement("div");
      message.className = "message";
      message.textContent = "フォロー中の コミュニティ・チャンネル が放送している番組がありません．";
    }

    const thumbParams = [];
    programs.forEach((program, index) => {
      const thumbParam = {};
      const thumbnailUrl = program.querySelector("community thumbnail").textContent;
      const startTime = program.querySelector("video open_time_jpstr").textContent - 0;
      const date = new Date(startTime * 1000);
      thumbParam.background = `url('${thumbnailUrl}')`;
      thumbParam.title = program.querySelector("video title").textContent;
      thumbParam.id = program.querySelector("video id").textContent;
      thumbParam.url = `http://live.nicovideo.jp/watch/${thumbParam.id}`;
      thumbParam.isReserved = UserThumbnails.isReserved(program);
      thumbParam.day = `${date.getDate()}(${Common.jpDay(date.getDay())})`;
      thumbParam.openTime = thumbParam.isReserved ? Time.jpDateFormat(startTime) + " 開場" : undefined;
      thumbParam.text = thumbParam.title;
      thumbParam.index = index;
      if (!thumbParam.isReserved || store.get("options.showReserved.enable") == "enable") {
        thumbParams.push(thumbParam);
      }
    });
    return thumbParams;
  }

  static isReserved(program) {
    const is_reserved = program.querySelector("video is_reserved").textContent;
    return is_reserved == "true";
  }
}
