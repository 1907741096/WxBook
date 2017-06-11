var app = getApp();
var util = require('../../../utils/util.js');
Page({

  data: {
    orders:{}
  },
  
  onLoad: function (options) {
    var url = app.globalData.http+'wxbook/api.php?c=order&a=getOrderByUserId&userid='+wx.getStorageSync('id');
    util.http(url,this.processData,'GET');
  },
  processData:function(data){
    for(var i=0;i<data.length;i++){
      data[i].time = Math.floor(data[i].time/60);
    }
    this.setData({
      orders: data
    })
    wx.hideNavigationBarLoading();
  },
  //下拉
  onPullDownRefresh: function (event) {
    var url = app.globalData.http + 'wxbook/api.php?c=order&a=getOrderByUserId&userid=' + wx.getStorageSync('id');
    util.http(url, this.processData, 'GET');
    wx.showNavigationBarLoading();
  },
  //跳转详情
  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: "../../detail/detail?id=" + id,
    })
  },
})