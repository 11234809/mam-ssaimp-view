
const isPositiveInteger = (rule, value, callback) => {
    if (value < 0) {
        callback(new Error('请输入大于0的数'));
    } else {
        callback();
    }
}
const isLessThanMillion = (rule, value, callback) => {
    if (value > 100) {
        console.log(rule);
        callback(new Error('每日收入金额不超过100万'));
    } else {
        callback();
    }
}
export const formRules = {
    serviceAreaId: [{
        required: true,
        message: '请选择服务区',
        trigger: 'change'
    }],
    createDay: [{
        required: true,
        message: '请选择日报时间',
        trigger: 'change'
    }],
    operateStatus: [{
        required: true,
        message: '请选择服务区运营状态',
        trigger: 'change'
    }],
    statisticalCaliber: [{
        required: true,
        message: '请选择流量统计口径',
        trigger: 'change'
    }],
    bigPassengerTraffic: [{
        required: true,
        message: '请输入大客车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    passengerTraffic: [{
        required: true,
        message: '请输入小客车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    newEnergyTraffic: [{
        required: true,
        message: '请输入新能源车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    freightTraffic: [{
        required: true,
        message: '请输入货车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    dangerFreightTraffic: [{
        required: true,
        message: '请输入危化品车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    carTraffic: [{
        required: true,
        message: '请计算总车流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    guestTraffic: [{
        required: true,
        message: '请输入客流量',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    snackIncome: [{
        required: true,
        message: '请输入小吃收入',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }
    ],
    supermarketIncome: [{
        required: true,
        message: '请输入超市收入',
        trigger: 'blur'
    }, 
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    restaurantIncome: [{
        required: true,
        message: '请输入餐厅收入',
        trigger: 'blur'
    }, 
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    motorRepairIncome: [{
        required: true,
        message: '请输入汽修收入',
        trigger: 'blur'
    }, 
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    roomIncome: [{
        required: true,
        message: '请输入客房收入',
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    oilIncome: [{
        required: true,
        message: '请输入油品收入',
        trigger: 'blur'
    }, 
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    otherIncome: [{
        required: true,
        message: '请输入其他收入',
        trigger: 'blur'
    }, 
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, 
    {
        validator: isLessThanMillion,
        trigger: 'blur'
    },
    {
        pattern: /^\d+(\.\d{0,6})?$/,
        message: '请输入最多6位小数的数字',
        trigger: 'blur'
    }],
    incomeTotal: [{
        required: true,
        message: '请计算收入总计',
        trigger: 'blur'
    }],
    oilCarNumber: [{
        required: true,
        message: '请输入加油车次',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    exPassengerNumber: [{
        required: true,
        message: '请输入换电小型车车辆数',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    exPassengerCost: [{
        required: true,
        message: '请输入小型客车换电金额',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
    exTruckNumber: [{
        required: true,
        message: '请输入换电卡车车辆数',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    exTruckCost: [{
        required: true,
        message: '请输入重卡换电金额',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
    gasCarNumber: [{
        required: true,
        message: '请输入加气车辆数',
        trigger: 'blur'
    },
    {
        validator: isPositiveInteger,
        trigger: 'blur'
    },
    {
        pattern: /^\d+$/,
        message: '请输入整数',
        trigger: 'blur'
    }
    ],
    gasNumber: [{
        required: true,
        message: '请输入加气量',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
    gasCost: [{
        required: true,
        message: '请输入加气金额',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
    photovoltaicNumber: [{
        required: true,
        message: '请输入光伏发电量',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
    photovoltaicTime: [{
        required: true,
        message: '请输入光伏发电时长',
        trigger: 'blur'
    }, {
        validator: isPositiveInteger,
        trigger: 'blur'
    }, {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '请输入最多2位小数的数字',
        trigger: 'blur'
    }],
}