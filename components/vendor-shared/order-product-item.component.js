import React from 'react';
import {StyleSheet, View,Image} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import {CustomText} from '../../screens/vendor/vendor-order-details.screen';
import Colors from '../../util/styles/colors';
import { base_url } from '../../util/api/api_essentials';
import { moneda } from '../../util/Moneda';

const OrderProductItemComponent = ({
  productId = 458,
  productName = 'Tyres',
  productPrice = '457',
  qtyOrdered = 144,
  img
}) => {
  return (
    <View style={[styles.dataRow, CommonStyles.flexDirectionRow]}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Image
      source={{uri:`${base_url}/${img}`}}
      style={{width:25,height:25,borderRadius:25/2,right:10}}
      />
      </View>
      <CustomText numberOfLines={1} isData={true} text={productName} />
      <CustomText isData={true} text={moneda( productPrice)} />
      <CustomText isData={true} text={qtyOrdered} />
    </View>
  );
};

const styles = StyleSheet.create({
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    paddingVertical: 5,
    backgroundColor: Colors.lighter,
    marginBottom: 2,
  },
});

export default OrderProductItemComponent;
