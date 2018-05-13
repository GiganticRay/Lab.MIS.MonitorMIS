using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Lab.MIS.BLL;
using Lab.MIS.Model;
using Newtonsoft.Json;

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
            if (userInfos.Count(a=>a.Id > 0) == 0)
            {
                res.Data = new {state = false};
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
                res.Data = new {state = false};
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
                res.Data = new {state = true};
            }
            catch (Exception e)
            {
                res.Data = new {state = false};
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
                res.Data = new {state = true};
            }
            catch (Exception e)
            {
                res.Data = new {state = false};
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
        public ActionResult GetAllDevicePoints() {

            List< DeviceInfo > getaAllDeviceInfo = deviceInfoService.Get(a => a.Id > 0).ToList();

            var res = new JsonResult();
            res.Data = JsonConvert.SerializeObject(getaAllDeviceInfo, setting);
            return res;
        }
        /// <summary>
        /// 根据id删除检测设备
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public ActionResult DeleteDevice(int id=0) {

            //DeviceInfo deviceinfo = deviceInfoService.Get(a => a.Id > 0).First();


            return Content(deviceInfoService.Delete(a => a.Id ==id).ToString());
        }

        public ActionResult SaveDevice(DeviceInfo deviceinfo) {
            bool getResult =  deviceInfoService.Update(deviceinfo);
            return Content(getResult.ToString());
        }
    }
}
