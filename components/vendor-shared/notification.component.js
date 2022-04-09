import React from 'react';
import CommonStyles from '../../util/styles/styles';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';
import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {getFormattedDate} from '../../util/utility-functions';

const NotificationComponent = ({
  isRead = false,
  userNameOrdered = 'Muhammad Usama',
  partNameOrdered = 'A pair of tyres',
  orderID = '482',
  orderDate = getFormattedDate(),
}) => {
  const {width} = useWindowDimensions();

  return (
    <View
      style={[
        CommonStyles.flexDirectionRow,
        CommonStyles.horizontalCenter,
        styles.notificationContainer,
        {
          width: width - SCREEN_HORIZONTAL_MARGIN * 2,
          backgroundColor: isRead ? '#d8eafc' : null,
          borderRadius: 8,
          marginBottom: 8,
        },
      ]}>
      <View style={styles.imageFlex}>
        <Image source={personMockImage} style={styles.imageStyles} />
      </View>
      <View style={styles.textFlex}>
        <Text style={[styles.notificationText, CommonStyles.fontFamily]}>
          {userNameOrdered} place order for '{partNameOrdered}', Order ID #
          {orderID}
        </Text>
        <Text style={[CommonStyles.fontFamily, styles.textDate]}>
          Order Date: {orderDate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 10,
  },
  imageFlex: {
    flex: 1,
  },
  textFlex: {
    flex: 4,
  },
  imageStyles: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  notificationText: {
    fontSize: 16,
    opacity: 0.5,
    flexShrink: 1,
  },
  textDate: {
    textAlign: 'right',
  },
});

export default NotificationComponent;
