import React from 'react'
import {
  FlexWidget,
  ImageWidget,
  OverlapWidget,
  TextWidget,
} from 'react-native-android-widget'
import {daysUntil, normalize} from '../../utils'
import {images, START_DATE} from '../../resources'
import {Dimensions} from 'react-native'
import fonts from '../../styles/fonts'

interface AndroidWidgetProps {
  width: number
  height: number
}

const AndroidWidget = ({width, height}: AndroidWidgetProps) => {
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
          image={images.default_letter}
          imageWidth={width}
          imageHeight={height}
          style={{width: 'match_parent', height: 'match_parent'}}
        />
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 'match_parent',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <FlexWidget
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              padding: 24,
            }}>
            <TextWidget
              text={`사랑한지`}
              style={{
                ...fonts.bmjua14,
                fontSize: 20,
                color: '#ffffff',
              }}
            />
          </FlexWidget>
          <FlexWidget
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              padding: 24,
            }}>
            <FlexWidget
              style={{
                width: 'match_parent',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TextWidget
                text={`${dateStr}`}
                style={{
                  ...fonts.bmjua14,
                  fontSize: 40,
                  color: '#ffffff',
                }}
              />
              <TextWidget
                text={`일째`}
                style={{
                  ...fonts.bmjua14,
                  fontSize: 20,
                  color: '#ffffff',
                }}
              />
            </FlexWidget>
          </FlexWidget>
        </FlexWidget>
      </OverlapWidget>
    </FlexWidget>
  )
}

export default AndroidWidget
