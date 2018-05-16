<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>
<%@ Import Namespace="System.Data" %>

<!DOCTYPE html>
<script runat="server">

    protected void Page_Load(object sender, EventArgs e)
    {

    }
</script>


<html>
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>天地图－地图API－范例－经纬度直投地图</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--css--%>
    <link href="../../Resource/Scripts/bootstrap.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/LogIn/login-register.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/sweetalert/sweetalert.css" rel="stylesheet" />
    <link href="../../Resource/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/LogIn/login-register.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/sweetalert/sweetalert.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />

    <%--js--%>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
    <script src="../../Resource/Scripts/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
    <script src="../../Resource/Scripts/jquery-ui.min.js"></script>
    <script src="../../Resource/Scripts/sweetalert/sweetalert-dev.min.js"></script>
    <script src="../../Resource/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.js"></script>    
    <script src="../../Resource/Scripts/MyJs.js"></script>

</head>

<body>
    <div id="MainDiv">

        <div id="headDiv">
            <img src="../../Resource/Img/Logo.png" id="LogoImg" />
            <nav class="menu">
                <!-- 创建主按钮 -->
                <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" />
                <label class="menu-open-button" for="menu-open">
                    <!-- 三根白线 -->
                    <span class="hamburger hamburger-1"></span>
                    <span class="hamburger hamburger-2"></span>
                    <span class="hamburger hamburger-3"></span>
                </label>


                <div class="menu-item" id="clearOverLays">
                    <span <%--class="glyphicon glyphicon-search"--%> aria-hidden="true">清空</span>
                </div>


                <div class="menu-item dropdown">
                    <span class="<%--glyphicon glyphicon-plus--%> dropdown-toggle" data-toggle="dropdown" aria-hidden="true">录入</span>
                    <ul class="dropdown-menu">
                        <li class="ToolBox" id="EnteringDeviceInfo"><span>录入监测设备信息</span></li>
                       <%-- <li role="separator" class="divider"></li>--%>
                        <li class="ToolBox" id="EnteringMonitorInfo"><span>录入检测阵信息</span></li>
                    </ul>
                </div>


                <div class="menu-item dropdown">
                    <span class="<%--glyphicon glyphicon-wrench--%> dropdown-toggle" data-toggle="dropdown" aria-hidden="true">工具</span>
                    <ul class="dropdown-menu pull-right">
                        <li class="ToolBox" id="MeasureLength"><span>测量</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MeasureArea"><span>测面</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MeasurearkPoint"><span>标点</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MarkLine"><span>标线</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MarkArea"><span>标面</span></li>
                    </ul>
                </div>

                <div class="menu-item" id="mine"><span <%--class="glyphicon glyphicon-user"--%> aria-hidden="true">登陆</span> </div>

                <div class="menu-item" id="showDevice"><span>显示</span></div>
            </nav>
        </div>

        <div id="mapDiv"></div>
        <div id="side_bar">
            <div id="handlerDiv"></div>
            <span id="side_barController"></span>
            <table id="SearchMainTable" class="table table-striped">
                <caption>查询</caption>
                <tbody>
                <tr>
                    <td colspan="2"><h4>预警起始时间：</h4></td>
                </tr>
                <tr>
                    <td>
                        <input type="date" class="form-control" id="beforeTimeDate" value="2017-12-01"/>
                    </td>
                    <td>
                        <input type="time" class="form-control" step="3" id="beforeTimeHMS" value="01:01:01"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><h4>预警结束时间：</h4></td>
                </tr>
                <tr>
                    <td>
                        <input type="date" class="form-control" id="endTimeDate" value="2017-12-04"/>
                    </td>
                    <td>
                        <input type="time" class="form-control" step="3" id="endTimeHMS" value="01:01:01"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><h4>请选择监测阵列：</h4></td>
                </tr>
                <tr>
                    <td>
                        <select class="btn btn-lg btn-default" id="searchSelect">
                            <option>全选</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td><button class="btn btn-lg btn-default" id="selectConfirmBtn">确定</button></td>
                    <td><button class="btn btn-lg btn-default" id="selectResetBtn">重置</button></td>
                </tr>
                
                </tbody>
            </table>
            <div id="SearchDiseaseInfoDiv">
                <img src="../../Resource/Img/searching.gif" id="LoadingGif"/>
                <table class="table table-bordered" id="SearchDiseaseInfoTable">
                    <caption>监测预警查询结果</caption>
                    <thead>
                        <tr>
                            <th>监测阵列</th>                      
                            <th>阵经度</th>
                            <th>阵纬度</th>
                            <th>经度</th>
                            <th>纬度</th>
                            <th>预警方位</th>
                            <th>监测类型</th>
                            <th>预警等级</th>
                            <th>预警时间</th>
                            <th>预留</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
        <div id="Layer">
            <div id="layer">
             <%--   <span>图层</span>--%>
            </div>
        </div>
    </div>

    <div class="modal fade login" id="loginModal">
        <div class="modal-dialog login animated">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;</button>
                    <h4 class="modal-title logIn">登录</h4>
                </div>
                <div class="modal-body">
                    <div class="box">
                        <div class="content">
                            <div class="social">
                                <img src="../../Resource/Img/head.jpg" class="img-responsive" align="middle" alt="Responsive image">
                            </div>
                            <div class="error">
                            </div>
                            <div class="form loginBox">
                                <form method="post" accept-charset="UTF-8" id="loginForm">
                                    <input id="UserIdText" class="form-control" type="text" placeholder="用户名" name="UserName">
                                    <input id="UserPwdText" class="form-control" type="password" placeholder="密码" name="UserPwd">
                                    <input class="btn btn-default btn-login" type="button" id="btnLogin" value="登录">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade " id="DeviceInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title" id="H1">检测设备信息
                    </h4>
                </div>
                <div class="modal-body">
                    <form id="DeviceInfoForm">
                        <table class="table table-striped table-bordered table-hover">
                            <tr>
                                <td>检测类型:</td>
                                <td>
                                    <select name="MonitorType">
                                        <option value="滑坡">滑坡</option>
                                        <option value="泥石流">泥石流</option>
                                    </select></td>
                            </tr>
                            <tr>
                                <td>监测点名称:</td>
                                <td>
                                    <input type="text" name="DeviceName" value="" /></td>
                            </tr>
                            <tr>
                                <td>数采编号:</td>
                                <td>
                                    <input type="text" name="ShuCaiNum" value="" /></td>
                            </tr>
                            <tr>
                                <td>传感器编号:</td>
                                <td>
                                    <input type="text" name="SensorNum" value="" /></td>
                            </tr>
                            <tr>
                                <td>手机卡号:</td>
                                <td>
                                    <input type="text" name="PhoneNum" value="" /></td>
                            </tr>
                            <tr>
                                <td>钥匙:</td>
                                <td>
                                    <input type="text" name="YaoshiNum" value="" /></td>
                            </tr>
                            <tr>
                                <td>位置(经度):</td>
                                <td>
                                    <input type="text" name="DeviceLon" value="" /></td>
                            </tr>
                            <tr>
                                <td>位置(纬度):</td>
                                <td>
                                    <input type="text" name="DeviceLat" value="" /></td>
                            </tr>
                            <%--<tr>
                                <td>备注:</td>
                                <td>
                                    <input type="text" name="Beizhu" value="" /></td>
                            </tr>--%>
                        </table>
                        <input type="hidden" name="Id" id="hiddenDeviceID" value="" />
                        <input type="hidden" name="MonitorName" value="" />
                        <input type="hidden" name="MonitorPointInfoId" value="" />
                        <input type="hidden" name="PointPicture" value="" />
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success glyphicon glyphicon-ok-circle" id="SaveDeviceInfo">
                        保存
                    </button>
                    <button type="button" class="btn btn-danger glyphicon glyphicon-remove-circle" id="DeleteDeviceInfo">
                        删除
                    </button>
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal" id="CloseDeviceInfo">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>
</body>
</html>
