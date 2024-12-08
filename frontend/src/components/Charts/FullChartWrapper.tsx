import { Card, Typography, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { IDocData, IDocItemData } from '@/types/DocTypes';
import { BarSeriesType } from '@mui/x-charts';
import { useMemo } from 'react';

interface IPivotedData {
  group: string;
  [secondaryGroup: string]: number | string;
}

// Utility function to get a specific additionalData value by key
function getAdditionalDataValue(item: IDocItemData, additionalDataKey: string): string {
  const found = item.additionalData.find((ad) => ad.key === additionalDataKey);
  return found && found.value ? found.value.trim() : '';
}

/**
 * Prepares pivoted chart data with two grouping levels and counts.
 *
 * @param {IDocItemData[]} docItems - The docItems array from your data.
 * @param {string} primaryGroupKey - The primary group key (e.g., 'company').
 * @param {string} secondaryGroupKey - The secondary group key (e.g., 'department').
 * @param {string} filterKey - The key inside additionalData to filter on (e.g., 'statusArrival').
 * @param {string} filterValue - The value that the `filterKey` should match (e.g., 'התייצב').
 *
 * @returns {{ chartData: IPivotedData[]; secondaryGroupList: string[] }} - The pivoted chart data and list of secondary groups.
 */
function preparePivotedChartData(
  docItems: IDocItemData[],
  primaryGroupKey: string,
  secondaryGroupKey: string,
  filterKey: string,
  filterValue: string
): { chartData: IPivotedData[]; secondaryGroupList: string[] } {
  const groupMap: Record<string, Record<string, { matched: number; total: number }>> = {};

  const secondaryGroupSet = new Set<string>();

  // Group by primary and secondary keys, count matched and total
  docItems.forEach((item) => {
    const primaryGroup = String(item.data[primaryGroupKey]);
    const secondaryGroup = String(item.data[secondaryGroupKey]);

    secondaryGroupSet.add(secondaryGroup);

    if (!groupMap[primaryGroup]) {
      groupMap[primaryGroup] = {};
    }

    if (!groupMap[primaryGroup][secondaryGroup]) {
      groupMap[primaryGroup][secondaryGroup] = { matched: 0, total: 0 };
    }

    groupMap[primaryGroup][secondaryGroup].total += 1;

    const val = getAdditionalDataValue(item, filterKey);
    if (val === filterValue) {
      groupMap[primaryGroup][secondaryGroup].matched += 1;
    }
  });

  const secondaryGroupList = Array.from(secondaryGroupSet).sort();

  // Create chartData
  const chartData: IPivotedData[] = Object.keys(groupMap).map((primaryGroup) => {
    const dataItem: IPivotedData = { group: primaryGroup };
    secondaryGroupList.forEach((secondaryGroup) => {
      const counts = groupMap[primaryGroup][secondaryGroup] || { matched: 0, total: 0 };

      if (counts.matched > 0 && counts.total > 0) {
        dataItem[secondaryGroup] = counts.matched;
        dataItem[`${secondaryGroup}_total`] = counts.total;
      }
    });
    return dataItem;
  });

  return { chartData, secondaryGroupList };
}

interface ChartWrapperProps {
  data: IDocData;
  primaryGroupKey: string;
  secondaryGroupKey: string;
  primaryGroupLabel?: string;
  secondaryGroupLabel?: string;
  additionalDataKey: string;
  additionalDataValue: string;
}

export default function FullChartWrapper(props: ChartWrapperProps) {
  const { data, primaryGroupKey, secondaryGroupKey, additionalDataKey, additionalDataValue, secondaryGroupLabel, primaryGroupLabel } =
    props;

  // Memoize the chart data preparation to prevent unnecessary recomputations
  const { chartData, secondaryGroupList } = useMemo(() => {
    if (data.docItems.length === 0) {
      return { chartData: [], secondaryGroupList: [] };
    }
    return preparePivotedChartData(data.docItems, primaryGroupKey, secondaryGroupKey, additionalDataKey, additionalDataValue);
  }, [data, primaryGroupKey, secondaryGroupKey, additionalDataKey, additionalDataValue]);

  if (chartData.length === 0) {
    return (
      <Card sx={{ padding: 2, maxHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">No data available</Typography>
      </Card>
    );
  }

  const series: BarSeriesType[] = secondaryGroupList.map((secondaryGroup) => ({
    type: 'bar',
    dataKey: secondaryGroup,
    label: `${secondaryGroupLabel} ${secondaryGroup}`,
    valueFormatter: (value: number | null, { dataIndex }: { dataIndex: number }) => {
      if (value === null) return null;

      const dataItem = chartData[dataIndex];
      const total = dataItem[`${secondaryGroup}_total`] as number;

      if (!total) return null;

      return `${value} / ${total}`;
    },
  }));

  const yAxis = [
    {
      label: `מספר ${additionalDataKey}`,
    },
  ];

  const xAxis = [
    {
      dataKey: 'group',
      scaleType: 'band' as const,
      label: 'חלוקה לפי פלוגות',
    },
  ];

  return (
    <Card sx={{ padding: 2, maxHeight: 400 }}>
      <Typography variant="h5" gutterBottom>
        Arrivals by {primaryGroupLabel} and {secondaryGroupLabel}
      </Typography>
      {chartData.length === 0 ? (
        <CircularProgress />
      ) : (
        <BarChart width={600} height={400} dataset={chartData} xAxis={xAxis} yAxis={yAxis} series={series} />
      )}
    </Card>
  );
}
