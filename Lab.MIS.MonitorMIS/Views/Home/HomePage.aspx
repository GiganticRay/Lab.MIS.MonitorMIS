<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>天地图－地图API－范例－经纬度直投地图</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--css--%>
    <link href="../../Resource/Scripts/bootstrap.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/bootstrap.min.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/LogIn/login-register.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/sweetalert/sweetalert.css" rel="stylesheet" />



    <%--js--%>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
    <script src="../../Resource/Scripts/bootstrap.min.js"></script>
    <script src="../../Resource/Scripts/MyJs.js"></script>
    <script src="../../Resource/Scripts/jquery-ui.min.js"></script>
    <script src="../../Resource/Scripts/sweetalert/sweetalert-dev.min.js"></script>
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
                    <button type="button" class="btn btn-default" id="Address"><span></span>成都</button>

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

        <div id="mapDiv"> </div>
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
                                    <input class="btn btn-default btn-login" type="button" id="btnLogin" value="登录" >
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
