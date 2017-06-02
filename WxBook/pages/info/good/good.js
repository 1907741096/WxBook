var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: {},
    isEmpty: true,
    requestUrl: "",
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('id')) {
      var url = app.globalData.http + "wxbook/api.php?c=good&a=getgoodbyuserid&userid="+wx.getStorageSync('id');
      util.http(url, this.processData, 'get');
      this.data.requestUrl = url;
    }
  },
  processData:function(data){
    if (!data) {
      return;
    }
    var books = {};

    for (var i = 0; i < data.length; i++) {
      data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
      if (data[i]['title'].length > 6) {
        data[i]['title'] = data[i]['title'].substring(0, 6) + "...";
      }
    }
    if (this.data.isEmpty) {
      books = data;
      this.data.isEmpty = false;
    } else {
      books = this.data.books.concat(data);
    }
    this.setData({
      books: books
    });
    wx.hideNavigationBarLoading();
    this.data.totalCount += 9;
  },
  //上滑
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "&start=" + this.data.totalCount + "&count=9";
    util.http(nextUrl, this.processData)
    wx.showNavigationBarLoading();
  },
  //下拉
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "&star=0&count=9";
    this.data.books = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processData);
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