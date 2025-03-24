import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';

const categoryButtons = ['💼 Career & Business', '💰 Finance & Wealth', '🏡 Housing & Comfort', '🚗 Transport & Tech', '🌍 Travel & Adventures', '💪 Health & Fitness', '📚 Education & Growth', '💖 Relationships & Family', '🎨 Creativity & Hobbies', '🎁 Wishes & Dreams']

const DreamBoardScreen = ({ setSelectedAleaScreen, selectedAleaScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedDreamCategory, setSelectedDreamCategory] = useState('');
  const [dreamImage, setDreamImage] = useState('');
  const [dreamText, setDreamText] = useState('');
  const [goalImage, setGoalImage] = useState('');
  const [goalText, setGoalText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addDreamVisible, setAddDreamVisible] = useState(false);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [isDreamBoardPickWasVisible, setIsDreamBoardPickWasVisible] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [selectedDreamToDelete, setSelectedDreamToDelete] = useState(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);

  const handleDreamImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled dream image picker');
      } else if (response.error) {
        console.log('DreamImagePicker Error: ', response.error);
      } else {
        setDreamImage(response.assets[0].uri);
      }
    });
  };

  const handleDeleteDream = () => {
    Alert.alert(
      "Delete dream",
      "Are you sure you want to delete this dream?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            removeDream();
          },
          style: "destructive"
        }
      ]
    );
  };

  const removeDream = async () => {
    const updatedDreams = dreams.filter(item => item.id !== selectedDreamToDelete.id);
    setDreams(updatedDreams);
    try {
      await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
      setSelectedDreamToDelete(null);
    } catch (error) {
      console.error('Error removing dream:', error);
    }
  };

  useEffect(() => {
    const loadDreamsFromStorage = async () => {
      try {
        const storedDreams = await AsyncStorage.getItem('dreams');
        if (storedDreams) {
          setDreams(JSON.parse(storedDreams));
        }
      } catch (error) {
        console.error('Error loading dreams:', error);
      }
    };

    loadDreamsFromStorage();
  }, []);

  const saveDreamToStorage = async () => {
    try {
      const dreamsToId = JSON.parse(await AsyncStorage.getItem('dreams')) || [];
      const newDreamId = dreamsToId.length > 0 ? Math.max(...dreamsToId.map(e => e.id)) + 1 : 1;
      const newDream = {
        id: newDreamId,
        dreamText: dreamText,
        dreamImage: dreamImage,
        goalText: goalText,
        goalImage: goalImage,
        dreamCategory: selectedDreamCategory,
      };

      const existingDreams = await AsyncStorage.getItem('dreams');
      const theseDreams = existingDreams ? JSON.parse(existingDreams) : [];

      theseDreams.unshift(newDream);
      setDreams(theseDreams);

      await AsyncStorage.setItem('dreams', JSON.stringify(theseDreams));
      setModalVisible(false);
      setDreamText('');
      setDreamImage('');
      setGoalText('');
      setGoalImage('');
      setSelectedDreamCategory('');
      if (isDreamBoardPickWasVisible) {
        setAddDreamVisible(false);
      }
    } catch (error) {
      console.error('Error saving dream:', error);
    }
  };

  const handleGoalImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled goal image picker');
      } else if (response.error) {
        console.log('GoalImagePicker Error: ', response.error);
      } else {
        setGoalImage(response.assets[0].uri);
      }
    });
  };

  const handleDeleteAleaRiseImage = (typeOfImage) => {
    Alert.alert(
      `Delete ${typeOfImage} image`,
      `Are you sure you want to delete ${typeOfImage} image?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            if (typeOfImage === 'dream') {
              setDreamImage('');
            } else {
              setGoalImage('');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      flex: 1
    }}>
      {dreams.length === 0 && !addDreamVisible ? (
        <>
          <Image
            source={require('../assets/images/dreamBoardImage.png')}
            style={{
              width: dimensions.width * 0.7,
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
              marginTop: dimensions.height * 0.07,
              paddingHorizontal: dimensions.width * 0.05,
            }}>
            🌟 Create your dream board and turn your desires into reality! 🌟{'\n'}

            {'\n'}Visualization helps you achieve your goals faster! Add inspiring images, quotes, and ideas, organize your dreams into categories, and keep them in sight every day. Career, travel, finances, health – everything that matters to you, all in one place. Start your journey toward your dream now! 🚀✨
          </Text>

          <TouchableOpacity
            onPress={() => {
              setAddDreamVisible(true);
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
                textAlign: 'left',
                alignSelf: 'center',
                fontWeight: 700,
              }}>
              Think Big & Go!
            </Text>
          </TouchableOpacity>
        </>
      ) : dreams.length !== 0 && !addDreamVisible ? (
        <View style={{
          alignSelf: 'center',
          height: dimensions.height * 0.82,
        }}>
          <ScrollView contentContainerStyle={{ paddingBottom: dimensions.height * 0.16 }} style={{ alignSelf: 'center', width: dimensions.width * 0.9 }}>
            {dreams.map((dream, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDreamToDelete(dream);
                  handleDeleteDream();
                }}
                key={dream.id} style={{
                  width: dimensions.width * 0.9,
                  borderColor: 'white',
                  borderWidth: dimensions.width * 0.005,
                  borderRadius: dimensions.width * 0.025,
                  paddingVertical: dimensions.height * 0.014,
                  marginTop: dimensions.height * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: fontPontanoSansRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.048,
                    marginBottom: dimensions.height * 0.01,
                    textAlign: 'center',
                    alignSelf: 'center',
                    maxWidth: dimensions.width * 0.55,
                    fontWeight: 700,
                  }}>
                  {dream.dreamCategory}
                </Text>
                <View style={{
                  borderBottomColor: 'white',
                  borderBottomWidth: dimensions.width * 0.001,
                  width: dimensions.width * 0.8,
                  alignSelf: 'center',
                  marginBottom: dimensions.height * 0.021,
                }}></View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: dimensions.width * 0.8,
                  alignSelf: 'center',
                }}>
                  <Image
                    source={{ uri: dream.dreamImage }}
                    style={{
                      width: dimensions.width * 0.2,
                      height: dimensions.width * 0.2,
                      borderRadius: dimensions.width * 0.025,
                    }}
                    resizeMode='stretch'
                  />

                  <View style={{
                    alignItems: 'center',
                    marginLeft: dimensions.width * 0.03,
                    alignSelf: 'flex-start',
                    width: dimensions.width * 0.55,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontPontanoSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.043,
                        textAlign: 'center',
                        alignSelf: 'center',
                        maxWidth: dimensions.width * 0.55,
                        fontWeight: 700,
                      }}>
                      Your Dream
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPontanoSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.037,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        maxWidth: dimensions.width * 0.55,
                        fontWeight: 500,
                      }}>
                      {dream.dreamText}
                    </Text>
                  </View>
                </View>

                <View style={{
                  width: dimensions.width * 0.8,
                  borderBottomColor: 'white',
                  borderBottomWidth: dimensions.width * 0.005,
                  alignSelf: 'center',
                  marginVertical: dimensions.height * 0.025,
                }}></View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: dimensions.width * 0.8,
                  alignSelf: 'center',
                }}>
                  <Image
                    source={{ uri: dream.goalImage }}
                    style={{
                      width: dimensions.width * 0.2,
                      height: dimensions.width * 0.2,
                      borderRadius: dimensions.width * 0.025,
                    }}
                    resizeMode='stretch'
                  />

                  <View style={{
                    alignItems: 'center',
                    marginLeft: dimensions.width * 0.03,
                    alignSelf: 'flex-start',
                    width: dimensions.width * 0.55,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontPontanoSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.043,
                        textAlign: 'center',
                        alignSelf: 'center',
                        maxWidth: dimensions.width * 0.55,
                        fontWeight: 700,
                      }}>
                      Your Goal
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPontanoSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.037,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        maxWidth: dimensions.width * 0.55,
                        fontWeight: 500,
                      }}>
                      {dream.goalText}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              setAddDreamVisible(true);
            }}
            style={{
              width: dimensions.width * 0.8,
              height: dimensions.height * 0.062,
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.025,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
              zIndex: 100,
            }}>
            <Text
              style={{
                fontFamily: fontPlusJakartaSansRegular,
                color: 'black',
                fontSize: dimensions.width * 0.043,
                textAlign: 'center',
                fontWeight: 600,
              }}>
              Add Dream
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SafeAreaView style={{
          width: dimensions.width,
          height: dimensions.height * 0.8,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
          <SafeAreaView style={{
            height: dimensions.height * 0.7,
            width: dimensions.width * 0.9,
            borderColor: 'white',
            borderWidth: dimensions.width * 0.005,
            borderRadius: dimensions.width * 0.025,
          }}>
            <Text
              style={{
                fontFamily: fontPontanoSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.04,
                marginTop: dimensions.height * 0.03,
                marginBottom: dimensions.height * 0.025,
                textAlign: 'center',
                fontWeight: 400,
              }}>
              Select Your Dream Category
            </Text>
            <View style={{
              width: dimensions.width * 0.81,
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.03,
              borderColor: 'white',
              borderWidth: dimensions.width * 0.005,
            }}>
              <TouchableOpacity
                onPress={() => {
                  setIsCategoriesVisible((prev) => !prev);
                }}
                style={{
                  width: dimensions.width * 0.8,
                  height: dimensions.height * 0.062,
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.025,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'black',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                  {selectedDreamCategory === '' ? 'Dream Categories' : selectedDreamCategory}
                </Text>

                <Image
                  source={isCategoriesVisible
                    ? require('../assets/icons/upTriangleIcon.png')
                    : require('../assets/icons/downTriangleIcon.png')
                  }
                  style={{
                    width: dimensions.width * 0.05,
                    height: dimensions.width * 0.05,
                    marginLeft: dimensions.width * 0.03,
                  }}
                  resizeMode='contain'
                />

              </TouchableOpacity>
              {isCategoriesVisible && (
                <ScrollView style={{
                  width: dimensions.width * 0.8,
                  borderRadius: dimensions.width * 0.025,
                  alignSelf: 'center',
                  backgroundColor: '#050505',
                }}>
                  {categoryButtons.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      setSelectedDreamCategory(item);
                      setIsCategoriesVisible(false);
                    }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderColor: 'white',
                        width: dimensions.width * 0.8,
                        borderBottomWidth: selectedDreamCategory === item && index !== categoryButtons.length - 1 ? dimensions.width * 0.003 : 0,
                        borderTopWidth: selectedDreamCategory === item && index !== 0 ? dimensions.width * 0.003 : 0,
                        height: dimensions.height * 0.062,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontPlusJakartaSansRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            {!isCategoriesVisible && (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                disabled={selectedDreamCategory === ''}
                style={{
                  width: dimensions.width * 0.5,
                  height: dimensions.height * 0.062,
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.025,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: dimensions.height * 0.05,
                  opacity: selectedDreamCategory === '' ? 0.5 : 1,
                }}>
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'black',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>

          {!isCategoriesVisible && (
            <TouchableOpacity
              onPress={() => {
                setAddDreamVisible(false);
              }}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.062,
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.025,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                position: 'absolute',
                bottom: 0,
              }}>
              <Text
                style={{
                  fontFamily: fontPlusJakartaSansRegular,
                  color: 'black',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'center',
                  fontWeight: 600,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

          <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#050505',
          }}>
            <View style={{
              height: dimensions.height * 0.77,
              width: dimensions.width * 0.9,
              borderColor: 'white',
              borderWidth: dimensions.width * 0.005,
              borderRadius: dimensions.width * 0.025,
              alignSelf: 'center',
            }}>
              <Text
                style={{
                  fontFamily: fontPlusJakartaSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.03,
                  fontWeight: 600,
                }}>
                {selectedDreamCategory}
              </Text>

              {!isDreamBoardPickWasVisible ? (
                <>
                  <Text
                    style={{
                      fontFamily: fontPlusJakartaSansRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'center',
                      alignSelf: 'center',
                      marginTop: dimensions.height * 0.03,
                      fontWeight: 500,
                    }}>
                    Your Dream
                  </Text>

                  {dreamImage === '' || !dreamImage ? (
                    <TouchableOpacity
                      onPress={() => handleDreamImagePicker()}
                      style={{
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        borderWidth: dimensions.width * 0.005,
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.4,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.01,
                      }}>

                      <View style={{
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.1,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.025,
                        position: 'absolute',
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontPlusJakartaSansRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            alignSelf: 'center',

                            fontWeight: 500,
                          }}>
                          Add photo
                        </Text>

                        <Image
                          source={require('../assets/icons/plusInSquareIcon.png')}
                          style={{
                            width: dimensions.width * 0.05,
                            height: dimensions.width * 0.05,
                            marginLeft: dimensions.width * 0.02,
                          }}
                          resizeMode='contain'
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        handleDeleteAleaRiseImage('dream');
                      }}
                      style={{
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        borderWidth: dimensions.width * 0.005,
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.4,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.01,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{ uri: dreamImage }}
                        style={{
                          width: dimensions.width * 0.39,
                          height: dimensions.width * 0.39,
                          borderRadius: dimensions.width * 0.025,
                          alignSelf: 'center',
                        }}
                        resizeMode='stretch'
                      />

                      <View style={{
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.1,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.025,
                        position: 'absolute',
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontPlusJakartaSansRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            alignSelf: 'center',

                            fontWeight: 500,
                          }}>
                          Delete photo
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <TextInput
                    placeholder="Type your dream here"
                    value={dreamText}
                    onChangeText={setDreamText}
                    placeholderTextColor="rgba(237, 237, 237, 0.85)"
                    placeholderTextSize={dimensions.width * 0.03}
                    multiline={true}
                    textAlignVertical="top"
                    style={{
                      maxWidth: dimensions.width * 0.8,
                      padding: dimensions.width * 0.03,
                      fontFamily: fontPontanoSansRegular,
                      fontSize: dreamText.length > 0 ? dimensions.width * 0.043 : dimensions.width * 0.037,
                      color: 'white',
                      height: dimensions.height * 0.14,
                      alignSelf: 'center',
                      width: dimensions.width * 0.8,
                      borderColor: 'white',
                      borderWidth: dimensions.width * 0.005,
                      borderRadius: dimensions.width * 0.025,
                      marginTop: dimensions.height * 0.1,
                    }}
                  />

                  <TouchableOpacity onPress={() => {
                    setIsDreamBoardPickWasVisible(true);
                  }}
                    disabled={dreamText === '' || dreamImage === ''}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: dimensions.width * 0.025,
                      borderColor: 'white',
                      width: dimensions.width * 0.5,
                      borderWidth: dimensions.width * 0.003,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      position: 'absolute',
                      bottom: dimensions.height * 0.05,
                      opacity: dreamText === '' || dreamImage === '' ? 0.5 : 1,
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
                      Next
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontFamily: fontPlusJakartaSansRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'center',
                      alignSelf: 'center',
                      marginTop: dimensions.height * 0.03,
                      fontWeight: 500,
                    }}>
                    Your Goal
                  </Text>

                  {goalImage === '' || !goalImage ? (
                    <TouchableOpacity
                      onPress={() => handleGoalImagePicker()}
                      style={{
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        borderWidth: dimensions.width * 0.005,
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.4,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.01,
                      }}>

                      <View style={{
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.1,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.025,
                        position: 'absolute',
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontPlusJakartaSansRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            alignSelf: 'center',

                            fontWeight: 500,
                          }}>
                          Add photo
                        </Text>

                        <Image
                          source={require('../assets/icons/plusInSquareIcon.png')}
                          style={{
                            width: dimensions.width * 0.05,
                            height: dimensions.width * 0.05,
                            marginLeft: dimensions.width * 0.02,
                          }}
                          resizeMode='contain'
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        handleDeleteAleaRiseImage('goal');
                      }}
                      style={{
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        borderWidth: dimensions.width * 0.005,
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.4,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.01,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{ uri: goalImage }}
                        style={{
                          width: dimensions.width * 0.39,
                          height: dimensions.width * 0.39,
                          borderRadius: dimensions.width * 0.025,
                          alignSelf: 'center',
                        }}
                        resizeMode='stretch'
                      />

                      <View style={{
                        width: dimensions.width * 0.4,
                        height: dimensions.width * 0.1,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.025,
                        position: 'absolute',
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontPlusJakartaSansRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            alignSelf: 'center',

                            fontWeight: 500,
                          }}>
                          Delete photo
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <TextInput
                    placeholder="Type your dream here"
                    value={goalText}
                    onChangeText={setGoalText}
                    placeholderTextColor="rgba(237, 237, 237, 0.85)"
                    placeholderTextSize={dimensions.width * 0.03}
                    multiline={true}
                    textAlignVertical="top"
                    style={{
                      maxWidth: dimensions.width * 0.8,
                      padding: dimensions.width * 0.03,
                      fontFamily: fontPontanoSansRegular,
                      fontSize: goalText.length > 0 ? dimensions.width * 0.043 : dimensions.width * 0.037,
                      color: 'white',
                      height: dimensions.height * 0.14,
                      alignSelf: 'center',
                      width: dimensions.width * 0.8,
                      borderColor: 'white',
                      borderWidth: dimensions.width * 0.005,
                      borderRadius: dimensions.width * 0.025,
                      marginTop: dimensions.height * 0.1,
                    }}
                  />

                  <TouchableOpacity onPress={saveDreamToStorage}
                    disabled={goalText === '' || goalImage === ''}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: dimensions.width * 0.025,
                      borderColor: 'white',
                      width: dimensions.width * 0.5,
                      borderWidth: dimensions.width * 0.003,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      position: 'absolute',
                      bottom: dimensions.height * 0.05,
                      opacity: goalText === '' || goalImage === '' ? 0.5 : 1,
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
                      Save
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <TouchableOpacity onPress={() => {
              if (isDreamBoardPickWasVisible) {
                setIsDreamBoardPickWasVisible(false);
              } else {
                setModalVisible(false);
                setDreamText('');
                setDreamImage('');
                setGoalText('');
                setGoalImage('');
                setSelectedDreamCategory('');
                setIsCategoriesVisible(false);
              }
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
                bottom: dimensions.height * 0.05,
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
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default DreamBoardScreen;
