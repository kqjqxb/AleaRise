import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import { ChevronLeftIcon, } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import musicArticlesData from '../components/musicArticlesData';

const fontMontserratRegular = 'Montserrat-Regular';
const fontDMSansRegular = 'DMSans18pt-Regular';
const fontDMSansBlack = 'DMSans18pt-Black';

const ArticlesScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMusicArticle, setSelectedMusicArticle] = useState(null);
  const scrollViewHippodromeRef = useRef(null);
  // useEffect(() => {
  //   scrollViewHippodromeRef.current.scrollTo({ y: 0, animated: false });
  // }, []);

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
        <Text></Text>
        <Text
          style={{
            fontFamily: fontDMSansRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: 700,
            marginLeft: dimensions.width * 0.044,
            paddingBottom: dimensions.height * 0.016,
          }}>
          Articles
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


      <ScrollView ref={scrollViewHippodromeRef} contentContainerStyle={{ paddingBottom: dimensions.height * 0.16 }} style={{}}>
        {musicArticlesData.map((article,) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedMusicArticle(article);
              setModalVisible(true);
            }}
            key={article.id} style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              backgroundColor: '#202020',
              borderRadius: dimensions.width * 0.04,
              alignItems: 'center',
              paddingBottom: dimensions.height * 0.016,
              marginBottom: dimensions.height * 0.012,
              marginTop: article.id === 1 ? dimensions.height * 0.021 : 0,
            }}>
            <Image
              source={article.image}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.19,
                borderTopLeftRadius: dimensions.width * 0.04,
                borderTopRightRadius: dimensions.width * 0.04,
              }}

            />
            <Text
              style={{
                fontFamily: fontDMSansRegular,
                color: 'white',
                fontSize: dimensions.width * 0.043,
                textAlign: 'left',
                alignSelf: 'flex-start',
                fontWeight: 400,
                marginLeft: dimensions.width * 0.044,
                paddingBottom: dimensions.height * 0.016,
                marginTop: dimensions.height * 0.016,
                paddingHorizontal: dimensions.width * 0.01,
                maxWidth: dimensions.width * 0.8,
              }}>
              {article.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
              setModalVisible(false);
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
                  textAlign: 'left',
                  fontWeight: 500,
                  marginLeft: dimensions.width * 0.01,
                }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={selectedMusicArticle?.image}
            style={{
              width: dimensions.width * 0.9,
              height: dimensions.height * 0.25,
              borderRadius: dimensions.width * 0.04,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.02,
            }}
            resizeMode='stretch'
          />

          <Text
            style={{
              fontFamily: fontDMSansRegular,
              color: 'white',
              fontSize: dimensions.width * 0.05,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 500,
              marginLeft: dimensions.width * 0.044,
              marginTop: dimensions.height * 0.016,
              paddingHorizontal: dimensions.width * 0.01,
              maxWidth: dimensions.width * 0.9,
            }}>
            {selectedMusicArticle?.title}
          </Text>

          <Text
            style={{
              fontFamily: fontDMSansRegular,
              color: 'white',
              fontSize: dimensions.width * 0.037,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 300,
              marginLeft: dimensions.width * 0.044,
              paddingBottom: dimensions.height * 0.016,
              marginTop: dimensions.height * 0.01,
              paddingHorizontal: dimensions.width * 0.01,
              maxWidth: dimensions.width * 0.9,
            }}>
            {selectedMusicArticle?.article}
          </Text>

        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ArticlesScreen;
