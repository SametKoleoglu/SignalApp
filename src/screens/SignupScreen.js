import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const SignupScreen = () => {
  // States
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  // Navigation
  const navigation = useNavigation();

  // Functions
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      image: image,
      password: password,
    };

    axios
      .post('http://localhost:4000/register', user)
      .then(res => {
        console.log(res.data);
        Alert.alert('Success', 'User created successfully');
        navigation.navigate('SignIn');

        setName('');
        setEmail('');
        setImage('');
        setPassword('');
      })
      .catch(error =>
        Alert.alert(
          'Error Register',
          'An error occurred while registering. Please try again.',
        ),
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <KeyboardAvoidingView>
          <View style={styles.view2}>
            <Text style={styles.text1}>Sign Up</Text>

            <Text
              style={{
                color: 'gray',
                marginTop: 10,
                textAlign: 'center',
                marginHorizontal: 10,
              }}>
              Profiles are visible to your friends and connections and groups
            </Text>

            <Pressable style={{marginTop: 10}}>
              <Image
                source={{
                  uri: image
                    ? image
                    : 'https://cdn-icons-png.flaticon.com/128/149/149071.png',
                }}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
              <Text
                style={{
                  color: 'gray',
                  marginTop: 3,
                  textAlign: 'center',
                  fontSize: 10,
                }}>
                Add
              </Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* INPUTS */}
            <View style={styles.view3}>
              <View style={{gap: 15}}>
                {/* EMAIL */}
                <Text style={styles.text2}>Name</Text>
                <View>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#BEBEBE"
                    style={[styles.input1, {fontSize: email ? 16 : 16}]}
                    placeholder="Enter your name"
                  />
                </View>

                {/* EMAIL */}
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

                {/* IMAGE */}
                <Text style={styles.text2}>Image</Text>
                <View>
                  <TextInput
                    value={image}
                    onChangeText={setImage}
                    placeholderTextColor="#BEBEBE"
                    style={[styles.input1, {fontSize: email ? 16 : 16}]}
                    placeholder="Enter your image"
                  />
                </View>

                {/* PASSWORD */}
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

            {/* BUTTON */}
            <Pressable style={styles.press} onPress={handleRegister}>
              <Text style={styles.text3}>Sign Up</Text>
            </Pressable>

            {/* BUTTON TEXT */}
            <View style={styles.view4}>
              <Text>Do you already have an account? </Text>
              <Pressable
                style={{paddingLeft: 3}}
                onPress={() => navigation.navigate('SignIn')}>
                <Text style={{color: 'steelblue'}}>Sign In</Text>
              </Pressable>
            </View>

            {/* IMAGE */}
            <View style={styles.view5}>
              <Image
                style={styles.image}
                source={{
                  uri: 'https://signal.org/assets/images/features/Media.png',
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
    marginTop: 50,
    justifyContent: 'center',
  },
  text1: {
    fontSize: 20,
    fontWeight: '500',
  },
  view3: {
    marginTop: 50,
    padding: 10,
  },
  text2: {
    fontSize: 20,
    fontWeight: '600',
    color: 'gray',
  },
  input1: {
    width: 300,
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
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 160,
  },
});
