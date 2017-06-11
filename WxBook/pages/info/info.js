var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:false,
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    staus: 1,
    translate: '',
    carts:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (wx.getStorageSync('id')) {
      var id = wx.getStorageSync('id');
      var url = app.globalData.http + "wxbook/api.php?c=user&a=getUserById&id=" + id;
      util.http(url, this.processData, 'GET');
      this.setData({
        islogin: true
      });
      var url = app.globalData.http + "wxbook/api.php?c=cart&a=getcartbyuserid&userid=" + id;
      util.http(url, this.processCart, 'get');
    } else {
      this.setData({
        islogin: false
      });
    }
  },
  processCart: function (data) {
    if (!data) {
      return;
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i]['title'].length > 7) {
        data[i]['title'] = data[i]['title'].substring(0, 7) + "...";
      }
    }
    this.setData({
      carts: data
    });
  },
  deletecart:function(event){
    var id = event.currentTarget.dataset.id;
    var url = app.globalData.http + "wxbook/api.php?c=cart&a=deleteCartById&id=" + id;
    util.http(url, this.processDelete, 'GET');
  },
  processDelete:function(data){
    var url = app.globalData.http + "wxbook/api.php?c=cart&a=getcartbyuserid&userid=" + wx.getStorageSync('id');
    util.http(url, this.processCart, 'get');
  },
  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: "../detail/detail?id=" + id,
    })
  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0px)',
        open: false,
      })
    } else {
      this.setData({
        translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)',
        open: true,
      })
    }
  },
  tap_start: function (e) {
    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (this.data.staus == 1) {
     
      this.data.startmark = e.touches[0].pageX;
    } else {
     
      this.data.startmark = e.touches[0].pageX;
    }

  },
  tap_drag: function (e) {
    
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.newmark <= this.data.startmark) {
        return;
      }
      if (this.data.staus == 1) {
        if (this.data.windowWidth * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {
          this.setData({
            translate: 'transform: translateX(' + Math.abs(this.data.newmark - this.data.startmark) + 'px)'
          })
        }
      }

    }
    
    else if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 2 && this.data.startmark - this.data.newmark < this.data.windowWidth * 0.75) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + this.data.windowWidth * 0.75 - this.data.startmark) + 'px)'
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    if (this.data.staus == 1 && this.data.startmark >= this.data.newmark) {
      return;
    }
    if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      } else {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
        })
        this.data.staus = 2;
      }
    } else {
      if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowWidth * 0.2)) {
        this.setData({
          translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
        })
        this.data.staus = 2;
      } else {
        this.setData({
          translate: 'transform: translateX(0px)'
        })
        this.data.staus = 1;
      }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  },
  gologin:function(){
    wx.navigateTo({
      url: 'login/login',
    })
  },
  processData:function(data){
    this.setData({
      user:data
    })
  },
  outlogin: function () {
    wx.removeStorageSync('id');
    this.setData({
      islogin: false,
      user: {},
      carts:{}
    })
  },
  viewBookPostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示图片的http链接
      urls: [src]//需要预览的图片http链接列表
    })
  },
  goprofile:function(){
    wx.navigateTo({
      url: 'profile/profile',
    })
  },
  gogood: function () {
    wx.navigateTo({
      url: 'good/good',
    })
  },
  gocollect: function () {
    wx.navigateTo({
      url: 'collect/collect',
    })
  },
  scancode:function(){
    if(!this.data.islogin){
      wx.showToast({
        title: "请先登录",
        image: "/images/icon/x.png"
      })
      return;
    }
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if(res.result.length==13){
          var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyisbn&isbn=" + res.result;
        }else{
          var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyid&id=" + res.result;
        }
        util.http(url, that.addCart, 'get');
      },
      fail(){
        wx.showToast({
          title: "未识别出二维码",
          image: "/images/icon/x.png"
        })
      }
    })
  },
  addCart:function(data){
    var that=this;
    if(data){
      var carts = that.data.carts;
      for(var i=0;i<carts.length;i++){
        if(data['bookid']==carts[i].bookid){
          wx.showToast({
            title: "请勿重复添加",
            image: "/images/icon/x.png"
          })
          return;
        }
      }
      wx.showModal({
        title: '扫码成功',
        content: '是否加入借书车?',
        success(res){
          if(res.confirm){
            var url = app.globalData.http + "wxbook/api.php?c=cart&a=changeCart&userid=" + wx.getStorageSync('id') + "&bookid=" + data['id'];
            util.http(url, that.processDelete, 'GET');
          }
        }
      })
    }else{
      wx.showToast({
        title:"未找到该图书",
        image:"/images/icon/x.png"
      })
    }
  },
  goreserve:function(){
    wx.navigateTo({
      url: 'reserve/reserve',
    })
  },
  gosetting:function(){
    wx.navigateTo({
      url: 'setting/setting',
    })
  },
  goborrow:function(){
    wx.navigateTo({
      url: 'borrow/borrow',
    })
  },
  goorder: function () {
    wx.navigateTo({
      url: 'order/order',
    })
  },
  gomessage:function(){
    if(wx.getStorageSync('id')){
      wx.navigateTo({
        url: 'message/message',
      })
    }else{
      wx.showToast({
        title:'请先登录',
        image:'/images/icon/x.png'
      })
    }
  }
})