import React from 'react'
import {
  FlexWidget,
  ImageWidget,
  OverlapWidget,
  TextWidget,
} from 'react-native-android-widget'
import {daysUntil} from '../../utils'
import {images, START_DATE} from '../../resources'
import fonts from '../../styles/fonts'
import {Dimensions} from 'react-native'

interface AndroidWidgetProps {
  width: number
  height: number
}

const AndroidWidget = ({width, height}: AndroidWidgetProps) => {
  const dateStr = `${daysUntil(START_DATE)}`
  const image = () => {
    if (width < Dimensions.get('window').width / 2)
      return images.widget_image_por
    if (width < Dimensions.get('window').width / 1.5) return images.wigdet_image
    const temp = Math.floor(Math.random() * 10) + 1
    if (temp > 5) {
      return images.wigdet_image_wide1
    }
    return images.wigdet_image_wide2
  }
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
          image={image()}
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
          {width > Dimensions.get('window').width / 2 ? (
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
          ) : (
            <FlexWidget
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: 24,
              }}
            />
          )}
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
                  fontSize:
                    width > Dimensions.get('window').width / 2 ? 40 : 22,
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
