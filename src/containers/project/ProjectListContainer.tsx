import useDateInput from 'lib/hooks/useDateInput';
import useInput from 'lib/hooks/useInput';
import React, { useMemo, useState } from 'react';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import ProjectList from 'components/project/ProjectList';
import { useEffect } from 'react';
import { useDidUpdateEffect } from 'lib/utils';
import { ProjectActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
// import { useShallowAppSelector } from 'store/hooks';
// import ProjectListByTable from 'components/project/ProjectListByTable';

export default function ProjectListContainer() {
  const {
    projectsData: { list: projects, pagingData: projectsPagingData },
    projectsSuccess,
  } = useShallowAppSelector(state => ({
    projectsData: state.project.projects.data || {},
    projectsSuccess: state.project.projects.success,
  }));
  const page = useInput(1);
  const period = useDateInput(null);
  const checkedProjectProcess = useCheckSetInput(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
  // new Set(['new', 'preparation', 'scan', 'cad', 'cam', 'milling', 'post', 'completed']),
  const keyword = useInput('');
  const [isSubmit, setIsSubmit] = useState<boolean | null>(null);

  let searchParams = useMemo(
    () => ({
      page: page.value,
      keyword: keyword.value,
      stages: checkedProjectProcess.value.size ? [...checkedProjectProcess.value].join('%') : '',
      // period: period.value,
      startDate: period.value ? period.value[0].unix() : '',
      endDate: period.value ? period.value[1].unix() : '',
    }),
    [page.value, keyword.value, period.value, checkedProjectProcess.value],
  );

  const handleChangePage = (value: number) => {
    // get project list
    // { ...searchParams, page: 1}
    console.log('get project list page is', value);
    ProjectActions.fetch_projects_request({ ...searchParams, page: value });
    page.setValue(value);
  };

  const handleSearch = () => {
    ProjectActions.fetch_projects_request({
      ...searchParams,
      keyword: keyword.value,
      page: 1,
    });
  };

  // SECTION: DidMount
  useEffect(() => {
    ProjectActions.fetch_projects_request({
      page: 1,
      keyword: '',
      stages: '',
      // startDate: '',
      // endDate: '',
    });
  }, []);

  // SECTION: DidUpdate
  useDidUpdateEffect(() => {
    ProjectActions.fetch_projects_request({ ...searchParams, page: 1 });
    page.setValue(1);
  }, [period.value, checkedProjectProcess.value]);

  return (
    <ProjectList
      projects={projects}
      projectsPagingData={projectsPagingData}
      page={page}
      period={period}
      checkedProjectProcess={checkedProjectProcess}
      keyword={keyword}
      onChangePage={handleChangePage}
      onSearch={handleSearch}
    />
  );
}
