import React, {useContext, useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const RequestChatRoom = () => {
  // NAVIGATION
  const navigation = useNavigation();
  const route = useRoute();

  // STATES
  const [message, setMessage] = useState('');

  // CONTEXT
  const {token, setToken, userId, setUserId} = useContext(AuthContext);

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: 'Request Chat Room',
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={'black'}
            onPress={() => navigation.goBack()}
          />
          <View>
            <Text>{route?.params?.name}</Text>
          </View>
        </View>
      ),
    });
  }, []);

  // FUNCTIONS
  const sendMessage = async () => {
    try {
      const userData = {
        senderId: userId,
        receiverId: route?.params?.receiverId,
        message: message,
      };

      const response = await axios.post('http://localhost:4000/send-request',userData);

      if (response.status == 200) {
        setMessage('');
        Alert.alert('Success', 'Request sent successfully');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView></ScrollView>

      <View style={styles.view1}>
        <Entypo name="emoji-happy" size={24} color="gray" />

        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input1}
          placeholder="Type a message"
        />

        <View style={styles.view2}>
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable onPress={sendMessage} style={styles.press1}>
          <Text style={styles.text1}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RequestChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    marginBottom: 20,
  },
  input1: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  view2: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  press1: {
    backgroundColor: '#0066b2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text1: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
});
