import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {SocketContext, useSocketContext} from '../context/SocketContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const ChatRoom = () => {
  // NAVIGATION
  const navigation = useNavigation();
  const route = useRoute();

  // STATES
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // CONTEXT
  const {token, setToken, userId, setUserId} = useContext(AuthContext);
  const {socket} = useSocketContext(SocketContext);

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: '',
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

  const listMessages = () => {
    const {socket} = useSocketContext();

    useEffect(() => {
      socket?.on('newMessage', newMessage => {
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      });

      return () => socket?.off('newMessage');
    }, [socket, messages, setMessages]);
  };

  listMessages();

  // FUNCTIONS
  const sendMessage = async (senderId, receiverId) => {
    try {
      await axios.post('http://localhost:4000/sendMessage', {
        senderId,
        receiverId,
        message,
      });

      socket.emit('sendMessage', {senderId, receiverId, message});

      setMessage('');

      setTimeout(() => {
        fetchMessages();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get('http://localhost:4000/messages', {
        params: {
          senderId,
          receiverId,
        }
      });

      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        {messages?.map((item, index) => {
          return (
            <Pressable
              style={[
                item?.senderId?._id == userId
                  ? {
                      alignSelf: 'flex-end',
                      backgroundColor: 'lightgreen',
                      maxWidth: '60%',
                      padding: 10,
                      borderRadius: 8,
                      margin: 5,
                    }
                  : {
                      alignSelf: 'flex-start',
                      backgroundColor: '#fff',
                      padding: 8,
                      margin: 5,
                      borderRadius: 8,
                    },
              ]}
              key={index}>
              <Text style={{fontSize: 14, textAlign: 'left'}}>
                {item?.message}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  textAlign: 'right',
                  color: 'gray',
                  marginTop: 5,
                }}>
                {formatTime(item?.timeStamp)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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

        <Pressable
          onPress={() => sendMessage(userId, route?.params?.receiverId)}
          style={styles.press1}>
          <Text style={styles.text1}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

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
