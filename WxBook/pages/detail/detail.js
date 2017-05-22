var app = getApp();
var util = require('../../utils/util.js');
Page({

  data: {
    book: {},
    others:{}
  },

  onLoad: function (options) {
    var bookId = options.id;
    var url = app.globalData.http+"wxbook/api.php?c=book&a=getbookbyid&id=" + bookId;
    util.http(url, this.processData, 'get');
  },

  processData: function (data) {
    if (!data) {
      return;
    }
    data['star'] = util.convertToStarsArray(data['rating']/2+0.5);

    var url =app.globalData.http+
    "wxbook/api.php?c=book&a=getbookbytag&tag="+data['tags'].substring(0,1)+
    "&start=0&count=5";
    util.http(url, this.processOthers, 'get');

    this.setData({
      book: data
    });
  },
  processOthers:function(data){
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
      others: data
    });
  },
  //查看图片
  viewBookPostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示图片的http链接
      urls: [src]//需要预览的图片http链接列表
    })
  },
  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: "../detail/detail?id=" + id,
    })
  }
})