import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Colors from '../../util/styles/colors';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';

const AutoPartsServiceCardComponent = ({text, navigation, navigationKey}) => {
  const {width} = useWindowDimensions();
  const widthRequired = width * 0.8;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DRAWER);
      }}>
      <View style={[styles.mainCardContainer]}>
        <Image
          source={personMockImage}
          style={[styles.imageStyles, {width: widthRequired}]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCardContainer: {
    height: 150,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
  },
  imageStyles: {
    borderRadius: 8,
    resizeMode: 'cover',
    height: 150,
  },
  textContainer: {
    position: 'absolute',
    top: 80,
    backgroundColor: Colors.secondaryColorBlueShade,
    borderTopRightRadius: 15,
  },
  text: {
    fontSize: 28,
    paddingLeft: 20,
    color: Colors.white,
    minWidth: 180,
    paddingVertical: 10,
  },
});

export default AutoPartsServiceCardComponent;
