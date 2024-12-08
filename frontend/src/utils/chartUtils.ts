import { IDocItemData } from '@/types/DocTypes';

export interface ISingleBarChartData {
  [key: string]: string | number;
  group: string;
}

export interface IMultipleChartData {
  [primaryGroup: string]: {
    chartData: ISingleBarChartData[];
    total: number;
  };
}

/**
 * Utility function to get a specific additionalData value by key.
 */
function getAdditionalDataValue(item: IDocItemData, additionalDataKey: string): string {
  const found = item.additionalData.find((ad) => ad.key === additionalDataKey);
  return found && found.value ? found.value.trim() : '';
}

/**
 * Prepares data for multiple charts.
 *
 * @param {IDocItemData[]} docItems - The array of document items.
 * @param {string} primaryGroupKey - The primary grouping key (e.g., 'company').
 * @param {string} secondaryGroupKey - The secondary grouping key (e.g., 'department').
 * @param {string} trackKey - The key in additionalData to track (e.g., 'statusArrival').
 * @param {string} trackValue - The value to count within the trackKey (e.g., 'התייצב').
 *
 * @returns {IMultipleChartData} - An object containing chart data for each primary group.
 */
export function prepareMultipleChartData(
  docItems: IDocItemData[],
  primaryGroupKey: string,
  secondaryGroupKey: string,
  additionalDataKey: string,
  additionalDataValue: string
): IMultipleChartData {
  const dataMap: Record<string, Record<string, number>> = {};

  // Initialize dataMap
  docItems.forEach((item) => {
    const primaryGroup = String(item.data[primaryGroupKey]);
    const secondaryGroup = String(item.data[secondaryGroupKey]);

    if (!dataMap[primaryGroup]) {
      dataMap[primaryGroup] = {};
    }

    if (!dataMap[primaryGroup][secondaryGroup]) {
      dataMap[primaryGroup][secondaryGroup] = 0;
    }

    const trackVal = getAdditionalDataValue(item, additionalDataKey);
    if (trackVal === additionalDataValue) {
      dataMap[primaryGroup][secondaryGroup] += 1;
    }
  });

  // Transform dataMap into IMultipleChartData
  const multipleChartData: IMultipleChartData = {};

  Object.keys(dataMap).forEach((primaryGroup) => {
    const secondaryGroups = dataMap[primaryGroup];
    const chartData: ISingleBarChartData[] = [];

    Object.keys(secondaryGroups).forEach((secondaryGroup) => {
      chartData.push({
        group: secondaryGroup,
        count: secondaryGroups[secondaryGroup],
      });
    });

    multipleChartData[primaryGroup] = {
      chartData,
      total: Object.values(secondaryGroups).reduce((a, b) => a + b, 0),
    };
  });

  return multipleChartData;
}
