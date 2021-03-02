const Loader = {
  reqId: null,
  init() {
    cancelAnimationFrame(this.reqId);
    this.delayStartTimestamp = Date.now();
    this.ready();
  },
  ready() {
    if (Date.now() - this.delayStartTimestamp > 3000) {
      console.log(
        "댓글 파일 첨부 탐색 허용 시간 초과",
        Date.now() - this.delayStartTimestamp
      );
      return;
    } else {
      console.log("댓글 파일 첨부 여부 탐색중...");
    }

    this.reqId = requestAnimationFrame(() => {
      if (
        !document.querySelector(
          ".dooray-comment-body .comment-content .attach-files-list"
        )
      ) {
        this.ready();
      } else {
        console.log("댓글 파일 첨부 탐색 성공!");
        View.init();
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
    });
    this.elements.fileLists = [];
    this.elements.downloadButtons = [];
  },
  setElements() {
    this.elements.fileLists = [
      ...document.querySelectorAll(
        ".dooray-comment-body .comment-content .attach-files-list"
      ),
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
    // console.log("injected!", this.elements.fileLists);
  },
  bindEvent() {
    // console.log("this.elements.downloadButtons", this.elements.downloadButtons);
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

Loader.init();

let prevUrl = location.href;
setInterval(() => {
  if (prevUrl !== location.href) {
    View.destroy();
    Loader.init();
    prevUrl = location.href;
  }
}, 1000);
