/// <reference path="jquery-3.2.1.js" />

var map;
var zoom = 12;
var open = true;
var handler, handler1;
var polygonTool;
var lineTool, markerTool;
var OptionsDict = "[";
var line3;
//判断用户是否登录
var isLog = false;
//聚合标记
var markers = null;
//标记数组
var arrayObj = [];
var newArray = [];
//用来存放通过搜索显示的设备点
var SelectDevice = [];
//存放线条的数组
var linesArray = [];
//判断用户是否登录
var isLog = false;
//表示是否显示设备信息
var isShowDevice = false;
//判断目前所属是否为卫星图
var Imglayer = false;
//判断目前所属是否为地形图
var Terlayer = false;
//用于判断工具是否添加
var bool1 = false, bool2 = false, bool3 = false, bool4 = false, bool5 = false;
//图层url
var imageURL = "http://t0.tianditu.cn/img_w/wmts?" +
                "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";

// var imageURL = "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles";
//创建自定义图层对象
var imageURL2 = "http://t0.tianditu.cn/ter_w/wmts?" +
                "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
var lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
var lay2 = new T.TileLayer(imageURL2, { minZoom: 1, maxZoom: 18 });

//所有通过table查询出来的点击的marker
var DiseaseMarkerArray = [];
//阵列id
var group_id = [];


///初始化函数

var textURL = "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}";
var textlay = new T.TileLayer(textURL, { minZoom: 1, maxZoom: 18 });

