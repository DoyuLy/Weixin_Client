
var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    movies: {},
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    //inTheaters/comingSoon/top250
    /**
     * 页面传参的方式:
     * 1.全局变量
     * 2.缓存
     * 3.url传参
     * 4.browser观察者模式,即event事件模块发送消息,angular和react可以用此方式给跨子组件或组件间传递参数
     */
    var category = options.category;
    var title = options.title;
    this.data.navigateTitle = title;


    var dataUrl = "";
    switch (category) {
      case "inTheaters":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "comingSoon":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250": dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },

  processDoubanData: function (moviesDouban) {
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
      movies.push(temp);
    }

    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies
    });

    this.data.totalCount += 20;

    //关闭导航栏加载动画
    wx.hideNavigationBarLoading();

    //关闭刷新 
    wx.stopPullDownRefresh();
  },

  onReady: function () {
    var that = this;
    /**
     * 设置导航条;只能在onReady函数里,类似jQuery的ready函数
     * onLoad -> onShow -> onReady
     */
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  //放弃使用scroll-view组件,因为不支持下拉刷新
  // onScrollLower: function (e) {
  //   //必须给scroll-view一个指定的高度,否则不会触发bindscrolltolower等事件
  //   console.log('loading more...');

  //   /**
  //    * 此处有一个bug, 每次请求数据后应该有一个loading状态, 这样可以阻止用户频繁请求当前数据组以导致bug
  //    */
  //   var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
  //   util.http(nextUrl, this.processDoubanData);
  //   //导航栏出现加载动画
  //   wx.showNavigationBarLoading();
  // },

  /**
   * 130400版本后, scroll-view不支持下拉刷新,即无法触发onPullDownRefresh
   * 推荐使用页面滚动 : onReachBottom事件
   */
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20"; //默认是20条
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  //滑动到底部触发的page事件
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  }
})