import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import FilterIcon from 'components/base/icons/FilterIcon';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import React, { useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import SearchIcon from '@material-ui/icons/Search';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import CheckIcon from 'components/base/icons/CheckIcon';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';

interface ProjectListByTableProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
  page: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  period: { value: Date; onChange: (e: any) => void; setValue: (value: Date) => void };
  checkedProjectProcess: {
    value: Set<string>;
    onChange: (e: any) => void;
    setValue: (value: Set<string>) => void;
  };
  keyword: { value: string; onChange: (e: any) => void; setValue: (value: string) => void };
  isSubmit: boolean | null;
  onChangePage: (value: number) => void;
  onSearch: () => void;
}

function ProjectListByTable({
  page,
  period,
  checkedProjectProcess,
  keyword,
  isSubmit,
  onChangePage,
  onSearch,
}: ProjectListByTableProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);

  const history = useHistory();
  // const [date, setDate] = useState(null);

  // useEffect(() => {
  //   console.log('date', date);
  // }, [date]);

  return (
    <Styled.ProjectListByTable data-component-name="ProjectListByTable">
      <h1 className="sr-only">Dashboard</h1>

      {/* TODO: 반복 컴포넌트인지 확인 후 분리 예정 */}
      <div className="ProjectListByTable__title_box">
        <span className="ProjectListByTable__title_badge" />
        <h2 className="ProjectListByTable__title">
          <CustomSpan fontSize={36} fontWeight={500}>
            New Project
          </CustomSpan>
        </h2>
      </div>

      <Grid container className="ProjectListByTable__container">
        {/* 1 row */}
        <Grid
          item
          container
          xs={12}
          justifyContent="space-between"
          className="ProjectListByTable__top"
        >
          <div className="ProjectListByTable__filter_box">
            <button
              className="btn-reset ProjectListByTable__filter_icon"
              onClick={() => setStepFilterOpen(true)}
            >
              <FilterIcon color={color.navy_blue} width={23} />
            </button>

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
            <MuiWrapper
              className="ProjectListByTable__search_wrapper sm"
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
                <span className="ProjectListByTable__search_icon_box">
                  <SearchIcon
                    htmlColor="white"
                    fontSize="medium"
                    className="cursor"
                    onClick={onSearch}
                  />
                </span>
              </>
            </MuiWrapper>

            {stepFilterOpen && (
              <div className="ProjectListByTable__filter_step_box">
                <ul className="ProjectListByTable__filter_step_list">
                  <li>
                    <button
                      className="btn-reset ProjectListByTable__filter_icon"
                      onClick={() => setStepFilterOpen(false)}
                    >
                      <FilterIcon color={color.navy_blue} width={23} />
                    </button>
                  </li>
                  {projectProcessFlagList.map((item, idx) => {
                    return (
                      <li
                        className={cx(`ProjectListByTable__filter_step_item`, {
                          active: checkedProjectProcess.value.has(item.index),
                        })}
                        key={idx}
                        onClick={() => checkedProjectProcess.onChange({ value: item.index })}
                      >
                        <span
                          className={`ProjectListByTable__filter_step_check ${item.index}`}
                          style={{
                            borderColor: checkedProjectProcess.value.has(item.index)
                              ? 'transparent'
                              : '#ccc',
                            backgroundColor: checkedProjectProcess.value.has(item.index)
                              ? item.color
                              : 'transparent',
                          }}
                        >
                          <CheckIcon
                            color={checkedProjectProcess.value.has(item.index) ? 'white' : '#ccc'}
                          />
                        </span>
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="ProjectListByTable__btn_box">
            <MuiButton
              config={{
                buttonStyle: {
                  width: '230px',
                },
              }}
              disableElevation
              variant="contained"
              color="primary"
              className="ProjectListByTable__create_btn inset-shadow-default border-radius-round"
              onClick={() => history.push(pageUrl.project.create)}
            >
              <AddIcon fontSize="small" /> Create New Project
            </MuiButton>
          </div>
        </Grid>

        {/* 2 row */}
        <Grid item xs={12} className="ProjectListByTable__middle">
          <TableContainer className="ProjectListByTable__table_container">
            <Table aria-label="project list table">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="center" className="no">
                    No
                  </TableCell>
                  <TableCell>Step</TableCell>
                  <TableCell>Project ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Partner</TableCell>
                  <TableCell>Completion Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 10 }).map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell>
                        <Grid container alignItems="center">
                          <span className={`step-mark post`}></span> Post processing
                        </Grid>
                      </TableCell>
                      <TableCell>20210715-XXXX-XXXX</TableCell>
                      <TableCell>Rly dkanro</TableCell>
                      <TableCell>Crown X3</TableCell>
                      <TableCell>DOF Bridge</TableCell>
                      <TableCell className="date">06.17.20 12:22</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            // count={pagingData?.totalPage}
            count={5}
            page={page.value}
            onChange={(e: any, value: number) => onChangePage(value)}
          />
        </Grid>
      </Grid>
    </Styled.ProjectListByTable>
  );
}

const Styled = {
  ProjectListByTable: styled.div`
    width: 100%;

    .ProjectListByTable__title_box {
      display: flex;
      align-items: center;
      z-index: 1;
      position: relative;
      margin-top: -120px;
      min-height: 120px;
      width: calc(100% - 250px);
      .ProjectListByTable__title_badge {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 20px;
        width: 60px;
        height: 60px;
        background-color: #eaeaea;
      }
      .ProjectListByTable__title {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 0 2px;
      }
    }
    .ProjectListByTable__container {
      width: 100%;
      > .MuiGrid-item {
      }
      .ProjectListByTable__top {
        .ProjectListByTable__filter_box {
          display: flex;
          align-items: center;
          position: relative;
          .ProjectListByTable__filter_icon {
            position: relative;
            top: 1px;
            margin-left: 15px;
          }
          .datePicker__box {
            margin-left: 15px;
          }
          .ProjectListByTable__search_wrapper {
            position: relative;
            margin-left: 20px;
            width: 440px;
            .MuiInputBase-root {
              background-color: #f4f5fa;
            }
            .ProjectListByTable__search_icon_box {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              right: 0;
              top: 0;
              width: 34px;
              height: 34px;
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
              background-color: ${color.navy_blue};
            }
          }
          .ProjectListByTable__filter_step_box {
            position: absolute;
            top: 0;
            left: 0;
            .ProjectListByTable__filter_step_list {
              display: flex;
              align-items: center;
              width: 810px;
              height: 40px;
              background-color: #f4f5fa;
              border-radius: 5px;
              box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.16);
              .ProjectListByTable__filter_step_item {
                margin-left: 20px;
                font-size: 13px;
                .ProjectListByTable__filter_step_check {
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
        .ProjectListByTable__btn_box {
          .ProjectListByTable__create_btn {
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
      .ProjectListByTable__middle {
      }
      .ProjectListByTable__table_container {
        margin-top: 20px;
        margin-bottom: 20px;
        overflow-x: initial;
        table {
          position: relative;
          table-layout: fixed;
        }
        col {
          // no
          &:nth-child(1) {
            width: 5%;
          }
          // step
          &:nth-child(2) {
            width: 13%;
          }
          // id
          &:nth-child(3) {
            width: 15%;
          }
          // name
          &:nth-child(4) {
            width: 15%;
          }
          // content
          &:nth-child(5) {
            width: 30%;
          }
          // partner
          &:nth-child(6) {
            width: 12%;
          }
          // date
          &:nth-child(7) {
            width: 10%;
          }
        }
        thead,
        tbody,
        tr {
          position: relative;
        }
        th,
        td {
          padding-left: 5px;
          padding-right: 5px;
          font-weight: 400;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom-color: #e7e8f2;
        }
        thead {
          &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: calc(100% + 20px);
            border-radius: 10px;
            /* background-color: white; */
            background-color: ${color.navy_blue};
            box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.16);
          }
          tr {
          }
          th {
            padding-top: 15px;
            padding-bottom: 15px;
            font-size: 16px;
            color: white;
            border-bottom: none;
          }
        }
        tbody {
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
          td {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: white;
            font-size: 16px;
            &.date {
              color: #858997;
            }
            .step-mark {
              display: inline-block;
              margin-right: 10px;
              width: 16px;
              height: 16px;
              border-radius: 2px;
              &.post {
                background-color: ${color.stage_post};
              }
            }
          }
          tr {
            &:first-child {
              td:first-child {
                border-top-left-radius: 10px;
              }
              td:last-child {
                border-top-right-radius: 10px;
              }
            }
            &:last-child {
              td {
                border-bottom: none;
              }
              td:first-child {
                border-bottom-left-radius: 10px;
              }
              td:last-child {
                border-bottom-right-radius: 10px;
              }
            }
          }
        }
      }
    }
  `,
};

export default React.memo(ProjectListByTable);
