$(function () {
    var letao = new Letao();
    // 通过乐淘对象初始化区域滚动
    letao.initScroll();

    // 通过ajax获取的左侧数据
    letao.getCategoryLeft();

    // 点击左侧获取右侧的数据
    letao.getCategoryRight();
})

var Letao = function () {

}

Letao.prototype = {
    // 初始化区域滚动
    initScroll: function () {
        // 初始化区域滚动
        var options = {
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        }

        mui('.mui-scroll-wrapper').scroll(options);
        // mui('.mui-scroll-wrapper').scroll({
        //   deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        // });

    },

    // 通过ajax获取左侧分类的数据
    getCategoryLeft: function () {
        $.ajax({
            url: '/category/queryTopCategory',
            success: function (data) {
                // console.log(data);
                // 获取模板数据
                var html = template('CategoryLeftTmp', data);
                // console.log(html);
                // 渲染页面
                $('.category-left ul').html(html);

            }
        })
    },

    // 点击左侧获取右侧数据
    getCategoryRight: function () {
        // 一进来就可以看见商品
        getRightData(1);

        // 给左侧分类添加点击事件，获取右侧数据
        $('.category-left ul').on('click','a', function (e) {
            // 给当前的li添加active 删除所有li的active
            $(e.target.parentNode).addClass('active').siblings().removeClass('active');;

            // var current = $(e.target);
            // console.log(current);
            // var id = current.dataset('id');
            var id = e.target.dataset['id'];
            // console.log(id);

            // 调用函数获取商品
            getRightData(id);
        })

        // 因为一开始就要看见，所以先封装一下
        function getRightData(id) {
            // 通过ajax来获取商品
            $.ajax({
                url: '/category/querySecondCategory',
                data: {
                    id: id
                },
                success: function (data) {
                    // console.log(data);
                    var product = template('CategoryRightTmp', data);
                    // console.log(product);
                    // 判断如果没有商品那么要增强用户体验
                    if(product){
                        // 如果有商品就渲染页面
                        $('.category-right .mui-row').html(product);
                    }else{
                        // 如果没有商品就提示用户
                        $('.category-right .mui-row').html('<h6>在下实在给不了更多了</h6>');
                    }
                }
            })
        }
    }
}