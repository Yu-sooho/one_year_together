import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback} from 'react'
import {View, Text, Button} from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'
import {usePermissionStore} from '../stores'

type EditLetterScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EditLetterScreen'
>
type EditLetterScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EditLetterScreen'
>

type Props = {
  navigation: EditLetterScreenNavigationProp
  route: EditLetterScreenRouteProp
}

const EditLetterScreen: React.FC<Props> = ({navigation, route}) => {
  const checkPermission = usePermissionStore(state => state.checkPermission)
  const openPermissionModal = usePermissionStore(
    state => state.openPermissionModal,
  )

  const openPicker = useCallback(async () => {
    const isHaveNoPermission = await checkPermission()
    if (isHaveNoPermission?.length > 0) {
      openPermissionModal(navigation)
    } else {
      ImageCropPicker.openPicker({})
    }
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>EditLetterScreen</Text>
      <Button title="Go to Event List" onPress={openPicker} />
    </View>
  )
}

export default EditLetterScreen
