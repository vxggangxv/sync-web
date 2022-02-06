import { Grid } from '@material-ui/core';
import MuiPagination from 'components/common/pagination/MuiPagination';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import useDateInput from 'lib/hooks/useDateInput';
import useInput from 'lib/hooks/useInput';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ProjectCard from 'components/project/ProjectCard';
import ProjectSearchFilter from 'components/project/ProjectSearchFilter';
import { useShallowAppSelector } from 'store/hooks';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { ProjectActions } from 'store/actionCreators';
import { useDidUpdateEffect } from 'lib/utils';
import { debounce } from 'lodash';

interface ProjectListModalContainerProps {
  onCloseProjectListModal: () => void;
}

function ProjectListModalContainer({ onCloseProjectListModal }: ProjectListModalContainerProps) {
  const {
    reworkProjectsData: { list: reworkProjects, pagingData: reworkProjectsPagingData },
    reworkProjectsSuccess,
  } = useShallowAppSelector(state => ({
    reworkProjectsData: state.project.reworkProjects.data || {},
    reworkProjectsSuccess: state.project.reworkProjects.success,
  }));
  const page = useInput(1);
  const period = useDateInput(null);
  const checkedProjectProcess = useCheckSetInput(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
  // new Set(['new', 'preparation', 'scan', 'cad', 'cam', 'milling', 'post', 'completed']),
  const projectType = useInput(1);
  const keyword = useInput('');
  // const [isSubmit, setIsSubmit] = useState<boolean | null>(null);

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
    ProjectActions.fetch_rework_projects_request({ ...searchParams, page: value });
    page.setValue(value);
  };

  const handleSearch = debounce(() => {
    ProjectActions.fetch_rework_projects_request({
      ...searchParams,
      keyword: keyword.value,
      page: 1,
    });
  }, 500);

  // SECTION: DidMount
  useEffect(() => {
    ProjectActions.fetch_rework_projects_request({
      page: 1,
      keyword: '',
      stages: '',
      // startDate: '',
      // endDate: '',
    });
  }, []);

  // SECTION: DidUpdate

  // onChange option
  useDidUpdateEffect(() => {
    ProjectActions.fetch_rework_projects_request({ ...searchParams, page: 1 });
    page.setValue(1);
  }, [period.value, checkedProjectProcess.value]);

  // const { isFetchSuccess } = useFetchLoading({ reworkProjectsSuccess });
  // if (!isFetchSuccess) return null;
  return (
    <StyledProjectListModalContainer data-component-name="ProjectListModalContainer">
      <Grid container className="projectListModal__container">
        <Grid item className="projectListModal__top">
          <ProjectSearchFilter
            viewType="modal"
            period={period}
            checkedProjectProcess={checkedProjectProcess}
            projectType={projectType}
            keyword={keyword}
            onChangePage={handleChangePage}
            onSearch={handleSearch}
          />
        </Grid>
        <Grid item className="projectListModal__middle">
          <Grid container className="projectListModal__card_wrapper">
            {!!reworkProjects?.length &&
              reworkProjects.map((item: any, idx: number) => {
                if (idx >= 8) return null;
                return (
                  <ProjectCard
                    key={idx}
                    isRework={true}
                    data={item}
                    onCloseProjectListModal={onCloseProjectListModal}
                  />
                );
              })}
            {/* {Array.from({ length: 8 }).map((item: any, idx: number) => (
              <ProjectCard key={idx} isRework={true} />
            ))} */}
          </Grid>

          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            count={reworkProjectsPagingData?.totalPage}
            page={page.value}
            onChange={(e: any, value: number) => handleChangePage(value)}
          />
        </Grid>
        {/* // */}
      </Grid>
    </StyledProjectListModalContainer>
  );
}

const StyledProjectListModalContainer = styled.div`
  .projectListModal__top {
  }
  .projectListModal__middle {
    width: 100%;
    .projectListModal__card_wrapper {
      column-gap: 20px;
      row-gap: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
      min-height: 648px;
      .projectCard__container {
        width: calc(25% - 15px);
      }
    }
  }
`;

export default React.memo(ProjectListModalContainer);
