var app = getApp();
var util = require('../../utils/util.js');
Page({

  data: {
    islogin: false,
    id: "",
    local: null,
    iss: true,
    isa: true,
    summary: "",
    author_intro: "",
    book: {},
    others: {},
    good: false,
    collect: false,
    cart: false,
    reserve: false,
    have: false,
    iscomment: false,
    comment: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true

  },

  onLoad: function (options) {
    if (wx.getStorageSync('id')) {
      this.setData({
        islogin: true,
        id: wx.getStorageSync('id')
      })
    }
    var bookId = options.id;
    var yun = options.m;
    if (yun) {
      this.setData({
        local: false
      })
      var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyid&id=" + bookId;
      util.http(url, this.processHaveYun, 'get');
      var url = "https://api.douban.com/v2/book/" + bookId;
      util.http(url, this.processYunData, 'get');
    } else {
      this.setData({
        local: true
      })
      var url = app.globalData.http + "wxbook/api.php?c=book&a=getbookbyid&id=" + bookId;
      util.http(url, this.processData, 'GET');
    }
  },
  processHaveYun: function (data) {
    if (data) {
      this.setData({
        have: true
      })
    }
  },
  changecart: function () {
    var url = app.globalData.http + "wxbook/api.php?c=cart&a=changeCart&userid=" + this.data.id + "&bookid=" + this.data.book['id'];
    var title;
    if (this.data.cart) {
      title = "取消成功";
    } else {
      title = "加入成功";
    }
    wx.showToast({
      title: title,
    })
    util.http(url, this.processCart, 'GET');
  },
  processCart: function (data) {
    if (data) {
      this.setData({
        cart: true
      })
    } else {
      this.setData({
        cart: false
      })
    }
  },
  changegood: function () {
    var url = app.globalData.http + "wxbook/api.php?c=good&a=changeGood&userid=" + this.data.id + "&bookid=" + this.data.book['id'];
    util.http(url, this.processGood, 'GET');
  },
  processGood: function (data) {
    if (data) {
      this.setData({
        good: true
      })
    } else {
      this.setData({
        good: false
      })
    }
  },
  changecollect: function () {
    var url = app.globalData.http + "wxbook/api.php?c=collect&a=changeCollect&userid=" + this.data.id + "&bookid=" + this.data.book['id'];
    util.http(url, this.processCollect, 'GET');
  },
  processCollect: function (data) {
    if (data) {
      this.setData({
        collect: true
      })
    } else {
      this.setData({
        collect: false
      })
    }
  },
  processYunData: function (data) {
    if (!data) {
      return;
    }
    var summary = data['summary'];
    var author_intro = data['author_intro'];
    var book = {};
    book['bookid'] = data.id;
    book['isbn'] = data.isbn13;
    book['star'] = util.convertToStarsArray(data.rating.average / 2 + 0.5);
    book['title'] = data.title;
    book['image'] = data.images.large;
    book['rating'] = data.rating.average;
    book['author'] = data.author[0];
    book['tags'] = util.convertToCastString(data.tags);
    book['publisher'] = data.publisher;
    book['pubdate'] = data.pubdate;
    book['price'] = data.price;
    book['pages'] = data.pages;
    book['summary'] = data.summary;
    book['author_intro'] = data.author_intro;
    book['author_info'] = data.author_intro;
    book['count'] = 0; book['good'] = 0; book['collect'] = 0;
    if (data['summary'].length > 60) {
      book['summary'] = data['summary'].substring(0, 60) + "...";
    }
    if (data['author_intro'].length > 60) {
      book['author_intro'] = data['author_intro'].substring(0, 60) + "...";
    }

    var url = "https://api.douban.com/v2/book/search?q=" + data.title + "&tag=" + data.tags[0].name +
      "&start=0&count=5";
    util.http(url, this.processYunOthers, 'get');

    this.setData({
      summary: summary,
      author_intro: author_intro,
      book: book
    });
  },

  processData: function (data) {
    if (!data) {
      return;
    }
    var summary = data['summary'];
    var author_intro = data['author_intro'];
    data['star'] = util.convertToStarsArray(data['rating'] / 2 + 0.5);
    if (data['summary'].length > 60) {
      data['summary'] = data['summary'].substring(0, 60) + "...";
    }
    if (data['author_intro'].length > 60) {
      data['author_intro'] = data['author_intro'].substring(0, 60) + "...";
    }

    var url = app.globalData.http +
      "wxbook/api.php?c=book&a=getbookbytag&tag=" + data['tags'].substring(0, 1) +
      "&start=0&count=5";
    util.http(url, this.processOthers, 'get');

    this.setData({
      summary: summary,
      author_intro: author_intro,
      book: data
    });
    if (this.data.islogin) {
      //点赞
      var goodurl = app.globalData.http + "wxbook/api.php?c=good&a=checkGood&userid=" + this.data.id + "&bookid=" + data['id'];
      console.log(goodurl);
      util.http(goodurl, this.processGood, 'GET');
      //收藏
      var collecturl = app.globalData.http + "wxbook/api.php?c=collect&a=checkCollect&userid=" + this.data.id + "&bookid=" + data['id'];
      util.http(collecturl, this.processCollect, 'GET');
      //借书车
      var carturl = app.globalData.http + "wxbook/api.php?c=cart&a=checkCart&userid=" + this.data.id + "&bookid=" + data['id'];
      util.http(carturl, this.processCart, 'GET');
      //预定
      var reserveurl = app.globalData.http + "wxbook/api.php?c=reserve&a=checkReserve&userid=" + this.data.id + "&bookid=" + data['id'];
      util.http(reserveurl, this.processReserve, 'GET');
    }
    //评论
    var commenturl = app.globalData.http + "wxbook/api.php?c=comment&a=getcommentByBookid&bookid=" + data['bookid'];
    this.setData({
      requestUrl: commenturl
    })
    util.http(commenturl, this.processComment, 'GET');
  },
  processComment: function (data) {
    if (data.status == 0 && !this.data.isEmpty) {
      wx.hideNavigationBarLoading();
      return;
    }
    if (data.status == 1) {
      var data = data.comment;
      for (var i = 0; i < data.length; i++) {
        data[i]['star'] = util.convertToStarsArray(data[i]['rating'] / 2 + 0.5);
        data[i]['time'] = util.formatTime1(new Date(data[i]['create_time'] * 1000));
        data[i]['rating']='';
      }
      var comment;
      if (this.data.isEmpty) {
        comment = data;
        this.data.isEmpty = false;
      } else {
        comment = this.data.comment.concat(data);
      }
      this.setData({
        iscomment: true,
        comment: comment
      })
      wx.hideNavigationBarLoading();
      this.data.totalCount += 1;

    } else {
      this.setData({
        iscomment: false,
      })
    }
  },
  processYunOthers: function (data) {
    if (!data) {
      return;
    }
    data = data.books;
    var books = [];
    for (var i = 0; i < data.length; i++) {
      books[i] = {};
      books[i].bookid = data[i].id;
      books[i].star = util.convertToStarsArray(data[i].rating.average / 2 + 0.5);
      if (data[i].title.length > 6) {
        books[i].title = data[i].title.substring(0, 6) + "...";
      }
      books[i].image = data[i].images.large;
      books[i].rating = data[i].rating.average;
    }

    this.setData({
      others: books
    });
  },
  processOthers: function (data) {
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
  ons: function () {
    this.setData({
      iss: false
    })
  },
  offs: function () {
    this.setData({
      iss: true
    })
  },
  ona: function () {
    this.setData({
      isa: false
    })
  },
  offa: function () {
    this.setData({
      isa: true
    })
  },
  processReserve: function (data) {
    if (data) {
      this.setData({
        reserve: true
      })
    } else {
      this.setData({
        reserve: false
      })
    }
  },
  changereserve: function () {
    var url = app.globalData.http + "wxbook/api.php?c=reserve&a=changeReserve&userid=" + this.data.id + "&bookid=" + this.data.book['id'];
    util.http(url, this.processReserveData, 'GET');
  },
  processReserveData: function (data) {
    if (data.status == 0) {
      wx.showToast({
        title: data.message,
        duration:2000,
        image: '/images/icon/x.png'
      })
    } else {
      if (data.message == "预订成功，请在三天内前来借取") {
        this.setData({
          reserve: true
        })
      } else {
        this.setData({
          reserve: false
        })
      }
      wx.showToast({
        duration: 1500,
        title: data.message,
      })
    }
  },
  changecommend: function () {
    var data = this.data.book;
    data['userid'] = this.data.id;
    var url = app.globalData.http + "wxbook/api.php?c=commend&a=addCommend";
    util.http(url, this.processCommendData, 'POST', data);
  },
  processCommendData: function (data) {
    if (data.status == 0) {
      wx.showToast({
        duration: 1500,
        title: data.message,
        image: '/images/icon/x.png'
      })
    } else {
      wx.showToast({
        duration: 1500,
        title: data.message,
      })
    }
  },
  //上滑
  onReachBottom: function (event) {
    if (this.data.local) {
      var nextUrl = this.data.requestUrl +
        "&start=" + this.data.totalCount + "&count=10";
      util.http(nextUrl, this.processComment)
      wx.showNavigationBarLoading();
    }
  }

})