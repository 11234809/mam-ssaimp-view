import * as echarts from "echarts";


const getRowBarOption = (data,config) => {
    let data1 = data.data;
    let data1Max = Math.max.apply(Math, data1);

    let data2 = [];
    for (var i = 0; i < data1.length; i++) {
      data2.push(data1Max)
    }
  let options = {
    grid: {
      left: 100,
      right: 40,
      bottom: 40,
      top: 40,
    },
    legend: {
      show: false,
    },
    xAxis: {
      max: data1Max,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      axisLine: { lineStyle: { color: "#293648" } },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#ffffff",
        fontSize: 12,
      },
      data: data.yData,
      axisLabel: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "normal", // 或 bold
        margin: 8,
        rotate: 30,
      },
      //data:[]
    },
    series: [
      {
        type: "bar",
        barGap: "-100%",
        barWidth: 15,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, config.barColor),
        },
        z: -10,
        data: data1,
      },
      {
        type: "bar",
        barGap: "-100%",
        barWidth: 15,

        itemStyle: {
          normal: {
            color: "#1E2230",
          },
        },
        label: {
          normal: {
            show: true,
            position: "right",
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
let hoveredIndex = '';
// 生成扇形的曲面参数方程
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2;

  const startRadian = startRatio * Math.PI * 2;
  const endRadian = endRatio * Math.PI * 2;
  const midRadian = midRatio * Math.PI * 2;

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
      // eslint-disable-next-line no-param-reassign
      isSelected = false;
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  // eslint-disable-next-line no-param-reassign
  k = typeof k !== 'undefined' ? k : 1 / 3;

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1;

  // 返回曲面参数方程
  return {
      u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32,
      },

      v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20,
      },

      x(u, v) {
          if (u < startRadian) {
              return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
              return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },

      y(u, v) {
          if (u < startRadian) {
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },

      z(u, v) {
          if (u < -Math.PI * 0.5) {
              return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
              return Math.sin(u) * h * 0.1;
          }
          // 当前图形的高度是Z根据h（每个value的值决定的）
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
  };
}
const getPie3D = (pieData, internalDiameterRatio) => {
  const series = [];
  // 总和
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let max =
    Math.max.apply(
      null,
      pieData.map((x) => x.value)
    ) / 40;
  const legendData = [];
  const k =
    typeof internalDiameterRatio !== "undefined"
      ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
      : 1 / 3;

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i += 1) {
    sumValue += pieData[i].value;

    const seriesItem = {
      name: typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k,
      },
    };

    if (typeof pieData[i].itemStyle !== "undefined") {
      const { itemStyle } = pieData[i];

      // eslint-disable-next-line no-unused-expressions
      typeof pieData[i].itemStyle.color !== "undefined"
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null;
      // eslint-disable-next-line no-unused-expressions
      typeof pieData[i].itemStyle.opacity !== "undefined"
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null;

      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }
  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i += 1) {
    endValue = startValue + series[i].pieData.value;
    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;

    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      // 我这里做了一个处理，使除了第一个之外的值都是10
      series[i].pieData.value === series[0].pieData.value ? 35 : 10
    );
    startValue = endValue;
    legendData.push(series[i].name);
  }
  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  const option = {
    // animation: false,
    tooltip: {
      formatter: (params) => {
        if (params.seriesName !== "mouseoutSeries") {
          return `${
            params.seriesName
          }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
            params.color
          };"></span>${option.series[params.seriesIndex].pieData.value}`;
        }
        return "";
      },
    },
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: 0,
      max: max,
    },

    legend: {
      show: true, // 显示图例
      data: legendData, // 图例数据来源于 series 的 name 字段
      // 可选：设置为不占 echarts 布局空间
      bottom:'30',
      textStyle: {
        color: "#ffffff", // 图例文字颜色（可选）
        fontSize: 12, // 图例文字大小（可选）
      },
    },
    grid3D: {
      show: false,
      boxHeight: 5,
      top: "-20%",
      viewControl: {
        // 3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 35,
        // beta: 30,
        rotateSensitivity: 1,
        zoomSensitivity: 0,
        panSensitivity: 0,
        // autoRotate: true,
        distance: 150,
      },
      // 后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
      postEffect: {
        // 配置这项会出现锯齿，请自己去查看官方配置有办法解决
        enable: false,
        bloom: {
          enable: true,
          bloomIntensity: 0.1,
        },
        SSAO: {
          enable: true,
          quality: "medium",
          radius: 2,
        },
        // temporalSuperSampling: {
        //   enable: true,
        // },
      },
    },
    series,
  };
  return option;
};
const getLineChartOption = (data, config) => {
  console.log(data)
  var fontColor = "#30eee9";
  let option = {
    grid: {
      top: "0",
      bottom: "0",
      containLabel: true,
    },
    tooltip: {
      show: true,
      trigger: "item",
    },
    legend: {
      show: true,
      x: "center",
      top:'0',
      icon: "stack",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "#1bb4f6",
      },
      data: data.name,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          color: fontColor,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#397cbc",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#195384",
          },
        },
        data: data.xAxis,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "信息量",
        min: 0,
        max: 1000,
        axisLabel: {
          formatter: "{value}",
          textStyle: {
            color: "#2ad1d2",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#27b4c2",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#11366e",
          },
        },
      },
      {
        type: "value",
        name: "车流量",
        min: 0,
        // max: 1000,
        axisLabel: {
          formatter: "{value} 辆",
          textStyle: {
            color: "#186afe",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#186afe",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#11366e",
          },
        },
      },
    ],
    series: [
      {
        smooth: true, //是否平滑
        name: "总车流量",
        type: "line",
        stack: "总量",
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#0092f6",
            lineStyle: {
              color: "#0092f6",
              width: 1,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(7,44,90,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(0,146,246,0.9)",
                },
              ]),
            },
          },
        },
        markPoint: {
          itemStyle: {
            normal: {
              color: "red",
            },
          },
        },
        data: data.seriesData.carTraffic,
      },
      {
        smooth: true, //是否平滑,
        name: "新能源车",
        type: "line",
        stack: "总量",
        symbol: "circle",
        symbolSize: 8,

        itemStyle: {
          normal: {
            color: "#00d4c7",
            lineStyle: {
              color: "#00d4c7",
              width: 1,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(7,44,90,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(0,212,199,0.9)",
                },
              ]),
            },
          },
        },
        data: data.seriesData.newEnergyTraffic,
      },
      {
        smooth: true, //是否平滑
        name: "货车",
        type: "line",
        stack: "总量",
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#aecb56",
            lineStyle: {
              color: "#aecb56",
              width: 1,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(7,44,90,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(114,144,89,0.9)",
                },
              ]),
            },
          },
        },
        data: data.seriesData.freightTraffic,
      },
      {
        smooth: true, //是否平滑
        name: "客车",
        type: "line",
        stack: "总量",
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#aeae56",
            lineStyle: {
              color: "#aeae56",
              width: 1,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(7,44,90,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(114,144,89,0.9)",
                },
              ]),
            },
          },
        },
        data: data.seriesData.guestTraffic,
      },  
       {
        smooth: true, //是否平滑
        name: "危化品车",
        type: "line",
        stack: "总量",
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: "#aeff56",
            lineStyle: {
              color: "#aeff56",
              width: 1,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(7,44,80,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(114,144,89,0.9)",
                },
              ]),
            },
          },
        },
        data: data.seriesData.DangerousTraffic,
      },
    ],
  };
  return option;
};
// 手动翻页函数
const handleWheel = (event, data, barColor, chartInstance, key) => {
  stopScroll(key); // 停止自动滚动

  const total = data.data.length;
  const displayCount = 4;
  let index = scrollIndices[key];

  if (event.deltaY < 0) {
    // 向上滚动
    index = Math.max(0, index - 1);
  } else {
    // 向下滚动
    index = Math.min(total - displayCount, index + 1);
  }

  scrollIndices[key] = index;

  const visibleData = data.data.slice(index, index + displayCount);
  const visibleNames = data.yData.slice(index, index + displayCount);

  const options = getRowBarOption(
    { data: visibleData, yData: visibleNames },
    { barColor }
  );

  chartInstance.setOption(options);
};
const getRadar = (data, config) => {
  let option = {
    color: ["#67F9D8", "#FFE434", "#56A3F1", "#FF917C"],
    radar: [
      {
        indicator: [
          { text: "Indicator1", max: 150 },
          { text: "Indicator2", max: 150 },
          { text: "Indicator3", max: 150 },
          { text: "Indicator4", max: 120 },
          { text: "Indicator5", max: 108 },
          { text: "Indicator6", max: 72 },
        ],
        center: ['50%', '35%'],
        radius: 80,
        axisName: {
          color: "#fff",
          backgroundColor: "#666",
          borderRadius: 3,
          padding: [3, 5],
        },
      },
    ],
    series: [
      {
        type: "radar",
        radarIndex: 0,
        data: [
          {
            value: [120, 118, 130, 100, 99, 70],
            name: "Data C",
            symbolSize: 5,
            label: {
              show: true,
              formatter: function (params) {
                return params.value;
              },
            },
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: "rgba(255, 145, 124, 0.1)",
                  offset: 0,
                },
                {
                  color: "rgba(255, 145, 124, 0.9)",
                  offset: 1,
                },
              ]),
            },
          },
          {
            value: [100, 93, 50, 90, 70, 60],
            name: "Data D",
            areaStyle: {
              color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                {
                  color: "rgba(255, 145, 124, 0.1)",
                  offset: 0,
                },
                {
                  color: "rgba(255, 145, 124, 0.9)",
                  offset: 1,
                },
              ]),
            },
          },
        ],
      },
    ],
  };
  return option;
};
const get3DBarOption = (data, config) => {
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - 9, shape.y - 9];
      const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    },
  });
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9];
      const c4 = [shape.x + 18, shape.y - 9];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + 18, shape.y - 9];
      const c3 = [shape.x + 9, shape.y - 18];
      const c4 = [shape.x - 9, shape.y - 9];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });
  echarts.graphic.registerShape("CubeLeft", CubeLeft);
  echarts.graphic.registerShape("CubeRight", CubeRight);
  echarts.graphic.registerShape("CubeTop", CubeTop);
  const VALUE = [
    2012, 1230, 3790, 2349, 1654, 1230, 3790, 2349, 1654, 3790, 2349, 1654,
  ];
  let option = {
    grid: {
      top:"-10%",
      bottom: "30%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "德州",
        "德城区",
        "陵城区",
        "禹城市",
        "乐陵市",
        "临邑县",
        "平原县",
        "夏津县",
        "武城县",
        "庆云县",
        "宁津县",
        "齐河县",
      ],
      axisLine: {
        show: true,
        lineStyle: {
          color: "white",
        },
      },
      axisTick: {
        show: false,
        length: 9,
        alignWithLabel: true,
        lineStyle: {
          color: "#7DFFFD",
        },
      },
      axisLabel: {
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          color: "white",
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
      },
      boundaryGap: ["20%", "20%"],
    },
    series: [
      {
        type: "custom",
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)]);
          return {
            type: "group",
            children: [
              {
                type: "CubeLeft",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#3B80E2",
                    },
                    {
                      offset: 1,
                      color: "#49BEE5",
                    },
                  ]),
                },
              },
              {
                type: "CubeRight",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#3B80E2",
                    },
                    {
                      offset: 1,
                      color: "#49BEE5",
                    },
                  ]),
                },
              },
              {
                type: "CubeTop",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#3B80E2",
                    },
                    {
                      offset: 1,
                      color: "#49BEE5",
                    },
                  ]),
                },
              },
            ],
          };
        },
        data: VALUE,
      },
      {
        type: "bar",
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: (e) => {
              switch (e.name) {
                case "10kV线路":
                  return VALUE[0];
                case "公用配变":
                  return VALUE[1];
                case "35kV主变":
                  return VALUE[2];
                case "水":
              }
            },
            fontSize: 12,
            color: "#fff",
          },
        },
        itemStyle: {
          color: "transparent",
        },
        data:VALUE
      },
    ],
  };
  return option;
};
export { getRowBarOption,getPie3D,getParametricEquation,getLineChartOption,handleWheel,getRadar,get3DBarOption };
