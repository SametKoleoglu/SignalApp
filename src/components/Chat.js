import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const Chat = ({item}) => {
  // Navigation
  const navigation = useNavigation();

  // State and Context
  const {userId} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatRoom', {
          name: item?.name,
          receiverId: item?._id,
          image: item?.image,
        })
      }
      style={styles.container}>
      <View style={styles.view1}>
        <Pressable>
          <Image
            source={{uri: item?.image}}
            style={{width: 45, height: 45, borderRadius: 50}}
          />
        </Pressable>

        <View>
          <Text style={styles.text1}>{item?.name}</Text>
          <Text style={styles.text2}>chat with {item?.name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text1: {
    fontWeight: '500',
    fontSize: 15,
  },
  text2: {
    color: 'gray',
    marginTop: 5,
  },
});
