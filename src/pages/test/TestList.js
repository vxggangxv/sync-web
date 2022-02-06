import { useShallowSelector } from 'lib/utils';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TestActions } from 'store/actionCreators';
import { useImmer } from 'use-immer';

const TestListState = {
  data: null,
};

function TestList({ match }) {
  const [values, setValues] = useImmer(TestListState);
  const { testsData } = useShallowSelector(state => ({
    testsData: state.test.tests.data,
  }));

  // console.log(match, 'match');
  // console.log(testsData, 'testsData');
  useEffect(() => {
    TestActions.fetch_tests_request();
  }, []);

  const data = testsData?.slice(0, 10);

  const handleClick = config => {
    const { type = '' } = config;

    if (type === 'data') {
      TestActions.fetch_tests_request();

      return;
    }
  };

  if (!data) return null;
  return (
    <>
      <ul>
        {data?.map(item => (
          <li key={item.id}>
            {item.id} <Link to={`${match.url}/@${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      {/* <button onClick={() => handleClick({ type: 'data' })}>Request</button> */}
    </>
  );
}

export default TestList;
