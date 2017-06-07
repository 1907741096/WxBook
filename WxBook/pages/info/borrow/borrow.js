var app = getApp();
var util = require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    isEmpty:true,
    borrow:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: 'comment/comment'
    })
  },
  onLoad: function () {
    var url=app.globalData.http+'wxbook/api.php?c=borrow&a=getBorrowByUserId&userid='+wx.getStorageSync('id');
    util.http(url,this.processData,'GET');
  },
  processData:function(data){
    console.log(data);
  }
})
