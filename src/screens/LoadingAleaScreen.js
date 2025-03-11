import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Text, Image, Dimensions,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingAleaScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();

  const fontInterRegular = 'Inter18pt-Regular';

  const [loadCrovvns, setLoadCrovvns] = useState(0);
  const [percentage, setPercentage] = useState(0);


  useEffect(() => {
    if (percentage < 100) {
      const timer = setTimeout(() => {
        setPercentage(percentage + 1);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      navigation.replace('Home');
    }
  }, [percentage]);



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#090909' }}>
      <Image
        resizeMode='contain'
        style={{
          width: dimensions.width * 0.8,
          height: dimensions.width * 0.8,

        }}
        source={require('../assets/images/aleaLaunchingImage.png')}
      />
      <Image
        resizeMode='contain'
        style={{
          width: dimensions.width * 0.3,
          height: dimensions.width * 0.3,
          marginTop: dimensions.height * 0.03,

        }}
        source={require('../assets/images/aleaTextLaunchingImahe.png')}
      />

      <View style={{
        position: 'absolute',
        bottom: dimensions.height * 0.1,
        width: dimensions.width * 0.9,
        height: dimensions.height * 0.004,
        backgroundColor: '#484848',
        borderRadius: dimensions.width * 0.01,
        overflow: 'hidden',
      }}>
        <View style={{
          width: dimensions.width * 0.9 * (percentage / 100),
          height: dimensions.height * 0.004,
          backgroundColor: 'white',
          borderRadius: dimensions.width * 0.01,
        }}>
        </View>
      </View>
    </View>
  );
};

export default LoadingAleaScreen;