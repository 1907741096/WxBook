var app = getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    searchPanelShow: false,
    searchResult: {},
    requestUrl: "",
  },
  onLoad:function(options){
    var n=parseInt(Math.random()*260, 10);
    var url = app.globalData.http + "wxbook/api.php?c=book&a=getbook";
    this.data.requestUrl = url;
    url+="bytag&tag=&start="+n+"&count=6";
    util.http(url, this.processData, 'get');
  },
  onScanCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyisbn&isbn="+res.result;
        that.data.searchPanelShow = true;
        util.http(url, that.processData, 'get');
      },
      fail(res){

      }
    })
  },
  processData: function (data) {
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
    books = data;
    this.setData({
      books: books
    });
    wx.hideNavigationBarLoading();
   // this.data.totalCount += 6;
  },
  //跳转详情
  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: "../detail/detail?id=" + id,
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
    var value = event.detail.value;
    if (value == '') {
      this.setData({
        searchResult: []
      });
    } else {
      var url = this.data.requestUrl + "BySearch&search=" + value;
      console.log(url);
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
  },
  onChange:function(){
    var n = parseInt(Math.random() * 260, 10);
    var url = this.data.requestUrl+"bytag&tag=&start=" + n + "&count=6";
    util.http(url, this.processData, 'get');
  }
})