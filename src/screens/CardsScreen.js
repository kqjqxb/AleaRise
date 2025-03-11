import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Sound from 'react-native-sound';

import inspireData from '../components/inspireData';

const fontDMSansRegular = 'DMSans18pt-Regular';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';


const CardsScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isPreviewWasVisible, setIsPreviewWasVisible] = useState(false);
  const [selectedPersonalityCategory, setSelectedPersonalityCategory] = useState('Inspire');

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      flex: 1
    }}>
      {!isPreviewWasVisible ? (
        <>
          <Image
            source={require('../assets/images/cardsPreviewImage.png')}
            style={{
              width: dimensions.width * 0.8,
              height: dimensions.height * 0.3,
              alignSelf: 'center',
            }}
            resizeMode='stretch'
          />
          <Text
            style={{
              fontFamily: fontPlusJakartaSansRegular,
              color: 'white',
              fontSize: dimensions.width * 0.037,
              textAlign: 'left',
              fontWeight: 300,
              marginTop: dimensions.height * 0.05,
              paddingHorizontal: dimensions.width * 0.05,
            }}>
            📌 Inspiration, success, and wisdom - all in one place!
            {'\n'}Every day, you’ll find:{'\n'}

            {'\n'}💬 Quotes – wise words from great minds that make you think.
            {'\n'}🏆 Success Stories – real-life examples of overcoming challenges and achieving goals.
            {'\n'}🎯 Practical Tips – short insights you can apply right away.{'\n'}

            Let each day start with motivation and inspiration! 🚀
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsPreviewWasVisible(true);
            }}
            style={{
              width: dimensions.width * 0.8,
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.025,
              height: dimensions.height * 0.061,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.111,
              zIndex: 1000,
            }}>
            <Text
              style={{
                fontFamily: fontDMSansRegular,
                color: 'black',
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
                alignSelf: 'center',
                fontWeight: 700,
              }}>
              Rise & Start!
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <SafeAreaView style={{
          flex: 1,
          height: dimensions.height,
          width: dimensions.width,
        }}>
          <SafeAreaView style={{
            backgroundColor: '#0D0D0D',
            width: dimensions.width * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            width: dimensions.width * 0.9,
          }}>
            {['Inspire', 'Achieve', 'Apply'].map((item, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedPersonalityCategory(item);
              }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.025,
                  borderColor: 'white',
                  width: dimensions.width * 0.28,
                  borderWidth: dimensions.width * 0.003,
                  backgroundColor: selectedPersonalityCategory === item ? 'white' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: selectedPersonalityCategory === item ? 'black' : 'white',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 600,
                    paddingVertical: dimensions.height * 0.016,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>


          <View style={{
            flexDirection: 'row',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            marginTop: dimensions.height * 0.03,
          }}>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/personalities/pers2.png')}
                style={{
                  width: dimensions.width * 0.4,
                  height: dimensions.height * 0.3,
                }}
                resizeMode='stretch'
              />
            </TouchableOpacity>

            <View style={{
              width: dimensions.width * 0.4,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <Text
                style={{
                  fontFamily: fontPlusJakartaSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  fontWeight: 600,
                  paddingVertical: dimensions.height * 0.016,
                  maxWidth: dimensions.width * 0.4,
                  left: dimensions.width * 0.037,
                }}>
                Eleanor Roosevelt
              </Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: dimensions.height * 0.03,
          }}>
            <View style={{
              width: dimensions.width * 0.4,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <Text
                style={{
                  fontFamily: fontPlusJakartaSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  fontWeight: 600,
                  paddingVertical: dimensions.height * 0.016,
                  maxWidth: dimensions.width * 0.4,
                  right: dimensions.width * 0.04,
                }}>
                Steve Jobs
              </Text>
            </View>

            <TouchableOpacity>
              <Image
                source={require('../assets/images/personalities/pers1.png')}
                style={{
                  width: dimensions.width * 0.4,
                  height: dimensions.height * 0.3,
                  alignSelf: 'flex-end',
                }}
                resizeMode='stretch'
              />

            </TouchableOpacity>
          </View>

          <TouchableOpacity  onPress={() => {
          }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.025,
              borderColor: 'white',
              width: dimensions.width * 0.8,
              borderWidth: dimensions.width * 0.003,
              backgroundColor:  'white',
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.08,
            }}
          >
            <Text
              style={{
                fontFamily: fontPlusJakartaSansRegular,
                color: 'black',
                fontSize: dimensions.width * 0.043,
                textAlign: 'center',
                fontWeight: 600,
                paddingVertical: dimensions.height * 0.016,
              }}>
              Unveil Insights
            </Text>
          </TouchableOpacity>


        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default CardsScreen;
