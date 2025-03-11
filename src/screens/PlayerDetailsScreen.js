import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ChevronLeftIcon, XCircleIcon } from 'react-native-heroicons/solid';
import DocumentPicker from 'react-native-document-picker';

const fontMontserratRegular = 'Montserrat-Regular';
const fontDMSansRegular = 'DMSans18pt-Regular';
const fontDMSansBlack = 'DMSans18pt-Black';

const PlayerDetailsScreen = ({ setSelectedScreen, selectedPlaylist, setSelectedPlaylist, setMusicPlaylists, setIsPlaylistVisible, musicPlaylists }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSwipeableId, setActiveSwipeableId] = useState(null);
  const [modalAddMusicVisible, setModalAddMusicVisible] = useState(false);
  const [musicTitle, setMusicTitle] = useState('');
  const swipeableRefs = useRef(new Map());

  const handleDeletePlaylist = async (id) => {
    const updatedPlaylists = musicPlaylists.filter(item => item.id !== id);
    setMusicPlaylists(updatedPlaylists);
    setModalVisible(false);
    setIsPlaylistVisible(false);
    await AsyncStorage.setItem('musicPlaylists', JSON.stringify(updatedPlaylists));
  };

  const removeTrack = (playlist, track) => {
    const updatedPlaylist = {
      ...playlist,
      sounds: playlist.sounds.filter(item => item.id !== track.id)
    };
    const updatedPlaylists = musicPlaylists.map(item =>
      item.id === playlist.id ? updatedPlaylist : item
    );
    setMusicPlaylists(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylist);
    setIsPlaylistVisible(true); // Залишаємо видимим, щоб користувач бачив зміни
    AsyncStorage.setItem('musicPlaylists', JSON.stringify(updatedPlaylists))
      .then(() => {
        console.log('Playlists updated in AsyncStorage');
      })
      .catch(error => {
        console.error('Error updating playlists in AsyncStorage:', error);
      });
  };

  const renderRightActions = (track) => (
    <TouchableOpacity
      onPress={() => removeTrack(selectedPlaylist, track)}
      style={{
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: '100%',
        width: 68,
      }}
    >
      <Image
        source={require('../assets/icons/redTrashCskyMusicIcon.png')}
        style={{
          width: dimensions.width * 0.07,
          height: dimensions.width * 0.07,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
    </TouchableOpacity>
  );

  const handleSwipeableTrackOpen = (id) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });
    setActiveSwipeableId(id);
  };

  const handleSwipeableTrackClose = (id) => {
    if (activeSwipeableId === id) {
      setActiveSwipeableId(null);
    }
  };

  const handleYellowDotsPress = (id) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });

    const currentDotsRef = swipeableRefs.current.get(id);
    if (currentDotsRef) {
      if (activeSwipeableId === id) {
        currentDotsRef.close();
        setActiveSwipeableId(null);
      } else {
        currentDotsRef.openRight();
        setActiveSwipeableId(id);
      }
    }
  };

  const handleMusicPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      // Якщо res — масив, вибираємо перший елемент
      const file = Array.isArray(res) ? res[0] : res;
      const newTrack = {
        id: selectedPlaylist.sounds.length > 0 ? Math.max(...selectedPlaylist.sounds.map(track => track.id)) + 1 : 1,
        uri: file.uri,
        name: musicTitle ? musicTitle : file.name || 'Unknown Track',
      };

      // Оновлюємо selectedPlaylist
      const updatedPlaylist = {
        ...selectedPlaylist,
        sounds: [newTrack, ...selectedPlaylist.sounds],
      };

      // Оновлюємо musicPlaylists
      const updatedPlaylists = musicPlaylists.map(item =>
        item.id === selectedPlaylist.id ? updatedPlaylist : item
      );

      // Оновлюємо стани
      setMusicPlaylists(updatedPlaylists);
      setSelectedPlaylist(updatedPlaylist);
      setMusicTitle('');

      // Зберігаємо оновлений список у AsyncStorage
      await AsyncStorage.setItem('musicPlaylists', JSON.stringify(updatedPlaylists));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    } finally {
      setModalAddMusicVisible(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      width: dimensions.width,
      height: dimensions.height,
    }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{
        width: dimensions.width,
        alignSelf: 'center',
      }}>
        <View style={{
          width: dimensions.width,
          paddingBottom: dimensions.height * 0.16,
          alignSelf: 'center',
        }}>
          <View style={{
            width: dimensions.width * 0.9,
            alignSelf: 'center',
          }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                backgroundColor: '#FF382B',
                width: dimensions.width * 0.14,
                height: dimensions.width * 0.14,
                borderRadius: dimensions.width * 0.016,
                paddingVertical: dimensions.height * 0.019,
                marginTop: dimensions.height * 0.016,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/icons/trashSkyMusicIcon.png')}
                style={{
                  width: dimensions.width * 0.091,
                  height: dimensions.width * 0.091,
                  alignSelf: 'center',
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedPlaylist?.image }}
              style={{
                width: dimensions.width * 0.5,
                height: dimensions.width * 0.5,
                borderRadius: dimensions.width * 0.03,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.019,
              }}
              resizeMode='stretch'

            />
            <Text
              style={{
                fontFamily: fontDMSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.07,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 500,
                marginTop: dimensions.height * 0.016,
              }}>
              {selectedPlaylist.title}
            </Text>

            {selectedPlaylist.description && (
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                  marginTop: dimensions.height * 0.005,
                  marginBottom: dimensions.height * 0.021,
                }}>
                {selectedPlaylist.description}
              </Text>
            )}

            {selectedPlaylist.sounds.length > 0 ? (
              selectedPlaylist.sounds.map((track, index) => (
                <Swipeable
                  key={track.id}
                  ref={(ref) => {
                    if (ref) {
                      swipeableRefs.current.set(track.id, ref);
                    } else {
                      swipeableRefs.current.delete(track.id);
                    }
                  }}
                  renderRightActions={() => renderRightActions(track)}
                  onSwipeableOpen={() => handleSwipeableTrackOpen(track.id)}
                  onSwipeableClose={() => handleSwipeableTrackClose(track.id)}
                >
                  <View key={track.id} style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    backgroundColor: '#2F2F31',
                    borderRadius: dimensions.width * 0.034,
                    paddingHorizontal: dimensions.width * 0.05,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: dimensions.height * 0.019,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontDMSansRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.034,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        fontWeight: 300,
                        maxWidth: dimensions.width * 0.7,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {track.name}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleYellowDotsPress(track.id)}
                    >
                      <Image
                        source={require('../assets/icons/3dotsIcon.png')}
                        style={{
                          width: dimensions.width * 0.05,
                          height: dimensions.width * 0.05,
                        }}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  </View>
                </Swipeable>
              ))
            ) : (
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 600,
                  maxWidth: dimensions.width * 0.9,
                  marginTop: dimensions.height * 0.1,
                }}
              >
                No tracks in this playlist
              </Text>
            )}
          </View>


        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setModalAddMusicVisible(true);
        }}
        style={{
          width: dimensions.width * 0.9,
          backgroundColor: '#B38C31',
          borderRadius: dimensions.width * 0.043,
          height: dimensions.height * 0.061,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          zIndex: 1000,
          position: 'absolute',
          bottom: dimensions.height * 0.07,
        }}>
        <Text
          style={{
            fontFamily: fontDMSansRegular,
            color: 'white',
            fontSize: dimensions.width * 0.04,
            textAlign: 'left',
            alignSelf: 'center',
            fontWeight: 700,
          }}>
          Add music
        </Text>
      </TouchableOpacity>

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
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
              marginBottom: dimensions.height * 0.005,
              textAlign: 'center',
              fontFamily: fontMontserratRegular,
              paddingHorizontal: dimensions.width * 0.073,
              fontWeight: 600,
              alignSelf: 'center',
            }}>
              Removal
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontMontserratRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              Are you sure you want to delete this?
            </Text>
            <View style={{
              width: dimensions.width * 0.8,
              borderTopColor: '#3C3C435C',
              borderTopWidth: dimensions.width * 0.0019,
            }}>
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.016,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '100%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={{
                  color: '#0A84FF',
                  fontSize: dimensions.width * 0.044,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 500,
                  fontFamily: fontMontserratRegular,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.016,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  borderTopColor: '#3C3C435C',
                  borderTopWidth: dimensions.width * 0.0019,
                }}
                onPress={() => {
                  handleDeletePlaylist(selectedPlaylist.id)
                }}
              >
                <Text style={{
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: fontMontserratRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 500,
                  color: '#FF382B',
                }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddMusicVisible}
        onRequestClose={() => {
          setModalAddMusicVisible(!modalAddMusicVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#0D0D0D',
        }}>
          <View style={{
            backgroundColor: '#0D0D0D',
            width: dimensions.width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            borderBottomColor: 'rgba(255, 255, 255, 0.39)',
            borderBottomWidth: dimensions.width * 0.003,
            paddingHorizontal: dimensions.width * 0.05,
            paddingBottom: dimensions.height * 0.016,
            zIndex: 5
          }}>
            <TouchableOpacity onPress={() => {
              setModalAddMusicVisible(false);
            }} style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}>
              <ChevronLeftIcon size={dimensions.height * 0.03} color='#B38C31' />
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: '#b38b31',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 500,
                  marginLeft: dimensions.width * 0.01,
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fontDMSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.046,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 700,
                marginLeft: dimensions.width * 0.043,
                right: dimensions.width * 0.061,
              }}>
              Add music
            </Text>

            <TouchableOpacity onPress={() => {
              if (!isFirstModalWasVisible) {
                setIsFirstModalWasVisible(true);
              } else {
                handleSaveMusicPlaylist();
              }
            }} style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
            >
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: '#B38C31',
                  opacity: 0,
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 500,
                  right: dimensions.width * 0.019,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            marginTop: dimensions.height * 0.01,
            backgroundColor: '#202020',
            borderRadius: dimensions.width * 0.034,
            paddingHorizontal: dimensions.width * 0.03,
            height: dimensions.height * 0.055,
          }}>
            <TextInput
              placeholder="Title"
              value={musicTitle}
              onChangeText={setMusicTitle}
              placeholderTextColor="rgba(255, 255, 255, 0.57)"
              style={{
                maxWidth: dimensions.width * 0.7,
                fontFamily: fontDMSansRegular,
                fontSize: dimensions.width * 0.04,
                color: 'white',
              }}
            />
            {musicTitle.length > 0 && (
              <TouchableOpacity onPress={() => {
                setMusicTitle('');
              }}>
                <XCircleIcon size={dimensions.height * 0.03} color='#8E8E93' />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={handleMusicPicker}
            style={{
              width: dimensions.width * 0.4,
              height: dimensions.width * 0.4,
              marginLeft: dimensions.width * 0.05,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
              marginTop: dimensions.height * 0.01,
              backgroundColor: '#202020',
              borderRadius: dimensions.width * 0.034,
              paddingHorizontal: dimensions.width * 0.03,
            }}>
            <Image
              source={require('../assets/images/fileImage.png')}
              style={{
                width: dimensions.width * 0.16,
                height: dimensions.width * 0.16,
                opacity: 0.3,
              }}
              resizeMode='contain'
            />
          </TouchableOpacity>

        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PlayerDetailsScreen;
