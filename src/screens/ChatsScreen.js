import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Chat} from '../components';

import 'core-js/stable/atob';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const ChatsScreen = () => {
  // STATES
  const [options, setOptions] = useState(['Chats']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);

  // CONTEXT
  const {token, setToken, userId, setUserId} = useContext(AuthContext);

  // NAVIGATION
  const navigation = useNavigation();

  // FUNCTIONS
  const chooseOption = option => {
    if (options.includes(option)) {
      setOptions(options.filter(opt => opt !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken('');
      navigation.replace('SignIn');
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    clearAuthToken();
  };

  // USE EFFECTS
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      setToken(token);

      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/get-requests/${userId}`,
      );
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log('requests : ', requests);

  const acceptRequest = async requestId => {
    try {
      const response = await axios.post(
        `http://localhost:4000/accept-request`,
        {
          userId,
          requestId,
        },
      );

      if (response.status == 200) {
        await getRequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log('users : ', chats);

  return (
    <SafeAreaView>
      <View style={styles.view1}>
        <TouchableOpacity
          onPress={logout}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign name="logout" size={25} color="black" />
          <Text>Sign Out</Text>
        </TouchableOpacity>

        <Text style={{fontSize: 15, fontWeight: '500', marginRight: 15}}>
          Chats
        </Text>

        <View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <AntDesign name="camerao" size={25} color="black" />
            <MaterialIcons
              name="person-outline"
              size={25}
              color="black"
              onPress={() => navigation.navigate('People')}
            />
          </View>
        </View>
      </View>

      <View style={{padding: 10}}>
        <Pressable
          onPress={() => chooseOption('Chats')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text>Chats</Text>
          </View>
          <Entypo name="chevron-small-down" size={25} color="black" />
        </Pressable>

        <View>
          {options?.includes('Chats') &&
            (chats?.length > 0 ? (
              <View>
                {chats?.map((item, index) => (
                  <Chat key={item?._id} item={item} />
                ))}
              </View>
            ) : (
              <View
                style={{
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{marginTop: 5, color: 'gray'}}>
                    Get Started by messaging a friend
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <Pressable
          onPress={() => chooseOption('Requests')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text>Requests</Text>
          </View>

          <Entypo name="chevron-small-down" size={25} color="black" />
        </Pressable>

        <View style={{marginVertical: 12}}>
          {options?.includes('Requests') && (
            <View>
              <Text style={{textAlign: 'center', paddingTop: 10}}>
                Checkout all the requests
              </Text>

              {requests?.map((item, index) => (
                <Pressable style={{marginVertical: 10}} key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <Pressable>
                      <Image
                        source={{uri: item?.from?.image}}
                        style={{width: 40, height: 40, borderRadius: 20}}
                      />
                    </Pressable>

                    <View style={{flex: 1}}>
                      <Text style={{fontWeight: '500', fontSize: 14}}>
                        {item?.from?.name}
                      </Text>

                      <Text style={{color: 'gray', marginTop: 5}}>
                        {item?.message}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => acceptRequest(item?.from?._id)}
                      style={{
                        width: 75,
                        borderRadius: 5,
                        padding: 10,
                        backgroundColor: '#005187',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 12,
                        }}>
                        Accept
                      </Text>
                    </Pressable>

                    <AntDesign name="delete" size={25} color="red" />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  view1: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  image1: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ChatsScreen;
