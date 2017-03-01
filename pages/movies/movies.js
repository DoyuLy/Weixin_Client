
/**
 * 必须要有分号,否则报错
 * require必须使用相对路径,资源可以使用绝对路径;且模板文件最好使用绝对路径引用图片
 * @import '' 和 <import src='' /> 可以使用绝对路径,也可以使用相对路径,但我们经常还是使用相对路径
 */
var util = require('../../utils/util.js');
var app = getApp();

Page({
    /**
     * 由于获取数据是异步的, 绑定是在onLoad函数完毕之后就立马开始绑定变量了,所以在异步获取数据时,
     * 必须提前定义好需要绑定的变量值(若你绑定的是你自己定义的变量的话)
     */
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanelShow: false,
    },
    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                that.processDoubanData(res.data, settedKey, categoryTitle)
            },
            fail: function (error) {
                // fail
                console.log(error)
            }
        })
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            // [1,1,1,1,1] [1,1,1,0,0]
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: moviesDouban.title, //categoryTitle,
            movies: movies,
            category: settedKey
        }
        this.setData(readyData);
    },

    onMoreTap: function (e) {
        var category = e.currentTarget.dataset.category;
        var title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category + "&title=" + title
        })
    },

    //此处体验有问题!!!
    onBindFocus: function (e) {
        //避免重复执行
        if (this.data.containerShow && !this.data.searchPanelShow) {
            this.data.containerShow = false;
            this.data.searchPanelShow = true;
            this.setData({
                containerShow: this.data.containerShow,
                searchPanelShow: this.data.searchPanelShow
            })
        }
    },

    /**
     * 搜索
     * 可以使用bindchange(文档里已删除,但api还支持) 与 bindblur 
     * bindblur支持真机的'完成', 在122100版本下模拟器也支持了回车事件
     * 同时122100版本增加了bindconfirm事件,  专门响应键盘的'完成'按钮
     */
    onBindConfirm: function (e) {
        var text = e.detail.value;
        if (text) {
            var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text.trim();
            this.getMovieListData(searchUrl, "searchResult", "");
        }
    },

    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {}  //清空查询的数据,否则下次再进入查询页面会发现数据没清除
        }
        )
    },

    //点击进入电影详情
    onMovieTap: function(e){
        var movieId = e.currentTarget.dataset.movieid;
        wx.navigateTo({
          url: 'movie-detail/movie-detail?id=' + movieId
        })
    }
})