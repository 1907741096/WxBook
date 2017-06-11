var app = getApp();
var util = require('../../utils/util.js');
Page({
    data: {
      banner:[
        
      ],
      top250:[

      ],
      newbook:[

      ],
      hotbook:[

      ]
    },
    onLoad: function (options) {
        //生命周期函数--监听页面加载
      var url = app.globalData.http + "wxbook/api.php?c=Position&a=getPosition&id=1";
      util.http(url, this.processBannerData, 'get');

      var url = app.globalData.http + "wxbook/api.php?c=Top250&a=getbook&start=0&count=10";
      util.http(url, this.processTop250Data, 'get');

      var url = app.globalData.http + "wxbook/api.php?c=NewBook&a=getbook&start=0&count=10";
      util.http(url, this.processNewBookData, 'get');

      var url = app.globalData.http + "wxbook/api.php?c=HotBook&a=getbook&start=0&count=10";
      util.http(url, this.processHotBookData, 'get');
      
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    },
    ontagTap:function(event){
      var tag = event.target.dataset.tag;
      var url = 'Book'
      wx.navigateTo({
        url: '../more/more?url=' + url + '&tag=' + tag
      });
    },
    onbookTap:function(event){
      var id=event.currentTarget.dataset.bookid;
      wx.navigateTo({
        url: '../detail/detail?id='+id,
      });
    },
    onMoreTap:function(event){
      var url = event.currentTarget.dataset.url;
      wx.navigateTo({
        url: '../more/more?url=' + url,
      });
    },
    processBannerData: function (data) {
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
        banner: data
      });
    },
    processTop250Data: function (data) {
      if (!data) {
        return;
      }

      for(var i=0;i<data.length;i++){
        data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
        if (data[i]['title'].length > 6) {
          data[i]['title'] = data[i]['title'].substring(0, 6) + "...";
        }
      }
      var books={
        books:data,
        name:'豆瓣top250',
        url:'Top250'
      }
      
      this.setData({
        top250: books
      });
    },
    processNewBookData: function (data) {
      if (!data) {
        return;
      }

      for (var i = 0; i < data.length; i++) {
        data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
        if (data[i]['title'].length > 6) {
          data[i]['title'] = data[i]['title'].substring(0, 6) + "...";
        }
      }

      var books={
        books:data,
        name:'新书速递',
        url:'NewBook'
      }

      this.setData({
        newbook: books
      });
    },
    processHotBookData: function (data) {
      if (!data) {
        return;
      }

      for (var i = 0; i < data.length; i++) {
        data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
        if (data[i]['title'].length > 6) {
          data[i]['title'] = data[i]['title'].substring(0, 6) + "...";
        }
      }

      var books = {
        books: data,
        name: '近期热门',
        url: 'HotBook'
      }

      this.setData({
        hotbook: books
      });
    },
    gomore:function(){
      wx.switchTab({
        url: '../search/search',
      })
    }
})