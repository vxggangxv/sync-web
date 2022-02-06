import { FormControlLabel, Grid, TextField } from '@material-ui/core';
import FilterIcon from 'components/base/icons/FilterIcon';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import React, { useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import CheckIcon from 'components/base/icons/CheckIcon';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';
import ProjectCard from './ProjectCard';
import { icon_magnifier } from 'components/base/images';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import ProjectSearchFilter, { ProjectSearchFilterProps } from './ProjectSearchFilter';
import { OffsetPagingData } from 'lib/sharedTypes';

export interface ProjectListProps extends ProjectSearchFilterProps {
  // page: object | any;
  projects: object | any;
  projectsPagingData: OffsetPagingData;
  page: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
}

function ProjectList({
  projects,
  projectsPagingData,
  period,
  checkedProjectProcess,
  keyword,
  onChangePage,
  onSearch,
  page,
}: ProjectListProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  // useEffect(() => {
  //   console.log('date', date);
  // }, [date]);

  return (
    <Styled.ProjectList data-component-name="ProjectList">
      <Grid container className="projectList__container">
        {/* page title */}
        <Grid item container xs={12} className="projectList__page_title">
          {/* TODO: 반복 컴포넌트인지 확인 후 분리 예정 */}
          <div className="projectList__title_box">
            <span className="projectList__title_badge" />
            <h2 className="projectList__title">
              <CustomSpan fontSize={36} fontWeight={500}>
                Project List
              </CustomSpan>
            </h2>
          </div>
        </Grid>

        {/* 1 row */}
        <Grid item container justifyContent="space-between" xs={12} className="projectList__top">
          <ProjectSearchFilter
            period={period}
            checkedProjectProcess={checkedProjectProcess}
            keyword={keyword}
            onChangePage={onChangePage}
            onSearch={onSearch}
          />

          <div className="projectList__btn_box">
            <MuiButton
              disableElevation
              variant="contained"
              color="primary"
              className="lg projectList__create_btn inset-shadow-default border-radius-round"
              onClick={() => history.push(pageUrl.project.create)}
            >
              <AddIcon fontSize="small" /> Create New Project
            </MuiButton>
          </div>
        </Grid>

        {/* 2 row */}
        <Grid item xs={12} className="projectList__middle">
          {/* 
          <img src={icon_cloud_upload} alt="upload icon" />
          <img src={icon_paper_plane} alt="invite icon" />
          <img src={icon_pencil_square} alt="edit icon" />
          <img src={icon_user} alt="user icon" />
          <img src={icon_calendar} alt="calendar icon" /> 
          */}
          <Grid container className="projectList__card_wrapper">
            {!!projects?.length &&
              projects.map((item: any, idx: number) => {
                if (idx >= 8) return null;
                return <ProjectCard key={idx} data={item} />;
              })}
          </Grid>
          {/* {Array.from({ length: 12 }).map(
              (item: any, index: number) => 'ProjectCard',
            )} */}

          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            count={projectsPagingData?.totalPage}
            // count={5}
            page={page.value}
            onChange={(e: any, value: number) => onChangePage(value)}
          />
        </Grid>

        {/* // */}
      </Grid>
    </Styled.ProjectList>
  );
}

const Styled = {
  ProjectList: styled.div`
    width: 100%;
    padding-bottom: 50px;

    .projectList__title_box {
      display: flex;
      align-items: center;
      z-index: 1;
      position: relative;
      margin-top: -120px;
      min-height: 120px;
      width: calc(100% - 250px);
      .projectList__title_badge {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 20px;
        width: 60px;
        height: 60px;
        background-color: #eaeaea;
      }
      .projectList__title {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 0 2px;
      }
    }
    .projectList__container {
      width: 100%;
      > .MuiGrid-item {
      }
      .projectList__top {
        .projectList__filter_box {
          display: flex;
          align-items: center;
          position: relative;

          .datePicker__box {
            width: 250px;
            .ant-picker {
              border-color: transparent;
            }
          }

          .projectList__filter_step_box {
            display: flex;
            align-items: center;
            padding: 3px;
            background-color: #f4f5fa;
            border-radius: 5px;

            .projectList__filter_step_list {
              display: flex;
              align-items: center;
              /* width: 810px; */
              height: 40px;
              .projectList__filter_step_item {
                display: inline-flex;
                align-items: center;
                margin-right: 20px;
                cursor: default;
                &:first-child {
                  margin-left: 15px;
                }
                &:last-child {
                  margin-right: 15px;
                }
                font-size: 13px;
                .projectList__filter_step_check {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 10px;
                  width: 20px;
                  height: 20px;
                  border-radius: 4px;
                  background-color: transparent;
                  border: 1px solid white;
                }
              }
            }
          }


        }
        .projectList__btn_box {
          /* margin-top: 10px;
           width: 100%; */
          text-align: right;
          .projectList__create_btn {
            width: 270px;
            font-weight: 700;
            .button {
              font-size: 16px;
            }
            svg {
              margin-right: 5px;
            }
          }
        }
    }
    .projectList__middle {
      .projectList__card_wrapper {
        column-gap: 16px;
        row-gap: 40px;
        margin-top: 20px;
        margin-bottom: 50px;
      }
    }
  `,
};

export default React.memo(ProjectList);

/* 
<li className={cx(`projectList__filter_step_item`, {})} key={idx}>
  <FormControlLabel
    control={
      <CustomMuiCheckbox
        name="process"
        checked={checkedProcess}
        onChange={(e: any) => setCheckedProcess(e.target.checked)}
        activeColor="red"
      />
    }
    label={<span style={{ fontSize: 12 }}>name</span>}
  />
</li> 
*/
