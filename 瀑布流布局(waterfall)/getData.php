<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/6/26
 * Time: 15:30
 */
//
    header("Content-Type:application/json;charset=utf-8");

    //接受前端提交过来的参数  get / post
    $page = $_GET['page']; //G_POST

    $pageSize = $_GET['pageSize'];

    //读取文件内容的方法 file_get_contents()
    $dataStr =  file_get_contents('./data.json');

    //转成json 对象、
    $data = json_decode($dataStr);

    // var_dump($data);
    $offset = ($page-1)*$pageSize;

    //翻页
    $page++;
    // array_slice( $data, start，length )
    // 截取出来的数据
    $result = array_slice($data,$offset,$pageSize);
    // 输出
    //转字符串 array
    // items  page
    echo json_encode(array('result'=>$result,'page'=>$page));


    //延迟1s执行
    sleep(1);
    //    echo "页码：".$page." & 数量".$pageSize;

