import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SigninScreen = () => {
  // NAVIGATION
  const navigation = useNavigation();

  // STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // CONTEXT
  const {token, setToken} = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigation.replace('MainStack', {screen: 'Main'});
    }
  }, [token, navigation]);

  // FUNCTIONS
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios.post('http://localhost:4000/login', user).then(res => {
      const token = res.data.token;
      AsyncStorage.setItem('authToken', token);
      setToken(token);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <KeyboardAvoidingView>
          <View style={styles.view2}>
            <Text style={styles.text1}>Sign In your account </Text>
          </View>

          <View style={styles.view3}>
            <View>
              <Text style={styles.text2}>Email</Text>
              <View>
                <TextInput
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#BEBEBE"
                  style={[styles.input1, {fontSize: email ? 16 : 16}]}
                  placeholder="Enter your email"
                />
              </View>
            </View>
          </View>

          <View style={styles.view3}>
            <View>
              <Text style={styles.text2}>Password</Text>
              <View>
                <TextInput
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#BEBEBE"
                  style={[styles.input1, {fontSize: email ? 16 : 16}]}
                  placeholder="Enter your password"
                />
              </View>
            </View>
          </View>

          <Pressable style={styles.press} onPress={handleLogin}>
            <Text style={styles.text3}>Sign In</Text>
          </Pressable>

          <View style={styles.view4}>
            <Text>Don't have an account? </Text>
            <Pressable
              style={{paddingLeft: 3}}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={{color: 'steelblue'}}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.view5}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://signal.org/assets/images/features/Media.png',
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view1: {
    padding: 10,
    alignItems: 'center',
  },
  view2: {
    alignItems: 'center',
    marginTop: 60,
    justifyContent: 'center',
  },
  text1: {
    fontSize: 20,
    fontWeight: '500',
  },
  view3: {
    marginTop: 50,
  },
  text2: {
    fontSize: 20,
    fontWeight: '600',
    color: 'gray',
  },
  input1: {
    width: 300,
    marginTop: 10,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontFamily: 'GeezaPro-Bold',
  },
  press: {
    width: 250,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 55,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 25,
  },
  text3: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text4: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    margin: 12,
  },
  view4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  view5: {
    marginTop: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 160,
  },
});

export default SigninScreen;