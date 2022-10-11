import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const Test = ({navigation}) => {
  return (
    <SafeAreaView>
      <View>
        <Text>Welcome to the Test page!</Text>
      </View>
    </SafeAreaView>
  )
}

export default Test;
