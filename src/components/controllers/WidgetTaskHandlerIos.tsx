import {useEffect} from 'react'
import {Platform} from 'react-native'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import {daysUntil} from '../../utils'
import {APP_GROUP_IDENTIFIER, START_DATE} from '../../resources'

const WidgetTaskHandlerIos = () => {
  async function saveTargetDate() {
    try {
      const dateStr = `${START_DATE.getTime()}`

      await SharedGroupPreferences.setItem(
        'startDate',
        dateStr,
        APP_GROUP_IDENTIFIER,
      )

      const savedDate = await SharedGroupPreferences.getItem(
        'startDate',
        APP_GROUP_IDENTIFIER,
      )

      console.log('Saved date from SharedGroupPreferences:', savedDate)
    } catch (error) {
      console.error('Error saving target date', error)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'ios') saveTargetDate()
  }, [])
  return null
}

export default WidgetTaskHandlerIos
