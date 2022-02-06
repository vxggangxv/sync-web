import React, { useContext, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import styled from 'styled-components';
import cx from 'classnames';
import { projectProcessFlagList } from 'lib/mapper';
import CustomTooltip from 'components/common/tooltip/CustomTooltip';
import { font, color, floatClear } from 'styles/utils';
import { useLocation } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import {
  project_step_bg,
  project_step_new_bg,
  project_step_done,
  project_step_ing_btn,
  project_step_skip,
  project_step_skip_bg,
  project_step_yet_btn,
} from 'components/base/images';
import { AppContext } from 'contexts/AppContext';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import { ProjectActions } from 'store/actionCreators';
import { useShallowSelector } from 'lib/utils';

/**
 * <StageTimeLine
    stage={informationFormat.stage} // number
    timeline={timeLineList} // array
    className=""
   />
 * @param {*} props
 * @param {number} stage // stage: 0 ~
 * @param {object} timeline // timeline: {create: 1630634289, preparation, scan, cad, cam, milling, postProcess, completed}, number | null
 */

const StageTimeline = props => {
  let {
    className = '',
    projectCode,
    stage,
    timeline = {},
    onOpenCompleteProjectModal = () => {},
  } = props;
  const { user } = useShallowSelector(state => ({
    user: state.user.user,
  }));
  const { t } = useTranslation();
  // console.log('stage-', stage);
  // console.log('timeline-', timeline);
  // undefined 에러 방지, 단계 객체 생성 [stage]: null

  // preparation 까지는 스킵 불가
  // NOTE: skip stage parsing
  const findProceedingIndex = timeline => {
    const timelineHasValueList = Object.entries(timeline).reduce((acc, [key, value]) => {
      return acc.concat(!!value ? 1 : 0);
    }, []);
    const proceedingIndex = timelineHasValueList.lastIndexOf(1);

    return proceedingIndex;
  };

  // const stage = findProceedingIndex(timeline);
  // console.log('stage', stage);

  const convertTimeline = (timeline, stage) => {
    const returnValue = Object.entries(timeline).reduce((acc, [key, value], index) => {
      let itemValue = value;
      if (value === null && index < stage) {
        itemValue = 'skip';
      }

      const currentItem = projectProcessFlagList.find(item => item.index === key);

      return acc.concat({
        stage: index,
        name: currentItem?.name,
        value: itemValue,
        stageIndex: currentItem?.index,
        // number: acc.length + 1,
        // title: currentItem?.title,
      });
    }, []);

    return returnValue;
  };

  const convertedTimeline = convertTimeline(timeline, stage);
  // console.log(convertedTimeline, 'convertedTimeline');
  // TEST:
  useEffect(() => {
    console.log('convertedTimeline', convertedTimeline);
  }, [convertedTimeline]);

  // SECTION: function

  const handleEditTimeline = stage => {
    if (!projectCode) return;

    if (stage === 7) {
      onOpenCompleteProjectModal();
    } else {
      ProjectActions.edit_timeline_request({
        // userGroupCodeIdx: user.userGroupIdx,
        projectCode,
        stage,
      });
    }
  };

  return (
    <Styled.StageTimeline data-component-name="StageTimeline" className={className}>
      <div className="stageTimeline__container">
        <div className="stageTimeline__step_list_bg">
          {convertedTimeline.map((item, idx) => {
            const proceededStatus = item.stage <= stage;
            const skipStatus = item.value === 'skip';
            const currentStatus = item.stage === stage;
            const yetStatus = item.stage > stage;
            return (
              <div
                key={idx}
                className={cx('stageTimeline__step_item', {
                  new: item.stage === 0,
                  proceeded: item.stage !== 0 && proceededStatus,
                  skip: skipStatus,
                  current: currentStatus,
                  yet: yetStatus,
                })}
              ></div>
            );
          })}
        </div>
        <div className="stageTimeline__step_list">
          {convertedTimeline.map((item, idx) => {
            // console.log('item', item);
            const newStatus = stage === 0;
            const proceededStatus = item.stage <= stage;
            const skipStatus = item.value === 'skip';
            const currentStatus = item.stage === stage;
            const yetStatus = item.stage > stage;
            const modifiedDate =
              !item.value || item.value === 'skip'
                ? ''
                : moment.unix(item.value).format('MMM DD YYYY');

            return (
              <div
                key={idx}
                className={cx('stageTimeline__step_item', {
                  new: item.stage === 0,
                  proceeded: item.stage !== 0 && proceededStatus,
                  skip: skipStatus,
                  current: currentStatus,
                  yet: yetStatus,
                })}
              >
                <div className="stageTimeline__step_btn_box">
                  <div className="stageTimeline__step_name">{item.name}</div>
                  <div className="stageTimeline__step_date">{modifiedDate}</div>
                  <button
                    className="btn-reset stageTimeline__step_btn"
                    onClick={() => handleEditTimeline(item.stage)}
                  >
                    {currentStatus && <img src={project_step_ing_btn} alt="procedding" />}
                    {yetStatus && <img src={project_step_yet_btn} alt="yet" />}
                    <span className="stageTimeline__step_skip">
                      {skipStatus && <img src={project_step_skip_bg} alt="yet" />}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Styled.StageTimeline>
  );
};

export default React.memo(StageTimeline);

const barWidth = 1368;
const barItemWidth = (1368 - 12 - 10) / 8;

const Styled = {
  StageTimeline: styled.div`
    margin: 0 auto;

    .stageTimeline__container {
      width: ${barWidth}px;
      height: 44px;
      background: url(${project_step_bg}) no-repeat;
      
      .stageTimeline__step_list_bg {
        position: absolute;
        display: flex;
        align-items: center;
        padding: 4px 0 0 6px;
        .stageTimeline__step_item {
          position: relative;

          &:not(.new) {
            margin-right: -33px;
            width: 222px;
            height: 34px;
            &.proceeded:not(.skip):not(.yet) {
              background: url(${project_step_done}) no-repeat;
              z-index: 1;
            }
            &.skip {
              background: url(${project_step_skip}) no-repeat;
          }
          &.new {
            z-index: 1;
            position: absolute;
            width: 34px;
            height: 34px;
            top: 4px;
            left: 6px;
          }

        }
      }
    }

    .stageTimeline__step_list {
      position: relative;
      display: flex;
      align-items: center;
      padding: 4px 0 0 6px;
      .stageTimeline__step_item {
        position: relative;

        .stageTimeline__step_btn_box {
          z-index: 1;
          position: absolute;
          top: -4px;

          .stageTimeline__step_btn {
            width: 42px;
            height: 42px;
          }

          .stageTimeline__step_skip {
            position: relative;
            top: 2px;
            left: -1px;
          }
        }
        &:not(.new) {
          margin-right: -33px;
          width: 222px;
          height: 34px;
          .stageTimeline__step_btn_box {
            right: -5px;
          }
        }
        &.new {
          z-index: 1;
          position: absolute;
          width: 34px;
          height: 34px;
          top: 4px;
          left: 6px;
          .stageTimeline__step_btn_box {
            left: -4px;
          }
        }

        .stageTimeline__step_name,
        .stageTimeline__step_date {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: ${barItemWidth}px;
          text-align: center;
        }
        .stageTimeline__step_name {
          top: -20px;
          font-size: 14px;
        }
        .stageTimeline__step_date {
          bottom: -17px;
          font-size: 11px;
          color: #858997;
        }

        &.current .stageTimeline__step_name {
          color: ${color.blue};  
          font-weight: 500;
        }
        &.yet .stageTimeline__step_name {
          color: #B5B7C1;  
        }
      }
    }
  `,
};

/* {t(`PROJECT_PROGRESS_${item.number}`)} */

/*
<CustomTooltip
  className="tooltip__box"
  disableHoverListener={!item.value}
  title={moDate}
  placement="bottom"
  interactive={false}
  baseStyle
  // customStyle={{ top: `15px`, right: `-10px` }}
>
  <span className="stageTimeline__step_text">{item.name}</span>
</CustomTooltip>
*/
