import React, { useEffect, useState } from 'react';
import {  Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);



  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#050505', height: dimensions.height }}
    >
      <Image
        resizeMode='contain'
        style={{
          width: dimensions.width * 0.3,
          height: dimensions.width * 0.3,
          marginTop: dimensions.height * 0.03,
          alignSelf: 'center',
        }}
        source={require('../assets/images/aleaTextLaunchingImahe.png')}
      />
      <Text
        style={{
          fontFamily: fontPontanoSansRegular,
          fontSize: dimensions.width * 0.043,
          paddingHorizontal: dimensions.width * 0.05,
          alignSelf: 'flex-start',
          color: 'white',
          textAlign: 'left',
          fontWeight: 500,
          marginTop: dimensions.height * 0.03,
        }}>
        {'\n'}🌟Alea Rise is an app for those who want to grow, break limits, and fill life with new challenges.{'\n'}

        {'\n'}🔹 Random Challenges – Choose a category (personal growth, health, career, etc.) and receive a task to push you out of your comfort zone.
        {'\n'}🔹 Source of Inspiration – Quotes, success stories, and practical tips to keep you motivated.
        {'\n'}🔹 Vision Board – Create your dream map by adding images and goals.
        {'\n'}🔹 Mini-Game – A dynamic challenge to test your reaction, focus, and agility.{'\n'}

        🚀 Alea Rise – Unlock new possibilities every day!
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.replace('LoadingAleaScreen');
        }}
        style={{
          position: 'absolute',
          bottom: dimensions.height * 0.08,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: dimensions.width * 0.019,
          backgroundColor: 'white',
          paddingVertical: dimensions.width * 0.034,
          width: dimensions.width * 0.77,
        }}
      >
        <Text
          style={{
            fontFamily: fontPlusJakartaSansRegular,
            color: 'black',
            fontSize: dimensions.width * 0.05,
            textAlign: 'center', fontWeight: 600
          }}>
          Rise On!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
