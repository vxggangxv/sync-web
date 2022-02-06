import { Grid, TextField } from '@material-ui/core';
import { chat_bubble_double, icon_user_circle } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import { paperStyle } from './ProjectShared';
import UserOutlineIcon from 'components/base/icons/UserOutlineIcon';
import moment from 'moment';
import cx from 'classnames';
import useKeyboard from 'lib/hooks/useKeyboard';
import useInput from 'lib/hooks/useInput';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import PaperPlaneIcon from 'components/base/icons/PaperPlaneIcon';
import ImgCrop from 'components/common/images/ImgCrop';
import { devConsoleSet } from 'lib/library';

interface ProjectChatProps {}

function ProjectChat() {
  const talkBoxListRef = useRef<HTMLDivElement>(null);
  const [chatListScrollHeight, setChatListScrollHeight] = useState(0);
  const [chatInputHeight, setChatInputHeight] = useState(0);
  // 채팅 input 초기 height 값
  const [chatInputInitialHeight, setChatInputInitialHeight] = useState(0);
  const chatTextareaRef = useRef<HTMLDivElement>(null);
  const message = useInput('');
  const keyboard = useKeyboard();
  // TODO: api mapping
  const totalPeople = 4;
  const isPossibleChat = true;

  // onScroll
  const handleScrollChat = (e: any) => {
    // const target = e.currentTarget;
    // if (target.scrollTop === 0) {
    //   const nextPage = page.value + 1;
    //   // console.log('nextPage', nextPage);
    //   submitChatListData = {
    //     ...submitChatListData,
    //     page: nextPage,
    //   };
    //   // console.log('submitChatListData', submitChatListData);
    //   // if (chatListData.hasNextPage) socketState.emit('chatList', submitChatListData);
    //   if (nextPage <= chatListData?.pagingData?.totalPage)
    //     socketState.emit('chatList', submitChatListData);
    //   page.setValue(nextPage);
    //   setScrollHeight(target.scrollHeight);
    // }
  };

  const handleSendMessage = () => {};

  const handleChangeChatHeight = (e: any) => {
    message.onChange(e);
    const target = e.currentTarget;
    const textareaScrollHeight = target.querySelector('textarea#chatTextareaRef').scrollHeight;
    const textareaHeight = target.querySelector('textarea#chatTextareaRef').clientHeight;
    // console.log('target', target);
    // console.log('target', textareaHeight);
    // console.log('target', textareaScrollHeight);
    // 19 -> 38 -> 57
    if (textareaHeight < 58) {
      setChatInputHeight(textareaHeight);
    }
  };

  useEffect(() => {
    if (chatTextareaRef.current) {
      const textareaHeight =
        chatTextareaRef.current.querySelector('textarea#chatTextareaRef')?.clientHeight || 19;
      // console.log('textareaHeight', textareaHeight);
      setChatInputInitialHeight(textareaHeight);
    }
  }, [chatTextareaRef.current]);

  return (
    <StyledProjectChat
      data-component-name="ProjectChat"
      chatInputInitialHeight={chatInputInitialHeight}
      chatInputHeight={chatInputHeight}
    >
      <Grid
        container
        alignItems="flex-end"
        justifyContent="space-between"
        className="projectChat__title_box"
      >
        <Grid item container xs={6} alignItems="flex-end">
          <img src={chat_bubble_double} alt="chat" className="projectChat__title_buuble" />
          <h1>
            <CustomSpan fontSize={21} fontWeight={500} marginLeft={20}>
              Project Chat
            </CustomSpan>
          </h1>
        </Grid>
        <Grid item container xs={6} alignItems="center" justifyContent="flex-end">
          <UserOutlineIcon />
          <CustomSpan fontColor={color.blue} fontSize={13} fontWeight={500} marginLeft={5}>
            Total : {totalPeople}
          </CustomSpan>
        </Grid>
      </Grid>

      <div className="projectChat__content_container">
        <div
          className="projectChat__talk_box_list"
          ref={talkBoxListRef}
          onScroll={handleScrollChat}
        >
          <div
            className={cx('projectChat__talk_box', {
              self: true,
            })}
          >
            <div className="projectChat__talk_content_box">
              <div className="projectChat__talk_content">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In blanditiis, et autem
                deleniti dolore suscipit quaerat recusandae repudiandae numquam saepe tenetur, omnis
                beatae molestias eum excepturi praesentium, adipisci velit quos?
              </div>
              <img
                src={icon_user_circle}
                alt="account"
                className="projectChat__talk_content_user"
              />
              {/* {user?.profileImg ? (
                <ImgCrop width={52} isCircle src={user.profileImg} />
              ) : (
                <img src={icon_user_circle} alt="account" />
              )} */}
            </div>
            <div className="projectChat__talk_date">
              <span className="projectChat__talk_time">
                {moment().format('MMM. DD. YYYY HH:mm')}
              </span>
              <span className="projectChat__talk_name"> Name</span>
            </div>
          </div>
          <div
            className={cx('projectChat__talk_box', {
              partner: true,
            })}
          >
            <div className="projectChat__talk_content_box">
              <div className="projectChat__talk_content">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. In blanditiis, et autem
                deleniti dolore suscipit quaerat recusandae repudiandae numquam saepe tenetur, omnis
                beatae molestias eum excepturi praesentium, adipisci velit quos?
              </div>
              <img
                src={icon_user_circle}
                alt="account"
                className="projectChat__talk_content_user"
              />
            </div>
            <div className="projectChat__talk_date">
              <span className="projectChat__talk_time">
                {moment().format('MMM. DD. YYYY HH:mm')}
              </span>
              <span className="projectChat__talk_name"> Name</span>
            </div>
          </div>
        </div>

        <div className="projectChat__input_box_outer">
          <div className="projectChat__input_box">
            {/* <textarea name="message" value={message.value} onChange={message.onChange} ></textarea> */}
            <MuiWrapper
              className="projectChat__input"
              config={{
                borderColor: 'rgba(181, 183, 193, 0.5)',
              }}
            >
              <TextField
                ref={chatTextareaRef}
                id="chatTextareaRef"
                variant="outlined"
                fullWidth
                multiline
                value={isPossibleChat ? message.value : '참여한 유저가 없습니다.'}
                // value={isPossibleChat ? message.value : t('CHAT_NO_PARTICIPATED')}
                // disabled={chatResponseStatus === 500 || !isPossibleChat}
                onKeyDown={e => {
                  // 기본 ENTER 줄바꿈 막기, SHIFT와 같이 있을 경우에만 줄바꿈 적용
                  if (!keyboard.value.has('SHIFT') && e.key.toUpperCase() === 'ENTER')
                    e.preventDefault();
                  keyboard.onChange({ key: e.key, type: 'keydown' });
                }}
                onKeyUp={e => {
                  handleChangeChatHeight(e);
                  // console.log('e.target.value', e.target.value);
                  // if (!keyboard.value.has('SHIFT') && keyboard.value.has('ENTER')) onSendMessage();
                  // value있고 SHIFT안 누르고 ENTER만 눌렀을 경우 submit
                  if (
                    !!message.value &&
                    !keyboard.value.has('SHIFT') &&
                    keyboard.value.has('ENTER')
                  )
                    handleSendMessage();
                  keyboard.onChange({ key: e.key, type: 'keyup' });
                }}
                onChange={message.onChange}
              />
            </MuiWrapper>
            <MuiButton
              disableElevation
              variant="contained"
              color="secondary"
              className="projectChat__send_btn"
              // disabled={chatResponseStatus === 500 || !isPossibleChat || !message.value?.trim()}
              onClick={handleSendMessage}
            >
              <PaperPlaneIcon color="white" width={22} />
            </MuiButton>
          </div>
        </div>
      </div>
    </StyledProjectChat>
  );
}

