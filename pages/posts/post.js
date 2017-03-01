var postsData = require('../../data/posts_data.js')
Page({
  data:{
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载

    //注意：在之前的版本里可以直接使用this.data.postList = postsData.postList; 之后的122100版本只能使用this.setData()
    this.setData({
       postList: postsData.postList
      });
  },
  onPostTap: function(e){
    var postId = e.currentTarget.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: 'post_detail/post_detail?id=' + postId 
    })
  },

  onSwiperTap: function (event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post_detail/post_detail?id=" + postId
    })
  },

  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})