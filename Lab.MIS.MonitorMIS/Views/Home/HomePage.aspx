<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>天地图－地图API－范例－经纬度直投地图</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--css--%>
    <link href="../../Resource/Scripts/bootstrap-3.3.7-dist/css/bootstrap.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/LogIn/login-register.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/sweetalert/sweetalert.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />


    <%--js--%>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
    <script src="../../Resource/Scripts/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
    <script src="../../Resource/Scripts/jquery-ui.min.js"></script>
    <script src="../../Resource/Scripts/sweetalert/sweetalert-dev.min.js"></script>
    <script src="../../Resource/Scripts/MyJs.js"></script>

</head>

<body>
    <div id="MainDiv">

        <div id="headDiv">
            <img src="../../Resource/Img/Logo.png" id="LogoImg" />
            <div id="rightBar">
                <div id="mine"></div>
                <div class="seperator"></div>
                <div id="mainMenuBtn"></div>
            </div>
            <div class="btn-group my_btn-group">
                <div class="btn-group">
                    <button type="button" class="btn btn-default" id="showDevice"><span></span>显示设备</button>

                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">工具<span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li class="ToolBox"><a href="#" id="MeasureLength"><span></span>测量</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox"><a href="#" id="MeasureArea"><span></span>测面</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox"><a href="#" id="MeasurearkPoint"><span></span>标点</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox"><a href="#" id="MarkLine"><span></span>标线</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox"><a href="#" id="MarkArea"><span></span>标面</a></li>
                    </ul>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">录入<span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li class="ToolBox"><a href="#" id="EnteringDeviceInfo"><span></span>录入监测设备信息</a></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox"><a href="#" id="EnteringMonitorInfo"><span></span>录入检测阵信息</a></li>
                    </ul>
                </div>
                <button type="button" class="btn btn-default" id="clearOverLays">清空</button>
            </div>
        </div>

        <div id="mapDiv"></div>
        <div id="side_bar">
            <span id="side_barController"></span>
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
