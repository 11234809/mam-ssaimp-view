export const formItem = (serviceAreaList) => {
  return [
    {
      type: "select",
      options: serviceAreaList,
      label: "公司",
      prop: "plateType",
    },
    {
      type: "select",
      options: serviceAreaList,
      label: "服务区",
      prop: "plateType",
    },
    {
      type: "datePicker",
      label: "时间(月份)",
      prop: "checkTime",
    },
  ];
};

export const tableColumn = [
  {
    type: "index",
    label: "序号",
    width: "80",
  },
  {
    prop: "company",
    label: "公司名称",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "服务区名称",
    width: 160,
  },
  {
    prop: "checkTime",
    label: "时间(月份)",
    width: 160,
  },
  {
    prop: "消防系统完好率",
    label: "消防系统完好率",
    width: 160,
  },
  {
    prop: "监控系统完好率",
    label: "监控系统完好率",
    width: 160,
  },
  {
    prop: "污水处理系统完好率",
    label: "污水处理系统完好率",
    width: 160,
  },
  {
    prop: "信息发布系统完好率",
    label: "信息发布系统完好率",
    width: 160,
  },
  {
    prop: "对公网络系统系统完好率",
    label: "对公网络系统系统完好率",
    width: 200,
  },
  {
    prop: "智能卫生间系统完好率",
    label: "智能卫生间系统完好率",
    width: 200,
  },
  {
    prop: "照明系统完好率",
    label: "照明系统完好率",
    width: 160,
  },
  {
    prop: "出入口车牌识别系统完好率",
    label: "出入口车牌识别系统完好率",
    width: 200,
  },
];
