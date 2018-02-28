export default class Thumbnail {
  static createElement(params) {
    const {
      key,
      preload,
      background,
      title,
      url,
      id,
      isReserved,
      text,
      day,
      openTime,
      index
    } = params;

    const thumbnail = document.createElement("div");
    thumbnail.id = id;
    thumbnail.className = "community-hover-wrapper";
    thumbnail.dataset.toggle = "tooltip";
    thumbnail.dataset.placement = "top";
    thumbnail.dataset.title = title;

    const inner = document.createElement("div");
    inner.className = "community";

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";

    const span = document.createElement("span");
    span.className = "comu_thumbnail";
    span.style.backgroundImage = background;
    // span.tooltip();

    thumbnail.appendChild(inner);
    inner.appendChild(a);
    a.appendChild(span);

    return thumbnail;
  }
}
