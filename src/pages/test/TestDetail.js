import { useShallowSelector } from 'lib/utils';
import React, { useEffect } from 'react';
import { TestActions } from 'store/actionCreators';

const TestDetailState = {
  data: null,
};

function TestDetail({ match }) {
  const id = Number(match.params.id);
  // console.log(id, 'id');
  const { testData, testPending } = useShallowSelector(state => ({
    testData: state.test.test.data,
    testPending: state.test.test.pending,
  }));

  useEffect(() => {
    TestActions.fetch_test_request(id);
  }, []);

  console.log(testData, 'testData');
  // NOTE: 기존 데이터를 보여줘도 되는 경우
  if (!testData) return null;
  // NOTE: 기존 데이터를 보여주기 싫은 경우
  // if (!testData || testPending) return null;
  return (
    <>
      {testData.id}, {testData.title}
    </>
  );
}

export default TestDetail;
