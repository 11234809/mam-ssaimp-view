// 搜索表单
export const formItem = (listOptions) => {
  return [
    {
      type: "select",
      options: listOptions.companyList,
      label: "公司",
      prop: "plateType",
    },
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "服务区",
      prop: "plateType",
    },
    {
      type: 'input',
      label: '投诉主题',
      prop: 'title',
    },
    {
      type: 'input',
      label: '投诉人',
      prop: 'title',
    },
    {
      type: "date",
      label: "投诉时间",
      prop: "checkTime",
    },
    {
      type: 'input',
      label: '填写人',
      prop: 'title',
    },
    {
      type: "date",
      label: "填写时间",
      prop: "checkTime",
    },
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "投诉状态",
      prop: "plateType",
    },
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "回复状态",
      prop: "plateType",
    },
  ];
};
// 新增表单
export const addFormItem = (listOptions) => {
  return [
    {
      type: "select",
      options: listOptions.serviceAreaList,
      label: "服务区",
      prop: "serviceAreaId",
    },
    {
      type: 'input',
      label: '投诉主题',
      prop: 'title',
    },
    {
      type: 'input',
      label: '投诉人',
      prop: 'title',
    },
    {
      type: "date",
      label: "投诉时间",
      prop: "checkTime",
    },
    {
      type: 'input',
      label: '投诉内容',
      prop: 'title',
      otherAttributes: {
        type: 'textarea',
        rows: 4
      },
    },
  ]
};
// 列表
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
    prop: "投诉主题",
    label: "投诉主题",
  },
  {
    prop: "投诉时间",
    label: "投诉时间",
  },
  {
    prop: "投诉人",
    label: "投诉人",
  },
  {
    prop: "填写人",
    label: "填写人",
  },
  {
    prop: "填写时间",
    label: "填写时间",
  },
  {
    prop: "投诉状态",
    label: "投诉状态",
  },
  {
    prop: "回复状态",
    label: "回复状态",
  },
];
