var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.login({
      success:function(res){
        var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + app.globalData.appid + "&secret=" + app.globalData.secret+"&js_code="+res.code+"&grant_type=authorization_code";
        util.http(url,that.processData,"GET");
      }
    })
  },
  processData:function(data){
    this.setData({
      openid:data.openid
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  formSubmit: function(event){
    var data = event.detail.value;
    if(data.username==''){
      wx.showToast({
        title: '请输入账号',
        image:"/images/icon/x.png",
        duration:1000
      })
      return;
    }
    if (data.password.length < 6) {
      wx.showToast({
        title: '密码不少于6位',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    if (data.password != data.password1) {
      wx.showToast({
        title: '两次密码不一致',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    if (data.school == '') {
      wx.showToast({
        title: '请输入学校',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    var that=this;
    wx.getUserInfo({
      success:function(res){
        data.face=res.userInfo.avatarUrl;
        data.name = res.userInfo.nickName;
        data.sex = res.userInfo.gender;
        data.openid=that.data.openid;
        var url = app.globalData.http + "wxbook/api.php?c=user&a=addUser";
        util.http(url, that.regResult, 'POST', data);
      }
    })
  },
  regResult:function(data){
    if(data.status==0){
      wx.showToast({
        title: data.message,
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    wx.showModal({
      title: '注册成功',
      content: '是否用此账号登录',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('id', data.id);
          wx.switchTab({
            url: '../info',
          })
        } else if (res.cancel) {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
  }
})