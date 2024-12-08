import React from 'react';
import { IDocData } from '@/types/DocTypes';
import SingleBarChart from './SingleBarChart';
import { FlexRowCenter, FlexRowSpaceBetween } from '@/styles/Flex';
import { IMultipleChartData, prepareMultipleChartData } from '@/utils/chartUtils';
import FullChartWrapper from './FullChartWrapper';

interface MultipleChartWrapperProps {
  data: IDocData;
  primaryGroupKey: string;
  secondaryGroupKey: string;
  additionalDataKey: string;
  additionalDataValue: string;
  primaryGroupLabel?: string;
  secondaryGroupLabel?: string;
}

const MultipleChartWrapper: React.FC<MultipleChartWrapperProps> = ({
  data,
  primaryGroupKey,
  secondaryGroupKey,
  additionalDataKey,
  additionalDataValue,
  secondaryGroupLabel,
  primaryGroupLabel,
}) => {
  const multipleChartData: IMultipleChartData = prepareMultipleChartData(
    data.docItems,
    primaryGroupKey,
    secondaryGroupKey,
    additionalDataKey,
    additionalDataValue
  );

  return (
    <FlexRowCenter flexWrap={'wrap'}>
      <FlexRowSpaceBetween width={'50%'} p={1}>
        <FullChartWrapper
          primaryGroupKey={primaryGroupKey}
          secondaryGroupKey={secondaryGroupKey}
          data={data}
          additionalDataKey={additionalDataKey}
          additionalDataValue={additionalDataValue}
          secondaryGroupLabel={secondaryGroupLabel}
          primaryGroupLabel={primaryGroupLabel}
        />
      </FlexRowSpaceBetween>
      {Object.entries(multipleChartData).map(([primaryGroupValue, { chartData }]) => (
        <FlexRowSpaceBetween width={'25%'} p={1} key={primaryGroupValue}>
          <SingleBarChart
            primaryGroupValue={primaryGroupValue}
            chartData={chartData}
            secondaryGroupLabel={secondaryGroupLabel}
            additionalDataValue={additionalDataValue}
          />
        </FlexRowSpaceBetween>
      ))}
    </FlexRowCenter>
  );
};

export default MultipleChartWrapper;
