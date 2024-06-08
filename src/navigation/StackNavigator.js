import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ProfileScreen,
  SigninScreen,
  SignupScreen,
  ChatsScreen,
  PeopleScreen,
  RequestChatRoom,
  ChatRoom,
} from '../screens';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const {token, setToken} = useContext(AuthContext);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            tabBarStyle: {
              backgroundColor: '#101010',
            },
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={28}
                  color="white"
                />
              ) : (
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={28}
                  color="#989898"
                />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarStyle: {
              backgroundColor: '#101010',
            },
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="person-outline" size={28} color="white" />
              ) : (
                <Ionicons name="person-outline" size={28} color="#989898" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SigninScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="People"
          component={PeopleScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen name="Request" component={RequestChatRoom} />

        <Stack.Screen name="ChatRoom" component={ChatRoom} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {token === null || token === '' ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;
