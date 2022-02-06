import useDateInput from 'lib/hooks/useDateInput';
import useInput from 'lib/hooks/useInput';
import React, { useMemo, useState } from 'react';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import ProjectList from 'components/project/ProjectList';
import { useEffect } from 'react';
import { useDidUpdateEffect } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';

export default function ProjectListContainer() {
  const page = useInput(1);
  const period = useDateInput(null);
  const checkedProjectProcess = useCheckSetInput(
    new Set(['new', 'preparation', 'scan', 'cad', 'cam', 'milling', 'post', 'completed']),
  );
  const keyword = useInput('');
  const [isSubmit, setIsSubmit] = useState<boolean | null>(null);

  let searchParams = useMemo(
    () => ({
      page: page.value,
      keyword: keyword.value,
      period: period.value,
      process: [...checkedProjectProcess.value],
    }),
    [page.value, keyword.value, period.value, checkedProjectProcess.value],
  );

  const handleChangePage = (value: number) => {
    page.setValue(value);
    // TODO: request api
    // get project list
    // { ...searchParams, page: 1}
    console.log('get project list page is', value);
  };

  const handleSearch = () => {
    if (!keyword.value) return console.log('Please, enter keyword');
    setIsSubmit(true);
    // TODO: request api
    console.log('handleSearch');
  };

  // DidMount
  useEffect(() => {}, []);

  // DidUpdate
  useDidUpdateEffect(() => {
    page.setValue(1);
    // TODO: request api
    // get project list
    // { ...searchParams, page: 1}
    console.log('get project list with period, process');
  }, [period.value, checkedProjectProcess.value]);

  return 'hi';
  // <ProjectList
  //   page={page}
  //   period={period}
  //   checkedProjectProcess={checkedProjectProcess}
  //   keyword={keyword}
  //   isSubmit={isSubmit}
  //   onChangePage={handleChangePage}
  //   onSearch={handleSearch}
  // />
}
