/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
var open = false;
var handler;
var polygonTool;
var lineTool, markerTool;
$(document).ready(function () {
    map = new T.Map('mapDiv');
    map.centerAndZoom(new T.LngLat(116.40769, 39.89945), zoom);
    //添加缩放按钮
    control = new T.Control.Zoom();
    map.addControl(control);
    //添加比例尺
    var scale = new T.Control.Scale();
    map.addControl(scale);
    MoveControl();
    $("#side_barController").click(function () {
        MoveLeftWindow();
    })
    var config = {
        showLabel: true,
        color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    lineTool = new T.PolylineTool(map, config);
    polygonTool = new T.PolygonTool(map, config);
    markerTool = new T.MarkTool(map, { follow: true });
    $("#MeasureLength").click(function () {
        lineTool.open();
    })
    $("#MeasureArea").click(function () {
        polygonTool.open();
    })
    $("#MeasurearkPoint").click(function () {
        editMarker();
        markerTool.open();
    })
    $("#MarkLine").click(function () {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
    })
    $("#MarkArea").click(function () {
        if (handler) handler.close();
        handler = new T.PolygonTool(map);
        handler.open();
    })
    $("#clearOverLays").click(function () {
        map.clearOverLays();
    })

    //点击登录按钮 
    $("#mine").click(function () {
        openLoginModal();
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
        $("#side_bar").animate({ left: '-337px' });
        open = true;
    }
    else {
        $("#side_bar").animate({ left: '0px' });
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


