import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import { AudioProvider } from './src/context/AudioContext';
import LoadingAleaScreen from './src/screens/LoadingAleaScreen';


const Stack = createNativeStackNavigator();

const AleaRiseStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isOnboardingReginasVisible, setIsOnboardingReginasVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingReginasGlowApp, setInitializingReginasGlowApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadReginasGreenGlowUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedReginasUser = await AsyncStorage.getItem(storageKey);
        const isReginasOnbWasVisible = await AsyncStorage.getItem('isReginasOnbWasVisible');

        if (storedReginasUser) {
          setUser(JSON.parse(storedReginasUser));
          setIsOnboardingReginasVisible(false);
        } else if (isReginasOnbWasVisible) {
          setIsOnboardingReginasVisible(false);
        } else {
          setIsOnboardingReginasVisible(true);
          await AsyncStorage.setItem('isReginasOnbWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of reginas user', error);
      } finally {
        setInitializingReginasGlowApp(false);
      }
    };
    loadReginasGreenGlowUser();
  }, [setUser]);

  if (initializingReginasGlowApp) {
    return (
      <View style={{
        backgroundColor: '#050505',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AudioProvider>
        <Stack.Navigator initialRouteName={isOnboardingReginasVisible ? 'OnboardingScreen' : 'LoadingAleaScreen'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingAleaScreen" component={LoadingAleaScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};


export default AleaRiseStack;
