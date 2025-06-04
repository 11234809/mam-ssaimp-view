import * as echarts from "echarts";
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
		show: false,
      axisLine: { lineStyle: { color: "#293648" } },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#ffffff",
        fontSize: 12,
      },
      
      //data:[]
    },
    series: [
      {
        type: "bar",
        barGap: "-100%",
        barWidth: 24,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, config.barColor),
        },
        z: -10,
        data: data1,
      },
      {
        type: "bar",
        barGap: "-100%",
        barWidth: 20,

        itemStyle: {
          normal: {
            color: "#1E2230",
          },
        },
        label: {
          normal: {
            show: true,
            position: "top",
            fontSize: 12,
            color: "#fff",
            formatter: function (params) {
              return data1[params.dataIndex] === 0
                ? "-"
                : data1[params.dataIndex];
            },
          },
        },
        z: -12,
        data: data2,
      },
    ],
  };
  return options;
};

export { getRowXBarOption };
