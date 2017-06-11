var app = getApp();
var util = require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    isEmpty:true,
    borrow:{}
  },
  onLoad: function () {
    var url = app.globalData.http +'wxbook/api.php?c=borrow&a=getAllBorrowByUserId&userid='+wx.getStorageSync('id');
    util.http(url,this.processData,'GET');
  },
  processData:function(data){
    if(data.status==0){
      this.setData({
        isEmpty: true,
        borrow: {}
      })
    }else{
      for(var i=0;i<data.borrow.length;i++){
        data.borrow[i]['borrow_time'] = util.formatTime2(new Date(data.borrow[i]['borrow_time']*1000));
        data.borrow[i]['return_time'] = util.formatTime2(new Date(data.borrow[i]['return_time']*1000));
      }
      this.setData({
        isEmpty: false,
        borrow: data.borrow
      })
    }
  },
  gocomment: function (event) {
    var bookid=event.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: 'comment/comment?bookid='+bookid
    })
  }
})