$(document).ready(function () {
    
    //每隔一分钟刷新一次预警点信息
    UpdateOneMinute();
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
                lt = lt < 450 ? 450 : lt;
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
    control.setPosition(T_ANCHOR_BOTTOM_LEFT);
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
        $("#SearchText").val("");
        $("#TableBody").html("");
    })



    //窗口大小改变时适应页面
    $(".dropdown-menu").animate({ left: '-65px' }, 100);


    //获取滚动条高度
    var scroll_height = $("#SearchDiseaseInfoDiv")[0].offsetHeight - $("#SearchDiseaseInfoDiv")[0].scrollHeight;

    //使side_bar高度等于窗口高度-headDiv高度
    var n = document.getElementById("side_bar");
    n.style.height = document.documentElement.offsetHeight - document.getElementById("headDiv").clientHeight - 4 + "px";

    //使SearchDiseaseInfoDiv高度等于side_bar高度-SearchMainTable高度
    var m = document.getElementById("SearchDiseaseInfoDiv");
    m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("SearchMainTable").clientHeight - scroll_height + "px";


    $(window).resize(function () {
        n.style.height = document.documentElement.offsetHeight - document.getElementById("headDiv").clientHeight - 4 + "px";
        m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("ChangeSearchParameters").clientHeight - document.getElementById("SearchMainTable").clientHeight - scroll_height + "px";
    });


    //鼠标滚动
    $("#SearchDiseaseInfoDiv").scroll(function () {
        $("#SearchMainTable").slideUp("1000", function () {
            $("#ChangeSearchParameters").css("display", "block");
        });

        m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("ChangeSearchParameters").clientHeight + "px";
    });

    //
    $("#ChangeSearchParameters").click(function () {
        $("#ChangeSearchParameters").css("display", "none");
        $("#SearchMainTable").slideToggle("slow");

        m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("SearchMainTable").clientHeight - scroll_height + "px";
    });



    //动态搜索框
    $(".search-button").click(function () {
        $(this).parent().toggleClass("open");
        if ($(".search-button").parent().hasClass("open")) {
            $("#SearchText")[0].focus();
        };
    });
    $(".menu-open-button").click(function () {
        $(".search-button").parent().removeClass("open");
        $("#SearchText").val("");
        $("#TableBody").html("");
    });

    $("[data-toggle='tooltip']").tooltip();

    //图层框收缩
    $("#LayerContent").click(function () {
        $(".row ").animate({ width: 'toggle' }, 350);
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

    var config2 = {
        pageCapacity: 10,	//每页显示的数量
        onSearchComplete: localSearchResult	//接收数据的回调函数
    };
    //创建搜索对象
    localsearch = new T.LocalSearch(map, config2);
    localsearch.search("奉节县");


    //显示隐藏监测设备按钮
    $("#showDevice").click(function () {
        if (!isShowDevice) {
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-close",
                "title": "隐藏地图上的监测点",
            }).tooltip("fixTitle").tooltip("show");
            ShowDevice(null);
            isShowDevice = true;
        } else {
            //表示当前地图中的所有标记
            //var AllOverlays = map.getOverlays();
            //$.each(AllOverlays, function (AllOverlays_Index, item) {
            //    //if (item.getType() == 2) {
            //    //    map.removeOverLay(item);
            //    //}
            //    //删除线条
            //    if (item.getType() == 4) {
            //        map.removeOverLay(item);
            //    }
            //});


            //清空设备连线
            if (linesArray.length>0) {
                $.each(linesArray, function (i, item) {
                    item.hide();
                });
            }
            //如果通过搜索显示的设备不为空
            if (SelectDevice.length>0) {
                $.each(SelectDevice, function (i, item) {
                    item.hide();
                });
            }
            SelectDevice=[];
            //如果显示检测设备点，则删除
            if (arrayObj.length>0) {
                //删除聚合标记
               // markers.removeMarkers(newArray);
                
                $.each(arrayObj, function (i, item) {
                    item.hide();
                });
            }
            arrayObj = [];
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-open",
                "title": "显示地图上的监测点",
            }).tooltip("fixTitle").tooltip("show");
            isShowDevice = false;
        }

    });


    //添加地图的缩放改变事件  请勿删除
    // map.addEventListener("zoomstart", MapGetZoom);

    //删除监测设备信息
    $("#DeleteDeviceInfo").click(function () {
        //获取隐藏于id
        var getHiddenId = $("#hiddenDeviceID").val();
        DeleteDeviceInfo(getHiddenId, "#CloseDeviceInfo");
    });

    //保存监测设备信息
    $("#SaveDeviceInfo").click(function () {
        //获取表单数据
        var getData = $("#DeviceInfoForm");
        SavaDevideInfo(getData, "#CloseDeviceInfo");
    });
    //改变图层到卫星图层
    $("#layertoimg").click(function () {
        layerToImg();
    })
    //改变图层到地形图层
    $("#layertoter").click(function () {
        layerToTer();
    })
    //原始图层
    $("#layertoori").click(function () {
        layerToOri();
    })


    //打开录入检测阵数据窗口
    $("#EnteringMonitorInfo").click(function () {
        OpenEnteringMonitorInfo();
    });

    //录入监测阵数据
    $("#EnteringMonitorInfoBtn").click(function () {
        EnteringMonitorInfo();
    });

    BindClickRemoveWarningPointBtn();


    //打开录入监测设备信息窗口
    $("#EnteringDeviceInfo").click(function () {
        OpenEnteringDeviceInfo();
    });

    //录入监测设备信息
    $("#SaveEnteringDeviceInfo").click(function () {
        EnteringDeviceInfo();
    });

    //下拉列表改变事件
    $("#DeviceSelect").change(function () {
        //获取监测阵列id
        var getSelectVal = $("#DeviceSelect").val();
        $("#MonitorPointInfoId").val(getSelectVal);
        $.ajax({
            url: "/Home/GetOneMonitorPointInfo",
            type: "POST",
            data: { id: getSelectVal },
            success: function (backData) {
                $("#MonitorType").html(backData);

            }

        });
    });

    //tree详情管理
    $("#showAllDevice").click(function () {
        OpenTreeDeviceWindow();
    });

    //tree详情管理中删除监测设备
    $("#TreeDeleteDeviceInfo").click(function () {
        //获取隐藏于id
        var getHiddenId = $("#TreehiddenDeviceID").val();
        DeleteDeviceInfo(getHiddenId, null);
    });

    //tree详情管理中保存监测设备
    $("#TreeSaveDeviceInfo").click(function () {
        //获取表单数据
        var getData = $("#TreeDeviceInfoForm");
        SavaDevideInfo(getData, null);
    });

    //绑定搜索栏改变事件
    BindVagueSelectInputChange();
    //绑定清空查询
    BindClearVagueSelect();

    //图片上传处理
    LoadingImg();

    //读取cookie
    //读取coockie写入text
    document.getElementById("UserIdText").value = getCookie("UserName");
    document.getElementById("UserPwdText").value = getCookie("UserPwd");
    var boolLog = getCookie("IsLog");
    if (boolLog == "true") {
        isLog = true;
        $("#btnLogin").val("已登录,点击退出登录");
    }

    //当上传图片的model隐藏时
    $("#editImgModel").on('hide.bs.modal', function () {
        HidenLoadingImgModel();
    })

    //关闭录入监测设备的model隐藏时
    $("#EnteringDeviceInfoModal").on('hide.bs.modal', function () {
        HidenEnteringDeviceModel();
    })

  
    //当树状model关闭时，将更新图片的隐藏域清空
    $("#TreeDeviceInfoModal").on('hide.bs.modal', function () {
        //将更新图片的隐藏域清空
        $("#hidShowImgId").val("");
    });


    //当点击Marker展示 model关闭时，将更新图片的隐藏域清空
    $("#DeviceInfoModal").on('hide.bs.modal', function () {
        //将更新图片的隐藏域清空
        $("#hidShowImgId").val("");
    });


    //关闭更新图片的model隐藏时
    $("#ShowImgModel").on('hide.bs.modal', function () {
        var getid = $("#hidShowImgId").val();
        HidenShowImgModel(getid);
    })


    //将右边的框隐藏
    $("#side_barController").click();

    //判断是隐藏还是显示
    isShowOrHide();

   
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
    if (open == true) {
        $("#side_bar").animate({ left: '-' + $("#side_bar").width() + 'px' }, 100);
        open = false;
    }
    else {
        $("#side_bar").animate({ left: '0px' }, 100);
        open = true;
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
            //map.addOverLay(polygon1);
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
                         type: "success",
                         timer: 1500
                     })
                 }
             }
         )
}

