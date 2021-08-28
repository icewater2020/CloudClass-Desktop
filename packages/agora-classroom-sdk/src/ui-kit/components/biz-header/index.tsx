import React, { FC, useCallback } from 'react';
import { Button, Inline, Tooltip } from '~components';
import { Icon, IconTypes } from '~components/icon';
import { Header } from '~components/layout';
import { Popover } from '~components/popover';
import { transI18n } from '../i18n';
import './index.css';
import { SignalContent } from './signal-content';
import IconJoin from './assets/join.png'
import IconStop from './assets/stop.png'
import IconExit from './assets/exit.png'
import IconWifi from './assets/wifi.png'
import IconFullscreen from './assets/fullscreen.png'
import IconExitFullscreen from './assets/exit-fullscreen.png'
import { useGlobalContext, useUserListContext, useBoardContext } from 'agora-edu-core'
const SIGNAL_QUALITY_TEXT: {[key:string]:string} = {
  excellent: '优',
  good: '良',
  bad: '差',
  unknown: '未知', 
}
export interface MonitorInfo {
  /**
   * CPU 使用率, 单位: %
   */
  cpuUsage: number;
  /**
   * 网络延迟, 单位: ms
   */
  networkLatency: number;
  /**
   * 网络状态
   */
  networkQuality: string;
  /**
   * 丢包率, 单位: %
   */
  packetLostRate: number;
}

export type BizClassStatus = 'pre-class' | 'in-class' | 'end-class';


export interface BizHeaderProps {
  /**
   * 是否是原生
   */
  isNative: boolean;
  /**
   * 课程状态
   */
   classState: BizClassStatus;
  /**
   * 课程是否正在录制
   */
  isRecording: boolean
  /**
   * 课程 title
   */
  title: string;
  /**
   * 信号强度
   */
  signalQuality: 'excellent' | 'good' | 'bad' | 'unknown';
  /**
   * 系统相关信息
   */
  monitor: MonitorInfo;

  /**
   * 上课时间
   */
  classFormatTime: string;

  /**
   * 录制时间
   */
  recordFormatTime: string;

  /**
   * 花名册中学生数
   */
  studentInRoomCnt: number;

  /**
   * 该课程中学生数
   */
  studentInClassCnt?: number;

  /**
   * 
   */
  onClick: (itemType: string) => void;

  userType?: 'teacher' | 'student';

  isFullScreen: boolean

  onRoomNameClick?: (e:any) => void
}

export const BizHeader: FC<BizHeaderProps> = ({
  classState,
  isRecording = false,
  isNative = false,
  signalQuality,
  title,
  classFormatTime,
  recordFormatTime,
  monitor,
  userType = 'student',
  onClick,
  studentInRoomCnt = 0,
  studentInClassCnt = 0,
  isFullScreen=false,
  onRoomNameClick
}) => {

  return (
    <>
      <Header className="biz-header">
        <div className="biz-header_lf" onClick={onRoomNameClick}>
        {title}
        </div>
        <div className="biz-header_md">
          { userType == 'teacher' &&
            <>
              { !isRecording &&
                <Button className="biz-header_md-join"  onClick={() => onClick('record')}>
                  <img src ={IconJoin}/>
                  <span>开始录制</span>
                </Button>
              }
              { isRecording &&
                <Button className="biz-header_md-stop" onClick={() => onClick('record')}>
                  <img src ={IconStop}/>
                  <span>{recordFormatTime}</span>
                </Button>
              }
            </>
          }
          { userType == 'student' &&
            <>
              { classState == 'pre-class' &&
                <div className="biz-header_md-done">
                  未上课
                </div>
              }
              { classState == 'in-class' &&
                <div className="biz-header_md-done">
                  {classFormatTime}
                </div>
              }
              { classState == 'end-class' &&
                <div className="biz-header_md-done">
                  已结束
                </div>
              }
            </>
          }
        </div>
        <div className="biz-header_rh">
          { userType == 'teacher' &&
            <Button className="biz-header_rh-roster-teacher" onClick={() => onClick('roster')}>
              <span>花名册 {studentInRoomCnt}/{studentInClassCnt}</span>
            </Button>
          }

          { userType == 'student' &&
            <div className="biz-header_rh-roster-student">
              <span>花名册 {studentInRoomCnt}/{studentInClassCnt}</span>
            </div>
          }
          
          <div className="biz-header_rh-item signal">
            <img src={IconWifi}/>
            <span>{monitor.networkLatency}ms</span>
            <span>{SIGNAL_QUALITY_TEXT[signalQuality]}</span>
          </div>
          <div className="biz-header_rh-item fullscreen" onClick={() => onClick('fullscreen')}>
            <img src={isFullScreen ? IconExitFullscreen:IconFullscreen}/>
            <span>{isFullScreen?'退出全屏':'全屏学习'}</span>
          </div>
          <div className="biz-header_rh-item exit" onClick={() => onClick('exit')}>
            <img src={IconExit}/>
            <span>退出</span>
          </div>
        </div>
      </Header>
    </>
  );
};
/**
 * 
 *  <Popover
          content={<SignalContent {...monitor} isNative={isNative} />}
          placement="bottomLeft">
          <div className={`biz-signal-quality ${signalQuality}`}>
            <Icon
              className="cursor-pointer"
              type={SIGNAL_QUALITY_ICONS[signalQuality] as IconTypes}
              size={24}
            />
          </div>
        </Popover>
        <div className="biz-header-title-wrap">
          <div className="biz-header-title">{title}</div>
          <div className="biz-header-title biz-subtitle">
            <Inline color={CLASS_STATUS_TEXT_COLOR[classState]}>{classStatusText}</Inline>
            <Inline color="#677386">{formatTime}</Inline> 
            </div>
            </div>
            <div className="header-actions">
              {userType === 'teacher' ? 
              <Tooltip title={isRecording ? transI18n('biz-header.recording') : transI18n('biz-header.start_record')} placement="bottom">
                <Icon hover={true} type={isRecording ? "recording" : "record"} color={isRecording ? '#2962F4': undefined} size={24} onClick={() => onClick('record')} />
              </Tooltip> : null}
              <Tooltip title={transI18n('biz-header.setting')} placement="bottom">
                <Icon hover={true} type="set" size={24} onClick={() => onClick('setting')}  />
              </Tooltip>
              <Tooltip title={transI18n('biz-header.exit')} placement="bottom">
                <Icon hover={true} type="exit" size={24} onClick={() => onClick('exit')} />
              </Tooltip>
            </div> 
 */