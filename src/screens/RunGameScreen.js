import React, { useEffect, useRef, useState } from 'react';
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

const fontDMSansRegular = 'DMSans18pt-Regular';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';
const fontPontanoSansRegular = 'PontanoSans-Regular';


const RunGameScreen = ({ setSelectedScreen, isRunGameStarted, setIsRunGameStarted }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);

  const [playerBottom, setPlayerBottom] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const gravity = 0.5;

  const [obstacleX, setObstacleX] = useState(dimensions.width);
  const [obstacleSize, setObstacleSize] = useState(dimensions.width * 0.12);

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
        const newX = x - 5;
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
        obstacleX < playerX + playerWidth - dimensions.width * 0.07 &&
        obstacleX + obstacleSize - dimensions.width * 0.07 > playerX &&
        playerBottom < 50
      ) {
        if(isRunGameStarted) 
          Alert.alert('Game Over');
        setIsRunGameStarted(false);
        setObstacleX(dimensions.width);
        setPlayerBottom(0);
        setIsJumping(false);
        setJumpVelocity(0);
      }
    }, 10);
    return () => clearInterval(gameTimerId);
  }, [isJumping, jumpVelocity, playerBottom, obstacleX, obstacleSize, dimensions.height, dimensions.width]);

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
            🔥 Ready for the challenge? 🔥{'\n'}

            {'\n'}Your character is racing forward, and your task is to jump in time, avoiding obstacles. ⏳ Small and large barriers will test your reflexes, while springs 🧘 will help you jump higher and reach platforms with valuable resources 💎. But be careful: traps may appear from above ⚠️, and one wrong move will lead to failure. 🎮
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsRunGameStarted(true);
              setPlayerBottom(0);
              setObstacleX(dimensions.width);
              setIsJumping(false);
              setJumpVelocity(0);
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
              Start
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableWithoutFeedback onPress={() => {
          if (!isJumping) {
            setIsJumping(true);
            setJumpVelocity(10);
          }
        }}>
          <SafeAreaView style={{
            flex: 1,
            height: dimensions.height * 0.8,
            width: dimensions.width,
          }}>
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
                  fontFamily: fontDMSansRegular,
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

export default RunGameScreen;
