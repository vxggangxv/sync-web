import { Grid, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import CustomSpan from 'components/common/text/CustomSpan';
import StyledSupportListRow from 'components/support/SupportListRow';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { StyledNoneShadowButtonOuter } from 'components/common/styled/Button';
import IconButton from '@material-ui/core/IconButton';
import { SupportActions, AppActions } from 'store/actionCreators';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { useShallowAppSelector } from 'store/hooks';

function SupportContainer() {
  const {
    fetchQnaList,
    fetchQnaListSuccess,
    fetchFaqList,
    fetchFaqListSuccess,
    updateQna,
    updateQnaSuccess,
  } = useShallowAppSelector(state => ({
    fetchQnaList: state.support.qnaList.data,
    fetchQnaListSuccess: state.support.qnaList.success,
    fetchFaqList: state.support.faqList.data,
    fetchFaqListSuccess: state.support.faqList.success,
    updateQna: state.support.updateQna.data,
    updateQnaSuccess: state.support.updateQna.success,
  }));

  const history = useHistory();

  const faqList = fetchFaqList?.list;
  const faqPagingData = fetchFaqList?.pagingData;
  const faqPage = useInput(1);
  const faqListPage = {
    totalPage: 16,
  };

  const qnaList = fetchQnaList?.list;
  const qnaPagingData = fetchQnaList?.pagingData;
  const qnaPage = useInput(1);

  const page = useInput(1);
  // const faqPagingData = fetchEmployeeList?.pagingData;
  const [mySupportTab, setMySupportTab] = useState(0);
  const qnaFileRef = useRef<null | any>(null);
  const localFileList = useMultiFileInput([]);
  const [isSubmit, setIsSubmit] = useState(false);
  // const [expand, setExpand] = useState(true);
  const isExpand = useInput(true);
  const requestTitle = useInput('');
  const requestContent = useInput('');

  useEffect(() => {
    console.log('fetchQnaList ____ ', fetchQnaList);
  }, [fetchQnaList]);
  useEffect(() => {
    console.log('fetchFaqList ____ ', fetchFaqList);
  }, [fetchFaqList]);
  // useEffect(() => {},[])

  const supportTabList = [
    {
      idx: 0,
      type: 'faq',
      title: 'FAQ',
    },
    {
      idx: 1,
      type: 'qna',
      title: '1:1 QnA',
    },
  ];

  const handleClickSupportTab = (tabIndex: number | any) => {
    setMySupportTab(tabIndex);
  };

  const handleInputAddLocalFile = (e: any) => {
    const {
      target: { files },
    } = e;

    console.log('files >>>> ', files);

    const fileList = Object.keys(files).reduce((acc, key) => {
      files[key].id = moment() + uuid();

      return acc.concat(files[key]);
    }, []);

    localFileList.setValue((draft: any) => draft.concat(fileList));
  };

  useEffect(() => {
    console.log('localFileList _____ ', localFileList.value);
  }, [localFileList.value]);
  useEffect(() => {
    console.log('mySupportTab init _____ ', localFileList.value.length);
    if (!!localFileList.value.length) {
      localFileList.setValue([]);
    }
  }, [mySupportTab]);

  const handleDeleteLocalFile = (fileId: string) => {
    localFileList.setValue((draft: any) => draft.filter((item: any) => item.id !== fileId));
  };

  const handleSubmitQna = () => {
    // setExpand(false);
    const submitData = {
      title: requestTitle.value,
      content: requestContent.value,
      files: localFileList.value,
    };
    isExpand.onChange({ value: false });

    console.log('submit QNA _______ ', submitData);
  };

  useEffect(() => {
    // init
    // SupportActions.
    if (mySupportTab) {
      SupportActions.fetch_qna_list_request({ page: qnaPage.value });
    } else {
      SupportActions.fetch_faq_list_request({ page: faqPage.value });
      // SupportActions.fetch_qna_list_request();
    }
    // SupportActions.update_qna_request()
  }, [mySupportTab]);

  // useEffect(() => {
  //   if (faqPage.value !== 1) {
  //     SupportActions.fetch_faq_list_request({ page: faqPage.value });
  //   }
  // }, [faqPage.value]);

  const handleChangeFaqPage = (value: number) => {
    isExpand.onChange({ value: false });
    SupportActions.fetch_faq_list_request({ page: value });
    faqPage.setValue(value);
  };

  const handleChangeQnaPage = (value: number) => {
    isExpand.onChange({ value: false });
    SupportActions.fetch_faq_list_request({ page: value });
    faqPage.setValue(value);
  };

  return (
    <StyledSupport data-component-name="Support">
      <h1 className="sr-only">Support</h1>

      <div className="support__tabs_wrapper">
        {supportTabList.map((item: any, index: number) => {
          return (
            <MuiWrapper className="support__tabs_btn_wrapper" key={index}>
              <MuiButton
                config={{
                  width: '200px',
                  height: '45px',
                }}
                disableElevation
                className={cx('support__tabs_btn', {
                  selected: mySupportTab === item.idx,
                })}
                variant="outlined"
                onClick={() => {
                  handleClickSupportTab(item.idx);
                }}
              >
                <CustomSpan fontSize={13} fontWeight={400}>
                  {item.title}
                </CustomSpan>
              </MuiButton>
            </MuiWrapper>
          );
        })}
      </div>
      {mySupportTab === 0 && (
        <section className="support__content_wrapper faq">
          <div className="support__content_title_box">
            <div className="support__content_title_image_box"></div>
            <div className="support__content_title">
              <h1>
                <CustomSpan fontSize={26} fontWeight={500} fontColor="#303030">
                  <T>FAQ</T>
                </CustomSpan>
              </h1>
            </div>
          </div>
          <div className="support__table faq">
            <div className="support__table_head faq">
              <Grid container className="support__table_row">
                <Grid item className="support__table_row_item">
                  <CustomSpan fontColor="#B5B7C1">
                    <T>No.</T>
                  </CustomSpan>
                </Grid>
                <Grid item className="support__table_row_item">
                  <T>Title</T>
                </Grid>
              </Grid>
            </div>
            <div className="support__table_body faq">
              {faqList?.map((item: any, index: number) => (
                <StyledSupportListRow
                  key={index}
                  item={item}
                  isExpand={isExpand}
                  type={'faq'}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="support__content_paging">
            <MuiPagination
              config={{
                justifyContent: 'center',
              }}
              // count={Math.floor(faqPagingData?.totalPage)}
              count={faqPagingData?.totalPage}
              value={faqPage.value}
              onChange={(e: any, value: number) => {
                // faqPage.setValue(value);
                handleChangeFaqPage(value);
              }}
            />
          </div>
        </section>
      )}
      {mySupportTab === 1 && (
        <section className="support__content_wrapper qna">
          <h1 className="sr-only">1:1QnA</h1>
          <div className="support__qan_list_wrapper">
            <div className="support__table qna">
              <div className="support__table_head qna">
                <Grid container className="support__table_row">
                  <Grid item className="support__table_row_item">
                    <CustomSpan fontColor="#B5B7C1">
                      <T>No.</T>
                    </CustomSpan>
                  </Grid>
                  <Grid item className="support__table_row_item">
                    <T>Title</T>
                  </Grid>
                </Grid>
              </div>
              <div className="support__table_body qna">
                {/* {qnaList.map((item: any, index: number) => (
                  <StyledSupportListRow
                    key={index}
                    item={item}
                    isExpand={isExpand}
                    type={'qna'}
                    index={index}
                  />
                ))} */}
              </div>
            </div>

            <div className="support__content_paging">
              <MuiPagination
                config={{
                  justifyContent: 'center',
                }}
                // count={Math.floor(faqPagingData?.totalPage)}
                count={qnaPagingData?.totalPage}
                value={qnaPage.value}
                onChange={(e: any, value: number) => {
                  // faqPage.setValue(value);
                  handleChangeQnaPage(value);
                }}
              />
            </div>
          </div>
          <div className="support__question_input_wrapper">
            <div className="support__question_input_box">
              <p>
                <CustomSpan fontSize={25} fontWeight={800} fontColor="#00A4E3">
                  {/* <T>1:1 Question</T> */}
                  1:1 Question
                </CustomSpan>
              </p>
              <Grid container className="support__question_input_row title">
                <Grid item className="support__question_input_label">
                  <span>
                    <T>Title</T>
                  </span>
                </Grid>
                <Grid item className="support__question_input_content">
                  <MuiWrapper
                    className="support__input_wrapper"
                    config={
                      {
                        // borderColor: 'transparent',
                        // activeBorderColor: 'transparent',
                        // hoverBorderColor: 'transparent',
                      }
                    }
                  >
                    <TextField
                      className="radius-md support__input title"
                      variant="outlined"
                      fullWidth
                      placeholder="Fill in the title"
                      // error={!!errors.email}
                      // value={value.length > 1 ? value : value.trim()}
                      value={requestTitle.value}
                      onChange={requestTitle.onChange}
                      // inputRef={ref}
                    />
                  </MuiWrapper>
                </Grid>
              </Grid>
              <Grid container className="support__question_input_row message">
                <Grid item className="support__question_input_label">
                  <span>
                    <T>Messgae</T>
                  </span>
                </Grid>
                <Grid item className="support__question_input_content">
                  <MuiWrapper className="support__input_wrapper">
                    <TextField
                      className="radius-md support__input message"
                      variant="outlined"
                      fullWidth
                      placeholder="Fill in the title"
                      multiline
                      rows={13}
                      value={requestContent.value}
                      onChange={requestContent.onChange}
                      // error={!!errors.email}
                      // value={value.length > 1 ? value : value.trim()}
                      // onChange={onChange}
                      // inputRef={ref}
                    />
                  </MuiWrapper>
                </Grid>
              </Grid>
              <Grid container className="support__question_input_row file">
                <Grid item className="support__question_input_label ">
                  <span>
                    <T>Attached File</T>
                  </span>
                </Grid>
                <Grid item className="support__question_input_content">
                  <div className="support__file_upload_wrapper">
                    <label htmlFor="qnaImage" className="support__file_upload cursor-pointer">
                      <div>
                        <T>Add File</T>
                      </div>
                    </label>
                    <input
                      type="file"
                      accept=".gif,.png,.jpeg,.jpg"
                      id="qnaImage"
                      // id="validBridgeData_5"
                      name="qnaImage"
                      hidden
                      ref={qnaFileRef}
                      multiple
                      onChange={e => {
                        handleInputAddLocalFile(e);
                        e.target.value = '';
                      }}
                    />
                    <CustomSpan fontSize={11} fontWeight={400} fontColor="#17288A" marginLeft={10}>
                      <T>* JPG, GIF, ro PNG only. Max size of 10MB.</T>
                    </CustomSpan>
                  </div>
                  <div className="support__upload_file_list_wrapper">
                    {localFileList?.value.map((file: any, index: number) => {
                      return (
                        <div key={index} className="support__upload_file">
                          <span>{file.name}</span>

                          <span
                            className="support__upload_file_cancel"
                            onClick={e => {
                              handleDeleteLocalFile(file.id);
                            }}
                          >
                            {'X'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Grid>
              </Grid>
              <StyledNoneShadowButtonOuter height={56} left="50%" width={320}>
                <MuiButton
                  config={{
                    width: '280px',
                    color: color.navy_blue,
                    iconMarginAlign: 50,
                  }}
                  disabled={!requestTitle.value || !requestContent.value}
                  disableElevation
                  variant="contained"
                  onClick={handleSubmitQna}
                  className="xl border-radius-round inset-shadow-default projectInformation__next_btn"
                >
                  <T>Submit</T>
                </MuiButton>
              </StyledNoneShadowButtonOuter>
            </div>
          </div>
        </section>
      )}
    </StyledSupport>
  );
}

const StyledSupport = styled.section<{}>`
  padding-bottom: 120px;

  .support__tabs_wrapper {
    margin-bottom: 30px;
    .support__tabs_btn_wrapper {
      height: 45px;
      margin-right: 10px;
      .support__tabs_btn {
        text-transform: none;
        color: #b5b7c1;
        &.selected {
          border: none;
          background: linear-gradient(to right, rgba(0, 166, 266, 1), rgba(8, 123, 238, 1));
          color: #ffffff;
        }
      }
    }
  }

  .support__table {
    width: 100%;
    .support__table_row {
      .support__table_row_item {
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
    .support__table_head {
      .support__table_row {
        width: 100%;
        height: 40px;
        border-radius: 5px;
        background-color: #f4f5fa;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
      }
    }
    .support__table_body {
      .support__table_row {
        width: 100%;
        height: 100%;
        align-items: center;
        font-size: 13px;
        font-weight: 500;
        .support__table_row_item {
          height: 64px;
        }
      }
    }
  }

  .support__content_wrapper {
    .support__content_paging {
      padding: 50px 0;
    }
    &.faq {
      width: 100%;
      min-height: 800px;
      border-radius: 15px;
      box-shadow: 0 0 10px rgb(0 0 0 / 16%);
      padding: 0 30px 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /* position: relative; */
      .support__content_title_box {
        display: flex;
        padding: 40px 0 50px;
        align-items: center;
        .support__content_title_image_box {
          width: 60px;
          height: 60px;
          margin-right: 30px;
          border: 1px solid #000;
        }
        .support__content_title {
        }
      }
    }
    &.qna {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      position: relative;
      .support__qan_list_wrapper {
        width: 806px;
        min-height: 800px;
        border-radius: 15px;
        box-shadow: 0 0 10px rgb(0 0 0 / 16%);
        padding: 40px 30px 0 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 100;
        background-color: #ffffff;
      }
      .support__question_input_wrapper {
        width: calc(100% - 806px + 30px);
        margin-left: -30px;
        z-index: 1;
        .support__question_input_box {
          width: 100%;
          min-height: 750px;
          /* width: 806px; */
          border-radius: 15px;
          border: 1px solid #e7e8f2;
          position: relative;
          padding: 45px 60px 70px 90px;
          .support__question_input_row {
            align-items: flex-start;
            &.title {
              height: 40px;
              margin: 24px 0 10px;
            }
            &.message {
              height: 240px;
            }
            &.file {
              /* height: 278px; */
              height: 220px;
              margin: 15px 0 0;
              border-bottom: 1px dashed #b5b7c1;
            }
            .support__question_input_label {
              display: flex;
              align-items: center;
              width: 120px;
              height: 40px;
              font-size: 15px;
              font-weight: 500;
            }
            .support__question_input_content {
              width: calc(100% - 120px);
              .support__input_wrapper {
                width: 100%;
                .support__input {
                  height: 100%;
                  &.title {
                    height: 40px;
                  }
                  &.message {
                    height: 240px;
                  }
                }
              }
              .support__file_upload_wrapper {
                display: flex;
                align-items: center;
                height: 40px;
                .support__file_upload {
                  /* margin: 4px 0; */
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 20px;
                  height: 32px;
                  width: 150px;
                  background-color: ${color.navy_blue};
                  font-size: 13px;
                  font-weight: 500;
                  color: #ffffff;
                }
              }

              .support__upload_file_list_wrapper {
                width: 380px;
                height: 180px;
                overflow: overlay;
                padding-top: 10px;

                .support__upload_file {
                  /* width: 340px; */
                  /* width: 100%; */
                  /* height: 15px; */
                  min-height: 15px;
                  padding: 4px 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  /* margin: 4px 20px 4px 0; */
                  margin-right: 20px;
                  font-size: 11px;
                  font-weight: 400;
                  .support__upload_file_cancel {
                    padding: 0 10px;
                    cursor: pointer;
                  }

                  &:hover {
                    background-color: #f4f5fa;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default React.memo(SupportContainer);
