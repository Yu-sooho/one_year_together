import React from 'react'
import type {WidgetTaskHandlerProps} from 'react-native-android-widget'
import {AndroidWidget} from '../containers'

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  DefaultWidget: AndroidWidget,
}

const WidgetTaskHandler = (props: WidgetTaskHandlerProps) => {
  const widgetInfo = props.widgetInfo
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget]
  const {width, height} = widgetInfo

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget width={width} height={height} />)
      break

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget width={width} height={height} />)
      // Not needed for now
      break

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget width={width} height={height} />)
      break

    case 'WIDGET_DELETED':
      // Not needed for now
      break

    case 'WIDGET_CLICK':
      // Not needed for now
      break

    default:
      break
  }
}

export default WidgetTaskHandler
