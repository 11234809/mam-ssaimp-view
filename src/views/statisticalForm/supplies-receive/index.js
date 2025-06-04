export const formItem = (listOptions) => {
    return [
        {
            type: "select",
            options: listOptions.serviceAreaIdList,
            label: "服务区",
            prop: "serviceAreaIdList",
        },
        {
            type: "select",
            options: listOptions.serviceAreaTypeList,
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
        width: 60,
    },
    {
        prop: "companyName",
        label: "公司名称",
        width: "aotu",
    },
    {
        prop: "serviceAreaName",
        label: "服务区名称",
        width: "auto",
    },
    {
        prop: "yearAndMonth",
        label: "时间(月份)",
        width: 160,
    },
    {
        prop: "goodsType",
        label: "物资类型",
        width: 160,
    },
    {
        prop: "name",
        label: "物资名称",
        width: 160,
    },
    {
        prop: "lastNum",
        label: "上期期末数",
        width: 160,
    },
    {
        prop: "inNum",
        label: "本期入库数量",
        width: 160,
    },
    {
        prop: "outNum",
        label: "本期出库数量",
        width: 160,
    },
    {
        prop: "stockNum",
        label: "本期库存数量",
        width: 160,
    },
];
