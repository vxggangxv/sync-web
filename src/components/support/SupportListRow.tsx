import { Grid, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import DownloadIcon from 'components/base/icons/DownloadIcon';

interface SupportListRowProps {
  item: object | any;
  isExpand: {
    value: Set<string>;
    onChange: (e: any) => void;
    setValue: (value: Set<string>) => void;
  };
  type: string | any;
  index: number | any;
}
function SupportListRow({ item, isExpand, type, index }: SupportListRowProps) {
  const [expand, setExpand] = useState(false);
  const [reply, setReply] = useState([]);

  const [hover, setHover] = useState<number>(-1);
  const onHover = (index: number) => {
    setHover(index);
  };

  const onLeave = (index: number) => {
    setHover(-1);
  };

  useEffect(() => {
    if (!isExpand.value) {
      setExpand(isExpand.value);
      isExpand.onChange({ value: true });
    }
  }, [isExpand]);

  useEffect(() => {
    if (!!item.replies) {
      setReply(JSON.parse(item.replies));
    }
  }, []);

  return (
    <StyledSupportListRow data-component-name="SupportListRow">
      <Accordion
        expanded={Boolean(expand)}
        square
        className="supportListRow__wrapper"
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <AccordionSummary className="supportListRow__summary">
          <Grid container className="supportListRow_row">
            <Grid item className="supportListRow_row_item">
              <CustomSpan fontColor="#B5B7C1">{index + 1}</CustomSpan>
            </Grid>
            <Grid item className="supportListRow_row_item">
              {item.title}
              {type === 'qna' && item.status === 2 && (
                <CustomSpan marginLeft={15} fontSize={16} fontWeight={400} fontColor="#33B5E4">
                  [1]
                </CustomSpan>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          className={cx('supportListRow__details', {
            qna: type === 'qna',
          })}
        >
          <div className="supportListRow__details_wrapper question">
            <div className="supportListRow__details_profile">
              <p>
                <CustomSpan fontSize={9} fontWeight={200} fontColor="#B5B7C1">
                  Sync
                </CustomSpan>
              </p>
              <p>
                <CustomSpan fontSize={11} fontWeight={400} fontColor="#303030">
                  {type === 'qna' ? item.email + ' / ' + item.name : `Sync_SupportTeam`}
                </CustomSpan>
              </p>
            </div>
            <div className="supportListRow__details_content question">{item.content}</div>
            {type === 'qna' && (
              <div className="supportListRow__details_files_box">
                <div className="supportListRow__details_files_label">
                  <CustomSpan fontSize={15} fontWeight={500} fontColor="#303030">
                    <T>Attached File</T>
                  </CustomSpan>
                </div>
                <div className="supportListRow__details_files_list">
                  {Array.from({ length: 10 }).map((item: any, index: number) => (
                    <p
                      className="supportListRow__details_files"
                      key={index}
                      onMouseEnter={() => onHover(index)}
                      onMouseLeave={() => onLeave(index)}
                    >
                      <span>file.test</span>
                      <DownloadIcon color={hover === index ? '#303030' : '#B5B7C1'} width={12} />
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {type === 'qna' &&
            !!reply.length &&
            reply?.map((item: any, index: number) => (
              <div className="supportListRow__details_wrapper answer" key={index}>
                <div className="supportListRow__details_profile ">
                  <p>
                    <CustomSpan fontSize={9} fontWeight={200} fontColor="#B5B7C1">
                      Sync
                    </CustomSpan>
                  </p>
                  <p>
                    <CustomSpan fontSize={11} fontWeight={400} fontColor="#303030">
                      Sync_SupportTeam
                    </CustomSpan>
                  </p>
                </div>
                <div className="supportListRow__details_content answer">{item.reply}</div>
                <div className="supportListRow__details_files_box">
                  <div className="supportListRow__details_files_label">
                    <CustomSpan fontSize={15} fontWeight={500} fontColor="#303030">
                      <T>Attached File</T>
                    </CustomSpan>
                  </div>
                  <div className="supportListRow__details_files_list">
                    {Array.from({ length: 10 }).map((item: any, index: number) => (
                      <p
                        className="supportListRow__details_files"
                        key={index}
                        onMouseEnter={() => onHover(index)}
                        onMouseLeave={() => onLeave(index)}
                      >
                        <span>file.test</span>
                        <DownloadIcon color={hover === index ? '#303030' : '#B5B7C1'} width={12} />
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </AccordionDetails>
      </Accordion>
    </StyledSupportListRow>
  );
}

const StyledSupportListRow = styled.div<{}>`
  width: 100%;
  .supportListRow_row {
    .supportListRow_row_item {
      &:nth-child(1) {
        width: 90px;
        padding-left: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:nth-child(2) {
        width: calc(100% - 90px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }
  }

  .supportListRow__wrapper {
    border-bottom: 1px solid #e7e8f2;
    &.MuiAccordion-root {
      box-shadow: none;
      &:before {
        display: none;
      }
      &.Mui-expanded {
        margin: 0;
      }
    }
    .supportListRow__summary {
      &.MuiAccordionSummary-root {
        min-height: 64px;
        padding: 0;
      }
      &.Mui-expanded {
        margin: 0;
      }
      .MuiAccordionSummary-content {
        margin: 0;
        &.Mui-expanded {
          margin: 0;
        }
      }
    }
    .supportListRow__details {
      flex-direction: column;
      padding: 5px 0 20px 90px;
      &.MuiAccordionDetails-root {
      }

      .supportListRow__details_content {
        width: 1272px;
        margin-top: 20px;
        margin-left: 50px;
        background-color: #edf4fb;
        padding: 20px;
        border-radius: 0px 15px 15px 15px;
        font-size: 11px;
        font-weight: 400;
        color: #303030;
        line-height: 25px;
      }

      &.qna {
        .supportListRow__details_wrapper {
          width: 100%;
          &.answer {
            .supportListRow__details_profile {
              text-align: right;
            }
          }
          .supportListRow__details_content {
            /* width: 606px; */
            width: 100%;
            margin-top: 20px;
            margin-left: 0;
            padding: 20px;
            font-size: 11px;
            font-weight: 400;
            color: #303030;
            line-height: 25px;
            &.question {
              border-radius: 0 15px 15px 15px;
              background-color: #edf4fb;
            }
            &.answer {
              border-radius: 15px 0 15px 15px;
              background-color: #f9f9fc;
            }
          }
        }
        .supportListRow__details_files_box {
          display: flex;
          margin: 20px 0 30px;
          .supportListRow__details_files_label {
            width: 140px;
          }
          .supportListRow__details_files_list {
            height: 100px;
            overflow-y: overlay;
            width: calc(100% - 140px);
            .supportListRow__details_files {
              height: 20px;
              color: #b5b7c1;
              display: flex;
              align-items: center;
              column-gap: 8px;
              margin-bottom: 5px;
              &:hover {
                cursor: pointer;
                text-decoration: underline;
                color: #303030;
              }
            }
          }
        }
      }
    }
  }
`;

export default React.memo(SupportListRow);
