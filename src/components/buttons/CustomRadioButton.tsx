import React, {memo} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../../utils'
import {CustomRadioButtonProps} from '../../types/ComponentTypes'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

const CustomRadioButton: React.FC<CustomRadioButtonProps> = memo(
  ({onPress, value, text}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View>
          <Text style={styles.titleText}>{text}</Text>
        </View>

        <View>
          {value ? (
            <Icon
              name="check-square"
              size={normalize(24)}
              color={colors.c242424}
            />
          ) : (
            <Icon name="square" size={normalize(24)} color={colors.c242424} />
          )}
        </View>
      </TouchableOpacity>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: normalize(52),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  titleText: {
    ...fonts.bmjua16,
  },
})

export default CustomRadioButton
