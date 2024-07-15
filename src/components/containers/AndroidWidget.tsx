import React from 'react'
import {
  FlexWidget,
  ImageWidget,
  OverlapWidget,
  TextWidget,
} from 'react-native-android-widget'
import {daysUntil, normalize} from '../../utils'
import {START_DATE} from '../../resources'
import {Dimensions} from 'react-native'

const AndroidWidget = () => {
  const {width, height} = Dimensions.get('window')
  const dateStr = `${daysUntil(START_DATE)}`
  const horizonPixel = width / 4
  const VerticalPixel = height / 8
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
      <OverlapWidget>
        <ImageWidget
          image={
            'https://manybackgrounds.com/images/hd/pretty-cherry-blossoms-picture-awak9y5hkcqb8b3o.jpg'
          }
          imageWidth={horizonPixel * 4}
          imageHeight={VerticalPixel * 2 + normalize(39)}
          style={{width: 'match_parent', height: 'match_parent'}}
        />
        <TextWidget
          text={`${dateStr}FㅇㄹㄴUFU`}
          style={{
            fontSize: 32,
            fontFamily: 'Inter',
            color: '#000000',
          }}
        />
      </OverlapWidget>
    </FlexWidget>
  )
}

export default AndroidWidget
