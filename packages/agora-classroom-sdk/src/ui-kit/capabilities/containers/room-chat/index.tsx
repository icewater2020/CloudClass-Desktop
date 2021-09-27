import { Chat, Icon } from '~components'
import { observer } from 'mobx-react'
import * as React from 'react';
import { useChatContext, useGlobalContext, useRoomContext } from 'agora-edu-core';
import { useCallback, useEffect } from 'react';
import { get } from 'lodash';
import { useUIStore } from '@/infra/hooks';

export const RoomChat = observer(() => {
  const {
    canChatting,
    isHost,
    getHistoryChatMessage,
    unreadMessageCount,
    muteChat,
    unmuteChat,
    messageList,
    sendMessage,
    addChatMessage,
    setLastReadMessageTs,
  } = useChatContext()

  const {
    chatCollapse,
    toggleChatMinimize,
  } = useUIStore()

  const {
    roomInfo
  } = useRoomContext()

  const {
    isFullScreen
  } = useGlobalContext()

  useEffect(() => {
    if ((isFullScreen && !chatCollapse) || (!isFullScreen && chatCollapse)) {
      // 第一个条件 点击全屏默认聊天框最小化
      // 第二个条件，全屏幕最小化后，点击恢复（非全屏），恢复聊天框
      setLastReadMessageTs()
      toggleChatMinimize()
    }
  }, [isFullScreen])

  const [nextId, setNextID] = React.useState('')

  const isMounted = React.useRef<boolean>(true)


  const refreshMessageList = useCallback(async () => {
    const res = nextId !== 'last' && await getHistoryChatMessage({ nextId, sort: 0 })
    if (isMounted.current) {
      setNextID(get(res, 'nextId', 'last'))
    }
  }, [nextId, setNextID, isMounted.current])

  React.useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  const onCanChattingChange = async (canChatting: boolean) => {
    if (canChatting) {
      await unmuteChat()
    } else {
      await muteChat()
    }
  }

  const [text, setText] = React.useState<string>('')

  const handleSendText = useCallback(async (): Promise<void> => {
    if (!text.trim()) return;
    const textMessage = text
    setText('')
    const message = await sendMessage(textMessage)
    addChatMessage(message)
  }, [text, setText])
  
  return (
    <Chat
      collapse={chatCollapse}
      onCanChattingChange={onCanChattingChange}
      canChatting={canChatting}
      isHost={isHost}
      uid={roomInfo.userUuid}
      messages={messageList}
      chatText={text}
      onText={(textValue: string) => {
        setText(textValue)
      }}
      onCollapse={() => {
        setLastReadMessageTs()
        toggleChatMinimize()
      }}
      onSend={handleSendText}
      showCloseIcon={isFullScreen}
      onPullFresh={refreshMessageList}
      unreadCount={!chatCollapse ? 0 : unreadMessageCount}
    />
  )
})