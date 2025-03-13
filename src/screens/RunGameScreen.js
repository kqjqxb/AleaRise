import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { use, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';

const RunGameScreen = ({ setSelectedAleaScreen, isRunGameStarted, setIsRunGameStarted, isVibrationEnabled }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);
  const [runScore, setRunScore] = useState(0);

  const [playerBottom, setPlayerBottom] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const gravity = 0.5;

  const [obstacleX, setObstacleX] = useState(dimensions.width);
  const [obstacleSize, setObstacleSize] = useState(dimensions.width * 0.12);
  const [gameRecors, setGameRecors] = useState([]);
  const [bestRecord, setBestRecord] = useState(0);
  const [startedSpeed, setStartedSpeed] = useState(5);

  useEffect(() => {
    const loadGameRecords = async () => {
      try {
        const existingRecords = await AsyncStorage.getItem('gameRecords');
        const records = existingRecords ? JSON.parse(existingRecords) : [];
        setGameRecors(records);
        if (records.length > 0) {
          setBestRecord(Math.max(...records));
        } else {
          setBestRecord(0);
        }
      } catch (error) {
        console.error('Error loading game records:', error);
      }
    };

    loadGameRecords();
  }, [isRunGameStarted]);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (isRunGameStarted) {
        setRunScore(score => {
          const increment = Math.floor(1 + startedSpeed * 0.25);
          const newScore = score + increment;
          return newScore;
        });
      }
    }, 70);

    return () => clearInterval(scoreInterval);
  }, [isRunGameStarted]);

  useEffect(() => {
    if (runScore !== 0 && runScore % 100 === 0) {
      setStartedSpeed(prev => prev + 1);
    }
  }, [runScore]);

  useEffect(() => {
    let gameTimerId = setInterval(() => {
      if (isJumping) {
        setPlayerBottom(pb => {
          const newPb = pb + jumpVelocity + dimensions.height * 0.0005;
          return newPb > dimensions.height * 0.4 ? dimensions.height * 0.4 : newPb;
        });
        setJumpVelocity(v => v - gravity);
        if (playerBottom + jumpVelocity <= 0) {
          setPlayerBottom(0);
          setIsJumping(false);
          setJumpVelocity(0);
        }
      }
      setObstacleX(x => {
        const newX = x - startedSpeed;
        if (newX < -obstacleSize) {
          const newSize = Math.random() < 0.5 ? dimensions.width * 0.15 : dimensions.width * 0.19;
          setObstacleSize(newSize);
          return dimensions.width;
        }
        return newX;
      });
      const playerX = dimensions.width * 0.1;
      const playerWidth = dimensions.width * 0.25;
      if (
        obstacleX < playerX + playerWidth - dimensions.width * 0.088 &&
        obstacleX + obstacleSize - dimensions.width * 0.088 > playerX &&
        playerBottom < dimensions.width * 0.1 //45
      ) {
        if (isRunGameStarted) {
          Alert.alert('Game Over', `Your score: ${runScore}`);
          if (isVibrationEnabled) {
            ReactNativeHapticFeedback.trigger("impactMedium", {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          }
          if (runScore > 0) {
            saveGameRecord(runScore);
          }
        }
        setIsRunGameStarted(false);
        setObstacleX(dimensions.width);
        setPlayerBottom(0);
        setIsJumping(false);
        setJumpVelocity(0);
        setStartedSpeed(5);
      }
    }, 10);
    return () => clearInterval(gameTimerId);
  }, [isJumping, jumpVelocity, playerBottom, obstacleX, obstacleSize, dimensions.height, dimensions.width]);

  const saveGameRecord = async (score) => {
    try {
      const existingRecords = await AsyncStorage.getItem('gameRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      records.push(score);
      await AsyncStorage.setItem('gameRecords', JSON.stringify(records));
    } catch (error) {
      console.error('Error saving game record:', error);
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
      {!isRunGameStarted ? (
        <>
          <Image
            source={require('../assets/images/runGameImage.png')}
            style={{
              width: dimensions.width * 0.64,
              height: dimensions.height * 0.28,
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
            🔥 Ready for the challenge? 🔥{'\n'}

            {'\n'}Your character is racing forward, and your task is to jump in time, causing damage. ⏳ Small and large barriers test your reflexes. But be careful: the more points - the greater the speed. 🎮
          </Text>

          {gameRecors.length > 0 && (
            <Text
              style={{
                fontFamily: fontPlusJakartaSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
                fontWeight: 500,
                marginTop: dimensions.height * 0.03,
                paddingHorizontal: dimensions.width * 0.05,
                alignSelf: 'flex-start',
              }}>
              Best score: {bestRecord}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {
              setIsRunGameStarted(true);
              setPlayerBottom(0);
              setObstacleX(dimensions.width);
              setIsJumping(false);
              setJumpVelocity(0);
              setRunScore(0);
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
              Start
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableWithoutFeedback onPress={() => {
          if (!isJumping) {
            if (isVibrationEnabled) {
              ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
            }
            setIsJumping(true);
            setJumpVelocity(10);
          }
        }}>
          <SafeAreaView style={{
            flex: 1,
            height: dimensions.height * 0.8,
            width: dimensions.width,
          }}>
            <Text
              style={{
                fontFamily: fontPlusJakartaSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.061,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 700,
                position: 'absolute',
                top: dimensions.height * 0.014,
              }}>
              {runScore}
            </Text>
            <View style={{
              position: 'absolute',
              backgroundColor: 'white',
              height: dimensions.height * 0.05,
              width: dimensions.width,
              bottom: dimensions.height * 0.21
            }}></View>
            <View style={{
              flex: 1,
              overflow: 'hidden',
              bottom: dimensions.height * 0.25,
            }}>
              <Image
                source={require('../assets/images/playerImage.png')}
                style={{
                  position: 'absolute',
                  left: dimensions.width * 0.1,
                  bottom: playerBottom,
                  width: dimensions.width * 0.25,
                  height: dimensions.width * 0.25,
                }}
                resizeMode='contain'
              />
              <Image
                source={require('../assets/images/triangleImage.png')}
                style={{
                  position: 'absolute',
                  left: obstacleX,
                  bottom: 0,
                  width: obstacleSize,
                  height: obstacleSize,
                }}
                resizeMode='contain'
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setIsRunGameStarted(false);
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
                bottom: dimensions.height * 0.05,
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
                Back
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default RunGameScreen;
