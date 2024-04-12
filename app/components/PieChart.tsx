import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface PieChartProps {
  data: number[];
  labels: string[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, labels }) => {
  const [chartData, setChartData] = useState<[string, number | string][]>([['Sentiment', 'count']]);
  
  useEffect(() => {
    const newData: [string, number | string][] = [['Sentiment', 'count']];
    labels.forEach((label, index) => {
      newData.push([label, data[index]]);
    });
    setChartData(newData);
  }, [data]);

  return (
<Chart
      chartType="PieChart"
      width={'100%'}
      height={'100%'}
      data={chartData}
      options={{
        pieHole: 0.4,
        colors: ['#4CAF50', '#F44336', '#2196F3'], 
        backgroundColor: '#000000',
        chartArea: { width: '100%', height: '100%', left: '10%', top: '10%', bottom: '10%'},
        legend: {
          textStyle: { color: 'white' }, // Change legend text color to white
        },
      }}
    />

)
};

export default PieChartComponent;


