<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>天地图－地图API－范例－经纬度直投地图</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--Script--%>
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />
    <script src="../../Resource/Scripts/MyJs.js"></script>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
</head>


<body onload="onLoad()">
    <div id="headDiv"> 
        <img src="../../Resource/Img/Logo.png" id="LogoImg"/>

        <div id="searchDiv">
            <input id="searchContent"/>
            <img id="clearKeyword" src="../../Resource/Img/Clear.png" />
        </div>
        <div id="searchBtn"></div>
        <div id="rightBar" >
            <div id="mine"></div>
            <div class="seperator"></div>
            <div id="mainMenuBtn"></div>
        </div>
    </div>
    
    <div id="mapDiv"></div>
</body>




</html>
