var letao;
$(function () {
    letao = new Letao();
    // 调用添加历史记录初始化
    letao.addHistory();
    //调用查询初始化
    letao.queryHistory();
    //调用每条数据的删除
    letao.deleteHistory();
    //调用清空历史记录
    letao.clearHistory();
})

var Letao = function () {

}

Letao.prototype = {
    //添加历史记录
    addHistory: function () {
        //1.获取当前搜索按钮添加点击事件
        $('.btn-search').on('click', function () {
            // 2.获取当前文本输入的内容
            var search = $('.btn-input').val();
            // console.log(search);
            //3.判断当前输入的值是否为空，为空就提示用户输入内容并且后面代码不执行
            if(!search.trim()) {
                alert('请输入你喜欢的商品');
                return;
            }
            // 4.获取本地存储已经存储的值
            var arr = window.localStorage.getItem('searchData');
            var id = 0;
            // 5.判断当前arr是否有值
            if(arr && JSON.parse(arr).length > 0){
                // 有值 就把值通过JSON.parse(arr)把JSON字符串转换成数组
                arr = JSON.parse(arr);
                // id为arr数组的最后一个值(arr[arr.length-1])的id+1
                id = arr[arr.length-1].id+1;
            }else{
                //如果没有值就赋值为空数组
                arr = [];
                //数组为空id就等于0
                id = 0;
            }
            // console.log(arr);
            // // 6.定义一个搜索内容是否在存储中存在
            var flag = false;
            for(var i = 0; i < arr.length; i++){
                // 如果存在吧flag = ture;
                if(arr[i].search == search){
                    flag = true;
                }
            }
            // 7.判断flag如果还是==false表示当前输入的值不存在
            if(flag == false){
                // 8.如果当前文本框输入的值 不在arr中 就添加到arr数组里面去
                arr.push({
                    'search':search,
                    'id':id
                });
            }
            // console.log(arr);
            // // 9.把arr转成JSON字符串存储到本地存储中
            window.localStorage.setItem('searchData',JSON.stringify(arr));
            // // 10.添加完成后调用查询方法刷新页面
            letao.queryHistory();
            // // 11.点击了搜索按钮跳转到商品列表里面
            window.location.href = "productlist.html?search="+search;
        })
    },
    //1.查询历史记录 并渲染列表
    queryHistory:function() {
        //2.获取本地已经存储的值
        var arr = window.localStorage.getItem('searchData');
        //判断当前arr是否有值
        if(arr && JSON.parse(arr).length > 0){
            //有值就把值通过JSON.parse(arr)把JSON字符串转换成数组
            arr = JSON.parse(arr);
        }else{
            //如果没有值就赋值为空数组
            arr = [];
        }
        //3.如果需要最后搜索的内容展示在最前面 进行数组反转 再去渲染
        arr = arr.reverse();
        // console.log(arr);
        //4.调用模板的方法生成html
        var html = template('searchListTmp',{'rows':arr});
        // console.log(html);
        // 5.把生成的html绑定到搜索历史的内容列表
        $('.content').html(html);
    },
    //删除搜索记录
    deleteHistory:function() {
        var that = this;
        //1.给所有删除按钮添加点击事件
        $('.content').on('click','.btn-delete',function() {
            //2.获取当前点击的删除按钮身上的data-id属性的值
            var id = $(this).data('id');
            // 3.获取本地存储已经存储的值
            var arr = window.localStorage.getItem('searchData');
            //判断当前arr是否有值
            if(arr && JSON.parse(arr).length > 0){
                //有值就把值通过JSON.parse(arr)把JSON字符串转换成数组
                arr = JSON.parse(arr);
            }else{
                //没值就赋值为空数组
                arr = [];
            }
            //5.遍历存储的数组
            for(var i = 0; i < arr.length; i++){
                //判断当前数组中有没有id和当前点击的删除按钮的id一致的值
                if(arr[i].id == id){
                    //8.删除数组当前的arr[i]
                    arr.splice(i,1);//第一个参数i代表要删除的数据的下标 1表示删除几个
                }
            }
            // 9.把删除后的数组重新存储到本地存储
            window.localStorage.setItem('searchData',JSON.stringify(arr));
            // 10.调用查询方法重新查询当前数据和渲染列表
            letao.queryHistory();
        })
    },
    //清空搜索记录
    clearHistory:function () {
        //1.获取清空按钮添加事件
        $('.btn-clear').on('click',function() {
            console.log('探索宇宙的真理已经很累，我没有时间再说谎');
            // 2.把本地存储的值设置为空字符串
            window.localStorage.setItem('searchData','');
            // 3.清空完毕重新查询渲染
            letao.queryHistory();
        })
    }
}