$(function(){

    $.extend({

        init:function(){
            return 0;
        },
        renderHtml:function(data){

            var strHtml = template("templateId",data);
            $("#templateAlert").append(strHtml);

            return 0;//终止代码
        }
    });
    //调用
    $.init();
    var data = {
            items:[{'title':'通知!','name':'管理员','content':'校园诈繁频繁出现,同学们请注意.'},
                  {'title':'通知!','name':'教务处','content':'教务处系统更新,增加模板'},
                  {'title':'通知!','name':'人社局','content':'来我们技校吗?'},
                  {'title':'通知!','name':'教育局','content':'我在职校等你.'}]
            };

    $.renderHtml(data);
});