function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}
function http(url, callBack, method) {
  var that = this;
  wx.request({
    url: url,
    data: {},
    method: method,
    header: {
      "Content-Type": "app/xml"
    }, // 设置请求的 header
    success: function (res) {
      callBack(res.data);
      // success
    },
    fail: function (res) {
      // fail
    },
    complete: function (res) {
      // complete
    }
  })
}
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + "/";
  }
  return castsjoin.substring(0, castsjoin.length - 1);
}
function convertToCastInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos, convertToCastInfos
}