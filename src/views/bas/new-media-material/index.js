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
  },
  {
    prop: "serviceAreaName",
    label: "服务区名称",
  },
  {
    prop: "checkTime",
    label: "时间(月份)",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "微博",
    width: 160,
  },
  {
    prop: "serviceAreaName",
    label: "其他",
    width: 160,
  },
];
