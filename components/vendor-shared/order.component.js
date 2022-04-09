import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import {getFormattedDate} from '../../util/utility-functions';
import VendorBadgeComponent from './vendor-badge.component';
import {ORDER_STATUSES} from '../../util/constants';
import Colors from '../../util/styles/colors';

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
            Order ID:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderId}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
            Order placed by:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderPlacedBy}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
            Order Date:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            {orderDate}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.headingContainer]}>
          <Text style={[CommonStyles.fontFamily, styles.heading]}>
            Order Price:
          </Text>
          <Text style={[styles.detail, CommonStyles.fontFamily]}>
            MXN {orderPrice}
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
    borderColor: Colors.light,
    borderRadius: 8,
  },
  headingContainer: {
    marginBottom: 5,
  },
  heading: {
    fontSize: 18,
    flex: 2,
  },
  detail: {
    flex: 2,
    marginLeft: 10,
    opacity: 0.5,
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
});

export default OrderComponent;
