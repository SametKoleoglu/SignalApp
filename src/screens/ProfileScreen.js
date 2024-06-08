import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>In Development</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
