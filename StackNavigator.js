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
  const [isOnboardingAleaRiseVisible, setIsOnboardingAleaRiseVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingAleaRiseApp, setInitializingAleaRiseApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadAleaRiseUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedAleaRiseUser = await AsyncStorage.getItem(storageKey);
        const isAleaRiseOnboardWasVisible = await AsyncStorage.getItem('isAleaRiseOnboardWasVisible');

        if (storedAleaRiseUser) {
          setUser(JSON.parse(storedAleaRiseUser));
          setIsOnboardingAleaRiseVisible(false);
        } else if (isAleaRiseOnboardWasVisible) {
          setIsOnboardingAleaRiseVisible(false);
        } else {
          setIsOnboardingAleaRiseVisible(true);
          await AsyncStorage.setItem('isAleaRiseOnboardWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of reginas user', error);
      } finally {
        setInitializingAleaRiseApp(false);
      }
    };
    loadAleaRiseUser();
  }, [setUser]);

  if (initializingAleaRiseApp) {
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
      <Stack.Navigator initialRouteName={isOnboardingAleaRiseVisible ? 'OnboardingScreen' : 'LoadingAleaScreen'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoadingAleaScreen" component={LoadingAleaScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AleaRiseStack;
