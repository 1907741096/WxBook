var app = getApp();
var util = require('../../../../utils/util.js');
Page({

  data: {
    bookid:'',
    userid:'',
    book:{},
    color:'limegreen'
  },
  onLoad: function (options) {
    var bookid=options.bookid;
    var userid=wx.getStorageSync('id');
    this.setData({
      bookid:bookid,
      userid:userid
    })
    var url = app.globalData.http + "wxbook/api.php?c=book&a=getbook&id=" + bookid;
    util.http(url, this.processData, 'GET');
  },
  processData:function(data){
    if(!data){
      return;
    }
    this.setData({
      book:data
    })
  },
  onslider:function(event){
    var value=event.detail.value;
    if(value>=8){
      this.setData({
        color:'limegreen'
      })
    }else if(value<=3){
      this.setData({
        color: 'red'
      })
    }else{
      this.setData({
        color: '#FFD700'
      })
    }
  },
  addcomment:function(event){
    var data=event.detail.value;
    data['userid']=this.data.userid;
    data['bookid']=this.data.book['bookid'];
    var url=app.globalData.http+'wxbook/api.php?c=comment&a=addcomment';
    util.http(url,this.processComment,'POST',data);
  },
  processComment:function(data){
    if(data){
      wx.showToast({
        title: '评论成功',
        duration: 1500,
        success: function () {
          util.sleep(1000);
          wx.redirectTo({
            url: '../borrow'
          })
        }
      })
    }else{
      wx.showToast({
        title: '评论失败',
        image:'/images/icon/x.png'
      })
    }
  }
})