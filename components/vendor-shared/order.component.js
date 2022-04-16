import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import {getFormattedDate} from '../../util/utility-functions';
import VendorBadgeComponent from './vendor-badge.component';
import {ORDER_STATUSES} from '../../util/constants';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';

const OrderComponent = ({
  orderId = 487,
  orderPlacedBy = 'Muhammad Usama',
  orderDate = getFormattedDate(),
  orderPrice = 151.23,
  orderStatus = ORDER_STATUSES.ORDER_PACKAGING,
  openOrderDetails,
}) => {
  
  return (
    <Pressable
      onPress={() => {
        openOrderDetails(orderId);
      }}>
      <View style={styles.orderCard}>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
            Pedido ID:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderId}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
            Cliente:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderPlacedBy}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
          Fecha:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderDate}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
          Precio:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            MXN {moneda( orderPrice)}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <VendorBadgeComponent orderStatus={orderStatus} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    marginBottom: 8,
    borderWidth: 1,
    padding: 15,
    borderColor: Colors.white,
    borderRadius: 2,
    backgroundColor:Colors.white,
    elevation:1,
    marginHorizontal:10
    
  },
  headingContainer: {
    // marginBottom: 5,
  },
  heading: {
    fontSize: adjust(13),
    flex: 2,
  },
  detail: {
    flex: 2,
    marginLeft: 10,
    opacity: 0.5,
    fontSize: adjust(12),
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
});

export default OrderComponent;
