import { TextField } from '@material-ui/core';
import { icon_user_circle } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import { paperStyle } from 'components/project/ProjectShared';

interface GoldStatusModalContainerProps {}

interface goldStatusFormInput {
  // submitValue - current, remained
  currentInlay: number;
  currentAType: number;
  currentSType: number;
  currentPtGold: number;
  // remainedInlay: number;
  // remainedAType: number;
  // remainedSType: number;
  // remainedPtGold: number;
  // state
  usedInlay: number;
  wastedInlay: number;
  returnedInlay: number;
  usedAType: number;
  wastedAType: number;
  returnedAType: number;
  usedSType: number;
  wastedSType: number;
  returnedSType: number;
  usedPtGold: number;
  wastedPtGold: number;
  returnedPtGold: number;
}

function GoldStatusModalContainer() {
  // gold state
  const {
    control: goldStatusControl,
    handleSubmit: handleSubmitGoldStatus,
    errors: goldStatusErrors,
    watch: goldStatusWatch,
    setValue: setGoldStatus,
  } = useForm<goldStatusFormInput>({
    mode: 'onChange',
    defaultValues: {
      // currentInlay: 0,
      // currentAType: 0,
      // currentSType: 0,
      // currentPtGold: 0,
      // usedInlay: 10,
      // wastedInlay: 10,
      // returnedInlay: 0,
    },
  });
  const currentInlay = +goldStatusWatch('currentInlay') || 0;
  const currentAType = +goldStatusWatch('currentAType') || 0;
  const currentSType = +goldStatusWatch('currentSType') || 0;
  const currentPtGold = +goldStatusWatch('currentPtGold') || 0;
  const usedInlay = +goldStatusWatch('usedInlay') || 0;
  const wastedInlay = +goldStatusWatch('wastedInlay') || 0;
  const returnedInlay = +goldStatusWatch('returnedInlay') || 0;
  const usedAType = +goldStatusWatch('usedAType') || 0;
  const wastedAType = +goldStatusWatch('wastedAType') || 0;
  const returnedAType = +goldStatusWatch('returnedAType') || 0;
  const usedSType = +goldStatusWatch('usedSType') || 0;
  const wastedSType = +goldStatusWatch('wastedSType') || 0;
  const returnedSType = +goldStatusWatch('returnedSType') || 0;
  const usedPtGold = +goldStatusWatch('usedPtGold') || 0;
  const wastedPtGold = +goldStatusWatch('wastedPtGold') || 0;
  const returnedPtGold = +goldStatusWatch('returnedPtGold') || 0;

  const remainedInlay = useMemo(
    () => currentInlay - usedInlay - wastedInlay + returnedInlay,
    [currentInlay, usedInlay, wastedInlay, returnedInlay],
  );
  const remainedAType = useMemo(
    () => currentAType - usedAType - wastedAType + returnedAType,
    [currentAType, usedAType, wastedAType, returnedAType],
  );
  const remainedSType = useMemo(
    () => currentSType - usedSType - wastedSType + returnedSType,
    [currentSType, usedSType, wastedSType, returnedSType],
  );
  const remainedPtGold = useMemo(
    () => currentPtGold - usedPtGold - wastedPtGold + returnedPtGold,
    [currentPtGold, usedPtGold, wastedPtGold, returnedPtGold],
  );

  const [logOrder, setLogOrder] = useState(0); // 0: Latest, 1: Oldest

  // method
  const handleSaveGold = () => {};

  return (
    <StyledGoldStatusModalContainer data-component-name="GoldStatusModalContainer">
      {/* goldStatus */}
      <div className="goldStatusModal__gold_form_container">
        <div className="goldStatusModal__profile_box">
          <div className="goldStatusModal__profile_in">
            <figure className="goldStatusModal__profile">
              <img src={icon_user_circle} alt="profile" />
              {/* {user?.profileImg ? (
                <ImgCrop width={52} isCircle src={user.profileImg} />
              ) : (
                <img src={icon_user_circle} alt="account" />
              )} */}
            </figure>
            <p className="goldStatusModal__nickname text-overflow-ellipis">{'Nickname'}</p>
            <p className="goldStatusModal__clinic text-overflow-ellipis">Clinic: {'Dental lab'}</p>
            <p className="goldStatusModal__email text-overflow-ellipis">
              {'info@asmiledental.com'}
            </p>
          </div>
        </div>

        <div className="goldStatusModal__form_box">
          <div className="goldStatusModal__clinic">
            <div>
              <CustomSpan fontColor={color.blue}>{'웃는내일치과'}</CustomSpan>
              <CustomSpan fontColor="#B5B7C1">의 현재 골드 보유 현황입니다.</CustomSpan>
            </div>
            <div>
              <CustomSpan fontColor={color.blue} fontSize={11}>
                {moment().format('MMM. DD. HH:mm')}
              </CustomSpan>
            </div>
          </div>
          <div className="goldStatusModal__form_table_box">
            <table className="goldStatusModal__form_table">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th>인레이</th>
                  <th>A 타입</th>
                  <th>S 타입</th>
                  <th>PT 골드</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>현재</th>
                  <td>
                    <Controller
                      name="currentInlay"
                      control={goldStatusControl}
                      defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            error={goldStatusErrors.currentInlay?.type === 'validate'}
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="currentAType"
                      control={goldStatusControl}
                      defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            error={goldStatusErrors.currentAType?.type === 'validate'}
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="currentSType"
                      control={goldStatusControl}
                      defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            error={goldStatusErrors.currentSType?.type === 'validate'}
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="currentPtGold"
                      control={goldStatusControl}
                      defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            error={goldStatusErrors.currentPtGold?.type === 'validate'}
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                </tr>

                <tr>
                  <th>사용량</th>
                  <td>
                    <Controller
                      name="usedInlay"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.usedInlay?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                            // onFocus={() => setGoldStatus('usedInlay', '')}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="usedAType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.usedAType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="usedSType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.usedSType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="usedPtGold"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.usedPtGold?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                </tr>

                <tr>
                  <th>소모량</th>
                  <td>
                    <Controller
                      name="wastedInlay"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.wastedInlay?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="wastedAType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.wastedAType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="wastedSType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.wastedSType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="wastedPtGold"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.wastedPtGold?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                </tr>

                <tr>
                  <th>반납</th>
                  <td>
                    <Controller
                      name="returnedInlay"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.returnedInlay?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="returnedAType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.returnedAType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="returnedSType"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.returnedSType?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      name="returnedPtGold"
                      control={goldStatusControl}
                      // defaultValue="0"
                      rules={{ validate: value => !isNaN(+value) }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="sm">
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            error={goldStatusErrors.returnedPtGold?.type === 'validate'}
                            value={value || ''}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </td>
                </tr>

                <tr>
                  <th>잔량</th>
                  <td>
                    <span className="form_input_text">{remainedInlay}</span>
                  </td>
                  <td>
                    <span className="form_input_text">{remainedAType}</span>
                  </td>
                  <td>
                    <span className="form_input_text">{remainedSType}</span>
                  </td>
                  <td>
                    <span className="form_input_text">{remainedPtGold}</span>
                  </td>
                  <td>
                    <MuiButton
                      config={{
                        width: 130,
                      }}
                      variant="contained"
                      color="secondary"
                      disableElevation
                      className="sm inset-shadow-default border-radius-round"
                      onClick={() => handleSubmitGoldStatus(handleSaveGold)}
                    >
                      <b>Save</b>
                    </MuiButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* log */}
      <div className="goldStatusModal__log_container">
        <div className="goldStatusModal__log_title_box">
          <div className="goldStatusModal__log_title">Log</div>
          <div className="goldStatusModal__log_order">
            <button
              className={cx('btn-reset', { active: logOrder === 0 })}
              onClick={() => setLogOrder(0)}
            >
              Latest
            </button>
            <pre>{'  l  '}</pre>
            <button
              className={cx('btn-reset', { active: logOrder === 1 })}
              onClick={() => setLogOrder(1)}
            >
              Oldest
            </button>
          </div>
        </div>

        <div className="goldStatusModal__log_content_container">
          <ul className="goldStatusModal__log_list">
            {Array.from({ length: 5 }).map((item, idx) => (
              <li className="goldStatusModal__log_item" key={idx}>
                {/* <div className="goldStatusModal__log_project_name">{'log name'}</div> */}
                <div className="goldStatusModal__log_project_text_box">
                  <div className="goldStatusModal__log_project_text">{'log text'}</div>
                  <p className="goldStatusModal__log_project_date">
                    {moment().format('MMM. DD. YYYY HH:mm')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StyledGoldStatusModalContainer>
  );
}

const StyledGoldStatusModalContainer = styled.div`
  .goldStatusModal__gold_form_container {
    display: flex;
    justify-content: space-between;
    .goldStatusModal__profile_box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 265px;
      height: 290px;
      padding: 0 10px;
      background-color: #fafafd;
      border-radius: 10px;
      .goldStatusModal__profile_in {
        margin-top: -10px;
        width: 100%;
        text-align: center;
      }
      .goldStatusModal__profile {
        img {
          width: 100px;
          height: 100px;
        }
      }
      .goldStatusModal__nickname {
        margin-top: 30px;
        font-size: 18px;
        font-weight: 700;
      }
      .goldStatusModal__clinic {
        margin-top: 15px;
      }
      .goldStatusModal__email {
        margin-top: 10px;
        font-size: 16px;
      }
    }

    .goldStatusModal__form_box {
      width: calc(100% - 295px);

      .goldStatusModal__clinic {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding-bottom: 5px;
        border-bottom: 1px solid ${color.blue};
      }
      .goldStatusModal__form_table_box {
        padding-top: 10px;
        .goldStatusModal__form_table {
          .muiWrapper {
            width: 78px;
            .MuiInputBase-input {
              text-align: center;
            }
          }

          th {
            color: #b5b7c1;
            font-size: 13px;
            text-align: center;
          }
          thead {
            th {
              padding: 8px 0;
            }
          }
          tbody {
            th {
              text-align: right;
            }
            td {
              padding: 10px 15px;
            }
            tr:first-child {
              td {
                padding-top: 0;
              }
            }
            tr:last-child {
              td {
                padding-top: 0;
                padding-bottom: 0;
                &:last-child {
                  padding: 0;
                  padding-left: 15px;
                }
              }
            }
          }
        }
      }

      .form__input_box {
      }
      .form_input_text {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
  }

  .goldStatusModal__log_container {
    margin-top: 55px;

    .goldStatusModal__log_title_box {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .goldStatusModal__log_title {
        font-size: 21px;
        font-weight: 500;
      }
      .goldStatusModal__log_order {
        font-size: 14px;
        color: #858997;
        pre {
          display: inline;
        }
        button {
          &.active {
            color: ${color.blue};
            font-weight: 500;
          }
        }
      }
    }

    .goldStatusModal__log_content_container {
      position: relative;
      margin-top: 10px;
      padding: 30px;
      border: 1px solid #b5b7c1;
      border-radius: 15px;

      .goldStatusModal__log_list {
        .goldStatusModal__log_item {
          display: flex;
          column-gap: 30px;
          font-size: 13px;

          &:not(:first-child) {
            margin-top: 20px;
          }
          .goldStatusModal__log_project_name {
            width: 60px;
            color: ${color.blue};
          }
          .goldStatusModal__log_project_text_box {
            /* width: calc(100% - 90px); */
            width: 100%;
            .goldStatusModal__log_project_date {
              margin-top: 5px;
              font-size: 11px;
              color: #9194a4;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(GoldStatusModalContainer);
