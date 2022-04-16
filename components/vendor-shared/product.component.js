import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PRODUCT_STATUS } from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import VendorBadgeComponent from './vendor-badge.component';
import Colors from '../../util/styles/colors';
import { base_url } from '../../util/api/api_essentials';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';

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
          <Text style={[CommonStyles.fontFamily, styles.nameProduct]}>
            {data?.name}
          </Text>
        </View>
        <View style={[CommonStyles.flexDirectionRow, styles.container]}>
          <Text style={[CommonStyles.fontFamily, styles.detailsText]}>
            MXN {moneda(data?.price)}
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
            <Text style={styles.detailButtonText}>Mostrar detalles</Text>

          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Pressable>
);
};

const styles = StyleSheet.create({
productContainer: {
  backgroundColor:Colors.white,
  borderColor: Colors.light,
  marginVertical: 8,
  padding: 15,
  marginHorizontal: deviceWidth * 0.03,
  elevation:1
  
},
imageStyles: {
  height: deviceHeight * 0.19,
  width: deviceHeight * 0.10,
  // borderRadius: 70 / 2,
},
container: {
  marginBottom: 8,
},
details: {
  padding: 10,
  flex: 3,
},
nameProduct:{
  fontSize: adjust(17),
  color:Colors.primarySolid
},
detailsText: {
  fontSize: adjust(14),
  opacity: 0.7,
  
},
statusContainer: {
  alignItems: 'flex-end',
  marginTop: 8,
},
detailButton: {
  paddingHorizontal: 15,
  height: deviceHeight * 0.06,
  borderWidth: 1,
  borderColor: Colors.primarySolid,
  backgroundColor: Colors.primarySolid,
  ...CommonStyles.horizontalCenter,
  ...CommonStyles.verticalCenter,
  borderRadius: 2
},
detailButtonText: {
  ...CommonStyles.fontFamily,
  color: 'white'
}
});

export default ProductComponent;
