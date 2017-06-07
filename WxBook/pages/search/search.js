var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    local: true,
    yun: true,
    searchPanelShow: false,
    searchResult: {},
    yunResult: {},
    requestUrl: "",
    book: {},
    totalCount: 0,
    yunUrl: "",
    isEmpty: true,
    localEmpty: true,
    searchLS:{}
  },
  onLoad: function (options) {
    var n = parseInt(Math.random() * 260, 10);
    var url = app.globalData.http + "wxbook/api.php?c=book&a=getbook";
    this.data.requestUrl = url;
    url += "bytag&tag=&start=" + n + "&count=6";
    util.http(url, this.processData, 'get');
    if (wx.getStorageSync('id')) {
      var searchurl = app.globalData.http + "wxbook/api.php?c=search&a=getSearchByUserId&userid=" + wx.getStorageSync('id');
      util.http(searchurl,this.processSearchLS,'GET');
    }
  },
  processSearchLS:function(data){
    if(data){
      this.setData({
        localEmpty:true,
        searchLS:data
      })
    }
  },
  onScanCode: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (that.data.local) {
          var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyisbn&isbn=" + res.result;
          that.data.searchPanelShow = true;
          util.http(url, that.processData, 'get');
        } else {
          var url = "https://api.douban.com/v2/book/isbn/" + res.result;
          that.data.searchPanelShow = true;
          util.http(url, that.processYunData, 'get');
        }
      },
      fail() {
        wx.showToast({
          title: "未识别出二维码",
          image: "/images/icon/x.png"
        })
      }
    })
  },
  processYunData: function (data) {
    if (!data) {
      return;
    }
    var books = {};
    books['rating'] = data['rating']['average'];
    books['image'] = data['images']['large'];
    books['star'] = util.convertToStarsArray(data['rating']['average'] / 2 + 0.5);
    if (data['title'].length > 6) {
      books['title'] = data['title'].substring(0, 6) + "...";
    } else {
      books['title'] = data['title'];
    }
    books['bookid'] = data['id'];
    this.setData({
      yunResult: { books: books },
      yun: false
    });
    wx.hideNavigationBarLoading();
    // this.data.totalCount += 6;
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
  processYunSearchData: function (data) {
    if (!data) {
      return;
    }
    data = data.books;
    var books = [];
    for (var i = 0; i < data.length; i++) {
      books[i] = {};
      books[i]['rating'] = data[i].rating['average'];
      books[i]['image'] = data[i].images['large'];
      books[i]['star'] = util.convertToStarsArray(data[i].rating['average'] / 2 + 0.5);
      if (data[i].title.length > 6) {
        books[i]['title'] = data[i].title.substring(0, 6) + "...";
      } else {
        books[i]['title'] = data[i].title;
      }
      books[i]['bookid'] = data[i].id;
    }

    if (this.data.isEmpty) {
      this.data.isEmpty = false;
    } else {
      books = this.data.yunResult.concat(books);
    }

    this.setData({
      yun: false,
      yunResult: books
    });
    wx.hideNavigationBarLoading();
    this.data.totalCount += 20;
  },
  //跳转详情
  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookid;
    if (this.data.local) {
      wx.navigateTo({
        url: "../detail/detail?id=" + id,
      })
    } else {
      wx.navigateTo({
        url: "../detail/detail?id=" + id + "&m=yun",
      })
    }
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
        localEmpty: true,
        searchResult: []
      });
    } else {
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
      localEmpty: false,
      searchResult: data
    });
  },
  onChange: function () {
    var n = parseInt(Math.random() * 260, 10);
    var url = this.data.requestUrl + "bytag&tag=&start=" + n + "&count=6";
    util.http(url, this.processData, 'get');
  },
  onYun: function () {
    this.setData({
      local: false
    })
  },
  offYun: function () {
    this.setData({
      local: true
    })
  },
  onYunSearch: function (event) {
    var value = event.detail.value;
    if (value == '') {
      this.setData({
        yunResult: [],
        yun: true
      });
    } else {
      this.setData({
        yunResult: [],
        isEmpty: true,
        totalCount: 0,
        yunUrl: ""
      });
      var url = "https://api.douban.com/v2/book/search?q=" + value + "&tag=" + value;
      this.setData({
        yunUrl: url
      })
      util.http(url, this.processYunSearchData, 'get');
    }
  },
  //上滑
  onReachBottom: function (event) {
    if (!this.data.local && this.data.yunUrl != "") {
      var nextUrl = this.data.yunUrl +
        "&start=" + this.data.totalCount + "&count=20";
      util.http(nextUrl, this.processYunSearchData)
      wx.showNavigationBarLoading();
    }
  },
  //下拉
  onPullDownRefresh: function (event) {
    if (!this.data.local && this.data.yunUrl != "") {
      var refreshUrl = this.data.yunUrl +
        "&star=0&count=20";
      this.data.books = {};
      this.data.isEmpty = true;
      this.data.totalCount = 0;
      util.http(refreshUrl, this.processYunSearchData);
      wx.showNavigationBarLoading();
    }
  },
  onSearch: function (event) {
    if (wx.getStorageSync('id')) {
      var value = event.detail.value;
      var url = app.globalData.http + 'wxbook/api.php?c=search&a=addSearch&userid=' + wx.getStorageSync('id') + '&content=' + value;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {

        }
      })
    }
  },
  deleteSearch:function(){
    var url = app.globalData.http + "wxbook/api.php?c=search&a=deleteSearchByUserId&userid=" + wx.getStorageSync('id');
    util.http(url, this.processDelete, 'GET');
  },
  processDelete:function(data){
    this.setData({
      searchLS: {}
    })
  }
})