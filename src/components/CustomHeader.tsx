import React, {useCallback} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../utils'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import {CustomHeaderProps} from '../types/ComponentTypes'

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  buttonText,
  titleStyle,
  containerStyle,
  onPressButton,
}) => {
  const navigation = useNavigation()

  const onPressBack = useCallback(() => {
    navigation.goBack()
  }, [])

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
        <Icon name="arrow-left" size={normalize(24)} color={colors.c242424} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      <TouchableOpacity onPress={onPressButton} style={styles.backButton}>
        {buttonText}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalize(50),
    backgroundColor: colors.cffffff,
    paddingHorizontal: normalize(8),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...fonts.bmjua20,
  },
})

export default CustomHeader
