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
      label: "日报时间",
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
    prop: "事故灾害",
    label: "事故灾害",
  },
  {
    prop: "养护施工",
    label: "养护施工",
  },
  {
    prop: "社会安全事件",
    label: "社会安全事件",
  },
  {
    prop: "地质灾害",
    label: "地质灾害",
  },
  {
    prop: "气象灾害",
    label: "气象灾害",
  },
  {
    prop: "其他事件",
    label: "其他事件",
  },
  {
    prop: "突发疫情",
    label: "突发疫情",
  },
  {
    prop: "total",
    label: "事件总数",
  },
];
