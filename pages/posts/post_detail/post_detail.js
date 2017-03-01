/**
 * 1.使用缓存来实现收藏功能与取消功能
 * 2.同步与异步模式获取缓存,若非必要请使用同步方式
 * 3.wx.showModal 与 wx.showToast 的使用
 * 4.wx.showActionSheet交互与分享(目前还不支持分享)
 * 5.音乐媒体播放常用的2个接口,微信也实现了audio组件,自身也是使用8个音乐媒体接口实现的;  注意音乐和封面不能使用本地文件
 * 6.catchTap 和 bindTap 冒泡与捕获的区别
 * 7.平级跳转与子级页面的跳转
 * 8.模板的使用,只支持模板,不支持模板里写js(即不支持模块化)
 * 9.globalData的使用
 */
var postsData = require('../../../data/posts_data.js')
//内置函数getApg
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.data.currentPostId = postId;
        console.log('接受参数' + postId);
        var data = postsData.postList[postId];
        this.setData({
            postData: data
        })

        var postsCollected = wx.getStorageSync('posts_collected');
        //缓存已存在
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            //缓存还不存在
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        //设置音乐播放全局变量, 以便再次进入详情页时不会出现状态不同步
        //同时只有全局记录的音乐id和当前页面的音乐id一致时才可以更改状态
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == postId) {
            this.setData({
                isPlayingMusic: true
            })
        }

        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        /**
         * 由于媒体播放微信提供了全局事件,我们需要微信的事件来同步我们的业务代码
         */
        var _this = this;
        // 播放时
        wx.onBackgroundAudioPlay(function () {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            /**
             * 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
             * 当前页面的postid，只处理当前页面的音乐播放。
             */
            if (currentPage.data.currentPostId === _this.data.currentPostId &&
                app.globalData.g_currentMusicPostId == _this.data.currentPostId) {
                _this.setData({
                    isPlayingMusic: true
                })
            }

            //设置当前音乐的播放状态: '播放' 
            app.globalData.g_isPlayingMusic = true;
            //记录当前播放的是哪一个页面的音乐（既然已经使用页面栈getCurrentPages(),就无需使用g_currentMusicPostId）
            //app.globalData.g_currentMusicPostId = _this.data.currentPostId;
        })
        // 暂停时
        wx.onBackgroundAudioPause(function () {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === _this.data.currentPostId &&
                app.globalData.g_currentMusicPostId == _this.data.currentPostId) {
                _this.setData({
                    isPlayingMusic: false
                })
            }

            //设置当前音乐的播放状态:  '暂停'
            app.globalData.g_isPlayingMusic = false;
            //一旦暂停则清空当前记录
            //app.globalData.g_currentMusicPostId = null;
        })
        // 播放完毕时; 所有状态相当于重置为初始化
        wx.onBackgroundAudioStop(function () {
            _this.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            //app.globalData.g_currentMusicPostId = null;
        })
    },

    //收藏/取消收藏
    onCollectionTap: function (e) {
        // this.getPostsCollectedSync(); //同步
        this.getPostsCollectedAsync();   //异步
    },

    getPostsCollectedAsync: function () {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSync: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                console.log('作用域: ' + this)
                if (res.confirm) {
                    // 更新文章是否的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function (postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: 'success', //loading
            success: function () { },
            fail: function () { },
            complete: function () { }
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
            // app.globalData.g_currentMusicPostId = null;
            app.globalData.g_isPlayingMusic = false;
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    }
})