//绑定搜索栏的下拉select options
function BindSelectOptions() {
    $.ajax({
        url: "/Home/GetMonitorInfos",
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
    $("#selectResetBtn").click(function () {
        $("#SearchDiseaseInfoTable").empty();
    });
}
//获取对应arrayId的数据加载到table里面
function loadDataToTable(arrayId) {
    var urlString = "/Home/GetDiseaseInfo";
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
                //不加载等级为0的预警点
                if (tmpjsonOb[i]["Grade"] != 0) {
                    //alert(tmpItem["Type"]);
                    var SelectedType = $("#searchSelectType option:selected").html();
                    if (SelectedType == "全选" || tmpItem["Type"] == SelectedType) {
                        //0是类型全选，1是滑坡，2是泥石流
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
                    }
                }
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
        var RowData = [
            td.eq(0).html(), td.eq(1).html(), td.eq(2).html(), td.eq(3).html(), td.eq(4).html(), td.eq(5).html(),
            td.eq(6).html(), td.eq(7).html(), td.eq(8).html()
        ];
        AddWarningPointToMap(RowData);
    });
}

//添加单个预警点点到地图上并绑定点击事件
function AddWarningPointToMap(RowData) {
    var data = RowData[3] + ", " + RowData[4] + ", " + RowData[7];

    if (RowData[7] == "泥石流") {
        //创建图片对象
        icon = new T.Icon({
            iconUrl: "../../Resource/Img/mud/" + RowData[7] + ".png",
            iconSize: new T.Point(25, 41),
            iconAnchor: new T.Point(10, 25)
        });
    } else {
        //创建图片对象
        icon = new T.Icon({
            iconUrl: "../../Resource/Img/coast/" + RowData[7] + ".png",
            iconSize: new T.Point(25, 41),
            iconAnchor: new T.Point(10, 25)
        });
    }

    // 创建标注
    var marker = new T.Marker(new T.LngLat(RowData[3], RowData[4]), { icon: icon });
    DiseaseMarkerArray.push(marker);
    //arrayObj.push(marker);
    //获取标记文本
    var content = RowData[0] + RowData[6] + "预警点";
    //将标注添加到地图中
    map.addOverLay(marker);
    //将地图的中心移动至此标记点
    var Lon = RowData[3];
    var Lat = RowData[4];
    map.centerAndZoom(new T.LngLat(Lon, Lat), 10);
    //注册标记的鼠标触摸,移开事件           
    addClickHandler(content, marker, RowData, true);
}

