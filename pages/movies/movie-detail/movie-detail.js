
/**
 * 这里备注一下image组件的设置模式
 * 老版本有3种缩放模式(新版本里多了widthFix, 一共4种), 9种裁剪模式
 * scaleToFill: 默认; 拉伸填满image元素,不保持纵横比导致图片变形(一般不使用)
 * aspectFit  : 常用模式; 保证图片长边能完全显示,则意味着图片能完全显示且保持了纵横比
 * aspectFill : 不常用; 虽然保持了纵横比, 但是由于只保证了短边能完全显示,会造成图片长边可能被裁剪掉一部分(默认保留中间部分)
 * widthFix   : 新增; 宽度不变, 高度自适应(意思是高度不可控了)
 * 注意裁剪缩放前提是需要设置image的宽高,否则一般是没有意义的; 若不设置宽高, 默认宽是320px(文档说的是300px,实际测试为320px)
 * 其他9种就是裁取图片的不同部分, 不添加样式默认也是320px宽度
 * 
 */

//var util = require('../../../utils/util.js');
import { Movie } from 'class/Movie.js';
var app = getApp();
Page({
  data: {
    movie: null
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    //util.http(url, this.processDoubanData);
    var movie = new Movie(url);
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })

    /**
     * lambda表达式里的context是函数定义的上下文,而非调用方函数的context
     * 请参考C#的lambda表达式的规范,左侧是匿名函数的参数, 右侧是匿名函数的函数体(我们称之为表达式或语句块)
     * 1. 左侧: 只有一个参数时可以省略(), ()=> {exp}  以及 (p1, p2) => {exp} 不能省略括号;
     *          高级语言中, 对于是否省略类型请查阅文档,js弱类型不涉及此问题
     * 2. 右侧: 为表达式时,可以省略{}; 若为代码块,不能省略
     */
    movie.getMovieData(movie => 
      this.setData({
        movie: movie
      })
    )
  },


  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }
})