var app = getApp();
var util = require('../../../utils/util.js');
Page({

  data: {
    messages:{},
    isEmpty: true,
    requestUrl: "",
    totalCount: 0
  },

  
  onLoad: function (options) {
    var id=wx.getStorageSync('id');
    var checkurl=app.globalData.http+'wxbook/api.php?c=message&a=checkMessageByUserId&userid='+id;
    util.http(checkurl,this.processCheck,'GET');
  },
  processCheck:function(data){
    var url = app.globalData.http + 'wxbook/api.php?c=message&a=getMessageByUserId&userid='+wx.getStorageSync('id');
    util.http(url, this.processMessage, 'GET');
    this.data.requestUrl = url;
  },
  processMessage:function(data){
    console.log(data);
    if(!data){
      wx.hideNavigationBarLoading();
      return;
    }
    for(var i=0;i<data.length;i++){
      if (data[i]['content'].length > 20) {
        data[i]['content'] = data[i]['content'].substring(0, 20) + "...";
      }
      data[i]['time'] = util.formatTime1(new Date(data[i]['time'] * 1000));
    }
    var messages={};
    if (this.data.isEmpty) {
      messages = data;
      this.data.isEmpty = false;
    } else {
      messages = this.data.messages.concat(data);
    }

    this.setData({
      messages:messages
    })

    wx.hideNavigationBarLoading();
    this.data.totalCount += 10;
  },
  //上滑
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "&start=" + this.data.totalCount + "&count=10";
    util.http(nextUrl, this.processMessage)
    wx.showNavigationBarLoading();
  },
  //下拉
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "&star=0&count=10";
    this.data.messages = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processMessage);
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