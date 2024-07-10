/**
 * @format
 */

import {LogBox} from 'react-native'
import {AppRegistry} from 'react-native'
import {registerWidgetTaskHandler} from 'react-native-android-widget'
import App from './src/App'
import {name as appName} from './app.json'
import {WidgetTaskHandler} from './src/components'

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state',
])

AppRegistry.registerComponent(appName, () => App)
registerWidgetTaskHandler(WidgetTaskHandler)
