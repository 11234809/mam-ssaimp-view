const getRowBarOption = (data,config) => {

  let options = {
   grid: {
     left: 0,
     right: 0,
     bottom: 0,
     top: 0,
   },
      legend: {
        show:false
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },

          labelLine: {
            show: false
          },
          data:data
        }
      ]
  };
  return options;
};

export { getRowBarOption };
