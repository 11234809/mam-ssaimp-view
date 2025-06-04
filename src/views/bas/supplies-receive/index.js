export const formItem = (serviceAreaList) => {
  return [
    {
      type: "select",
      options: serviceAreaList,
      label: "服务区",
      prop: "plateType",
    },
    {
      type: "select",
      options: serviceAreaList,
      label: "服务区类型",
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
    prop: "serviceAreaName",
    label: "物资类型",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "物资名称",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "上期期末数",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "本期入库数量",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "本期出库数量",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "本期库存数量",
    width: 160,
  },
];
