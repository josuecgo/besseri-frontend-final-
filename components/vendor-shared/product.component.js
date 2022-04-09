import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PRODUCT_STATUS } from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import VendorBadgeComponent from './vendor-badge.component';
import Colors from '../../util/styles/colors';
import { base_url } from '../../util/api/api_essentials';

const ProductComponent = ({ data,openProductDetails }) => {
  return (
    <Pressable
      onPress={() => {
        openProductDetails(data);
      }}>
      <View style={[styles.productContainer, CommonStyles.flexDirectionRow]}>
        <View style={{ flex: 1 }}>
          <Image source={{ uri: `${base_url}/${data?.productImg}` }} style={styles.imageStyles} />
        </View>
        <View style={styles.details}>
          <View style={[CommonStyles.flexDirectionRow, styles.container]}>
            <Text style={[CommonStyles.fontFamily, styles.detailsText]}>
              {data?.name}
            </Text>
          </View>
          <View style={[CommonStyles.flexDirectionRow, styles.container]}>
            <Text style={[CommonStyles.fontFamily, styles.detailsText]}>
              MXN {data?.price}
            </Text>
          </View>
          <View style={[CommonStyles.flexDirectionColumn]}>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={[CommonStyles.fontFamily, styles.detailsText]}>
              {data?.description}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              onPress={() => {
                openProductDetails(data);
              }}
              style={styles.detailButton}
            >
              <Text style={styles.detailButtonText}>Show Details</Text>

            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light,
    marginBottom: 8,
    padding: 15,
  },
  imageStyles: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
  },
  container: {
    marginBottom: 8,
  },
  details: {
    padding: 10,
    flex: 3,
  },
  detailsText: {
    fontSize: 16,
    opacity: 0.5,
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  detailButton: {
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    ...CommonStyles.horizontalCenter,
    ...CommonStyles.verticalCenter,
    borderRadius: 25
  },
  detailButtonText: {
    ...CommonStyles.fontFamily,
    color: 'white'
  }
});

export default ProductComponent;
