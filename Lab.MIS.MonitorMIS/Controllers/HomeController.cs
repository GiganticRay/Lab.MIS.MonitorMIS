using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Lab.MIS.BLL;
using Lab.MIS.Model;
using Newtonsoft.Json;
using System.Text;

namespace Lab.MIS.MonitorMIS.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public UserInfoService userInfoService = new UserInfoService();
        public DeviceInfoService deviceInfoService = new DeviceInfoService();
        public PointPictureService pointPictureService = new PointPictureService();
        public MonitorPointInfoService monitorPointInfoService = new MonitorPointInfoService();
        //json序列化的对象
        public JavaScriptSerializer JsSerializer = new JavaScriptSerializer();

        public JsonSerializerSettings setting
        {
            get
            {
                return new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                };
            }
        }


        public ActionResult HomePage()
        {
            return View();
        }

        public ActionResult Login(UserInfo userInfo)
        {
            IQueryable<UserInfo> userInfos = userInfoService.Get(a => a.UserName == userInfo.UserName && a.UserPwd == userInfo.UserPwd);

            var res = new JsonResult();
            if (userInfos.Count(a => a.Id > 0) == 0)
            {
                res.Data = new { state = false };
            }
            else
            {
                res.Data = new
                {
                    Id = userInfos.First().Id,
                    UserName = userInfos.First().UserName,
                    UserAuthority = userInfos.First().UserAuthority
                };
            }

            return res;
        }

        /// <summary>
        /// 获取返回点击device信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetClickDeviceInfo(int id)
        {
            var res = new JsonResult();
            try
            {
                DeviceInfo deviceInfo = deviceInfoService.Get(a => a.Id == id).First();
                res.Data = JsonConvert.SerializeObject(deviceInfo, setting);
            }
            catch (Exception e)
            {
                res.Data = new { state = false };
            }

            return res;
        }

        /// <summary>
        /// 录入deviceinfo信息
        /// </summary>
        /// <param name="deviceInfo"></param>
        /// <returns></returns>
        public ActionResult EnteringDeviceInfo(DeviceInfo deviceInfo)
        {
            var res = new JsonResult();
            try
            {
                deviceInfoService.Add(deviceInfo);
                res.Data = new { state = true };
            }
            catch (Exception e)
            {
                res.Data = new { state = false };
            }

            return res;
        }

        /// <summary>
        /// 录入monitorInfo信息
        /// </summary>
        /// <param name="deviceInfo"></param>
        /// <returns></returns>
        public ActionResult EnteringMonitorPointInfo(MonitorPointInfo monitorPointInfo)
        {
            var res = new JsonResult();
            try
            {
                monitorPointInfoService.Add(monitorPointInfo);
                res.Data = new { state = true };
            }
            catch (Exception e)
            {
                res.Data = new { state = false };
            }

            return res;
        }

        /// <summary>
        /// 获取MonitorInfos和monitorInfos对应的deviceInfo信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GetMonitorInfos()
        {
            List<MonitorPointInfo> monitorPointInfos = monitorPointInfoService.Get(a => a.Id > 0).ToList();
            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(monitorPointInfos, setting);
            return res;
        }
        /// <summary>
        /// 获取所有检测设备的信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GetAllDevicePoints()
        {

            List<DeviceInfo> getaAllDeviceInfo = deviceInfoService.Get(a => a.Id > 0).ToList();

            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(getaAllDeviceInfo, setting);
            return res;
        }


        public ActionResult GetDiseaseInfo(string arrayId, string beforeTime, string endTime)
        {
            string GetUrl = "http://47.92.125.37/mudrock/user/getResult" + "?arrayId=" + arrayId + "&beforeTime=" + beforeTime + "&endTime=" + endTime;
            string Jsonstr = JsonToTableClass.GetJson(GetUrl);
            return Content(Jsonstr);
        }

        /// <summary>
        /// 根据id删除检测设备
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public ActionResult DeleteDevice(int id = 0)
        {

            //DeviceInfo deviceinfo = deviceInfoService.Get(a => a.Id > 0).First();


            return Content(deviceInfoService.Delete(a => a.Id == id).ToString());
        }

        public ActionResult SaveDevice(DeviceInfo deviceinfo)
        {
            bool getResult = deviceInfoService.Update(deviceinfo);
            return Content(getResult.ToString());
        }

        /// <summary>
        /// 通过id获取监测阵列的类型
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetOneMonitorPointInfo(int id = 13)
        {
            MonitorPointInfo newMoitor = monitorPointInfoService.Get(a => a.MonitorId == id).First();

            string getMonitorType = newMoitor.Type.Length > 0 ? newMoitor.Type : "错误，未知";
            return Content(getMonitorType);
        }
        /// <summary>
        /// 获取未满3个检测设备的检测阵列
        /// </summary>
        /// <returns></returns>
        public ActionResult GetNewMonitorInfos()
        {
            List<MonitorPointInfo> monitorPointInfos = monitorPointInfoService.Get(a => a.Id > 0).ToList();
            List<MonitorPointInfo> newPointInfo = new List<MonitorPointInfo>();
            foreach (var item in monitorPointInfos)
            {
                int getDeviceMonitorId = item.MonitorId;

                int count = deviceInfoService.Get(a => a.MonitorPointInfoId == getDeviceMonitorId).Count();

                //判断是否有三个设备
                if (count < 3)
                {
                    newPointInfo.Add(item);
                }
            }
            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(newPointInfo, setting);
            return res;
        }
        /// <summary>
        /// 获取树状结构的数据
        /// </summary>
        /// <returns></returns>
        public ActionResult GetTreeJson()
        {
            StringBuilder backData = new StringBuilder();

            backData.Append("[{");
            backData.Append("\"tags\":[\"-1\"],\"text\":\"滑坡\",\"nodes\":[");
            List<DeviceInfo> newDeviceList = deviceInfoService.Get(a => a.MonitorType == "滑坡").ToList();
            foreach (var item in newDeviceList)
            {
                backData.Append("{");
                backData.AppendFormat("\"tags\":[\"{0}\"],", item.Id);
                backData.AppendFormat("\"text\":[\"{0}\"]", item.DeviceName);
                backData.Append("},");
            }
            //将最后一个“,”移除
            backData.Remove(backData.Length - 1, 1);
            backData.Append("]");



            backData.Append("},");



            backData.Append("{");
            backData.Append("\"tags\":[\"-1\"],\"text\":\"泥石流\",\"nodes\":[");
            List<DeviceInfo> newDeviceListSecond = deviceInfoService.Get(a => a.MonitorType == "泥石流").ToList();
            foreach (var item in newDeviceListSecond)
            {
                backData.Append("{");
                backData.AppendFormat("\"tags\":[\"{0}\"],", item.Id);
                backData.AppendFormat("\"text\":[\"{0}\"]", item.DeviceName);
                backData.Append("},");
            }
            //将最后一个“,”移除
            backData.Remove(backData.Length - 1, 1);
            backData.Append("]");



            backData.Append("}]");

            return Content(backData.ToString());
        }
        /// <summary>
        /// 通过id获取一个检测设备的信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GetOneDevice(int id)
        {
            List<DeviceInfo> getaAllDeviceInfo = deviceInfoService.Get(a => a.Id == id).ToList();

            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(getaAllDeviceInfo, setting);
            return res;

        }
        /// <summary>
        /// 根据id查询监测阵列的三个监测设备信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetDeviceInfoByMonitorId(int id)
        {
            List<DeviceInfo> tmp = deviceInfoService.Get(a => a.MonitorPointInfoId == id).ToList();
            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(tmp, setting);
            return res;
        }
    }
}
