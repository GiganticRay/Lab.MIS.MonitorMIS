﻿/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
var open = false;
var handler, handler1;
var polygonTool;
var lineTool, markerTool;
var OptionsDict = "[";

//判断用户是否登录
var isLog = false;

var bool1 = false, bool2 = false, bool3 = false, bool4 = false, bool5 = false;

$(document).ready(function () {
    //隐藏loading
    $("#LoadingGif").css("display", "none");
    //绑定搜索栏事件
    BindSelectConfirmBtn();
    BindSelectResetBtn();
    BindSelectOptions();
    BindSelectChange();

    //日期选择器的配置
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        startDate: "2013-02-14 10:00",
        minuteStep: 10
    });
    //为leftDiv添加拖动
    var doc = $(document), dl = $("#side_bar");
    var sum = dl.width() +
        $("#handlerDiv").mousedown(function (e) {
            var me = $(this);
            var deltaX = e.clientX - (parseFloat(me.css("left")) || parseFloat(me.prop("clientLeft")));
            lt = e.clientX;
            doc.mousemove(function (e) {
                lt = e.clientX;
                lt = lt < 530 ? 531 : lt;
                me.css("left", lt + "px");
                dl.width(lt);
            });
        }).width();
    doc.mouseup(function () {
        doc.unbind("mousemove");
    });
    doc[0].ondragstart
        = doc[0].onselectstart
        = function () {
            return false;
        };

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
        bool1 = true;
    });
    $("#MeasureArea").click(function() {
        polygonTool.open();
        bool2 = true;
    });
    $("#MeasurearkPoint").click(function() {
        editMarker();
        markerTool.open();
        bool3 = true;
    });
    $("#MarkLine").click(function() {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
        bool4 = true;
    });
    $("#MarkArea").click(function() {
        if (handler1) handler1.close();
        handler1 = new T.PolygonTool(map);
        handler1.open();
        bool5 = true;
    });
    $("#clearOverLays").click(function () {
        if (bool1) {
            lineTool.clear();
        }
        if (bool2) {
            polygonTool.clear();
        }
        if (bool3) {
            markerTool.clear();
        }
        if (bool4) {
            handler.clear();
        }
        if (bool5) {
            handler1.clear();
        }
    })

    //点击登录按钮 
    $("#mine").click(function () {
        openLoginModal();
    });

    //点击确定登录 提交数据
    $("#btnLogin").click(function () {
        //调用验证登录方法
        loginAjax();
    });

    var config2 = {
        pageCapacity: 10,	//每页显示的数量
        onSearchComplete: localSearchResult	//接收数据的回调函数
    };
    //创建搜索对象
    localsearch = new T.LocalSearch(map, config2);
    localsearch.search("奉节县");
});
//移动控件的位置
function MoveControl() {
    var controlPosition = T_ANCHOR_BOTTOM_RIGHT;
    control.setPosition(controlPosition);
}
//左窗口的移动
function MoveLeftWindow(){
    if (open == false) {
        $("#side_bar").animate({ left: '-' + $("#side_bar").width() + 'px' }, 100);
        open = true;
    }
    else {
        $("#side_bar").animate({ left: '0px' }, 100);
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
//一个没啥用的函数
function localSearchResult(result) {
    //清空地图及搜索列表

    area(result.getArea());
}
//用于解析行政区边界，并画边界线
function area(obj) {
    if (obj) {
        //坐标数组，设置最佳比例尺时会用到
        var pointsArr = [];
        var points = obj.points;
        for (var i = 0; i < points.length; i++) {
            var regionLngLats = [];
            var regionArr = points[i].region.split(",");
            for (var m = 0; m < regionArr.length; m++) {
                var lnglatArr = regionArr[m].split(" ");
                var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                regionLngLats.push(lnglat);
                pointsArr.push(lnglat);
            }
            //创建线对象
            var line1 = new T.Polyline(regionLngLats, {
                color: "#191970",
                weight: 3,
                opacity: 1,
                lineStyle: "dashed"
            });
            //向地图上添加线
            map.addOverLay(line1);
            //创建面对象
            var polygon1 = new T.Polygon(regionLngLats, {
                color: "#191970", weight: 3, opacity: 0.5, fillColor: "#8B7B8B", fillOpacity: 0.5
            });
            //向地图上添加面
            map.addOverLay(polygon1);
        }

        //显示最佳比例尺
        map.setViewport(pointsArr);
    }
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


//绑定搜索栏的下拉select options
function BindSelectOptions() {
    $.ajax({
        url: "http://localhost:56818/Home/GetMonitorInfos",
        type: "Post",
        dataType: "Json",
        success: function(result) {
            var postRes = $.parseJSON(result);
            $("#searchSelect").empty();
            $("#searchSelect").append("<option value='" + 0 + "'>" + '全选' + "</option>");
            $(postRes).each(function(i, item) {
                $("#searchSelect").append("<option value='" + item.MonitorId + "'>" + item.Name + "</option>");
                OptionsDict += "{ \"value\":\"" + item.MonitorId + "\" , \"Key\":\"" + item.Name + "\" },";
            });
            OptionsDict = OptionsDict.slice(0, OptionsDict.length - 1) + "]";
            //获取的Json对象  监测块ID和监测块
            OptionsDict = $.parseJSON(OptionsDict);
        }
    });
}

//绑定搜索栏下拉select 改变事件
function BindSelectChange() {
    $("#searchSelect").change(function() {
    });
}

//绑定搜索栏确定按钮
function BindSelectConfirmBtn() {
    $("#selectConfirmBtn").click(function () {
        $("#SearchDiseaseInfoTable").empty();
        $("#SearchDiseaseInfoTable")
                .append(
                    "<caption>监测预警查询结果</caption><thead><tr><th>监测阵列</th><th>阵经度</th><th>阵纬度</th><th>经度</th><th>纬度</th><th>预警方位</th><th>监测类型</th><th>预警等级</th><th>预警时间</th><th>预留</th></tr></thead><tbody></tbody>");

        var arrayId = $("#SearchMainTable option:selected").val();
        if (arrayId != 0) {
            loadDataToTable(arrayId);
        } else {
            var array = $("#searchSelect option:not(:selected)");
            for (var i = 0; i < array.length; i++) {
                loadDataToTable(array[i].value);
            }
        }
    });
}
//绑定搜索栏重置按钮
function BindSelectResetBtn() {
    $("#selectResetBtn").click(function() {
        $("#SearchDiseaseInfoTable").empty();
    }); 
}
//获取对应arrayId的数据加载到table里面
function loadDataToTable(arrayId) {
    var urlString = "http://localhost:56818/Home/GetDiseaseInfo";
    //Load loading gif
    $("#LoadingGif").css("display", "inline");
    $.ajax({
        url: urlString,
        type: "Get",
        dataType: "Json",
        data: {
            arrayId: arrayId,
            beforeTime: convertFormat($("#beforeTimeDate").val()) + " " + $("#beforeTimeHMS").val(),
            endTime: convertFormat($("#endTimeDate").val()) + " " + $("#endTimeHMS").val()
        },
        success: function (result) {          
            //成功隐藏loading gif
            $("#LoadingGif").css("display", "none");
            var tmpjsonOb = eval("(" + result + ")");
            var appendStr = "";
            
            $.each(tmpjsonOb, function (i, tmpItem) {
                var item = tmpjsonOb[i];

                appendStr += "<tr><td>";
                for (j in tmpjsonOb[i]) {
                    if (j == "ArrayID") {
                        //ArrayID  要换成对应的中文， 用到一个全局的                      
                        for (tmpj in OptionsDict) {
                            if (OptionsDict[tmpj].value == tmpjsonOb[i][j]) {
                                appendStr += OptionsDict[tmpj].Key + "</td><td>";
                            }
                        }
                    } else {
                        appendStr += tmpjsonOb[i][j] + "</td><td>";
                    }
                }
                appendStr += "</td></tr>";
            });
            $("#SearchDiseaseInfoTable").append(appendStr);
        },
        error:function(xhr, status, error) {
            alert(status + "," + error);
        }
    });

}

//将YY-MM-DD 转换为 YY/MM/DD
function convertFormat(str) {

    var reg = new RegExp("-", "g");//g,表示全部替换。
    return str.replace(reg, "/");
}
