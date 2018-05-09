<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>天地图－地图API－范例－经纬度直投地图</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--Script--%>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
    <script src="../../Resource/Scripts/bootstrap.min.js"></script>
     <script src="../../Resource/Scripts/MyJs.js"></script>
    <link href="../../Resource/Scripts/bootstrap.min.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />
    <script src="../../Resource/Scripts/layer.js"></script>
</head>

<body onload="onLoad()">
    <div id="MainDiv">
        <div id="headDiv">
            <img src="../../Resource/Img/Logo.png" id="LogoImg" />
            <div id="searchDiv">
                <input id="searchContent" />
                <img id="clearKeyword" src="../../Resource/Img/Clear.png" />
            </div>
            <div id="searchBtn"></div>
            <div id="rightBar">
                <div id="mine"></div>
                <div class="seperator"></div>
                <div id="mainMenuBtn"></div>
            </div>
        </div>

        <div id="mapDiv">
            <div class="btn-group" id="btn-group">
                <div class="btn-group">
                    <button type="button" class="btn btn-default" id="Address"><span></span>成都</button>
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">工具<span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li class="ToolBox"><a href="#" id="MeasureLength"><span></span>测量</a></li>
                        <li class="ToolBox"><a href="#" id="MeasureArea"><span></span>测面</a></li>
                        <li class="ToolBox"><a href="#" id="MeasurearkPoint"><span></span>标点</a></li>
                        <li class="ToolBox"><a href="#" id="MarkLine"><span></span>标线</a></li>
                        <li class="ToolBox"><a href="#" id="MarkArea"><span></span>标面</a></li>
                    </ul>
                </div>
                <button type="button" class="btn btn-default" id="clearOverLays">清空</button>
            </div>
        </div>
        <div id="side_bar">
            <span id="side_barController"></span>
        </div>
    </div>
</body>




</html>
