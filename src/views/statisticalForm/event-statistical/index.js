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
      label: "日报时间",
      prop: "checkTime",
    },
  ];
};
// 普通列prop
export const normalColumn = ["index", "company", "serviceAreaName"];
// 事件统计报表列表
export const tableColumn = [
  {
    type: "index",
    label: "序号",
    width: "80",
    prop: "index",
  },
  {
    prop: "company",
    label: "公司名称",
  },
  {
    prop: "serviceAreaName",
    label: "服务区名称",
  },
];
// 事件统计报表详情列表
export const detailTableColumn = [
  {
    prop: "companyText",
    label: "公司",
  },
  {
    prop: "serviceAreaText",
    label: "服务区",
  },
  {
    prop: "areaName",
    label: "区域",
  },
  {
    prop: "eventName",
    label: "事件类型",
  },
  {
    prop: "describ",
    label: "异常描述",
  },
  {
    prop: "statusText",
    label: "处理状态",
  },
  {
    prop: "reportUser",
    label: "上报人",
  },
  {
    prop: "reportRole",
    label: "角色",
  },
  {
    prop: "createTime",
    label: "上报时间",
    width: 120,
  },
  {
    prop: "happenTime",
    label: "发生时间",
    width: 120,
  },
  {
    prop: "isControlText",
    label: "是否管制",
  },
  {
    prop: "controlMethod",
    label: "管制措施",
  },
  {
    prop: "guanzhiTime",
    width: 250,
    label: "管制时间",
  },
  {
    prop: "epidemicNum",
    label: "疫情人员数量",
  },
  {
    prop: "files",
    label: "上报时图片",
    slotType: 'img',
  },
  {
    prop: "handleTime",
    label: "处理时间",
    width: 120,
  },
  {
    prop: "handleResult",
    label: "处理结果",
  },
  {
    prop: "handleFiles",
    label: "处理时图片",
    slotType: 'img',
  },
];
