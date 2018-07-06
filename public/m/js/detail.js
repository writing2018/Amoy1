var letao
$(function () {
    letao = new Letao();

    letao.selectSize();

    var productid = getQueryString('productid');
    letao.getProductDetail(productid);
  })
  
  var Letao = function () {
  
  }
  
  Letao.prototype = {
    // 初始化轮播图
    initSlider: function () {
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    },
    getProductDetail: function (id) {
      $.ajax({
        url: '/product/queryProductDetail',
        data: {
          id: id
        },
        success: function (data) {

          var start = data.size.split('-')[0]-0;
          var end = data.size.split('-')[1]-0;
          var arr = [];
          for(var i = start; i < end; i++){
            arr.push(i);
          }
          // console.log(arr);
          data.size = arr;

          var html = template('productDetailTmp',data);
          $('#product').html(html);
          // console.log(data);
          mui('.mui-numbox').numbox()

          // 渲染轮播图
          var slideHtml = template('productSlideTmp',data);
          // console.log(slideHtml);
          $('.mui-slider').html(slideHtml);
              // 通过letao对象的初始化轮播图
          // letao.initSlider();

          var gallery = mui('.mui-slider');
          gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
          });
        }
      })
    },
    //给选择尺码切换选中状态
    selectSize: function () {
      //获得当前选中的状态因为span是动态生成的，所以要用事件委托
      $('#product').on('tap','.btn-size',function () {
        $(this).addClass('active').siblings().removeClass('active');
      })
    }
  }


//获取url地址栏的参数的函数 网上找的  name就是url参数名
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}