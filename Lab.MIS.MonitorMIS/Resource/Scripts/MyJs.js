/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
var open = false;
var handler;
var polygonTool;
var lineTool, markerTool;
//判断用户是否登录
var isLog = false;


$(document).ready(function () {

    //为模态对话框添加拖拽
    $(".modal").draggable();

    map = new T.Map('mapDiv');
    map.centerAndZoom(new T.LngLat(116.40769, 39.89945), zoom);
    //添加缩放按钮
    control = new T.Control.Zoom();
    map.addControl(control);
    //添加比例尺
    var scale = new T.Control.Scale();
    map.addControl(scale);
    MoveControl();
    $("#side_barController").click(function() {
        MoveLeftWindow();
    });
    var config = {
        showLabel: true,
        color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    lineTool = new T.PolylineTool(map, config);
    polygonTool = new T.PolygonTool(map, config);
    markerTool = new T.MarkTool(map, { follow: true });
    $("#MeasureLength").click(function() {
        lineTool.open();
    });
    $("#MeasureArea").click(function() {
        polygonTool.open();
    });
    $("#MeasurearkPoint").click(function() {
        editMarker();
        markerTool.open();
    });
    $("#MarkLine").click(function() {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
    });
    $("#MarkArea").click(function() {
        if (handler) handler.close();
        handler = new T.PolygonTool(map);
        handler.open();
    });
    $("#clearOverLays").click(function() {
        map.clearOverLays();
    });

    //点击登录按钮 
    $("#mine").click(function () {
        openLoginModal();
    });

    //点击确定登录 提交数据
    $("#btnLogin").click(function () {
        //调用验证登录方法
        loginAjax();
    });
});
//移动控件的位置
function MoveControl() {
    var controlPosition = T_ANCHOR_BOTTOM_RIGHT;
    control.setPosition(controlPosition);
}
//左窗口的移动
function MoveLeftWindow(){
    if (open == false) {
        $("#side_bar").animate({ left: '-337px' }, "fast");
        open = true;
    }
    else {
        $("#side_bar").animate({ left: '0px' }, "fast");
        open = false;
    }
}
//标记点函数
function editMarker() {
    var markers = markerTool.getMarkers()
    for (var i = 0; i < markers.length; i++) {
        markers[i].enableDragging();
    }
}

//打开登录窗口
function openLoginModal() {

    //填充信息
    $('#loginModal .registerBox').fadeOut('fast', function () {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function () {
            $('.login-footer').fadeIn('fast');
        });

        $('.modal-title.logIn').html('登录');
    });
    $('.error').removeClass('alert alert-danger').html('');
    //打开窗口
    $('#loginModal').modal('show');
 
}

//验证登录
function loginAjax() {
    //如果已经登录，点击将退出登录
    if (isLog == true) {
        logoff(function () {
            isLog = false;
            swal({
                title: "退出登录成功！",
                type: "success",
                timer: 1500
            });
            $("#btnLogin").val("登录");
        });
    } else {
        //将表单整体序列化成一个数组提交到后台
        var postData = $("#loginForm").serializeArray();
        $.post("/Home/Login", postData, function (data) {
            if (data["state"] != false) {
                $('#loginModal').modal('hide');
                //禁用登录按钮
                $("#btnLogin").val("已登录,点击退出登录");
                isLog = true;
                swal({
                    title: "登录成功！",
                    type: "success",
                    timer: 1500
                });
            } else {
                shakeModal(data);
            }
        });
    }
}

//登录窗口震动
function shakeModal(data) {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("登录失败");
    $('input[type="password"]').val('');
    setTimeout(function () {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 400);
}

//sweetalert
function logoff(Func) {
    swal({
        title: "您确定要退出登录吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定退出！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    },
             function (isConfirm) {
                 if (isConfirm) {
                     Func();
                 }
                 else {
                     swal({
                         title: "已取消",
                         type: "error",
                         timer: 1500
                     })
                 }
             }
         )
}
