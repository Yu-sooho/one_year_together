import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import fonts from './styles/fonts';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={fonts.bmjua24}>안녕하세요</Text>     
       <Text style={fonts.nanumgn24}>안녕하세요</Text>
       <Text style={fonts.nanumgy24}>안녕하세요</Text>
       <Text style={{fontSize:24}}>안녕하세요</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
