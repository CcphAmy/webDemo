$(function(){

    //操作页面元素
    // 1、获取指定的元素 $('.items')
    // 2、绑定事件 $('.items').click(function(){})
    // 3、处理逻辑 .....
        /*
        * jquery
        *
        * q. 认识一个方法（api）的时候，从四点入手
        * 1.0 调用者
        * 2.0 参数
        * 3.0 返回值
        * 4.0 功能
        *
        * $(selector)  选择器 选中指定的元素
        *$(selector).width()  获取元素的宽度
        *$(selector).height()  获取元素的高度
        * $(selector).children(）获取指定元素下所有子元素
        *$(selector)css({width:100,height:100});
        *
        * */
    // function foo(){}  foo();
    //标识
    var isLoading=false;
    // 拓展自定义方法
    $.extend({
        // console.log(tips) 在控制台输出 检查代码 test.log
        //初始化..
        init:function(){
            $.getData(1,6);
            return 0;
        },
        //瀑布流排版
        waterfall:function(selector){
            // 1、获取相关的元素
            var  row = $(selector);
            var  parentWidth = row.width();
            var  cols = row.children();//隐式迭代   //for(var i - 0 ; i < 原声dom集合.length; i++){}
            var  childWidth = cols.width();
            // console.log(childWidth);
            //多少列
            var column =5;

            //间隙
            var space = (parentWidth-childWidth*column)/(column-1);
            // console.log(space);
            // 数组 （记录所有的.col 元素高度）
            var arrHeight =[];
            //jquery 循环   $.each('元素集合'，function(index , items ){})
            $.each(cols,function(index,item){
                // console.log(index)
                // console.log(item); 原生js dom
                // console.log($(item));  jq dom
                // item.offsetHeight;
                var h = $(item).height();
                //第一行设置top=0; left = ??
                if(index < column){
                    arrHeight[index]=h;
                    //    设置前五个.col 盒子位置
                    $(item).css({

                        left:index*(childWidth+space)+"px",
                        top:0
                    })
                }else {
                    //arrHeight 找到最小的.col
                    //假设第一数 是最小的
                    var minHeight = arrHeight[0];
                    var minIndex = 0;
                    for(var i = 0 ; i < arrHeight.length;i++){
                        if(arrHeight[i] < minHeight){
                            //属性  = 赋值
                            minHeight = arrHeight[i];
                            minIndex = i;
                        }
                    }
                    //设置第六张开始的图片
                    $(item).css({
                        left:minIndex*(childWidth+space),
                        top:minHeight+space
                    });
                     //    更新数组
                    arrHeight[minIndex]+=h+space;
                }
                // console.log(arrHeight);
                //设置 按钮
                //假设数组第一个元素是最大的
                var maxHeight =arrHeight[0];
                //最大的高度??
                //   给.main 设置高度
                for(var j = 0 ; j < arrHeight.length; j++){

                    if(arrHeight[j]>maxHeight){
                        //左边属性 =  右边值
                        maxHeight=arrHeight[j];
                    }
                }
                //.main 元素
                $('.main').css({
                    height:maxHeight
                })
            });

            return 0;

        },
        //获取数据
        getData:function(page , pageSize){
            // ajax      交互式网页应用开发技术
            $.ajax({
                url:"../getData.php",
                type:"get",
                dataType:"json",
                data:{
                    page:page,
                    pageSize:pageSize
                },      // ?page=0&pageSize=2
                async:true,
                beforeSend:function(){ //请求之前执行的回调函数
                    // console.log("之前")
                    // .addClass()
                    isLoading = false;
                    $('.loading-btn').addClass('active').html('正在加载..');
                },
                success:function(data){

                    if(data.result.length==0){
                        isLoading=true;
                        $('.loading-btn').addClass('active').html('没有更多..');
                        return 0;
                    }
                    //处理数据
                    // console.log(data);
                    //渲染页面
                    $.renderHtml(data);
                    //removeClass();  //链式
                    $('.loading-btn').removeClass('active').html('点击加载..');
                    isLoading=true;


                },
                error:function(err){
                    console.log(err)
                }
            });

            return 0;
        },
        //点击加载
        loadingMore:function(){
              //需求：
              // 点击按钮，加载数据
              //1.0 获取按钮元素
              //   console.log("test.click");
                $('.loading-btn').click(function(){
                    if(isLoading){//防止连续点击
                        //获取data-page的值  $(this)指向按钮
                        var pnum = $(this).attr('data-page');
                        // console.log('test...')
                        $.getData(pnum,6);
                    }
                });
            return 0;
        },
        //把数据渲染在页面
        renderHtml:function(data){
            console.log(data);
             // 使用模板  template("模板ID",{res:data.result}) 返回数据和html匹配好的字符串
            var strHtml = template("templateId",{res:data.result});
            //.append(str)  往盒子后面追加内容
            // console.log(strHtml);
            $(".row").append(strHtml);
            $.waterfall('.row');//封装好的瀑布流函数
            //自定义标签属性
            $(".loading-btn").attr('data-page',data.page);
            //调用加载函数
            //判断
            return 0;//终止代码
        },
        //滚动加载
        scrollLoding:function(){
            //监听滚动的事件
            $(window).on('scroll',function(){
                console.log("滚动了..")
                //浏览器窗口的视口高度
                var winHeight = window.innerHeight;
                //.main的高度
                var height = $('.main ').height();
                //页面被卷去的高度
                var ttop = document.body.scrollTop|| document.documentElement.scrollTop;
                //页面剩余的部分高度
                var resultHeight = height -(winHeight+ttop);

                // 判断 页面剩余部分 少于100的时候触发
                if( resultHeight <  100){
                    if(isLoading){
                        //获取data-page的值  $(this)指向按钮
                        var pnum = $('.loading-btn').attr('data-page');
                        console.log(pnum);
                        // console.log('test...')
                        $.getData(pnum,6);
                    }
                }else {
                    console.log(resultHeight);
                }

            })
        }
    });
    //调用
    $.init();
    // $.loadingMore();
    $.scrollLoding()    ;
    // $.waterfall('.row');//实参
    // $.loadingMore();
    // 自定义函数
    // $.sayHello("say hello..");
});