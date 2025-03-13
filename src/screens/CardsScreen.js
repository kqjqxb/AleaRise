import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Animated,
  ScrollView,
  Modal,
  Share,
} from 'react-native';

import inspireData from '../components/inspireData';
import achivePersonsData from '../components/achivePersonsData';
import applyPersonsData from '../components/applyPersonsData';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';


const CardsScreen = ({ setSelectedAleaScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isPreviewWasVisible, setIsPreviewWasVisible] = useState(false);
  const [selectedPersonalityCategory, setSelectedPersonalityCategory] = useState('Inspire');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);

  const getDataByPersonalityCategory = (PersonalityCategory) => {
    switch (PersonalityCategory) {
      case 'Inspire':
        return inspireData;
      case 'Achieve':
        return achivePersonsData;
      case 'Apply':
        return applyPersonsData;
      default:
        return [];
    }
  };

  const data = getDataByPersonalityCategory(selectedPersonalityCategory);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedPerson(null);
    if (slidesRef.current) {
      slidesRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [data])

  const ShareAleaInspireAndAchieveInfo = async (person) => {
    try {
      if (person) {
        await Share.share({
          message: `You can learn about ${person} and his quotes in Alea Rise app!`,
        });
      }
    } catch (error) {
      console.error('Error share person:', error);
    }
  };

  const ShareAleaApplyInfo = async (person) => {
    try {
      if (person) {
        await Share.share({
          message: `Do you know about "${person}"? Read about in Alea Rise app!`,
        });
      }
    } catch (error) {
      console.error('Error share person:', error);
    }
  };

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
                fontFamily: fontPontanoSansRegular,
                color: 'black',
                fontSize: dimensions.width * 0.043,
                textAlign: 'center',
                alignSelf: 'center',
                bottom: dimensions.height * 0.005,
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
            display: 'flex',
            alignSelf: 'center',
            width: dimensions.width * 0.9,
          }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: false,
              })}
              scrollEventThrottle={32}
              ref={slidesRef}
            >
              {data.map((item, index) => {
                if (index % 2 === 0) {
                  return (
                    <View key={item.id} style={{ width: dimensions.width * 0.9, flex: 1, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }} >
                      <View style={{
                        flexDirection: 'row',
                        width: dimensions.width * 0.9,
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginTop: dimensions.height * 0.03,
                      }}>
                        <TouchableOpacity onPress={() => {
                          setSelectedPerson(data[index]);
                        }}>
                          <Image
                            source={data[index].image}
                            style={{
                              width: dimensions.width * 0.4,
                              height: dimensions.height * 0.3,
                              borderColor: 'white',
                              borderWidth: selectedPerson === data[index] ? dimensions.width * 0.01 : 0,
                              borderRadius: dimensions.width * 0.025,
                              padding: selectedPerson === data[index] ? 0 : dimensions.width * 0.01,
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
                            {data[index].person}
                          </Text>
                        </View>
                      </View>

                      {index + 1 < data.length && (
                        <View style={{
                          flexDirection: 'row',
                          width: dimensions.width * 0.9,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          marginBottom: dimensions.height * 0.03,
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
                              {data[index + 1].person}
                            </Text>
                          </View>

                          <TouchableOpacity onPress={() => {
                            setSelectedPerson(data[index + 1]);
                          }} style={{
                            marginRight: dimensions.width * 0.01,

                          }}>
                            <Image
                              source={data[index + 1].image}
                              style={{
                                width: dimensions.width * 0.4,
                                height: dimensions.height * 0.3,
                                alignSelf: 'flex-end',
                                borderColor: 'white',
                                borderWidth: selectedPerson === data[index + 1] ? dimensions.width * 0.01 : 0,
                                borderRadius: dimensions.width * 0.025,
                                padding: selectedPerson === data[index + 1] ? 0 : dimensions.width * 0.01,
                              }}
                              resizeMode='stretch'
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </ScrollView>
          </View>


        </SafeAreaView>
      )}

      <TouchableOpacity onPress={() => {
        setModalVisible(true);
      }}
        disabled={!selectedPerson}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: dimensions.width * 0.025,
          borderColor: 'white',
          width: dimensions.width * 0.8,
          borderWidth: dimensions.width * 0.003,
          backgroundColor: 'white',
          alignSelf: 'center',
          position: 'absolute',
          bottom: dimensions.height * 0.12,
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#050505',
        }}>
          {data === inspireData ? (
            <>
              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 700,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.05,
                }}>
                {selectedPerson?.person}
              </Text>

              <Image
                source={selectedPerson?.image}
                style={{
                  width: dimensions.width * 0.4,
                  height: dimensions.height * 0.3,
                  marginTop: dimensions.height * 0.03,
                  alignSelf: 'center',
                }}
                resizeMode='stretch'
              />

              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 700,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.05,
                }}>
                “{selectedPerson?.text}”
              </Text>

              <TouchableOpacity onPress={() => {
                ShareAleaInspireAndAchieveInfo(selectedPerson?.person);
              }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.025,
                  borderColor: 'white',
                  width: dimensions.width * 0.5,
                  borderWidth: dimensions.width * 0.003,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.07,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 700,
                    paddingVertical: dimensions.height * 0.016,
                  }}>
                  Share
                </Text>
                <Image
                  source={require('../assets/icons/sharePersonIcon.png')}
                  style={{
                    width: dimensions.width * 0.05,
                    height: dimensions.width * 0.05,
                    marginLeft: dimensions.width * 0.04,
                  }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          ) : data === achivePersonsData ? (
            <>
              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 700,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.16,
                }}>
                {selectedPerson?.person} - {selectedPerson?.text}
              </Text>

              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 500,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.1,
                }}>
                {selectedPerson?.fullText}
              </Text>

              <TouchableOpacity onPress={() => {
                ShareAleaInspireAndAchieveInfo(selectedPerson?.person);
              }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.025,
                  borderColor: 'white',
                  width: dimensions.width * 0.5,
                  borderWidth: dimensions.width * 0.003,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.07,
                  position: 'absolute',
                  bottom: dimensions.height * 0.19
                }}
              >
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 700,
                    paddingVertical: dimensions.height * 0.016,
                  }}>
                  Share
                </Text>
                <Image
                  source={require('../assets/icons/sharePersonIcon.png')}
                  style={{
                    width: dimensions.width * 0.05,
                    height: dimensions.width * 0.05,
                    marginLeft: dimensions.width * 0.04,
                  }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 700,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.05,
                }}>
                {selectedPerson?.person} - {selectedPerson?.text}
              </Text>

              <Text
                style={{
                  fontFamily: fontPontanoSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.037,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 500,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.05,
                }}>
                {selectedPerson?.fullText}
              </Text>

              <TouchableOpacity onPress={() => {
                ShareAleaApplyInfo(selectedPerson?.person);
              }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.025,
                  borderColor: 'white',
                  width: dimensions.width * 0.5,
                  borderWidth: dimensions.width * 0.003,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.07,
                  position: 'absolute',
                  bottom: dimensions.height * 0.19
                }}
              >
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 700,
                    paddingVertical: dimensions.height * 0.016,
                  }}>
                  Share
                </Text>
                <Image
                  source={require('../assets/icons/sharePersonIcon.png')}
                  style={{
                    width: dimensions.width * 0.05,
                    height: dimensions.width * 0.05,
                    marginLeft: dimensions.width * 0.04,
                  }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => {
            setModalVisible(false);
          }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.025,
              borderColor: 'white',
              width: dimensions.width * 0.8,
              borderWidth: dimensions.width * 0.003,
              backgroundColor: 'white',
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
              Back
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CardsScreen;
