import { INavigationItem, Navigation, ActionButtons, StartView, Assistant, ExitButton, ISignalStatus } from 'agora-aclass-ui-kit'
import React, { useCallback } from 'react'
import { dialogManager } from 'agora-aclass-ui-kit'
import { useAcadsocRoomStore, useSceneStore, useUIStore, useMediaStore,useAppStore } from '@/hooks'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import { SignalBar } from './signal/signal'
import { EduManager, EduRoleTypeEnum } from 'agora-rte-sdk'
import Button from '@material-ui/core/Button';
import { t } from '@/i18n'

const StartViewBox = observer(() => {
  const acadsocStore = useAcadsocRoomStore()
  const startTime: string = acadsocStore.classTimeText
  return (
    <StartView text={startTime} isEnd={acadsocStore.isClassroomDelayed}/>
  )
})

const AssistantMenu = observer(() => {
  const signalLevel = (packetLossRate: number) => {
    if (packetLossRate > 30) return 1
    if (packetLossRate > 20) return 2
    if (packetLossRate > 10) return 3
    return 3
  }
  const mediaStore = useMediaStore()
  const acadsocRoomStore = useAcadsocRoomStore()
  const userList = mediaStore.signalStatus;
  const remoteUsers: ISignalStatus[] = userList.filter((item) => item.userUuid !== acadsocRoomStore.userUuid).map((item) => {
    const receiveDelay = parseInt(item.receiveDelay, 10)
    const packagesLost = parseInt(item.packetLossRate, 10)
    return {
      userName: item.userName,
      userUid: item.userUuid,
      signalLevel: signalLevel(packagesLost),
      delay: isNaN(receiveDelay) ? '-' : receiveDelay,
      packagesLost: isNaN(packagesLost) ? '-' : packagesLost,
    }
  })
  return (
    <Assistant 
    userSignalStatus={remoteUsers} 
    title={t('aclass.assistant.title')}
    noUserText={t('aclass.assistant.noRemoteUser')} 
    delayText={t('aclass.assistant.delay')}
    lossRate={t('aclass.assistant.lossRate')}
    />
  )
})

export const Nav = observer(() => {

  const acadsocRoomStore = useAcadsocRoomStore()

  const userRole = get(acadsocRoomStore, 'roomInfo.userRole', 1)
  const assistantView = {
    isComponent: true,
    componentKey: "assistant",
    renderItem: () => { return <AssistantMenu /> }
  }
  const classMessageView = {
    isComponent: false,
    componentKey: "classID",
    text: `ClassID：${get(acadsocRoomStore, 'roomInfo.roomUuid', '')}`
  }

  const statusBar = [
    {...classMessageView},
    {
      isComponent: true,
      componentKey: "classStartTime",
      renderItem: () => { return <StartViewBox /> }
    },
    {
      isComponent: true,
      componentKey: "signalBar",
      renderItem: () => { return <SignalBarContainer /> }
    }
  ]
  userRole === EduRoleTypeEnum.assistant && statusBar.unshift(assistantView)

  const statusBarList = statusBar.filter((it: any) => userRole !== EduRoleTypeEnum.assistant ? it.componentKey !== 'assistant' : true)

  return (
    <Navigation
      leftContainer={statusBarList}
      rightContainer={actionBar}
    />
  )
})

const onRefresh = () => {
  window.location.reload()
}

const current = {
  lock: false
}

const onCustomerService = async () => {

  // const handleUpload = async () => {
    // if (current.lock) return
    try {
      // current.lock = true
      const id = await EduManager.uploadLog('test')
      dialogManager.confirm({
        title: t(`aclass.upload_log_success`),
        text: `id: ${id}`,
        showConfirm: true,
        showCancel: true,
        confirmText: t(`aclass.confirm_close`),
        visible: true,
        cancelText: t(`aclass.cancel_close`),
        onConfirm: () => {
        },
        onCancel: () => {
        }
      })
      // current.lock = false
    } catch (err) {
      console.log(err)
      throw err
      // current.lock = false
    }
  // }

  // await handleUpload()
}

const onEquipmentDetection = () => {
  console.log('click onEquipmentDetection')
}

type IStatusBar = INavigationItem[]

const SignalBarContainer = observer(() => {
  const roomStore = useAcadsocRoomStore()

  return (
    <SignalBar level={roomStore.signalLevel}></SignalBar>
  )
})

const ActionBarContainer = observer(() => {
  const uiStore = useUIStore()

  const handleSetting = useCallback(() => {
    if (uiStore.aclassVisible) {
      uiStore.hideMediaSetting()
    } else {
      uiStore.showMediaSetting()
    }
  }, [uiStore.aclassVisible])

  const buttonArr = [
    { name: 'refresh', clickEvent: onRefresh },
    { name: 'customerService', clickEvent: onCustomerService },
    { name: 'equipmentDetection', clickEvent: handleSetting },
  ]

  return (
    <ActionButtons buttonArr={buttonArr} />
  )
})

const actionBar: IStatusBar = [{
  isComponent: true,
  componentKey: "actionBar",
  renderItem: () => {
    return <ActionBarContainer />
  },
},
{
  isComponent: true,
  componentKey: "exitButton",
  renderItem: () => {

    const history = useHistory()
    const acadsocRoomStore = useAcadsocRoomStore()
    const appStore = useAppStore()

    const onExitRoom = () => {
      appStore.isNotInvisible && dialogManager.show({
        title: t(`aclass.confirm.endClass`),
        text: t(`aclass.confirm.exit`),
        confirmText: t(`aclass.confirm.yes`),
        visible: true,
        cancelText: t(`aclass.confirm.no`),
        onConfirm: async () => {
          await appStore.destroyRoom()
        },
        onCancel: () => {
        }
      })
    }

    return <Button style={{
      width: '100px',
      height: '28px',
      padding: 0,
      minWidth: '60px',
      fontWeight: 400,
      borderRadius: '14px',
      border: '2px solid white',
      textTransform: 'none',
      backgroundColor: '#E0B536',
      color: '#fff',
    }} onClick={onExitRoom}>{t("aclass.exit")}</Button>
  }
}]