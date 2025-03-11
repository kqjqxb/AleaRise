import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { ChevronLeftIcon, XCircleIcon, } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import PlayerDetailsScreen from './PlayerDetailsScreen';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const fontMontserratRegular = 'Montserrat-Regular';
const fontDMSansRegular = 'DMSans18pt-Regular';
const fontDMSansBlack = 'DMSans18pt-Black';

const PlayerScreen = ({ selectedScreen, setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isFirstModalWasVisible, setIsFirstModalWasVisible] = useState(false);
  const [sounds, setSounds] = useState([]);
  const [musicPlaylists, setMusicPlaylists] = useState([]);
  const [musicTitle, setMusicTitle] = useState('');
  const scrollViewHippodromeRef = useRef(null);
  const [selectedTrackToDelete, setSelectedTrackToDelete] = useState(null);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const swipeableRefs = useRef(new Map());
  const [activeSwipeableId, setActiveSwipeableId] = useState(null);

  useEffect(() => {
    const loadRacetracks = async () => {
      try {
        const storedMusicPlaylists = await AsyncStorage.getItem('musicPlaylists');
        if (storedMusicPlaylists) {
          setMusicPlaylists(JSON.parse(storedMusicPlaylists));
        }
      } catch (error) {
        console.error('Error loading musicPlaylists:', error);
      }
    };
    loadRacetracks();
  }, [selectedScreen, musicPlaylists]);


  const handleSaveMusicPlaylist = async () => {
    const hereMusicsPlaylists = JSON.parse(await AsyncStorage.getItem('musicPlaylists')) || [];
    const newId = hereMusicsPlaylists.length > 0 ? Math.max(...hereMusicsPlaylists.map(e => e.id)) + 1 : 1;
    const newMusic = {
      id: newId,
      title: title,
      description: description ? description : 'No description',
      image: image,
      sounds: sounds,
    };
    try {
      hereMusicsPlaylists.unshift(newMusic);
      setMusicPlaylists(hereMusicsPlaylists);
      setModalVisible(false);
      setSounds([]);
      setIsFirstModalWasVisible(false);
      setTitle('');
      setDescription('');
      setImage('');
      setMusicTitle('');
      await AsyncStorage.setItem('musicPlaylists', JSON.stringify(hereMusicsPlaylists));
    } catch (error) {
      console.error('Error saving musicPlaylists:', error);
    }
  };

  const handlePlaylistImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const removeTrack = () => {
    const updatedSounds = sounds.filter(item => item.id !== selectedTrackToDelete.id);
    setSounds(updatedSounds);
  };

  const renderRightActions = (track) => (
    <TouchableOpacity
      onPress={() => removeTrack()}
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

  useEffect(() => {
    console.log('sounds:', sounds);
  }, [sounds]);


  const handleMusicPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      const file = Array.isArray(res) ? res[0] : res;

      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

      const newTrack = {
        id: sounds.length > 0 ? Math.max(...sounds.map(track => track.id)) + 1 : 1,
        uri: file.uri,
        name: musicTitle ? musicTitle : fileNameWithoutExtension || 'Unknown Track',
      };
      setSounds([newTrack, ...sounds]);
      setMusicTitle('');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  // const moveFileToDocs = async (fileUri, fileName) => {
  //   const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  //   try {
  //     await RNFS.copyFile(fileUri, newPath);
  //     return newPath;
  //   } catch (error) {
  //     console.error('Помилка копіювання файлу:', error);
  //     return null;
  //   }
  // };

  // filepath: /Users/user/Downloads/ReactNative/SkyMusicCity/src/screens/PlayerScreen.js
  // Sound.setCategory('Playback'); // Додає категорію для iOS (опціонально)

  // const handleMusicPicker = async () => {
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.audio],
  //     });
  //     console.log('Обраний файл:', res);
  //     if (!res?.uri) return;

  //     // Беремо URI та декодуємо
  //     let fileUri = decodeURI(res.fileCopyUri || res.uri);

  //     // Видаляємо "file://"
  //     let cleanPath = fileUri.replace('file://', '');

  //     // При потребі перейменовуємо файл (наприклад, без дужок)
  //     let safeName = res.name.replace(/[()]/g, '').replace(/\s+/g, '_');

  //     const fileExists = await RNFS.exists(cleanPath);
  //     if (!fileExists) {
  //       // Копіюємо з "file://" і з новим іменем
  //       const newPath = await moveFileToDocs(`file://${cleanPath}`, safeName);
  //       if (!newPath) return;
  //       cleanPath = newPath.replace('file://', '');
  //     }

  //     // Створюємо звук
  //     const sound = new Sound(cleanPath, '', error => {
  //       if (error) {
  //         console.error('Помилка завантаження звуку:', error);
  //         return;
  //       }
  //       console.log('Звук успішно завантажено!');

  //       const newTrack = {
  //         id: sounds.length > 0 ? Math.max(...sounds.map(track => track.id)) + 1 : 1,
  //         uri: cleanPath,
  //         name: musicTitle ? musicTitle : res.name || 'Unknown Track',
  //         duration: sound.getDuration(), // Отримання тривалості
  //       };
  //       setSounds([newTrack, ...sounds]);
  //       setMusicTitle('');
  //     });
  //   } catch (err) {
  //     console.error('DocumentPicker Error: ', err);
  //   }
  // };



  const handleDeletePlaylistImage = (index) => {
    Alert.alert(
      "Delete playlist image",
      "Are you sure you want to delete playlist image?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            setImage('');
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
        zIndex: 5
      }}>
        {isPlaylistVisible ? (
          <TouchableOpacity onPress={() => {
            setIsPlaylistVisible(false);
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
        ) : (
          <Text></Text>
        )}
        <Text
          style={{
            fontFamily: fontDMSansRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: 700,
            marginLeft: !isPlaylistVisible ? dimensions.width * 0.044 : -dimensions.width * 0.12,
            paddingBottom: dimensions.height * 0.016,
          }}>
          Music player
        </Text>

        <TouchableOpacity onPress={() => {
          setSelectedScreen('Settings');
        }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: dimensions.height * 0.016,
          }}
        >
          <Image
            source={require('../assets/icons/goldSettingsIcon.png')}
            style={{
              width: dimensions.height * 0.03,
              height: dimensions.height * 0.03,
              right: dimensions.width * 0.0,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {!isPlaylistVisible ? (
        musicPlaylists.length === 0 ? (
          <>
            <View style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              backgroundColor: '#202020',
              marginTop: dimensions.height * 0.025,
              borderRadius: dimensions.width * 0.04,
              alignItems: 'center',
              paddingVertical: dimensions.height * 0.025,
            }}>
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.046,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                }}>
                You don't have anything here yet...
              </Text>
              <Image
                source={require('../assets/images/noMusicPlayersImage.png')}
                style={{
                  width: dimensions.width * 0.8,
                  height: dimensions.height * 0.23,
                }}
                resizeMode='contain'
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                width: dimensions.width * 0.9,
                backgroundColor: '#B38C31',
                borderRadius: dimensions.width * 0.043,
                height: dimensions.height * 0.061,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.019,
                zIndex: 1000,
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
                Add
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
          }}>
            <ScrollView ref={scrollViewHippodromeRef} contentContainerStyle={{ paddingBottom: dimensions.height * 0.16 }} style={{}}>
              <View style={{
                width: dimensions.width * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.016,
              }}>
                {musicPlaylists.map((item, index) => (
                  <TouchableOpacity key={index} style={{
                    width: dimensions.width * 0.43,
                    marginBottom: dimensions.height * 0.025,
                  }}
                    onPress={() => {
                      setSelectedPlaylist(item);
                      setIsPlaylistVisible(true);
                    }}
                  >
                    <Image
                      source={require('../assets/images/roofImage.png')}
                      style={{
                        width: dimensions.width * 0.43,
                        height: dimensions.width * 0.1,
                        alignSelf: 'flex-start',
                      }}
                      resizeMode='stretch'
                    />

                    <View style={{
                      width: dimensions.width * 0.43,
                      backgroundColor: '#202020',
                      borderBottomLeftRadius: dimensions.width * 0.034,
                      borderBottomRightRadius: dimensions.width * 0.034,

                      position: 'relative',
                      zIndex: 1,

                    }}>
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: dimensions.width * 0.43,
                          height: dimensions.height * 0.1,
                          alignSelf: 'center',
                        }}
                        resizeMode='stretch'
                      />
                      <Text
                        style={{
                          fontFamily: fontDMSansRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.044,
                          textAlign: 'left',
                          alignSelf: 'flex-start',
                          fontWeight: 500,
                          flex: 1,
                          paddingVertical: dimensions.height * 0.014,
                          paddingHorizontal: dimensions.width * 0.03,
                        }}>
                        {item.title}
                      </Text>

                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
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
                Add
              </Text>
            </TouchableOpacity>
          </View>
        )

      ) : (
        <>
          <PlayerDetailsScreen musicPlaylists={musicPlaylists} setSelectedPlaylist={setSelectedPlaylist} setMusicPlaylists={setMusicPlaylists} setIsPlaylistVisible={setIsPlaylistVisible} selectedPlaylist={selectedPlaylist} />
        </>
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
              if (isFirstModalWasVisible) {
                setIsFirstModalWasVisible(false);
              } else {
                setModalVisible(false);
                setSounds([]);
                setTitle('');
                setDescription('');
                setImage('');
                setMusicTitle('');
              }
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
              disabled={title === ''}
            >
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: '#B38C31',
                  opacity: title.length === 0 ? 0.5 : 1,
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 500,
                  right: dimensions.width * 0.019,
                }}>
                {isFirstModalWasVisible ? 'Save' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {!isFirstModalWasVisible ? (
            <>
              <Text
                style={{
                  fontFamily: fontDMSansRegular,
                  color: 'white',
                  opacity: 0.7,
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 300,
                  paddingHorizontal: dimensions.width * 0.05,
                  marginTop: dimensions.height * 0.019,
                }}>
                Create a playlist
              </Text>

              {image === '' || !image ? (
                <TouchableOpacity
                  onPress={handlePlaylistImagePicker}
                  style={{
                    width: dimensions.width * 0.9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    backgroundColor: '#202020',
                    borderRadius: dimensions.width * 0.034,
                    paddingHorizontal: dimensions.width * 0.03,
                    height: dimensions.height * 0.21,
                  }}>
                  <Image
                    source={require('../assets/images/photoImage.png')}
                    style={{
                      width: dimensions.width * 0.23,
                      height: dimensions.width * 0.23,
                      opacity: 0.7,
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleDeletePlaylistImage}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    borderRadius: dimensions.width * 0.034,
                    position: 'relative',
                  }}>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.21,
                      borderRadius: dimensions.width * 0.034,
                    }}
                    resizeMode='stretch'
                  />
                  <Image
                    source={require('../assets/images/photoImage.png')}
                    style={{
                      width: dimensions.height * 0.111,
                      height: dimensions.height * 0.111,
                      position: 'absolute',
                      alignSelf: 'center',
                      top: dimensions.height * 0.055,
                    }}
                    resizeMode='contain'
                  />

                </TouchableOpacity>
              )}


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
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="rgba(255, 255, 255, 0.57)"
                  style={{
                    maxWidth: dimensions.width * 0.7,
                    fontFamily: fontDMSansRegular,
                    fontSize: dimensions.width * 0.04,
                    color: 'white',
                  }}
                />
                {title.length > 0 && (
                  <TouchableOpacity onPress={() => {
                    setTitle('');
                  }}>
                    <XCircleIcon size={dimensions.height * 0.03} color='#8E8E93' />
                  </TouchableOpacity>
                )}
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
                  placeholder="Description (optional - max 300 characters)"
                  value={description}
                  maxLength={300}
                  onChangeText={setDescription}
                  placeholderTextColor="rgba(255, 255, 255, 0.57)"
                  placeholderTextSize={dimensions.width * 0.03}
                  style={{
                    maxWidth: dimensions.width * 0.8,
                    fontFamily: fontDMSansRegular,
                    fontSize: description.length > 0 ? dimensions.width * 0.04 : dimensions.width * 0.034,
                    color: 'white',
                  }}
                />
                {description.length > 0 && (
                  <TouchableOpacity onPress={() => {
                    setDescription('');
                  }}>
                    <XCircleIcon size={dimensions.height * 0.03} color='#8E8E93' />
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
              paddingBottom: dimensions.height * 0.16,
            }} style={{}}>
              <View style={{
                width: dimensions.width,
                alignSelf: 'center',
              }}>
                <Text
                  style={{
                    fontFamily: fontDMSansRegular,
                    color: 'white',
                    opacity: 0.7,
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    fontWeight: 300,
                    paddingHorizontal: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.019,
                  }}>
                  Importing music
                </Text>
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
                  placeholder="Title (optional)"
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

              {sounds.length > 0 && (
                sounds.map((track, index) => (
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
                        onPress={() => {
                          setSelectedTrackToDelete(track);
                          handleYellowDotsPress(track.id);
                        }}
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
              )}



            </ScrollView>
          )}


        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default PlayerScreen;
