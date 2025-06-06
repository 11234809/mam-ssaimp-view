import * as echarts from "echarts";

let color = ['#CC1CAA', '#8D67FF', '#00FFFF', '#48DE13', '#FFC516', '#DC3E14', '#8E16F8'];
let dom = 800;
let barWidth = dom / 20;
let colors = []
for(let i = 0;i<4;i++){
    colors.push({
         type: 'linear',
        x: 0,
        x2: 1,
        y: 0,
        y2: 0,
        colorStops: [
        {
            offset: 0,
            color: '#73fcff' // 最左边
        }, {
            offset: 0.5,
            color: '#86eef1' // 左边的右边 颜色
        }, {
            offset: 0.5,
            color: '#5ad6d9' // 右边的左边 颜色
        }, {
            offset: 1,
            color: '#3dc8ca'
        }]
    })
}

const getRowXBarOption = (data,config) => {
    let data1 = data.data;
    let data1Max = Math.max.apply(Math, data1);

    let data2 = [];
    for (var i = 0; i < data1.length; i++) {
      data2.push(data1Max)
    }
  let options = {
    grid: {
      left: 40,
      right: 40,
      bottom: 40,
      top: 40,
    },
    legend: {
      show: false,
    },
    //X轴
    xAxis: {
       splitLine: {
         show: false,
       },
       axisTick: {
         show: false,
       },
       
       data: data.xData,
    },
    yAxis: {
        show: true,
        splitNumber: 1,
        axisLine: {
            show: false,
        },
        splitLine: {
            show: true,
            lineStyle: {
                type:'dashed',
                color: '#075858'
            },
        },
        axisLabel: {
            color: '#FFFFFF',
            margin: 30,
            fontSize:15
        }
    },
	
	dataZoom: [
	    {
	        // 设置滚动条的隐藏与显示
	        show: true,
	        // 设置滚动条类型
	        type: "slider",
	        // 设置背景颜色
	        backgroundColor: "rgb(19, 63, 100)",
	        // 设置选中范围的填充颜色
	        fillerColor: "rgb(16, 171, 198)",
	        // 设置边框颜色
	        borderColor: "rgb(19, 63, 100)",
	        // 是否显示detail，即拖拽时候显示详细数值信息
	        showDetail: false,
	        // 数据窗口范围的起始数值
	        startValue:0,
	        // 数据窗口范围的结束数值（一页显示多少条数据）
	        endValue: 5,
			minValueSpan:5,
	        // empty：当前数据窗口外的数据，被设置为空。
	        // 即不会影响其他轴的数据范围
	        filterMode: "empty",
	        // 设置滚动条宽度，相对于盒子宽度
	        width: "50%",
	        // 设置滚动条高度
	        height: 8,
	        // 设置滚动条显示位置
	        left: "center",
	        // 是否锁定选择区域（或叫做数据窗口）的大小
	        zoomLoxk: true,
	        // 控制手柄的尺寸
	        handleSize: 0,
	        // dataZoom-slider组件离容器下侧的距离
	        bottom: 3,
	    },
	    {
	        // 没有下面这块的话，只能拖动滚动条，
	        // 鼠标滚轮在区域内不能控制外部滚动条
	        type: "inside",
	        // 滚轮是否触发缩放
	        zoomOnMouseWheel: false,
	        // 鼠标滚轮触发滚动
	        moveOnMouseMove: true,
	        moveOnMouseWheel: true,
			startValue: 0,
			endValue: 5,
			minValueSpan: 5,
	    },
	],
    series: [
        {
            type: 'bar',
            barWidth: barWidth,
            itemStyle: {
                normal: {
                    color: function(params) {
                        return colors[params.dataIndex % 7];
                    }
                }
            },
            label: {
                show: false,
                position: [barWidth / 2, -(barWidth + 20)],
                color: '#ffffff',
                fontSize: 14,
                fontStyle: 'bold',
                align: 'center',
            },
			barGap: '1%',
            data: data1
        },
        {
            z: 2,
            type: 'pictorialBar',
            data: data1,
            symbol: 'diamond',
            symbolOffset: [0, '50%'],
            symbolSize: [barWidth, barWidth * 0.5],
            itemStyle: {
                normal: {
                    color: function(params) {
                        return colors[params.dataIndex % 7];
                    },
                }
            },
        },
        {
            z: 3,
            type: 'pictorialBar',
            symbolPosition: 'end',
            data: data1,
            symbol: 'diamond',
            symbolOffset: [0, '-50%'],
            symbolSize: [barWidth, barWidth * 0.5],
            itemStyle: {
                normal: {
                    borderWidth: 0,
                    color: function(params) {
                        return colors[params.dataIndex % 7];
                    },
    
                }
            },
        },
    ],
  };
  return options;
};

export { getRowXBarOption };
