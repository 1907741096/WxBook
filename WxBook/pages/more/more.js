var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchPanelShow:false,
    searchResult: {},
    isEmpty: true,
    navigateTitile: "",
    requestUrl: "",
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tag=options.tag;
    var c=options.url;
    if(tag){
      var url = app.globalData.http + "wxbook/api.php?c=" + c + "&a=getbookbytag&tag="+tag;
    }else{
      var url = app.globalData.http + "wxbook/api.php?c=" + c + "&a=getbook";
    }
    util.http(url, this.processData, 'get');
    this.data.requestUrl = url;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  processData: function (data) {
    if (!data) {
      return;
    }
    var books={};

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
    this.data.totalCount += 20;
  },

  //上滑
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "&start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processData)
    wx.showNavigationBarLoading();
  },
  //下拉
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "&star=0&count=20";
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
      url: "../detail/detail?id=" +id,
    })
  },
  onCancelImgTap: function (event) {
    this.setData({
      searchPanelShow: false,
      searchResult: {}
    }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      searchPanelShow: true
    })
  },

  onBindInput: function (event) {
    var value=event.detail.value;
    if(value==''){
      this.setData({
        searchResult: []
      });
    }else{
      var url = this.data.requestUrl + "BySearch&search=" + value;
      util.http(url, this.processSearch, 'get');
    }
  },
  processSearch: function (data) {
    if (!data) {
      return;
    }

    for (var i = 0; i < data.length; i++) {
      data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
      if (data[i]['title'].length > 6) {
        data[i]['title'] = data[i]['title'].substring(0, 6) + "...";
      }
    }

    this.setData({
      searchResult: data
    });
  }
})