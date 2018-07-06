var letao;
$(function () {
  letao = new Letao();
  // 下拉刷新和上拉加载
  letao.initPullRefresh();
  // 搜索商品列表
  letao.searchProductList();

  letao.productSort();

  search = getQueryString('search');
  // console.log(search);
  //当我输入对应的商品名字时，一开始就要调用页面
  letao.getProductList({
    proName: search
  }, function (data) {
    //渲染页面
    var html = template("productlistTmp", data);
    $(".wares").html(html)
  });
  // letao.getProductList({
  //     proName: search
  // }, function (data) {
  //     //把数据调用模板引擎生成html
  //     var html = template('productListTmp', data);
  //     //把生成的模板绑定到商品列表的内容
  //     $('.wares').html(html);
  // });
});

var Letao = function () {};

var search;
var page = 1;

Letao.prototype = {
  //下拉刷新和上拉加载
  initPullRefresh: function () {
    mui.init({
      pullRefresh: {
        container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          callback: function () {
            setTimeout(function () {
              letao.getProductList({
                proName: search
              }, function (data) {
                //渲染页面
                var html = template("productlistTmp", data);
                $(".wares").html(html);
                //当数据请求渲染完毕后结束下拉刷新
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                //每次下拉刷新都要重置上拉加载
                mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
                //page(页码)也要重置
                page = 1;
              });
            }, 1000);
          } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
          contentnomore: "在下实在给不了更多了...",
          callback: function () {
            setTimeout(function () {
              //下拉请求更多调用获取商品的方法
              letao.getProductList({
                  proName: search,
                  page: ++page
                },
                function (data) {
                  var html = template("productlistTmp", data);
                  $(".wares").append(html);

                  //判断如果数组有数据就继续追加，没有就提示没有了
                  if (data.data.length > 0) {
                    //不加true就可以继续刷新，加了就是提示用户没有了
                    mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh();
                  } else {
                    mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
                  }
                }
              );
            }, 1000);
          }
        }
      }
    });
  },
  //搜索商品列表
  searchProductList: function () {
    // 1.给搜索按钮添加点击事件
    $(".btn-search").on("tap", function () {
      console.log("探索宇宙的真理已经很累，我没有时间再说谎");
      search = $(".btn-input").val();
      // console.log(search);
      // 3.调用获取商品列表的API搜索商品
      letao.getProductList({
        proName: search
      }, function (data) {
        //渲染页面
        var html = template("productlistTmp", data);
        $(".wares").html(html);
      });
    });
  },
  // // 获取商品数据的公共函数
  getProductList: function (obj, callback) {
    $.ajax({
      url: "/product/queryProduct",
      data: {
        page: obj.page || 1,
        pageSize: obj.pageSize || 2,
        proName: obj.proName,
        price: obj.price,
        num: obj.num
      },
      success: function (data) {
        // console.log(data);

        //判断回调函数传递了就调用
        if (callback) {
          // 数据渲染完毕了，就结束下拉刷新
          callback(data);
        }
      }
    });
  },
  //商品列表的排序
  productSort: function () {
    //1.给所有排序按钮添加点击事件
    $('.screen .mui-row').on('tap', 'a', function () {
      // 2.跟当前点击的a获取当前a链接的排序方式
      var sortType = $(this).data('sort-type');
      // console.log(sortType);
      var sort = $(this).data('sort');
      //3.获取到当前存的数值是几，如果是1就把它变成2，相反
      if (sort == 1) {
        sort = 2;
      } else {
        sort = 1;
      }
      //4.改变完sort后给当前的自定义data-sort赋值
      $(this).attr('data-sort',sort);
      if (sortType == 'price') {
        // 5.当我排序的时候要调用模板获取数据
        letao.getProductList({
          proName: search,
          price: sort
        }, function (data) {
          //渲染页面
          var html = template("productlistTmp", data);
          $(".wares").html(html);
        });
      } else if (sortType == 'num') {
        //6.改变完sort后给当前的自定义data-sort赋值
        $(this).attr('data-sort',sort);
        letao.getProductList({
          proName: search,
          num: sort
        }, function (data) {
          //渲染页面
          var html = template("productlistTmp", data);
          $(".wares").html(html);
        });
      }
    })
  }
};

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