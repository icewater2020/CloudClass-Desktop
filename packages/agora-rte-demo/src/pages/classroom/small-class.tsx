import React from 'react';
import {VideoMarquee} from '@/components/video-marquee';
import {NetlessBoard} from '@/components/netless-board';
import { ScreenSharing } from '@/components/screen-sharing';
import { RoomBoard } from '@/components/room-board';
import { observer } from 'mobx-react';
import { useSceneStore } from '@/hooks';
import { EduRoleTypeEnum } from 'agora-rte-sdk';

export const LiveRoomVideoMarquee = observer(() => {
  const sceneStore = useSceneStore()
  return <VideoMarquee
    className={'small-class-room'}
    showMain={true}
    mainStream={sceneStore.teacherStream}
    othersStreams={sceneStore.studentStreams}
  />
})

export const SmallClass = () => {
  return (
    <div className="room-container">
      <LiveRoomVideoMarquee />
      <div className="container">
        <div className="biz-container">
          <NetlessBoard />
          <ScreenSharing />
        </div>
        <RoomBoard />
      </div>
    </div>
  )
}