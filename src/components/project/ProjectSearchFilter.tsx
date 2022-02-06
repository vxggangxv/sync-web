import { FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
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

export interface ProjectSearchFilterProps {
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
  viewType?: string;
  period: { value: Date; onChange: (e: any) => void; setValue: (value: Date) => void };
  checkedProjectProcess: {
    value: Set<number>;
    onChange: (e: any) => void;
    setValue: (value: Set<number>) => void;
  };
  projectType?: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  keyword: { value: string; onChange: (e: any) => void; setValue: (value: string) => void };
  isSubmit?: boolean | null;
  onChangePage: (value: number) => void;
  onSearch: () => void;
}

const ProjectSearchFilter = ({
  viewType,
  period,
  checkedProjectProcess,
  projectType,
  keyword,
  isSubmit,
  onChangePage,
  onSearch,
}: ProjectSearchFilterProps) => {
  return (
    <StyledProjectSearchFilter className="projectList__filter_box" viewType={viewType}>
      <div className="projectList__filter_step_box">
        <CustomDatePicker
          type="rangeDate"
          fullWidth
          borderColor="#B5B7C1"
          height={40}
          value={period.value}
          onChange={period.onChange}
          className={cx({
            error: isSubmit ? !period.value : false,
          })}
          isClient={true}
        />
        <ul className="projectList__filter_step_list">
          {projectProcessFlagList.map((item, idx) => {
            return (
              <li
                className={cx(`projectList__filter_step_item`, {
                  active: checkedProjectProcess.value.has(item.id),
                })}
                key={idx}
                onClick={() => checkedProjectProcess.onChange({ value: item.id })}
              >
                <span
                  className={`projectList__filter_step_check ${item.id}`}
                  style={{
                    borderColor: checkedProjectProcess.value.has(item.id) ? 'transparent' : '#ccc',
                    backgroundColor: checkedProjectProcess.value.has(item.id)
                      ? item.color
                      : 'transparent',
                  }}
                >
                  {checkedProjectProcess.value.has(item.id) && <CheckIcon />}
                </span>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* <MuiWrapper className="lg projectList__project_type_select_box" isGlobalStyle>
        <FormControl fullWidth variant="outlined">
          <Select
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
              marginThreshold: 10,
            }}
            displayEmpty
            // multiple
            // name="preferedProgram"
            value={projectType?.value}
            onChange={projectType?.onChange}
            // renderValue={selected => {
            //   if (selected.length === 0) return '';
            //   const selectedLabelList = toolList.reduce((acc, curr) => {
            //     if (selected.includes(curr.id)) return acc.concat(curr.label);
            //     return acc;
            //   }, []);

            //   return selectedLabelList.join(', ');
            // }}
          >
            <MenuItem value="" disabled>
              Select project type
            </MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </Select>
        </FormControl>
      </MuiWrapper> */}

      <MuiWrapper
        className="projectList__search_wrapper lg"
        config={{
          borderColor: 'transparent',
          activeBorderColor: 'transparent',
          hoverBorderColor: 'transparent',
        }}
      >
        <>
          <TextField
            className="radius-md"
            variant="outlined"
            fullWidth
            placeholder="Search for the Project"
            value={keyword.value || ''}
            onChange={keyword.onChange}
            onKeyPress={e => e.key === 'Enter' && onSearch()}
          />
          <button className="btn-reset projectList__search_btn" onClick={onSearch}>
            <img src={icon_magnifier} alt="search" />
          </button>
        </>
      </MuiWrapper>
    </StyledProjectSearchFilter>
  );
};

const StyledProjectSearchFilter = styled.div<{ viewType: string | undefined }>`
  & {
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
          margin-right: 18px;
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

    .projectList__project_type_select_box {
      margin-left: 15px;
      width: 285px;
    }

    .projectList__search_wrapper {
      position: relative;
      margin-left: 15px;
      width: ${({ viewType }) => (viewType === 'modal' ? '310px' : '260px')};
      .MuiInputBase-root {
        background-color: #f4f5fa;
      }
      .projectList__search_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        top: 0;
        width: 46px;
        height: 46px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: ${color.navy_blue};
      }
    }
  }
`;

export default React.memo(ProjectSearchFilter);
