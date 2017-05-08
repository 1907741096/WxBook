//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    // wx.scanCode({
    //   success: function(res){
    //     console.log(res.result);
    //     wx.request({
    //       url: 'https://api.douban.com/v2/book/isbn/:'+res.result,
    //       data: {},
    //       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //       header: {"Content-Type": "application/json"}, // 设置请求的 header
    //       success: function(book){
    //         // success
    //         console.log(book);
    //       },
    //       fail: function(res) {
    //         // fail
    //       },
    //       complete: function(res) {
    //         // complete
    //       }
    //     })
    //   },
    //   fail: function(res) {
    //     console.log(res);
    //   },
    //   complete: function(res) {
    //     console.log(res);
    //     // complete
    //   }
    // })
  }
})
