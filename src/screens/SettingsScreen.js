import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Switch,
  Modal,
} from 'react-native';
import RNRestart from 'react-native-restart';

const fontPlusJakartaSansRegular = 'PlusJakartaSans-Regular';

const SettingsScreen = ({ setSelectedAleaScreen, isVibrationEnabled, setVibrationEnabled }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);

  const toggleNotificationSwitch = () => {
    const newValue = !isVibrationEnabled;
    setVibrationEnabled(newValue);
    saveSettings('isVibrationEnabled', newValue);
  };
  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      RNRestart.Restart();
      console.log('AsyncStorage очищено');
    } catch (error) {
      console.error('Помилка при очищенні AsyncStorage', error);
    }
  };

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    }}>
      <View style={{
        width: dimensions.width * 0.9,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: dimensions.width * 0.025,
        borderColor: 'white',
        borderWidth: dimensions.width * 0.007,
        paddingVertical: dimensions.height * 0.03,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: dimensions.width * 0.77,
          marginBottom: dimensions.height * 0.19,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <Image 
              source={require('../assets/icons/vibrationIcon.png')}
              style={{
                width: dimensions.width * 0.1,
                height: dimensions.width * 0.1,
                marginRight: dimensions.width * 0.02,
              }}
              resizeMode='contain'
            />

            <Text style={{
              color: 'white',
              fontSize: dimensions.width * 0.07,
              fontFamily: fontPlusJakartaSansRegular,
              fontWeight: 600,
            }}>
              Vibration
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#948ea0', true: '#FFFFFF' }}
            thumbColor={'#2BE281'}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleNotificationSwitch}
            value={isVibrationEnabled}
          />
        </View>
        <TouchableOpacity 
          onPress={() => {
            setModalVisible(true);
          }}
        style={{
          width: dimensions.width * 0.8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: dimensions.width * 0.019,
          height: dimensions.height * 0.07,
        }}>
          <Text
            style={{
              fontFamily: fontPlusJakartaSansRegular,
              color: 'black',
              fontSize: dimensions.width * 0.05,
              textAlign: 'center',
              fontWeight: 600,
            }}>
            Reset progress
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1E1E1EE0',
        }}>
          <View style={{
            paddingHorizontal: 0,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.05,
            paddingTop: dimensions.width * 0.07,
            alignItems: 'center',
            width: dimensions.width * 0.8,
          }}>
            <Text style={{
              fontSize: dimensions.width * 0.044,
              marginBottom: dimensions.height * 0.019,
              textAlign: 'center',
              fontFamily: fontPlusJakartaSansRegular,
              paddingHorizontal: dimensions.width * 0.073,
              fontWeight: 500,
              alignSelf: 'center',
            }}>
              Reset progress?
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontPlusJakartaSansRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              Are you sure you want to reset your progress?
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: dimensions.width * 0.8,
              borderTopColor: '#050505',
              borderTopWidth: dimensions.width * 0.0019,
              paddingHorizontal: dimensions.width * 0.07,
            }}>
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={{
                  color: '#090814',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                  fontFamily: fontPlusJakartaSansRegular,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{
                height: '100%',
                borderLeftWidth: dimensions.width * 0.0019,
                paddingVertical: dimensions.height * 0.021,
                borderLeftColor: '#050505',
              }} />
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  setModalVisible(false);
                  clearAsyncStorage();
                }}
              >
                <Text style={{
                  color: '#FF2519',
                  textAlign: 'center',
                  fontFamily: fontPlusJakartaSansRegular,
                  fontSize: dimensions.width * 0.044,
                  alignSelf: 'center',
                  fontWeight: 600,
                }}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
