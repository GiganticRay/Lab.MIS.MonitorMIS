//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Lab.MIS.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class MonitorPointInfo
    {
        public MonitorPointInfo()
        {
            this.DeviceInfo = new HashSet<DeviceInfo>();
        }
    
        public int Id { get; set; }
        public int MonitorId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    
        public virtual ICollection<DeviceInfo> DeviceInfo { get; set; }
    }
}
