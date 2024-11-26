import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const MyPieChart = () => {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 'Đang học', value: 50, label: 'Đang học' },
            { id: 'Đã tốt nghiệp', value: 30, label: 'Đã tốt nghiệp' },
            { id: 'Bỏ học', value: 20, label: 'Bỏ học' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
};

export default MyPieChart;
