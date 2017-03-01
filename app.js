
App({
    globalData: {
        g_isPlayingMusic: false,
        g_currentMusicPostId: null,
        doubanBase: "https://api.douban.com"
    },
    //应用程序启动时触发,仅启动时触发一次
    onLaunch: function () {

    },
    //程序前台运行时会触发,一旦后台运行改为前台运行即刻触发
    onShow: function () {

    },
    //后台运行时即刻触发
    onHide: function () {

    },
    onError: function (msg) {
        //在最早的版本是没有onError函数的
    }
})