var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,
    face:"",
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = wx.getStorageSync('id');
    var url = app.globalData.http + "wxbook/api.php?c=user&a=getUserById&id=" + id;
    util.http(url, this.processData, 'GET');
  },
  processData: function (data) {
    this.setData({
      face:data.face,
      user: data
    })
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
  formSubmit:function(event){
    var data = event.detail.value;
    wx.showNavigationBarLoading();
    if(data['name']==''){
      wx.showToast({
        title: '昵称不能为空',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    if(data['school']==''){
      wx.showToast({
        title: '学校不能为空',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    wx.uploadFile({
      url: '',
      filePath: '',
      name: '',
    })
    data['sex']=this.data.sex;
    data['id']=this.data.user.id;
    var url=app.globalData.http+"wxbook/api.php?c=user&a=updateUser";
    util.http(url,this.processUpdate,"POST",data);
  },
  processUpdate(data){
    wx.hideNavigationBarLoading();
    if (data.status == 0) {
      wx.showToast({
        title: data.message,
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    wx.showToast({
      title: data.message,
      duration: 1000      
    })
  },
  radioChange:function(event){
    var sex=event.detail.value;
    this.setData({
      sex:sex
    })
  },
  chooseface:function(){
    var that=this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        that.setData({
          face: res.tempFilePaths
        })
      },
    })
  }
})