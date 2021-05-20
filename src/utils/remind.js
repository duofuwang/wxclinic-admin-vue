/*
 * @Author: your name
 * @Date: 2021-02-05 16:44:07
 * @LastEditTime: 2021-02-08 09:03:12
 * @LastEditors: Please set LastEditors
 * @Description: 用于提醒新消息
 * @FilePath: \JChat\src\utils\changeTItle.js
 */
export default class Remind {
    beforeTitle = ''
    titleTimer
    unread = 0
    constructor() {
        this.saveTitle()
    }

    saveTitle () {
        const { title } = document
        this.beforeTitle = title
    }
    resetTitle (title) {
        document.title = title || this.beforeTitle
        clearTimeout(this.titleTimer)
    }
    changeTitle (unread) {
        const that = this
        this.unread = unread
        let flage = 0;
        this.resetTitle(this.beforeTitle)
        change()
        Remind.showBrowser.call(this)
  
        function change () {
          let title = "【未读】"
          if (flage) {
            title = "【" + that.unread + "条】"
          }
          flage = !flage
          that.titleTimer = setTimeout(() => {
            that.resetTitle(title + that.beforeTitle)
            change()
          }, 1000);
        }
    }
    static showBrowser () {
        if (window.Notification && Notification.permission !== "denied") {
            const { unread } = this
            Notification.requestPermission(function (status) {
            if (status === "granted")
                new Notification('新消息', {
                body: `您总共有${unread}条消息未读。`
                });
            });
        }
    }
}