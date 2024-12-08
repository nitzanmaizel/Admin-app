import MultipleChartWrapper from '@/components/Charts/MultipleChartWrapper';
import PageWrapper from '@/components/Layout/PageWrapper';
import { useUser } from '@/hooks/useUser';
import { useDocQuery } from '@/services/docServices/useDocQuery';
import React from 'react';
import { useParams } from 'react-router-dom';

const primaryGroupKey = 'company';
const secondaryGroupKey = 'department';
const additionalDataKey = 'statusArrival';
const additionalDataValue = 'התייצב';
const primaryGroupLabel = 'פלוגה';
const secondaryGroupLabel = 'מחלקה';

const AnalyticsDocPage: React.FC = () => {
  const { docId = '' } = useParams<{ docId: string }>();
  const { userInfo } = useUser();
  const [chartConfig] = React.useState({
    primaryGroupKey,
    secondaryGroupKey,
    additionalDataKey,
    additionalDataValue,
    primaryGroupLabel,
    secondaryGroupLabel,
  });
  const { data: docData, isLoading } = useDocQuery(docId);

  console.log({ userInfo });

  return (
    <PageWrapper>
      {isLoading && docData === undefined ? (
        <div>Loading...</div>
      ) : (
        <MultipleChartWrapper
          data={docData!}
          primaryGroupKey={chartConfig.primaryGroupKey}
          secondaryGroupKey={chartConfig.secondaryGroupKey}
          additionalDataKey={chartConfig.additionalDataKey}
          additionalDataValue={chartConfig.additionalDataValue}
          primaryGroupLabel={chartConfig.primaryGroupLabel}
          secondaryGroupLabel={chartConfig.secondaryGroupLabel}
        />
      )}
    </PageWrapper>
  );
};

export default AnalyticsDocPage;
