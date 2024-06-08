import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const User = ({item}) => {
  // NAVIGATION
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.view1}>
        <Pressable>
          <Image source={{uri: item?.image}} style={styles.image} />
        </Pressable>

        <View style={styles.view2}>
          <Text>{item?.name}</Text>
          <Text>{item?.email}</Text>
        </View>

        <Pressable
          style={styles.press2}
          onPress={() =>
            navigation.navigate('Request', {
              name: item?.name,
              receiverId: item?._id,
            })
          }>
          <Text style={styles.text3}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
  },
  view1: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  view2: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  press2: {
    padding: 10,
    width: 75,
    backgroundColor: '#005187',
    borderRadius: 5,
    alignItems: 'center',
  },
  text3: {
    color: 'white',
  },
});
