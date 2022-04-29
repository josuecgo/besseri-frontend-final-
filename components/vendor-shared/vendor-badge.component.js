import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ORDER_STATUSES, PRODUCT_STATUS} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';
import { TranslateStatus } from '../../util/helpers/StatusText';

const STATUSES_COLORS = {
  [ORDER_STATUSES.PROCESSING]: '#007bff',
  [ORDER_STATUSES.PACKED]: '#6c757d',
  [ORDER_STATUSES.CANCELLED]: 'red',
  [ORDER_STATUSES.PARCEL_DELIVERED]:'#0bda51'
};

const VendorBadgeComponent = ({orderStatus}) => {
  

  return (
    <View
      style={[
        styles.badge,
        CommonStyles.flexCenter,
        {backgroundColor: STATUSES_COLORS[orderStatus]},
      ]}>
      <Text style={[styles.text, CommonStyles.fontFamily]}>{TranslateStatus(orderStatus)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: 8,
    minWidth: 110,
    minHeight: 30,
    borderRadius: 20,
    
  },
  text: {
    color: Colors.white,
    fontSize: adjust(9),
  },
});

export default VendorBadgeComponent;
