/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
var open = false;
var handler, handler1;
var polygonTool;
var lineTool, markerTool;
var OptionsDict = "[";

//判断用户是否登录
var isLog = false;
//聚合标记
var markers = null;
//标记数组
var arrayObj = null;
//判断用户是否登录
var isLog = false;
//表示是否显示设备信息
var isShowDevice = false;
//判断目前所属图层
var layer = false;
//用于判断工具是否添加
var bool1 = false, bool2 = false, bool3 = false, bool4 = false, bool5 = false;
//图层url
var imageURL = "http://t0.tianditu.cn/img_w/wmts?" +
                "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
//创建自定义图层对象
var lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });



///初始化函数

var textURL = "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}";
var textlay = new T.TileLayer(textURL, { minZoom: 1, maxZoom: 18 });

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
                lt = lt < 670 ? 670 : lt;
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
    //$(".modal").draggable({ cancel: ".title"});
    //$(".modal-content").draggable();



    map = new T.Map('mapDiv');
    map.centerAndZoom(new T.LngLat(116.40769, 39.89945), 14);
    //添加缩放按钮
    control = new T.Control.Zoom();

    map.addControl(control);
    //添加比例尺
    var scale = new T.Control.Scale();
    map.addControl(scale);
    MoveControl();
    $("#side_barController").click(function () {
        MoveLeftWindow();
    });
    var config = {
        showLabel: true,
        color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    lineTool = new T.PolylineTool(map, config);
    polygonTool = new T.PolygonTool(map, config);
    markerTool = new T.MarkTool(map, { follow: true });
    $("#MeasureLength").click(function () {
        lineTool.open();
        bool1 = true;
    });
    $("#MeasureArea").click(function () {
        polygonTool.open();
        bool2 = true;
    });
    $("#MeasurearkPoint").click(function () {
        editMarker();
        markerTool.open();
        bool3 = true;
    });
    $("#MarkLine").click(function () {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
        bool4 = true;
    });
    $("#MarkArea").click(function () {
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

    //悬浮下拉

    //$(".dropdown").mouseover(function () {
    //    $(this).addClass("open");
    //});

    //$(".dropdown").mouseleave(function () {
    //    $(this).removeClass("open");
    //});

    //$(".dropdown").click(function () {
    //    $(this).find(".dropdown-menu").removeClass("open");
    //});

    $(".dropdown-menu").animate({ left: '-65px' }, 100);





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


    //显示隐藏检测设备按钮
    $("#showDevice").click(function () {
        if (!isShowDevice) {
            $("#showDevice").find("span").html("隐藏");
            ShowDevice();
            isShowDevice = true;
        } else {
            //表示当前已经显示设备标记
            //删除标记
            var AllOverlays = map.getOverlays();
            $.each(AllOverlays, function (AllOverlays_Index, item) {
                if (item.getType() == 2) {
                    map.removeOverLay(item);
                }
            });
            //如果存在聚合的标记，则删除
            if (arrayObj != null) {
                //删除聚合标记
                if (markers.removeMarkers(arrayObj)) {
                    arrayObj == null;
                }
            }
            $("#showDevice").find("span").html("显示");
            isShowDevice = false;
        }

    });


    //添加地图的缩放改变事件  请勿删除
    // map.addEventListener("zoomstart", MapGetZoom);

    //删除检测设备信息
    $("#DeleteDeviceInfo").click(function () {
        DeleteDeviceInfo();
    });

    //保存检测设备信息
    $("#SaveDeviceInfo").click(function () {
        SavaDevideInfo();
    });

    $("#layer").click(function () {
        changelayer();
    })

    //打开录入检测阵数据窗口
    $("#EnteringMonitorInfo").click(function () {
        OpenEnteringMonitorInfo();
    });

    //录入检测阵数据
    $("#EnteringMonitorInfoBtn").click(function () {
        EnteringMonitorInfo();
    });

});

//获取缩放级别
function MapGetZoom(e) {

    //alert(map.getZoom());
    //if (map.getZoom()>=12) {
    //    //将聚合标记移除
    //    markers.removeMarkers(arrayObj);
    //}
    //alert(markers.getGridSize());
    //markers.setGridSize(1);
}


//移动控件的位置
function MoveControl() {
    var controlPosition = T_ANCHOR_BOTTOM_RIGHT;
    control.setPosition(controlPosition);
}
//左窗口的移动
function MoveLeftWindow() {
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
                         type: "`",
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
        success: function (result) {
            var postRes = $.parseJSON(result);
            $("#searchSelect").empty();
            $("#searchSelect").append("<option value='" + 0 + "'>" + '全选' + "</option>");
            $(postRes).each(function (i, item) {
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
    $("#searchSelect").change(function () {
    });
}

//绑定搜索栏确定按钮
function BindSelectConfirmBtn() {
    $("#selectConfirmBtn").click(function () {
        $("#SearchDiseaseInfoTable").empty();
        $("#SearchDiseaseInfoTable")
                .append(
                    "<caption>监测预警查询结果</caption><thead><tr><th>监测阵列</th><th>阵经度</th><th>阵纬度</th><th>经度</th><th>纬度</th><th>预警方位</th><th>监测类型</th><th>预警等级</th><th>预警时间</th></tr></thead><tbody></tbody>");

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
    $("#selectResetBtn").click(function () {
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
                appendStr = appendStr.slice(0, appendStr.length - 4);
                appendStr += "</tr>";
            });
            $("#SearchDiseaseInfoTable").append(appendStr);
            BindClickRow();
        },
        error: function (xhr, status, error) {
            alert(status + "," + error);
        }
    });

}

//点击表格行加载对应受灾害点
function BindClickRow() {
    $("#SearchDiseaseInfoTable tr").click(function () { //给每行绑定了一个点击事件：var td = $( this ).find( "td" );
        var td = $(this).find("td");
        //this指向了当前点击的行，通过find我们获得了该行所有的td对象。
        //题中说到某个td，为了演示所以我们假设是要获得第3个td的数据。
        var data = td.eq(3).html() + ", " + td.eq(4).html() + ", " + td.eq(7).html();

        if (td.eq(7).html() == "泥石流") {
            //创建图片对象
            icon = new T.Icon({
                iconUrl: "../../Resource/Img/mud/" + td.eq(7).html() + ".png",
                iconSize: new T.Point(25, 41),
                iconAnchor: new T.Point(10, 25)
            });
        } else {
            //创建图片对象
            icon = new T.Icon({
                iconUrl: "../../Resource/Img/coast/" + td.eq(7).html() + ".png",
                iconSize: new T.Point(19, 27),
                iconAnchor: new T.Point(10, 25)
            });
        }

        // 创建标注
        var marker = new T.Marker(new T.LngLat(td.eq(3).html(), td.eq(4).html()), { icon: icon });
        //arrayObj.push(marker);
        //获取标记文本
        var content = td.eq(0).html() + td.eq(6).html() + "预警点";
        // 将标注添加到地图中
        map.addOverLay(marker);
        //注册标记的鼠标触摸,移开事件           
        addClickHandler(content, marker, td, true);
        //通过eq可以得到具体的某个td对象，从而得到相应的数据} );
    });
}

//将YY-MM-DD 转换为 YY/MM/DD
function convertFormat(str) {

    var reg = new RegExp("-", "g");//g,表示全部替换。
    return str.replace(reg, "/");
}

//注册信息点触碰、移开、点击事件 
// content 标记的文字信息  
//marker 标记对象 
//dataId 标记对象对应的id
//IsDiseasePoint 是否是预警点
function addClickHandler(content, marker, data, IsDiseasePoint) {
    //鼠标触碰事件
    marker.addEventListener("mouseover", function (e) {
        //获取坐标
        var point = e.lnglat;
        //创建一个信息窗实例
        var markerInfoWin = new T.InfoWindow(content, { offset: new T.Point(0, -30) }); // 创建信息窗口对象
        map.openInfoWindow(markerInfoWin, point); //开启信息窗口
    }
    );
    //鼠标移开事件
    marker.addEventListener("mouseout", function (e) {
        //关闭信息窗
        map.closeInfoWindow();
    }
    );
    if (IsDiseasePoint == false) {
        //鼠标单击事件deviceInfoPoint
        marker.addEventListener("click",
            function(e) {
                clickOpenWindow(data);
            }
        );
    } else {
        //鼠标单击事件预警点
        marker.addEventListener("click",
            function (e) {
                clickOpenDiseaseWindow(data);
            }
        );
    }
}

//点击marker打开设备信息窗口
function clickOpenWindow(data) {
    //将数据加载时窗口中
    var getForm = $("#DeviceInfoForm");


    var num = 0;
    for (var item in data) {
        if (num < getForm[0].length - 1) {
            getForm[0][num].value = data[item];
            num++;
        }
    }

    //给隐藏域赋值
    $("#hiddenDeviceID").val(data["Id"]);

    $("#DeviceInfoModal").modal('show');
}

//点击marker打开预警点信息窗口
function clickOpenDiseaseWindow(data) {
    //将数据加载时窗口中
    $("#MonitorName").val(data.eq(0).html());
    $("#MonitorLon").val(data.eq(1).html());
    $("#MonitorLat").val(data.eq(2).html());
    $("#Lon").val(data.eq(3).html());
    $("#Lat").val(data.eq(4).html());
    $("#WarningDirection").val(data.eq(5).html());
    $("#MonitorType").val(data.eq(6).html());
    $("#WarningLevel").val(data.eq(7).html());
    $("#WarningTime").val(data.eq(8).html());

    $("#DiseaseInfoModal").modal('show');
}


//删除检测设备信息
function DeleteDeviceInfo() {
    //判断是否登录
    if (isLog == true) {
        Delete(function () {
            //获取隐藏于id
            var getHiddenId = $("#hiddenDeviceID").val();
            $.ajax({
                url: "/Home/DeleteDevice",
                type: "POST",
                data: { id: getHiddenId },
                success: function (Backdata) {
                    if (Backdata > 0) {
                        swal({
                            title: "删除成功！",
                            type: "success",
                            timer: 1500
                        });
                        //关闭窗口
                        $("#CloseDeviceInfo").click();
                    }
                    else {
                        swal({
                            title: "删除失败！",
                            type: "error",
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        swal({
            title: "请先登录！",
            type: "error",
            timer: 1500
        });
        openLoginModal();
    }
}

//显示设备标记
function ShowDevice() {
    //当地图加载时将设备信息已标记的形式在地图上显示
    //存取数据的数组
    var data_info = [];
    $.ajax({
        url: "/Home/GetAllDevicePoints",
        type: "post",
        datatype: "Json",
        success: function (BackData) {
            //将string转换成json
            var newData = JSON.parse(BackData);
            $.each(newData, function (index, element) {
                //js中二维数组必须进行重复的声明，否则会undefind  
                data_info[index] = [];
                data_info[index]["MonitorType"] = element.MonitorType;
                data_info[index]["DeviceName"] = element.DeviceName;
                data_info[index]["ShuCaiNum"] = element.ShuCaiNum;
                data_info[index]["SensorNum"] = element.SensorNum;
                data_info[index]["PhoneNum"] = element.PhoneNum;
                data_info[index]["YaoshiNum"] = element.YaoshiNum;
                data_info[index]["DeviceLon"] = element.DeviceLon;
                data_info[index]["DeviceLat"] = element.DeviceLat;
                data_info[index]["Beizhu"] = element.Beizhu;
                data_info[index]["Id"] = element.Id;
                data_info[index]["MonitorName"] = element.MonitorName;
                data_info[index]["MonitorPointInfoId"] = element.MonitorPointInfoId;
                data_info[index]["PointPicture"] = element.PointPicture;
                data_info[index]["content"] = "监测点:" + element.DeviceName + "<br>" + "联系电话：" + element.PhoneNum + "<br>" + "检测类型:" + element.MonitorType;
            });

            arrayObj = new Array();
            //添加标记
            for (var j = 0; j < data_info.length; j++) {
                var icon = null;
                if (data_info[j]["MonitorType"] == "泥石流") {
                    //创建图片对象
                    icon = new T.Icon({
                        iconUrl: "../../Resource/Img/mud/0.png",
                        iconSize: new T.Point(25, 41),
                        iconAnchor: new T.Point(10, 25)
                    });
                } else {
                    //创建图片对象
                    icon = new T.Icon({
                        iconUrl: "../../Resource/Img/coast/0.png",
                        iconSize: new T.Point(19, 27),
                        iconAnchor: new T.Point(10, 25)
                    });
                }

                // 创建标注
                var marker = new T.Marker(new T.LngLat(data_info[j]["DeviceLon"], data_info[j]["DeviceLat"]), { icon: icon });
                arrayObj.push(marker);
                //获取标记文本
                var content = data_info[j]["content"];
                // 将标注添加到地图中
                // map.addOverLay(marker);
                //注册标记的鼠标触摸,移开事件           
                addClickHandler(content, marker, data_info[j], false);
            }
            //聚合marker
            markers = new T.MarkerClusterer(map, { markers: arrayObj });
            //设置网格大小
            markers.setGridSize(1);
        }
    });
}

//保存设备信息
function SavaDevideInfo() {
    //判断是否登录
    if (isLog == true) {
        save(function () {
            //获取表单数据
            var getData = $("#DeviceInfoForm");

            var objectData = {
                Id: getData[0]["Id"].value,
                DeviceName: getData[0]["DeviceName"].value,
                ShuCaiNum: getData[0]["ShuCaiNum"].value,
                SensorNum: getData[0]["SensorNum"].value,
                PhoneNum: getData[0]["PhoneNum"].value,
                YaoshiNum: getData[0]["YaoshiNum"].value,
                DeviceLon: getData[0]["DeviceLon"].value,
                DeviceLat: getData[0]["DeviceLat"].value,
                Beizhu: getData[0]["Beizhu"].value,
                MonitorType: getData[0]["MonitorType"].value,
                MonitorName: getData[0]["MonitorName"].value,
                MonitorPointInfoId: getData[0]["MonitorPointInfoId"].value,
                PointPicture: getData[0]["PointPicture"].value,
            };
            $.ajax({
                url: "/Home/SaveDevice",
                type: "POST",
                data: objectData,
                success: function (Backdata) {
                    if (Backdata == "True") {
                        swal({
                            title: "保存成功！",
                            type: "success",
                            timer: 1500
                        });
                        //关闭窗口
                        $("#CloseDeviceInfo").click();
                        //刷新
                        $("#showDevice").click();
                        $("#showDevice").click();
                    }
                    else {
                        swal({
                            title: "保存失败！",
                            type: "error",
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        swal({
            title: "请先登录！",
            type: "error",
            timer: 1500
        });
        openLoginModal();
    }
}

function changelayer() {
    if (layer == false) {
        //将图层增加到地图上
        map.addLayer(lay);
        map.addLayer(textlay);
        layer = true;
    }
    else {
        map.removeLayer(lay);
        map.removeLayer(textlay);

        layer = false;
    }
}

//删除提示框
function Delete(Func) {
    swal({
        title: "您确定要删除这条数据吗",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定删除！",
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

//保存提示框
function save(Func) {
    swal({
        title: "您确定要保存吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定保存！",
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

//录入提示框
function EnteringData(Func) {
    swal({
        title: "您确定要录入吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定录入！",
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

//打开检测阵列信息录入窗口
function OpenEnteringMonitorInfo() {
    $("#MonitorInfoModal").modal('show');
}

//录入检测阵列信息
function EnteringMonitorInfo() {
    //判断是否登录
    if (isLog == true) {
        EnteringData(function () {
            //获取表单数据
            var getData = $("#MonitorInfoForm");

            var objectData = {
                MonitorId: getData[0]["MonitorId"].value,
                Name: getData[0]["MonitorIdName"].value,
                Type: getData[0]["MonitorType"].value
            };
            $.ajax({
                url: "/Home/EnteringMonitorPointInfo",
                type: "POST",
                data: objectData,
                success: function (Backdata) {
                    if (Backdata["state"] == true) {
                        swal({
                            title: "录入成功！",
                            type: "success",
                            timer: 1500
                        });
                        //关闭窗口
                        $("#CloseMonitorInfo").click();
                    }
                    else {
                        swal({
                            title: "录入失败！",
                            type: "error",
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        swal({
            title: "请先登录！",
            type: "error",
            timer: 1500
        });
        openLoginModal();
    }
}

