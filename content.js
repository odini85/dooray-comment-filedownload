const Loader = {
  reqId: null,
  init() {
    cancelAnimationFrame(this.reqId);
    this.delayStartTimestamp = Date.now();
    this.checkLoad();
    console.log(`${this.config.title} 탐색 시작`);
  },
  data: {
    prev: {
      url: null,
    },
  },
  config: {
    title: "",
    delay: 30000,
    idSelector: "",
    containerSelector: "",
  },
  watch(config) {
    Loader.init();
    Object.assign(this.config, config);
    this.data.prev.url = location.href;

    setInterval(() => {
      const idElement = document.querySelector(this.config.idSelector);
      // console.log("watch interval!");
      if (
        this.data.prev.url !== location.href &&
        idElement &&
        idElement.innerText !== this.data.prev.id
      ) {
        Loader.init();
        View.destroy();
        this.data.prev.url = location.href;
      }
    }, 1000);
  },
  checkLoad() {
    if (Date.now() - this.delayStartTimestamp > 3000) {
      console.log(
        `${this.config.title} 탐색 허용 시간 초과!!`,
        Date.now() - this.delayStartTimestamp
      );
      return;
    } else {
      console.log(`${this.config.title} 여부 탐색중...`);
    }

    this.reqId = requestAnimationFrame(() => {
      if (!document.querySelector(this.config.containerSelector)) {
        this.checkLoad();
      } else {
        console.log(`${this.config.title} 탐색 성공!`);
        View.init();
        this.data.prev.id = document.querySelector(
          this.config.idSelector
        ).innerText;
      }
    });
  },
};

const View = {
  elements: {
    fileLists: [],
    downloadButtons: [],
  },
  init() {
    this.setElements();
    this.injectUI();
    this.bindEvent();
  },
  destroy() {
    this.elements.downloadButtons.forEach((el) => {
      el.removeEventListener("click", this.handlerDownload);
      el.remove();
    });
    this.elements.fileLists = [];
    this.elements.downloadButtons = [];
  },
  setElements() {
    this.elements.fileLists = [
      ...document.querySelectorAll(Loader.config.containerSelector),
    ];
  },
  injectUI() {
    this.elements.fileLists.forEach((el) => {
      const button = document.createElement("button");
      button.setAttribute("class", "u_btn_all_download");
      button.innerText = "첨부파일 모두 받기";
      el.after(button);
      this.elements.downloadButtons.push(button);
    });
  },
  bindEvent() {
    this.elements.downloadButtons.forEach((button) => {
      button.addEventListener("click", this.handlerDownload);
    });
  },
  handlerDownload(e) {
    const prevFileList = e.target.previousSibling;
    if (!prevFileList.classList.contains("attach-files-list")) {
      return;
    }

    const fileItems = [...prevFileList.querySelectorAll(".file-name")];
    fileItems.forEach((itemEl, t) => {
      setTimeout(() => {
        !(function (item) {
          const t = item.innerText.split(".")[0],
            n = item.href,
            a = document.createElement("a");
          if (
            ((a.href = n),
            (a.target = "_blank"),
            n.substring(n.lastIndexOf("/") + 1),
            (a.download = t),
            navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
              navigator.userAgent.search("Chrome") < 0)
          )
            document.location = a.href;
          else {
            var r = new MouseEvent("click", {
              view: window,
              bubbles: !0,
              cancelable: !1,
            });
            a.dispatchEvent(r),
              (window.URL || window.webkitURL).revokeObjectURL(a.href);
          }
        })(itemEl);
      }, 1e3 * t);
    });
  },
};

Loader.watch({
  idSelector: '.post-code.flex-none span[ng-bind="::$ctrl.post.number"]',
  containerSelector: ".dooray-comment-body .comment-content .attach-files-list",
  title: "댓글 파일 첨부",
});
