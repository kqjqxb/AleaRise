import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './SettingsScreen';
import { ScrollView } from 'react-native-gesture-handler';
import CardsScreen from './CardsScreen';
import LoadingAleaScreen from './LoadingAleaScreen';
import aleaChallengesData from '../components/aleaChallengesData';
import DreamBoardScreen from './DreamBoardScreen';
import RunGameScreen from './RunGameScreen';

const fontMontserratRegular = 'Montserrat-Regular';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';

const bottomBtns = [
  {
    id: 2,
    screen: 'RunGame',
    aleaIcon: require('../assets/icons/aleaBtnIcons/runGameIcon.png'),
  },
  {
    id: 3,
    screen: 'DreamBoard',
    aleaIcon: require('../assets/icons/aleaBtnIcons/dreamBoardIcon.png'),
  },
  {
    id: 1,
    screen: 'Home',
    aleaIcon: require('../assets/icons/aleaBtnIcons/mainPageIcon.png'),
  },
  {
    id: 4,
    screen: 'Cards',
    aleaIcon: require('../assets/icons/aleaBtnIcons/cardsIcon.png'),
  },
  {
    id: 5,
    screen: 'Settings',
    aleaIcon: require('../assets/icons/aleaBtnIcons/aleaSettingsIcon.png'),
  },
]

