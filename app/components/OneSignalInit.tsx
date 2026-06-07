'use client'

import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: 'e4019aab-d232-4083-a13f-fe2061fe438e',
      safari_web_id: '',
      notifyButton: {
        enable: true,
        size: 'medium',
        position: 'bottom-right',
        text: {
          'tip.state.unsubscribed': '새 글 알림 받기',
          'tip.state.subscribed': '알림 구독 중',
          'tip.state.blocked': '알림이 차단되어 있어요',
          'message.prenotify': '새 세계사 이야기를 알려드릴게요!',
          'message.action.subscribed': '구독해 주셔서 감사합니다!',
          'message.action.resubscribed': '알림이 다시 활성화되었습니다.',
          'message.action.unsubscribed': '알림을 해제했습니다.',
          'dialog.main.title': '알림 설정',
          'dialog.main.button.subscribe': '구독하기',
          'dialog.main.button.unsubscribe': '구독 취소',
          'dialog.blocked.title': '알림 허용 필요',
          'dialog.blocked.message': '브라우저 설정에서 알림을 허용해 주세요.',
        },
      },
      allowLocalhostAsSecureOrigin: true,
    })
  }, [])

  return null
}
