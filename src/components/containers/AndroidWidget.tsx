import React from 'react'
import {FlexWidget, TextWidget} from 'react-native-android-widget'
import {daysUntil} from '../../utils'
import {START_DATE} from '../../resources'

const AndroidWidget = () => {
  const dateStr = `${daysUntil(START_DATE)}`

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}>
      <TextWidget
        text={`${dateStr}FUFU`}
        style={{
          fontSize: 32,
          fontFamily: 'Inter',
          color: '#000000',
        }}
      />
    </FlexWidget>
  )
}

export default AndroidWidget