const formatAleaRiseDate = (date) => {
  if (!date) return 'Date';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedAleaScreen, setSelectedAleaScreen] = useState('Home');

  const [isRunGameStarted, setIsRunGameStarted] = useState(false);

  const [selectedUpBtn, setSelectedUpBtn] = useState('Challenge');
  const [isDifficultWasVisible, setIsDifficultWasVisible] = useState(false);
  const [isBeginWasVisible, setIsBeginWasVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedChallengeCategory, setSelectedChallengeCategory] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isVibrationEnabled, setVibrationEnabled] = useState(false);
  const [growthJournal, setGrowthJournal] = useState([]);

  const loadAleaRiseSettings = async () => {
    try {
      const notificationAleaRiseValue = await AsyncStorage.getItem('isVibrationEnabled');
      if (notificationAleaRiseValue !== null) setVibrationEnabled(JSON.parse(notificationAleaRiseValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    loadAleaRiseSettings();
  }, [isVibrationEnabled, selectedAleaScreen]);

  const saveCurrentChallenge = async (challenge) => {
    try {
      await AsyncStorage.setItem('currentChallenge', JSON.stringify(challenge));
    } catch (error) {
      console.error('Error saving currentChallenge:', error);
    }
  };

  useEffect(() => {
    setIsBeginWasVisible(false);
    setIsDifficultWasVisible(false);
    setSelectedDifficulty('');
    setSelectedChallengeCategory('');
  }, [selectedAleaScreen]);

  useEffect(() => {
    const loadCurrentChallenge = async () => {
      try {
        const storedChallenge = await AsyncStorage.getItem('currentChallenge');
        if (storedChallenge) {
          setCurrentChallenge(JSON.parse(storedChallenge));
        }
      } catch (error) {
        console.error('Error loading currentChallenge:', error);
      }
    };

    loadCurrentChallenge();

  }, [selectedAleaScreen]);

  useEffect(() => {
    let interval;
    if (currentChallenge) {
      interval = setInterval(() => {
        const activeChallenge = currentChallenge.challenges.find(challenge => challenge.status === 'accept');
        if (activeChallenge) {
          setElapsedTime(getElapsedTime(activeChallenge.startTime));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentChallenge, elapsedTime]);

  const handleAcceptChallenge = async (index) => {
    if (isVibrationEnabled) {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    const updatedChallenges = [...currentChallenge.challenges];

    if (updatedChallenges[index].status !== 'done') {
      updatedChallenges[index].status = 'done';
      updatedChallenges[index].endTime = new Date().toISOString();
      updatedChallenges[index].elapsedTime = getElapsedTime(updatedChallenges[index].startTime);
    }

    const activeChallenge = updatedChallenges.find(ch => ch.status === 'accept');
    if (!activeChallenge) {
      const nextIndex = updatedChallenges.findIndex((ch, i) => i > index && ch.status !== 'done');
      if (nextIndex !== -1) {
        updatedChallenges[nextIndex].status = 'accept';
        updatedChallenges[nextIndex].startTime = new Date().toISOString();
        setElapsedTime('00:00:00');
      } else {
        const firstNotDone = updatedChallenges.findIndex(ch => ch.status !== 'done');
        if (firstNotDone !== -1) {
          updatedChallenges[firstNotDone].status = 'accept';
          updatedChallenges[firstNotDone].startTime = new Date().toISOString();
          setElapsedTime('00:00:00');
        }
      }
    }

    const updatedCurrentChallenge = {
      ...currentChallenge,
      challenges: updatedChallenges,
    };

    setCurrentChallenge(updatedCurrentChallenge);
    await saveCurrentChallenge(updatedCurrentChallenge);

    if (updatedChallenges.every(challenge => challenge.status === 'done')) {
      const completedEntry = {
        challenges: updatedChallenges,
        allCompletedDate: new Date().toISOString(),
      };

      try {
        const storedJournal = await AsyncStorage.getItem('growthJournal');
        const growthJournal = storedJournal ? JSON.parse(storedJournal) : [];
        growthJournal.unshift(completedEntry);
        await AsyncStorage.setItem('growthJournal', JSON.stringify(growthJournal));
        loadGrowthJournal();
        setCurrentChallenge(null);
        setIsBeginWasVisible(false);
        setIsDifficultWasVisible(false);
        setSelectedDifficulty('');
        setSelectedChallengeCategory('');
        setElapsedTime('00:00:00');
      } catch (error) {
        console.error('Error saving to growthJournal:', error);
      }

      await AsyncStorage.removeItem('currentChallenge');
      setCurrentChallenge(null);
    }
  };

  const loadGrowthJournal = async () => {
    try {
      const storedJournal = await AsyncStorage.getItem('growthJournal');
      const parsedJournal = storedJournal ? JSON.parse(storedJournal) : [];
      setGrowthJournal(parsedJournal);
    } catch (error) {
      console.error('Error loading growthJournal:', error);
    }
  };

  useEffect(() => {
    loadGrowthJournal();
  }, []);

  const getElapsedTime = (startTime) => {
    if (!startTime) return '00:00:00';

    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={{
      backgroundColor: '#050505',
      flex: 1,
      height: dimensions.height,
      width: dimensions.width,
    }}>
      {selectedAleaScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
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
            {['Challenge', 'Growth journal'].map((item, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedUpBtn(item);
              }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.025,
                  borderColor: 'white',
                  width: dimensions.width * 0.43,
                  borderWidth: dimensions.width * 0.003,
                  backgroundColor: selectedUpBtn === item ? 'white' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: selectedUpBtn === item ? 'black' : 'white',
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

          {selectedUpBtn === 'Challenge' ? (
            !currentChallenge ? (
              !isDifficultWasVisible && !isBeginWasVisible ? (
                <View style={{
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.03,
                }}>
                  <Image
                    source={require('../assets/images/mainImage.png')}
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.28,
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
                    }}>
                    Choose a category and receive a random challenge to help you grow! Improve yourself in different areas of life – Personal Growth 💡, Health & Fitness 🏋️, Productivity 📈, Social Skills 🗣️, Creativity 🎨, and Education 📚.

                    {'\n'}{'\n'}Each challenge is a chance to step out of your comfort zone, try something new, and discover new possibilities within yourself. Accept the challenge and move forward! 💪🔥
                  </Text>

                </View>
              ) : isBeginWasVisible && !isDifficultWasVisible ? (
                <View style={{
                  width: dimensions.width,
                  alignSelf: 'center',
                }}>
                  <Text
                    style={{
                      fontFamily: fontPlusJakartaSansRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'center',
                      fontWeight: 300,
                      marginTop: dimensions.height * 0.1,
                      marginBottom: dimensions.height * 0.07,
                      paddingHorizontal: dimensions.width * 0.05,
                    }}>
                    Before receiving a challenge, you can choose the difficulty level
                  </Text>
                  {['Easy', 'Medium', 'Hard'].map((difficulty, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      setSelectedDifficulty(difficulty);
                    }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        width: dimensions.width * 0.8,
                        borderWidth: dimensions.width * 0.003,
                        backgroundColor: selectedDifficulty === difficulty ? 'white' : 'transparent',
                        alignSelf: 'center',
                        marginBottom: dimensions.height * 0.019,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontPlusJakartaSansRegular,
                          color: selectedDifficulty === difficulty ? 'black' : 'white',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600,
                          paddingVertical: dimensions.height * 0.016,
                        }}>
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <>
                  <Text
                    style={{
                      fontFamily: fontPlusJakartaSansRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'center',
                      fontWeight: 300,
                      marginTop: dimensions.height * 0.03,
                      marginBottom: dimensions.height * 0.04,
                      paddingHorizontal: dimensions.width * 0.05,
                    }}>
                    Choose a category and receive a challenge from various areas of life.
                  </Text>
                  {['📌 Personal Growth', '📌 Health and Fitness', '📌 Career and Productivity', '📌 Social Skills', '📌 Creativity', '📌 Education'].map((category, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      setSelectedChallengeCategory(category);
                    }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.025,
                        borderColor: 'white',
                        width: dimensions.width * 0.8,
                        borderWidth: dimensions.width * 0.003,
                        backgroundColor: selectedChallengeCategory === category ? 'white' : 'transparent',
                        marginBottom: dimensions.height * 0.019,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontPlusJakartaSansRegular,
                          color: selectedChallengeCategory === category ? 'black' : 'white',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600,
                          paddingVertical: dimensions.height * 0.016,
                        }}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )
            ) : (
              <>
                <View style={{ marginTop: dimensions.height * 0.021, }}></View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                  paddingTop: dimensions.height * 0.05,
                  paddingBottom: dimensions.height * 0.1,
                }} style={{}}>

                  {currentChallenge && currentChallenge.challenges.map((challenge, index) => (
                    index === 0 || currentChallenge.challenges[index - 1].status === 'done' ? (
                      <View key={index} style={{
                        alignSelf: 'center',
                        width: dimensions.width,
                      }}>
                        <View key={index} style={{
                          width: dimensions.width * 0.9,
                          alignSelf: 'center',
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: dimensions.width * 0.9,
                            alignSelf: 'center',
                          }}>
                            <View style={{
                              width: dimensions.width * 0.1,
                              height: dimensions.width * 0.1,
                              borderRadius: dimensions.width * 0.012,
                              backgroundColor: 'white',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Text
                                style={{
                                  fontFamily: fontPlusJakartaSansRegular,
                                  color: 'black',
                                  fontSize: dimensions.width * 0.043,
                                  textAlign: 'center',
                                  fontWeight: 600,
                                }}>
                                {challenge.id}
                              </Text>
                            </View>
                            <View style={{ marginLeft: dimensions.width * 0.03, top: -dimensions.height * 0.005 }}>

                              <Text
                                style={{
                                  fontFamily: fontPontanoSansRegular,
                                  color: 'white',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'left',
                                  fontWeight: 500,
                                  maxWidth: dimensions.width * 0.7,
                                }}>
                                {challenge.title}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: fontPontanoSansRegular,
                                  color: 'white',
                                  fontSize: dimensions.width * 0.04,
                                  textAlign: 'left',
                                  fontWeight: 500,
                                  maxWidth: dimensions.width * 0.7,
                                }}>
                                {challenge.description}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={{
                          width: dimensions.width * 0.9,
                          alignSelf: 'center',
                          marginTop: dimensions.height * 0.019,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: dimensions.height * 0.025,
                        }}>
                          <TouchableOpacity
                            disabled={challenge.status === 'done'}
                            onPress={() => handleAcceptChallenge(index)}
                            style={{
                              width: dimensions.width * 0.43,
                              backgroundColor: challenge.status === 'done' ? '#FB8A8A' : '#9FE7B3',
                              borderRadius: dimensions.width * 0.025,
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: dimensions.height * 0.05,
                            }}>
                            <Text
                              style={{
                                fontFamily: fontPlusJakartaSansRegular,
                                color: 'black',
                                fontSize: dimensions.width * 0.04,
                                textAlign: 'left',
                                fontWeight: 600,
                                maxWidth: dimensions.width * 0.7,
                              }}>
                              {challenge.status === 'done' ? 'Done' : 'Accept'}
                            </Text>
                          </TouchableOpacity>

                          <View style={{
                            width: dimensions.width *
                              0.43,
                            backgroundColor: 'white',
                            borderRadius: dimensions.width * 0.025,
                            borderColor: challenge.status === 'done' ? '#9FE7B3' : '#FB8A8A',
                            borderWidth: dimensions.width * 0.01,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: dimensions.height * 0.05,
                          }}>
                            <Text
                              style={{
                                fontFamily: fontPlusJakartaSansRegular,
                                color: 'black',
                                fontSize: dimensions.width * 0.035,
                                textAlign: 'left',
                                fontWeight: 600,
                                maxWidth: dimensions.width * 0.7,
                              }}>
                              {challenge.status === 'done' ? challenge.elapsedTime : elapsedTime}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleAcceptChallenge(index)}
                          disabled={challenge.status === 'done'}
                        >
                          <Image
                            source={require('../assets/icons/completeWithLineIcon.png')}
                            style={{
                              alignSelf: 'center',
                              width: dimensions.width * 0.14,
                              height: dimensions.height * 0.14,
                              top: -dimensions.height * 0.061,
                            }}
                            resizeMode='contain'
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  ))}
                </ScrollView>
              </>
            )
          ) : (
            <>
              <Text
                style={{
                  fontFamily: fontPlusJakartaSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 700,
                  marginTop: dimensions.height * 0.025,
                  paddingHorizontal: dimensions.width * 0.05,
                  paddingBottom: dimensions.height * 0.01,
                }}>
                Your done challenges:
              </Text>

              {growthJournal.length === 0 && (
                <Text
                  style={{
                    fontFamily: fontPlusJakartaSansRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.07,
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontWeight: 700,
                    marginTop: dimensions.height * 0.25,
                    paddingHorizontal: dimensions.width * 0.05,
                  }}>
                  You haven't completed any challenges yet.
                </Text>
              )}
              <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: dimensions.height * 0.16,
                  alignSelf: 'center'
                }}>
                {growthJournal.map((growth, index) => (
                  <View key={index} style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    marginTop: index !== 0 ? dimensions.height * 0.025 : dimensions.height * 0.016,
                    borderRadius: dimensions.width * 0.025,
                    borderColor: 'white',
                    borderWidth: dimensions.width * 0.003,
                    paddingVertical: dimensions.height * 0.023,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontPlusJakartaSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: 700,
                        marginBottom: dimensions.height * 0.005,
                      }}>
                      {growth.allCompletedDate ? formatAleaRiseDate(new Date(growth.allCompletedDate)) : 'dd/mm/yyyy'}
                    </Text>

                    {growth.challenges.map((grChallenge, index) => (
                      <View key={grChallenge.id} style={{
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.021,
                        width: dimensions.width * 0.8,
                        borderBottomColor: 'white',
                        borderBottomWidth: grChallenge.id !== 3 ? dimensions.width * 0.001 : 0,
                        paddingBottom: grChallenge.id !== 3 ? dimensions.height * 0.025 : 0,
                      }}>
                        <Text
                          style={{
                            fontFamily: fontPlusJakartaSansRegular,
                            color: 'white',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            fontWeight: 500,
                            maxWidth: dimensions.width * 0.9,
                          }}>
                          {grChallenge.title}
                        </Text>

                        <View style={{
                          width: dimensions.width * 0.43,
                          backgroundColor: 'white',
                          borderRadius: dimensions.width * 0.025,
                          borderColor: '#FB8A8A',
                          borderWidth: dimensions.width * 0.01,
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: dimensions.height * 0.05,
                          alignSelf: 'center',
                          marginTop: dimensions.height * 0.019,
                        }}>
                          <Text
                            style={{
                              fontFamily: fontPlusJakartaSansRegular,
                              color: 'black',
                              fontSize: dimensions.width * 0.035,
                              textAlign: 'center',
                              fontWeight: 600,
                              maxWidth: dimensions.width * 0.7,
                            }}>
                            {grChallenge.elapsedTime}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {!currentChallenge && (
            <TouchableOpacity
              disabled={currentChallenge || (isBeginWasVisible && selectedDifficulty === '') || (isDifficultWasVisible && selectedChallengeCategory === '')}
              onPress={() => {
                if (!currentChallenge && !isDifficultWasVisible && !isBeginWasVisible) {
                  setIsBeginWasVisible(true);
                } else if (!currentChallenge && !isDifficultWasVisible && isBeginWasVisible) {
                  setIsDifficultWasVisible(true);
                } else {
                  const challengeSource = aleaChallengesData.find(item => item.categoty === selectedChallengeCategory)?.difficults[selectedDifficulty.toLowerCase()];
                  if (challengeSource) {

                    const challenge = JSON.parse(JSON.stringify(challengeSource));

                    challenge[0].status = 'accept';
                    challenge[0].startTime = new Date().toISOString();
                    const challengeWithPoints = {
                      challenges: challenge,
                      completedPoints: [],
                      selectedDifficulty: selectedDifficulty,
                      selectedChallengeCategory: selectedChallengeCategory
                    };
                    setCurrentChallenge(challengeWithPoints);
                    setElapsedTime('00:00:00');
                  }
                }
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
                {!currentChallenge && (!isDifficultWasVisible && !isBeginWasVisible) ? 'Let’s begin!' : !currentChallenge && (!isDifficultWasVisible && isBeginWasVisible) ? 'Keep going!' : 'Get a challenge'}
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      ) : selectedAleaScreen === 'Settings' ? (
        <SettingsScreen setSelectedAleaScreen={setSelectedAleaScreen} selectedAleaScreen={selectedAleaScreen} isVibrationEnabled={isVibrationEnabled} setVibrationEnabled={setVibrationEnabled} />
      ) : selectedAleaScreen === 'RunGame' ? (
        <RunGameScreen setSelectedAleaScreen={setSelectedAleaScreen} isRunGameStarted={isRunGameStarted} setIsRunGameStarted={setIsRunGameStarted} isVibrationEnabled={isVibrationEnabled} />
      ) : selectedAleaScreen === 'DreamBoard' ? (
        <DreamBoardScreen setSelectedAleaScreen={setSelectedAleaScreen} selectedAleaScreen={selectedAleaScreen} />
      ) : selectedAleaScreen === 'Cards' ? (
        <CardsScreen setSelectedAleaScreen={setSelectedAleaScreen} selectedAleaScreen={selectedAleaScreen} />
      ) : selectedAleaScreen === 'LoadingScreen' ? (
        <LoadingAleaScreen setSelectedAleaScreen={setSelectedAleaScreen} />
      ) : null}

      {!(selectedAleaScreen === 'RunGame' && isRunGameStarted) && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: '#0D0D0D',
              width: dimensions.width,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              paddingTop: dimensions.height * 0.004,
              paddingBottom: dimensions.height * 0.019,
              paddingHorizontal: dimensions.width * 0.07,
              zIndex: 4000,
            }}
          >
            {bottomBtns.map((button, index) => (
              <TouchableOpacity
                key={button.id}
                onPress={() => setSelectedAleaScreen(button.screen)}
                style={{
                  padding: dimensions.height * 0.01,
                  alignItems: 'center',
                  opacity: selectedAleaScreen === button.screen ? 1 : 0.37,
                }}
              >
                <Image
                  source={button.aleaIcon}
                  style={{
                    width: dimensions.height * 0.028,
                    height: dimensions.height * 0.028,
                    textAlign: 'center'
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: fontMontserratRegular,
                    color: selectedAleaScreen === button.screen ? '#B38C31' : '#656565',
                    fontSize: dimensions.width * 0.03,
                    textAlign: 'center',
                    fontWeight: 300,
                    marginTop: dimensions.height * 0.01,
                  }}>
                  {button.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
    </View>
  );
};

export default HomeScreen;
