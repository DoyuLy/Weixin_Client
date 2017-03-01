Page({
    //注意这里需要定义一个空结构，否则会报错
    onTap: function(e){
        /**
         * 注意wx.navigateTo是跳转到子级页面，会记录navigate导航记录
         * 会触发onHide生命周期事件
         */
        // wx.navigateTo({
        //   url: '../posts/post',
        //   success: function(res){
        //     console.log('子页面跳转成功！')
        //   },
        //   fail: function() {},
        //   complete: function() {}
        // })

        /**
         * wx.redirectTo 是一个平级页面间的跳转
         * 会触发onUnload生命周期事件
         */
        // wx.redirectTo({
        //   url: '../posts/post',
        //   success: function(res){
        //     console.log(res)
        //   },
        //   fail: function(e) {
        //       console.log(e)
        //   },
        //   complete: function() {}
        // })

         /**
         * 用于跳转到tabBar
         * 122100版本中,若要跳转到tabBar,则必须使用此方法; 但是从tabBar页面跳转到子页面还是使用navigateTo
         */
        wx.switchTab({
          url: '../posts/post',
          success: function(res){
            console.log(res)
          },
          fail: function(e) {
              console.log(e)
          },
          complete: function() {}
        })
    },
    onUnload: function(){
        console.log('卸载welcome页面')
    },
    onHide: function(){
        console.log('隐藏welcome页面')
    }
})