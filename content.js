const FileDownloader = {
  init() {
    this.checkLoad();
  },
  checkLoad() {
    setInterval(() => {
      const fileList = document.querySelectorAll(
        ".dooray-comment-body .comment-content .attach-files-list:not([data-copy])"
      );
      if (fileList.length) {
        this.renderDownButton(fileList);
      }
    }, 1000);
  },
  renderDownButton(fileList) {
    [...fileList].forEach((el) => {
      const button = document.createElement("button");
      button.setAttribute("class", "u_btn_all_download");
      button.innerText = "첨부파일 모두 받기";
      el.after(button);
      el.dataset.copy = true;
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

FileDownloader.init();