//绑定移除预警点信息按钮
function BindClickRemoveWarningPointBtn() {
    $("#RemoveWarningPointBtn").click(function () {
        $.each(DiseaseMarkerArray, function (i, item) {
            item.hide();
        });
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
            function (e) {
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

    //将图片预览窗口清空
    RestitutionShowWind("MarkerOLPic", "MarkerImgDivPic", "MarkerImgOutDivPic", "MarkerLiPic", "MarkerImgNearDivPic", "MarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");

    //通过id获取图片地址
    GetPicPathById(data["Id"]);


    $("#DeviceInfoModal").modal('show');
}

//点击marker打开预警点信息窗口
function clickOpenDiseaseWindow(data) {

    //将数据加载时窗口中
    $("#MonitorName").val(data[0]);
    $("#MonitorLon").val(data[1]);
    $("#MonitorLat").val(data[2]);
    $("#Lon").val(data[3]);
    $("#Lat").val(data[4]);
    $("#WarningDirection").val(data[5]);
    $("#DiseaseMonitorType").val(data[6]);
    $("#WarningLevel").val(data[7]);
    $("#WarningTime").val(data[8]);

    $("#DiseaseInfoModal").modal('show');
}

//每隔一分钟刷新一次加载在地图上面
function UpdateOneMinute() {
    var urlString = "/Home/GetDiseaseInfo";
    //var urlString = "/Home/TestGetDiseaseInfo";

    setInterval(function () {
        //获取当前时间戳
        var timestamp = Math.round(new Date() / 1000);
        var NowTime = getFormatDate(timestamp);
        timestamp = timestamp - 60;
        var BeforeTime = getFormatDate(timestamp);

        var array = $("#searchSelect option:not(:selected)");
        array.push($("#searchSelect option:selected")[0]);
        for (var i = 0; i < array.length; i++) {
            $.ajax({
                url: urlString,
                type: "Get",
                dataType: "Json",
                data: {
                    arrayId: array[i].value,
                    beforeTime: BeforeTime,
                    endTime: NowTime
                },
                success: function (result) {
                    var tmpjsonOb = eval("(" + result + ")");
                    var DataArray = [];

                    $.each(tmpjsonOb, function (i, tmpItem) {
                        //不加载等级为0的预警点
                        if (tmpjsonOb[i]["Grade"] != 0) {
                            var item = tmpjsonOb[i];
                            for (j in tmpjsonOb[i]) {
                                if (j == "ArrayID") {
                                    //ArrayID  要换成对应的中文， 用到一个全局的                      
                                    for (tmpj in OptionsDict) {
                                        if (OptionsDict[tmpj].value == tmpjsonOb[i][j]) {
                                            DataArray.push(tmpjsonOb[i][j]);
                                        }
                                    }
                                } else {
                                    DataArray.push(tmpjsonOb[i][j]);
                                }
                            }
                            //添加此预警点到地图上面
                            AddWarningPointToMap(DataArray);
                        }
                    });
                },
                error: function (xhr, status, error) {
                    alert(status + "," + error);
                }
            });
        }
    }, 60000);

}

//根据时间戳获取格式化日期
function getFormatDate(timestamp) {
    timestamp = parseInt(timestamp + '000');
    var newDate = new Date(timestamp);
    Date.prototype.format = function (format) {
        var date = {
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    }
    return newDate.format('yyyy/MM/dd hh:mm:ss');
}

//删除监测设备信息
//getHiddenId 表单数据
//select_option 关闭窗口的选择器 null表示是树状结构窗体中
function DeleteDeviceInfo(getHiddenId, select_option) {
    //判断是否登录
    if (isLog == true) {
        Delete(function () {

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

                        if (select_option != null) {
                            //关闭窗口
                            $(select_option).click();
                        } else {
                            //表示是树状结构中的保存操作，需要刷新树状结构中的数据
                            $.ajax({
                                url: "/Home/GetTreeJson",
                                type: "POST",
                                success: function (backData) {
                                    //像树状结构中添加数据
                                    AddDataToTree(backData);
                                }
                            });
                        }
                        
                        //刷新
                        $("#showDevice").click();
                        $("#showDevice").click();
                        //清空窗体数据
                        $("input[type=reset]").trigger("click");
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
function ShowDevice(getID) {
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
                data_info[index]["content"] = "监测点:" + element.DeviceName + "<br>" + "联系电话：" + element.PhoneNum + "<br>" + "监测类型:" + element.MonitorType;
            });

            arrayObj = [];
            //添加标记
            for (var j = 0; j < data_info.length; j++) {
                var icon = null;
                if (data_info[j]["MonitorType"] == "泥石流") {
                    //创建图片对象
                    icon = new T.Icon({
                        iconUrl: "../../Resource/Img/mud/0.png",
                        iconSize: new T.Point(19, 27),
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

               
                

                //不为空时，是经过搜索查出来的
                if (getID != null) {

                    if (data_info[j]["Id"] == getID) {
                        // 创建标注
                        var marker = new T.Marker(new T.LngLat(data_info[j]["DeviceLon"], data_info[j]["DeviceLat"]), { icon: icon });

                        //获取标记文本
                        var content = data_info[j]["content"];
                         // 将标注添加到地图中
                        map.addOverLay(marker);
                        //注册标记的鼠标触摸,移开事件           
                        addClickHandler(content, marker, data_info[j], false);
                        SelectDevice.push(marker);
                        return;
                    }
                } else {
                    // 创建标注
                    var marker = new T.Marker(new T.LngLat(data_info[j]["DeviceLon"], data_info[j]["DeviceLat"]), { icon: icon });
                    //获取标记文本
                    var content = data_info[j]["content"];
                    //将标注添加至数组
                    arrayObj.push(marker);
                    // 将标注添加到地图中
                    map.addOverLay(marker);
                    //注册标记的鼠标触摸,移开事件           
                    addClickHandler(content, marker, data_info[j], false);

                
                   
                }
                
               
            }
            //newArray = arrayObj;
            //聚合marker
            //markers = new T.MarkerClusterer(map, { markers: arrayObj });
            //设置网格大小
            //markers.setGridSize(1);
            //以下代码是为了获得不重复的阵列id
            var num = [];
            num[0] = 0;
            for (var i = 0; i < data_info.length; i++) {
                var exit = false;
                for (var j = 0; j < group_id.length; j++) {
                    if (group_id[j] == data_info[i]["MonitorPointInfoId"]) {
                        exit = true;
                        break;
                    }
                }
                if (exit == false) {
                    group_id[num[0]] = data_info[i]["MonitorPointInfoId"];
                    num[0]++;
                }
            }
            DrawLineForGroup();
        }
    });
}
//为阵列画线
function DrawLineForGroup() {
    for (var i = 0; i < group_id.length; i++) {
        var first_point = [];
        var points1 = [];
        linesArray = [];
        $.ajax({
            url: "/Home/GetDeviceInfoByMonitorId",
            type: "post",
            datatype: "Json",
            data: { id: group_id[i] },
            success: function (BackData) {
                var newData = JSON.parse(BackData);
                $.each(newData, function (index, element) {
                    if (index == 0) {
                        first_point[0] = element.DeviceLon;
                        first_point[1] = element.DeviceLat;
                    }
                    points1.push(new T.LngLat(element.DeviceLon, element.DeviceLat));
                });
                points1.push(new T.LngLat(first_point[0], first_point[1]));
                line3 = new T.Polyline(points1);
                //向地图上添加线
                map.addOverLay(line3);
                points1 = [];
                first_point = [];
                linesArray.push(line3);
            }
        })
    }

}

//保存设备信息
//getData 表单数据
//select_option 关闭窗口的选择器
function SavaDevideInfo(getData, select_option) {
    //判断是否登录
    if (isLog == true) {
        save(function () {

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
                        if (select_option != null) {
                            //关闭窗口
                            $(select_option).click();
                        } else {
                            //表示是树状结构中的保存操作，需要刷新树状结构中的数据
                            $.ajax({
                                url: "/Home/GetTreeJson",
                                type: "POST",
                                success: function (backData) {
                                    //像树状结构中添加数据
                                    AddDataToTree(backData);
                                }
                            });
                        }

                        //清空窗体数据
                        $("input[type=reset]").trigger("click");

                        //刷新
                        $("#showDevice").click();
                        $("#showDevice").click();

                        //将预览图片的位置重置
                        RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
                        //将更新图片的隐藏域清空
                        $("#hidShowImgId").val("");
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
//卫星图
function layerToImg() {
    if (Terlayer == true) {
        map.removeLayer(lay2);
        map.removeLayer(textlay);
        Terlayer = false;
    }
    if (Imglayer == false) {
        map.addLayer(lay);
        map.addLayer(textlay);
        Imglayer = true;
    }
}
//地形图
function layerToTer() {
    if (Imglayer == true) {
        map.removeLayer(lay);
        map.removeLayer(textlay);
        Imglayer = false;
    }
    if (Terlayer == false) {
        map.addLayer(lay2);
        map.addLayer(textlay);
        Terlayer = true;
    }
}
//原始图
function layerToOri() {
    if (Terlayer == true) {
        map.removeLayer(lay2);
        map.removeLayer(textlay);
        Terlayer = false;
    }
    if (Imglayer == true) {
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

//打开监测阵列信息录入窗口
function OpenEnteringMonitorInfo() {
    //清空窗体数据
    $("input[type=reset]").trigger("click");

    $("#MonitorInfoModal").modal('show');
}

//打开监测设备信息录入窗口
function OpenEnteringDeviceInfo() {
    //清空窗体数据
    $("input[type=reset]").trigger("click");
    //将select清空，重新加载
    $("#DeviceSelect").html("");
    //在打开窗口之前查询出所有的监测阵列
    $.ajax({
        url: "/Home/GetNewMonitorInfos",
        type: "POSt",
        success: function (getData) {
            //将string转换成json
            var newData = JSON.parse(getData);
            //给隐藏域添加MonitorPointInfoId
            $("#MonitorPointInfoId").val(newData[0].MonitorId);
            //获取监测类型
            $("#MonitorType").html(newData[0].Type);


            $.each(newData, function (index, element) {
                $("#DeviceSelect").append("<option value='" + element.MonitorId + "'>" + element.Name + "</option>");
            });
        }
    });
    //将展示图片的窗口恢复原状
    RestitutionShowWind("MarkerOL", "MarkerImgDiv", "MarkerImgOutDiv", "MarkerLi", "MarkerImgNearDiv", "MarkerDefaultImg", "editImg", "#editImgModel");
    $("#EnteringDeviceInfoModal").modal('show');
}

//打开tree详情管理监测设备
function OpenTreeDeviceWindow() {
    //将图片的位置重置
    RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
    //清空窗体数据
    $("input[type=reset]").trigger("click");

    $.ajax({
        url: "/Home/GetTreeJson",
        type: "POST",
        success: function (backData) {
            $("#TreeDeviceInfoModal").modal('show');
            //像树状结构中添加数据
            AddDataToTree(backData);
        }
    });

}

//录入监测阵列信息
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

//录入监测设备信息
function EnteringDeviceInfo() {
    //判断是否登录
    if (isLog == true) {
        EnteringData(function () {
            //获取表单数据
            var getData = $("#EnteringDeviceInfoForm");

            var objectData = {
                DeviceName: getData[0]["DeviceName"].value,
                ShuCaiNum: getData[0]["ShuCaiNum"].value,
                SensorNum: getData[0]["SensorNum"].value,
                PhoneNum: getData[0]["PhoneNum"].value,
                YaoshiNum: getData[0]["YaoshiNum"].value,
                DeviceLon: getData[0]["DeviceLon"].value,
                DeviceLat: getData[0]["DeviceLat"].value,
                MonitorType: $("#MonitorType")[0].innerText,
                MonitorName: getData[0]["MonitorName"].value,
                MonitorPointInfoId: $("#DeviceSelect")[0].options[$("#DeviceSelect")[0].selectedIndex].value,
                Beizhu: getData[0]["Beizhu"].value
            };
            $.ajax({
                url: "/Home/EnteringDeviceInfo",
                type: "POST",
                data: objectData,
                success: function (Backdata) {
                    if (Backdata["state"] > 0) {
                        //获取新添加的监测设备的id
                        var getAddDeviceID = Backdata["state"];
                        $.ajax({
                            url: "/Home/EnteringPics",
                            type: "POST",
                            data: { id: getAddDeviceID, imgPaths: $("#loadinImgPaths").val() },
                            success: function (data) {
                                if (data["state"] == true) {
                                    swal({
                                        title: "录入成功！",
                                        type: "success",
                                        timer: 1500
                                    });
                                    //关闭窗口
                                    $("#CloseEnteringDeviceInfo").click();
                                    //刷新
                                    $("#showDevice").click();
                                    $("#showDevice").click();
                                }
                                else {
                                    swal({
                                        title: "录入数据成功，录入图片失败！",
                                        type: "error",
                                        timer: 1500
                                    });
                                }
                            }
                        });

                    } else {
                        swal({
                            title: "录入数据失败！",
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

//向树状结构中添加数据
function AddDataToTree(backData) {
    $('#tree').treeview({
        data: backData,   // data is not optional
        levels: 1,
        //点击节点
        onNodeSelected: function (event, data) {
            //data["tags"]  选中的ID
            if (data["tags"] >= 0) {
                var data_info = [];
                $.ajax({
                    url: "/Home/GetOneDevice",
                    data: { id: data["tags"][0] },
                    type: "post",
                    datatype: "Json",
                    success: function (BackData) {
                        //将string转换成json
                        var newData = JSON.parse(BackData);
                        $.each(newData, function (index, element) {
                            data_info["MonitorType"] = element.MonitorType;
                            data_info["DeviceName"] = element.DeviceName;
                            data_info["ShuCaiNum"] = element.ShuCaiNum;
                            data_info["SensorNum"] = element.SensorNum;
                            data_info["PhoneNum"] = element.PhoneNum;
                            data_info["YaoshiNum"] = element.YaoshiNum;
                            data_info["DeviceLon"] = element.DeviceLon;
                            data_info["DeviceLat"] = element.DeviceLat;
                            data_info["Beizhu"] = element.Beizhu;
                            data_info["Id"] = element.Id;
                            data_info["MonitorName"] = element.MonitorName;
                            data_info["MonitorPointInfoId"] = element.MonitorPointInfoId;
                            data_info["PointPicture"] = element.PointPicture;
                        });

                        //将数据加载时窗口中
                        var getForm = $("#TreeDeviceInfoForm");

                        var num = 0;
                        for (var item in data_info) {
                            if (num < getForm[0].length - 1) {
                                getForm[0][num].value = data_info[item];
                                num++;
                            }
                        }
                        //给隐藏域赋值
                        $("#TreehiddenDeviceID").val(data_info["Id"]);
                        $("#hidShowImgId").val(data_info["Id"]);
                        //加载图片
                        GetPicPathById(data_info["Id"]);

                    }
                });
            }
        }
    });
}

//绑定搜索栏改变事件
function BindVagueSelectInputChange() {

    $("#SearchText").on('input', function (e) {
        $("#TableBody").html("");
        $("#SearchResultContent").css("display", "block");
        var contentString = $("#SearchText").val();
        var StrTmp = "";
        if (contentString == "") {
            return;
        }
        //TableBody
        $.ajax({
            url: "/Home/GetVagueSearch",
            type: "POST",
            data: { SearchContent: contentString },
            success: function (backData) {
                var tmpObj = $.parseJSON(backData);
                $.each(tmpObj,
                    function (i, item) {
                        var signContent = contentString;
                        var signContentPosition = item.DeviceName.indexOf(signContent);
                        var beforeContent = item.DeviceName.slice(0, signContentPosition);
                        var backContent = item.DeviceName.slice(signContentPosition + signContent.length, item.DeviceName.length);
                        $("#TableBody").html("");
                        StrTmp += "<tr><td>" +
                            beforeContent + "<span class='biaozhu'>" + signContent + "</span>" + backContent +
                             "</td><td >" +
                            item.MonitorType +
                            "</td><td style = 'display:none'>" +
                            item.DeviceLon +
                            "</td><td style = 'display:none'>" +
                            item.DeviceLat +
                            "</td><td style = 'display:none'>" +
                            "监测点:" + item.DeviceName + "<br>" + "联系电话：" + item.PhoneNum + "<br>" + "监测类型:" + item.MonitorType +
                            "</td><td style = 'display:none'>" +
                            item.Id +
                            "</td ></tr>";
                    });
                $("#TableBody").append(StrTmp);
                BindVagueClickRow();
            }

        });
    });
}
//绑定清空查询
function BindClearVagueSelect() {
    $("#search_btn").click(function () {
        $("#SearchText").val("");
        $("#TableBody").html("");
        //隐藏表格
        $("#SearchResultContent").css("display", "none");

    });
}
//点击模糊查询出来的表格行
function BindVagueClickRow() {
    //给每行绑定了一个点击事件：var td = $( this ).find( "td" );
    $("#VagueTable tr").click(function () { 
        var td = $(this).find("td");
        var Lon = td.eq(2).html();
        var Lat = td.eq(3).html();
        var type = td.eq(1).html();
        var content = td.eq(4).html();
        var  DeviceID= td.eq(5).html();


        map.centerAndZoom(new T.LngLat(Lon, Lat), 20);
        var getLngLat = map.getCenter();
        //判断当前是否显示设备标记
        if (arrayObj.length <= 0) {

            ShowDevice(DeviceID);
            ////如果没有显示,自己添加
            //if (type == "泥石流") {
            //    //创建图片对象
            //    icon = new T.Icon({
            //        iconUrl: "../../Resource/Img/mud/0.png",
            //        iconSize: new T.Point(25, 41),
            //        iconAnchor: new T.Point(10, 25)
            //    });
            //} else {
            //    //创建图片对象
            //    icon = new T.Icon({
            //        iconUrl: "../../Resource/Img/coast/0.png",
            //        iconSize: new T.Point(25, 41),
            //        iconAnchor: new T.Point(10, 25)
            //    });
            //}

            //// 创建标注
            //var marker = new T.Marker(new T.LngLat(Lon, Lat), { icon: icon });
            ////获取标记文本
            //var content = content;
            //// 将标注添加到地图中
            //map.addOverLay(marker);
            //addClickHandler(content, marker, DeviceID, false);
        } 
    });
}

//将展示图片的窗口恢复原状
//OlId         olId
//imgDivId     图片外层id
//imgOutDivId 最外层divID
//liId       li的id
//imgNearDivId   最近的divid
//defaultImgId  默认图片的id
function RestitutionShowWind(OlId, imgDivId, imgOutDivId, liId, imgNearDivId, defaultImgId, editImgId, showLoadingImgModel) {
    var newLi = document.createElement("li");
    newLi.setAttribute("id", liId);
    newLi.setAttribute("data-target", "#" + imgOutDivId);
    newLi.setAttribute("data-slide-to", 0);
    newLi.setAttribute("class", "active");

    //将li清空，并添加新的li
    var olObject = document.getElementById(OlId);
    olObject.innerHTML = "";
    olObject.appendChild(newLi);
    //    $(OlSelect).empty().append(newLi);



    var newDiv = document.createElement("div");
    //defaultImg
    newDiv.setAttribute("id", imgNearDivId);
    newDiv.setAttribute("class", "item active");

    var newImg = document.createElement("img");
    newImg.setAttribute("class", "d-block w-100 img-responsive img-rounded");
    newImg.setAttribute("src", "../../Resource/Img/DefaultImg.jpg");
    newImg.setAttribute("alt", "First slide");
    newImg.setAttribute("css", 'width="600px" height="200px');

    newImg.setAttribute("id", defaultImgId)

    //将图片标签加入div中
    newDiv.appendChild(newImg);

    //"更新图片"图标
    var editImg = document.createElement("img");
    editImg.setAttribute("src", "../../Resource/Img/alert.png");
    //    editImg.setAttribute("class","glyphicon glyphicon-edit");
    editImg.setAttribute("alt", "editImg");
    editImg.setAttribute("style", "position:absolute;height:10%;right:0px;z-index:1000;top:0px;");
    editImg.setAttribute("title", "点击更新图片");
    editImg.setAttribute("id", editImgId);


    editImg.onclick = function () {
        //判断是否是录入检测设备的model
        if (editImg.id == "editImg") {
            //加载之前将图片预览窗口清空
            RestitutionShowWind("MarkerOL", "MarkerImgDiv", "MarkerImgOutDiv", "MarkerLi", "MarkerImgNearDiv", "MarkerDefaultImg", "editImg", "#editImgModel");
            $(showLoadingImgModel).modal('show');
        } else {
            if ($("#hidShowImgId").val()) {
                $(showLoadingImgModel).modal('show');
            } else {
                swal({
                    title: "请先选中数据！",
                    type: "error",
                    timer: 1500
                });
            }
        }


    }

    var divObject = document.getElementById(imgDivId);
    divObject.innerHTML = "";
    divObject.appendChild(newDiv);
    divObject.appendChild(editImg);
}

//图片上传处理
function LoadingImg() {

    $("#editImgFile").fileinput("refresh", {
        uploadUrl: '/Controllers/PicUpload.ashx', // you must set a valid URL here else you will get an error
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        language: 'zh', //设置语言
        maxFileSize: 10000,
        maxFilesNum: 10,
        showRemove: true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        allowedFileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        deleteUrl: '../Ashx/deleteUrl.ashx',   // String删除图片时的请求路径
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });

    //	异步上传成功结果处理
    $("#editImgFile").on("fileuploaded", function (event, data, previewId, index) {
        //向隐藏域中添加数据
        hiddenPic = $("#loadinImgPaths").val();
        if (hiddenPic.length == 0) {
            $("#loadinImgPaths").val(data.response.msg);
        } else {
            $("#loadinImgPaths").val(hiddenPic + ";" + data.response.msg);
        }
    })
}

//获取cookie
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]).toString();
    } else {
        return null;
    }
}

//通过循环加载图片窗口
function LoadPictureData(ImgDivselector, OlSelect, ImgOutDivSelect, imgNearDivId, data) {
    for (var i = 0; i < data.length; i++) {
        //加载服务器上的图片
        AddPicture(ImgDivselector, OlSelect, data[i], ImgOutDivSelect, imgNearDivId);
    }
}

//动态加载图片
//ImgDivselector 图片的最外层div  id
//OlSelect   指示标的ol  id
//PicPath   图片路径
//ImgOutDivSelect   图片预览的最外层div的id 确保li按钮的可用性
function AddPicture(ImgDivselector, OlSelect, PicPath, ImgOutDivSelect, imgNearDivId) {

    //获取li的个数
    var StrIndex = $(OlSelect)[0].childElementCount;


    var defaultImgPath = document.getElementById(imgNearDivId).children[0].src;
    var defaultImgName = defaultImgPath.substring(defaultImgPath.lastIndexOf("/") + 1);

    //查看默认实例图片
    if (defaultImgName == "DefaultImg.jpg") {
        document.getElementById(imgNearDivId).children[0].src = PicPath;

    } else {
        var newDiv = $("<div class='item '></div>");
        //添加图片
        var myImg = document.createElement("img");
        myImg.setAttribute("class", "d-block w-100 img-responsive img-rounded");
        myImg.setAttribute("src", "../.." + PicPath);
        myImg.setAttribute("alt", StrIndex + 1 + " slide");
        myImg.setAttribute("name", StrIndex + "img");
        //将图片添加至div中
        newDiv.append(myImg);
        $(ImgDivselector).append(newDiv)

        //设置li
        var li = document.createElement("li");
        li.setAttribute("data-target", ImgOutDivSelect);
        li.setAttribute("data-slide-to", StrIndex);
        $(OlSelect).append(li);
    }

}


//隐藏上传图片的model时
function HidenLoadingImgModel() {
    //获取隐藏域的图片路径
    var getHiddenVal = $("#loadinImgPaths").val();
    //有上传图片时加载图片轮播
    if (getHiddenVal) {
        var PicData = getHiddenVal.split(';'); loadinImgPaths
        LoadPictureData("#MarkerImgDiv", "#MarkerOL", "#MarkerImgOutDiv", "MarkerImgNearDiv", PicData);
    }

    //将上传图片位置清空
    $(".form-group .close.fileinput-remove").click();

}

//隐藏录入设备信息的model时
function HidenEnteringDeviceModel() {
    //应该将上传图片的窗口数据清空
    //将隐藏域的图片路径清空
    $("#loadinImgPaths").val("");

    //将上传图片位置清空
    $(".form-group .close.fileinput-remove").click();

}

//通过id获取图片地址
function GetPicPathById(postId) {
    //将图片预览窗口清空
    RestitutionShowWind("MarkerOLPic", "MarkerImgDivPic", "MarkerImgOutDivPic", "MarkerLiPic", "MarkerImgNearDivPic", "MarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");

    RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
    //给上传图片的隐藏于赋值
    $("#hidShowImgId").val(postId);
    $.ajax({
        url: "/Home/GetPicPathById",
        type: "POST",
        data: { id: postId },
        success: function (backData) {
            //将string转换成json
            var newData = JSON.parse(backData);
            //json字符串转数组
            //var getArray = JSON.parse(newData);
            var array = [];
            var keyslist = new Array();
            $.each(newData, function (index, item) {
                //加载服务器上的图片
                AddPicture("#MarkerImgDivPic", "#MarkerOLPic", item.PicPath, "#MarkerImgOutDivPic", "MarkerImgNearDivPic");
                AddPicture("#TreeMarkerImgDivPic", "#TreeMarkerOLPic", item.PicPath, "#TreeMarkerImgOutDivPic", "TreeMarkerImgNearDivPic");
                keyslist[index] = {
                    key: item.Id,
                    url: "/Home/DeleteExistImgs"  // 可修改 场景2中会用的  
                };
                array[index] = "<img class='file-preview-image'  src='../.." + item.PicPath + "'>";

            });

            //获取监测设备的id
            var getDeviceId = { "DevieceID": postId };

            //将已经存在的图片加载至图框中 传递图片的<img >
            edit_image(array, keyslist, getDeviceId);

        }
    });
}


//将已经存在的图片加载至图框中
function edit_image(editImgArray, keyslist, getDeviceId) {
    //更新图片
    $("#ShowImgFile").fileinput("refresh", {
        uploadUrl: '/Controllers/PicUpload.ashx',
        uploadExtraData: getDeviceId,
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        language: 'zh', //设置语言
        maxFileSize: 10000,
        maxFilesNum: 10,
        maxImageWidth: 100,
        maxImageHeight: 100,
        showRemove: false,
        showPreview: true,
        browseOnZoneClick: true,
        allowedFileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        initialPreviewAsData: true,    //，是否将初始预览内容集解析为数据而不是原始标记
        initialPreview: editImgArray,
        initialPreviewConfig: keyslist,//配置预览中的一些参数   
        enctype: 'multipart/form-data',// 上传图片的设置  
        browseClass: "btn btn-primary" //按钮样式  
    });


    $("#ShowImgFile").on("filebeforedelete", function () {
        alert("asdf");
    });
    //删除成功后
    $("#ShowImgFile").on("filedeleted", function () {
        swal({
            title: "删除成功",
            type: "success",
            timer: 1000
        })
    });


    //异步上传成功结果处理
    $("#ShowImgFile").on("fileuploaded", function (event, data, previewId, index) {
        if (data.response.msg.length > 0) {
            //到此只是文件上传本地成功,还未更新至数据库
            $.ajax({
                url: "/Home/editUploadImgs",
                type: "POST",
                data: { DevieceID: getDeviceId.DevieceID, path: data.response.msg },
                success: function (backData) {
                    if (backData.msg == true) {
                        swal({
                            title: "上传成功",
                            type: "success",
                            timer: 1000
                        })
                    } else {
                        swal({
                            title: "上传失败",
                            type: "error",
                            timer: 1000
                        })
                    }

                }
            });


        } else {
            swal({
                title: "上传失败",
                type: "error",
                timer: 1000
            })
        }
    })
}


//关闭更新图片的model
function HidenShowImgModel(getid) {
    //更新数据
    GetPicPathById(getid);
}

//判断是隐藏还是显示
function isShowOrHide() {
    setInterval(function () {
        if (SelectDevice.length > 0 || arrayObj.length>0) {
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-close",
                "title": "隐藏地图上的监测点",
            }).tooltip("fixTitle");
            isShowDevice = true;
        }
    }, 1000);
}
