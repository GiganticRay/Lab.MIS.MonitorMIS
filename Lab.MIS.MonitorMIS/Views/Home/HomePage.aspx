<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

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
                        <li role="separator" class="divider"></li>
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

                <div class="menu-item"><span>成都</span></div>
            </nav>
        </div>

        <div id="mapDiv"></div>
        <div id="side_bar">
            <span id="side_barController"></span>
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
</body>
</html>
