import {useEffect} from 'react'
import {Platform} from 'react-native'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import {daysUntil} from '../../utils'
import {
  APP_GROUP_IDENTIFIER,
  FIRST_DATE,
  MARRY_DATE,
  START_DATE,
} from '../../resources'

const WidgetTaskHandlerIos = () => {
  async function saveTargetDate() {
    try {
      const startStr = `${START_DATE.getTime()}`
      const firstStr = `${FIRST_DATE.getTime()}`
      const marryStr = `${MARRY_DATE.getTime()}`
      const imageUrl = `https://manybackgrounds.com/images/hd/pretty-cherry-blossoms-picture-awak9y5hkcqb8b3o.jpg`

      await SharedGroupPreferences.setItem(
        'startDate',
        startStr,
        APP_GROUP_IDENTIFIER,
      )
      await SharedGroupPreferences.setItem(
        'firstDate',
        firstStr,
        APP_GROUP_IDENTIFIER,
      )

      await SharedGroupPreferences.setItem(
        'marryDate',
        marryStr,
        APP_GROUP_IDENTIFIER,
      )

      await SharedGroupPreferences.setItem(
        'imageUrl',
        imageUrl,
        APP_GROUP_IDENTIFIER,
      )

      console.log('Saved date from SharedGroupPreferences')
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
