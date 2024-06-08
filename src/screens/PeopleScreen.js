import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {User} from '../components';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PeopleScreen = () => {
  // STATE AND CONTEXT
  const [users, setUsers] = useState([]);
  const {token, userId} = useContext(AuthContext);

  // NAVIGATION
  const navigation = useNavigation();

  const fetchUsers = async () => {
    console.log('user id : ', userId);
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}`);
      const data = await response.data;
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log('users : ', users);

  return (
    <SafeAreaView>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10}}>
        <Pressable>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        </Pressable>
        <Text style={styles.text1}>People Usign Signal</Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item}) => <User item={item} key={item?._id} />}
      />
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  container: {},
  text1: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 80,
  },
});
