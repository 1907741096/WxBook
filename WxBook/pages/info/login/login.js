var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  goreg:function(){
    wx.navigateTo({
      url: '../reg/reg',
    })
  },
  wxlogin:function(){
    wx.getUserInfo({
      success:function(res){
        console.log(res);
      }
    })
  },
  formSubmit:function(event){
    var data = event.detail.value;
    if (data.username == '') {
      wx.showToast({
        title: '请输入账号',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    if (data.password.length == '') {
      wx.showToast({
        title: '请输入密码',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    var url = app.globalData.http + "wxbook/api.php?c=user&a=checkUser";
    util.http(url, this.loginResult, 'POST', data);
  },
  loginResult:function(data){
    if (data.status == 0) {
      wx.showToast({
        title: data.message,
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    wx.showToast({
      title: '登陆成功',
      duration: 1000,
      success:function(){
        util.sleep(1000);
        wx.setStorageSync('id', data.id);
        wx.switchTab({
          url: '../info'
        })
      }
    })
  }
})