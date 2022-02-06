import { Grid } from '@material-ui/core';
import CustomSpan from 'components/common/text/CustomSpan';
import React from 'react';
import styled from 'styled-components';
import { paperStyle } from './ProjectShared';
import ListBackgroundVerticalDivision from 'components/common/background/ListBackgroundVeticalDivision';
import moment from 'moment';
import { color } from 'styles/utils';

interface ProjectLogProps {}

// const pElement = document.querySelector('h1')?.previousSibling;
// const pElement = document.querySelector('h1')?.nextSibling;

function ProjectLog() {
  return (
    <StyledProjectLog data-component-name="ProjectLog">
      <div className="projectLog_title_box">
        <h1>
          <CustomSpan fontSize={21} fontWeight={500}>
            Log
          </CustomSpan>
        </h1>
      </div>

      <div className="projectLog__content_container">
        <div className="projectLog__list_container">
          <ListBackgroundVerticalDivision />
          <div className="projectLog__list_box">
            <ul className="projectLog__list">
              {Array.from({ length: 13 }).map((item, idx) => (
                <li className="projectLog__item" key={idx}>
                  <div className="projectLog__type">Project</div>
                  <div className="projectLog__title_box">
                    <div className="projectLog__title">A new project has arrived.</div>
                    <div className="projectLog__date">
                      <span className="projectLog__time">
                        {moment().format('MMM. DD. YYYY HH:mm')}{' '}
                      </span>
                      <span className="projectLog__name">Brie Leason@doflab.com</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </StyledProjectLog>
  );
}

const StyledProjectLog = styled.section`
  position: relative;

  .projectLog_title_box {
    display: flex;
    align-items: flex-end;
    height: 56px;
  }

  .projectLog__content_container {
    position: relative;
    ${paperStyle};
    margin-top: 20px;
    padding: 30px 0;
    height: 560px;

    .projectLog__list_container {
      width: 100%;
      height: 100%;
    }

    .projectLog__list_box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      .projectLog__list {
        display: flex;
        flex-wrap: wrap;
        .projectLog__item {
          display: flex;
          flex-wrap: wrap;
          width: 50%;
          padding-left: 30px;
          font-size: 13px;

          &:nth-child(2) ~ .projectLog__item {
            margin-top: 20px;
          }
          .projectLog__type {
            width: 22%;
            font-size: 12px;
            color: ${color.blue};
          }

          .projectLog__title_box {
            width: 78%;
            .projectLog__title {
            }
          }
          .projectLog__date {
            margin-top: 5px;
            .projectLog__time,
            .projectLog__name {
              display: inline-block;
              vertical-align: bottom;
              font-size: 11px;
              color: #9194a4;
              font-weight: 300;
              letter-spacing: -0.3px;
            }
            .projectLog__time {
              /* font-size: 10px; */
            }
            .projectLog__name {
              margin-left: 5px;
              max-width: 145px;
              font-style: italic;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(ProjectLog);

/* <Grid
        container
        alignItems="flex-end"
        justifyContent="space-between"
        className="projectChat__title_box"
      >
        <Grid item container xs={6} alignItems="flex-end">
        </Grid>
      </Grid> */
