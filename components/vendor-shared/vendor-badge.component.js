import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ORDER_STATUSES, PRODUCT_STATUS} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';

const STATUSES_COLORS = {
  [ORDER_STATUSES.PROCESSING]: '#007bff',
  [ORDER_STATUSES.PACKED]: '#6c757d',
  [ORDER_STATUSES.CANCELLED]: 'red',
  [ORDER_STATUSES.PARCEL_DELIVERED]:'#0bda51'
};

const VendorBadgeComponent = ({orderStatus}) => {
  const configText = (e) => {
    let text;

    switch (e) {
      case 'PARCEL DELIVERED':
        return text = 'PAQUETE ENTREGADO';
      case 'PACKED':
          return text = 'EMPACADO';

      case undefined:
        return text = 'Sin datos'
      default:
        return text = 'Sin datos'
        
    }
  }

  return (
    <View
      style={[
        styles.badge,
        CommonStyles.flexCenter,
        {backgroundColor: STATUSES_COLORS[orderStatus]},
      ]}>
      <Text style={[styles.text, CommonStyles.fontFamily]}>{configText(orderStatus)}</Text>
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
    fontSize: adjust(10),
  },
});

export default VendorBadgeComponent;
