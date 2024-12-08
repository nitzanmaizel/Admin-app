import React from 'react';
import { Card, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ISingleBarChartData } from '@/utils/chartUtils';

interface SingleBarChartProps {
  primaryGroupValue: string;
  chartData: ISingleBarChartData[];
  secondaryGroupLabel?: string;
  additionalDataValue: string;
}

const SingleBarChart: React.FC<SingleBarChartProps> = ({ primaryGroupValue, chartData, secondaryGroupLabel, additionalDataValue }) => {
  return (
    <Card sx={{ padding: 1, maxHeight: 400 }}>
      <Typography variant="h6" gutterBottom>
        {'פלוגה '}
        {primaryGroupValue}
      </Typography>
      <BarChart
        width={300}
        height={400}
        sx={{
          maxHeight: 400,
        }}
        dataset={chartData}
        xAxis={[
          {
            dataKey: 'group',
            scaleType: 'band' as const,
            label: secondaryGroupLabel || 'Group',
          },
        ]}
        yAxis={[{ label: `Number of ${additionalDataValue}` }]}
        series={[
          {
            dataKey: 'count',
            label: 'סה"כ התייצבות',
            valueFormatter: (value: number | null) => (value !== null ? value.toString() : ''),
          },
        ]}
      />
      <Typography variant="body2" color="textSecondary">
        {'מספר'} {additionalDataValue}: {chartData.reduce((acc, item) => acc + (Number(item.count) || 0), 0)}
      </Typography>
    </Card>
  );
};

export default SingleBarChart;
