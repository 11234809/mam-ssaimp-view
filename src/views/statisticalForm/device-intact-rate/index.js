export const formItem = (listOptions) => {
    return [
        {
            type: "select",
            options: listOptions.serviceAreaList,
            label: "公司",
            prop: "plateType",
        },
        {
            type: "select",
            options: listOptions.serviceAreaTypeList,
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
        prop: "companyName",
        label: "公司名称",
        width: "aotu",
    },
    {
        prop: "serviceAreaName",
        label: "服务区名称",
        width: "aotu",
    },
    {
        prop: "yearAndMonth",
        label: "时间(月份)",
        width: "aotu",
    },
    {
        prop: "fire",
        label: "消防系统完好率",
        width: "aotu",
    },
    {
        prop: "video",
        label: "监控系统完好率",
        width: "aotu",
    },
    {
        prop: "sewage",
        label: "污水处理系统完好率",
        width: "aotu",
    },
    {
        prop: "information",
        label: "信息发布系统完好率",
        width: "aotu",
    },
    {
        prop: "network",
        label: "对公网络系统系统完好率",
        width: 200,
    },
    {
        prop: "toilet",
        label: "智能卫生间系统完好率",
        width: 200,
    },
    {
        prop: "lighting",
        label: "照明系统完好率",
        width: "aotu",
    },
    {
        prop: "accessLicense",
        label: "出入口车牌识别系统完好率",
        width: 200,
    },
];
