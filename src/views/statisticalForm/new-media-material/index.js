export const formItem = (listOptions) => {
  return [
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "服务区",
      prop: "serviceAreaIdList",
    },
    {
      type: "select",
      options: listOptions.serviceTypeList,
      label: "服务区类型",
      prop: "serviceAreaTypeList",
    },
    {
      type: "datePicker",
      label: "时间(月份)",
      prop: "yearAndMonth",
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
    prop: "companyName",
    label: "公司名称",
  },
  {
    prop: "areaInfoName",
    label: "服务区名称",
  },
  {
    prop: "date",
    label: "时间(月份)",
    width: 160,
  },
  {
    prop: "wxNums",
    label: "微博",
    width: 160,
  },
  {
    prop: "otherNums",
    label: "其他",
    width: 160,
  },
];