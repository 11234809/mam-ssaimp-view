// 日报搜索表单项
export const dailyFormItem = (listOptions) => {
  return [
    // {
    //   type: "select",
    //   options: listOptions.companyList,
    //   label: "公司",
    //   prop: "plateType",
    // },
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "服务区",
      prop: "serviceAreaId",
    },
    // {
    //   type: "select",
    //   options: listOptions.serviceAreaList,
    //   label: "服务区类型",
    //   prop: "plateType",
    // },
    {
      type: "datePicker",
      label: "日报时间",
      prop: "checkTime",
    },
  ];
};
// 日报统计报表列表
export const dailyTableColumn = [
  {
    type: "index",
    label: "序号",
    width: "80",
    prop: "index",
    fixed: "left"
  },
  {
    prop: "createDay",
    label: "日报时间",
    width: 180,
    fixed: "left"
  },
//   {
//     prop: "company",
//     label: "公司",
//   },
  {
    prop: "serviceAreaName",
    label: "服务区",
    width: 180,
    fixed: "left"
  },
];
// 日报/月报/全路网统计报表列表
export const tableColumn = [
  {
    prop: "carTraffic",
    label: "总车流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "bigPassengerTraffic",
    label: "大客车流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "passengerTraffic",
    label: "小客车流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "newEnergyTraffic",
    label: "新能源车流量",
    sortable: true,
    width: 160,
  },
  {
    prop: "freightTraffic",
    label: "货车(不含危化品车)流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "dangerFreightTraffic",
    label: "危化品车流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "guestTraffic",
    label: "客流量",
    sortable: true,
    width: 120,
  },
  {
    prop: "truckService",
    label: "司机之家服务人次",
    sortable: true,
    width: 120,
  },
  {
    prop: "snackIncome",
    label: "小吃收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "supermarketIncome",
    label: "超市收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "restaurantIncome",
    label: "餐厅收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "motorRepairIncome",
    label: "汽修收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "roomIncome",
    label: "客房收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "oilIncome",
    label: "油品收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "nonOilIncome",
    label: "非油品收入(万元)",
    sortable: true,
    width: 180,
  },
  {
    prop: "otherIncome",
    label: "其他收入(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "incomeTotal",
    label: "收入总计(万元)",
    sortable: true,
    width: 160,
  },
  {
    prop: "oilCarNumber",
    label: "加油车次(辆)",
    width: 120,
  },
  {
    prop: "exPassengerNumber",
    label: "换电车辆数(小型客车)",
    width: 120,
  },
  {
    prop: "exPassengerCost",
    label: "换电金额(小型客车)",
    width: 120,
  },
  {
    prop: "exTruckNumber",
    label: "换电车辆数(重卡)",
    width: 120,
  },
  {
    prop: "exTruckCost",
    label: "换电金额(重卡)",
    width: 120,
  },
  {
    prop: "gasCarNumber",
    label: "加气车辆数(辆)",
    width: 120,
  },
  {
    prop: "gasNumber",
    label: "加气量(吨)",
    width: 120,
  },
  {
    prop: "gasCost",
    label: "加气金额(元)",
    width: 120,
  },
  {
    prop: "photovoltaicNumber",
    label: "光伏发电量(KWH)",
    width: 120,
  },
  {
    prop: "photovoltaicTime",
    label: "光伏发电时长(小时)",
    width: 120,
  },
];
// 流量情况统计
export const trafficStats = [
  {
    title: "总车流量",
    key: "carTraffic",
  },
  {
    title: "大客车流量",
    key: "bigPassengerTraffic",
  },
  {
    title: "小客车流量",
    key: "passengerTraffic",
  },
  {
    title: "新能源车流量",
    key: "newEnergyTraffic",
  },
  {
    title: "货车(非危化)流量",
    key: "freightTraffic",
  },
  {
    title: "危化品车流量",
    key: "dangerFreightTraffic",
  },
  {
    title: "客流量",
    key: "guestTraffic",
  },
];
// 收入情况统计
export const revenueStats = [
  {
    title: "小吃收入(万元)",
    key: "snackIncome",
  },
  {
    title: "超市收入(万元)",
    key: "supermarketIncome",
  },
  {
    title: "餐厅收入(万元)",
    key: "restaurantIncome",
  },
  {
    title: "汽修收入(万元)",
    key: "motorRepairIncome",
  },
  {
    title: "客房收入(万元)",
    key: "roomIncome",
  },
  {
    title: "油品收入(万元)",
    key: "oilIncome",
  },
  {
    title: "非油品收入(万元)",
    key: "nonOilIncome",
  },
  {
    title: "其他收入(万元)",
    key: "otherIncome",
  },
  {
    title: "收入总计(万元)",
    key: "incomeTotal",
  },
];
// 换电、加气、光伏统计
export const rechargeStats = [
  {
    title: "加油车次",
    key: "oilCarNumber",
  },
  {
    title: "换电车辆数(小客)",
    key: "exPassengerNumber",
  },
  {
    title: "换电金额(小客)",
    key: "exPassengerCost",
  },
  {
    title: "换电车辆数(重卡)",
    key: "exTruckNumber",
  },
  {
    title: "换电金额(重卡)",
    key: "exTruckCost",
  },
  {
    title: "加气车辆数",
    key: "gasCarNumber",
  },
  {
    title: "加气量",
    key: "gasNumber",
  },
  {
    title: "加气金额",
    key: "gasCost",
  },
  {
    title: "光伏发电量",
    key: "photovoltaicNumber",
  },
  {
    title: "光伏发电时长",
    key: "photovoltaicTime",
  },
];