const chatListHeight = 490;
const chatInputBoxInintialHeight = 40;

const StyledProjectChat = styled.section<{
  chatInputInitialHeight: number;
  chatInputHeight: number;
}>`
  position: relative;

  .projectChat__title_box {
    .projectChat__title_buuble {
      position: relative;
      top: 5px;
    }
  }

  .projectChat__content_container {
    margin-top: 20px;
    height: 560px;

    .projectChat__talk_box_list {
      ${paperStyle};
      position: relative;
      z-index: 1;
      padding: 30px 40px;
      height: ${chatListHeight}px;
      height: ${({ chatInputInitialHeight, chatInputHeight }) =>
        chatInputHeight > chatInputInitialHeight &&
        chatListHeight - (chatInputHeight - chatInputInitialHeight)}px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: white;

      .projectChat__talk_box {
        position: relative;

        font-size: 14px;
        &:not(:first-child) {
          margin-top: 20px;
        }
        .projectChat__talk_date {
          margin-top: 5px;
        }
        .projectChat__talk_time,
        .projectChat__talk_name {
          display: inline-block;
          vertical-align: bottom;
          font-size: 11px;
          color: #9194a4;
          font-weight: 300;
          letter-spacing: -0.3px;
        }
        .projectChat__talk_time {
          /* font-size: 10px; */
        }
        .projectChat__talk_name {
          margin-left: 5px;
          max-width: 435px;
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .projectChat__talk_content_box {
          display: flex;
        }
        .projectChat__talk_content_user {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(181, 183, 193, 0.5);
        }
        .projectChat__talk_content {
          position: relative;
          padding: 10px;
          border-radius: 15px;
          font-size: 14px;
          line-height: 1.3;
        }
        &.self {
          .projectChat__talk_date {
            text-align: left;
            .projectChat__talk_name {
            }
          }
          .projectChat__talk_content {
            margin-right: 10px;
            background-color: #edf4fb;
            border-top-right-radius: 0;
          }
        }
        &.partner {
          .projectChat__talk_date {
            text-align: right;
          }
          .projectChat__talk_content_box {
            flex-direction: row-reverse;
          }
          .projectChat__talk_content {
            margin-left: 10px;
            background-color: #f9f9fc;
            border-top-left-radius: 0;
          }
        }
      }
    }

    .projectChat__input_box_outer {
      position: relative;
      margin-top: -20px;
      width: 100%;
      /* height: 90px; */
      padding: 35px 40px 15px;
      background-color: #eff1f8;
      border-radius: 15px;
      box-shadow: inset 0 -1px 3px rgba(0, 0, 0, 0.16);
      .projectChat__input_box {
        display: flex;
        align-items: middle;
        justify-content: space-between;
        /* height: 108px;
        padding: 20px; */
        /* height: 108px; */
        min-height: ${chatInputBoxInintialHeight}px;
        height: ${({ chatInputInitialHeight, chatInputHeight }) =>
          chatInputBoxInintialHeight + (chatInputHeight - chatInputInitialHeight)}px !important;
        .muiWrapper {
          width: calc(100% - 50px);
          height: 100%;
          background-color: #fff;
          border-color: #b5b7c1;
          .MuiInputBase-root {
            padding: 10px;
          }
          textarea {
            padding: 0;
            max-height: 58px;
            overflow-y: auto !important;
            line-height: 1.4;
            word-break: break-all;
            &::-webkit-scrollbar {
              display: none;
            }
          }
        }
        .button {
          margin-left: 10px;
          width: 40px;
          min-height: ${chatInputBoxInintialHeight}px;
          height: ${({ chatInputInitialHeight, chatInputHeight }) =>
            chatInputBoxInintialHeight + (chatInputHeight - chatInputInitialHeight)}px;
          padding: 0;
          min-width: initial;
        }
      }
    }
  }
`;

export default React.memo(ProjectChat);
