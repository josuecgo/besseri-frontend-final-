import React from 'react';
import {Text, View,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import ButtonComponent from '../button/button.component';
const OrderCard = ({data,onPress,isRider}) => {
  return (
    <View style={styles.cardContainer}>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{...CommonStyles.fontFamily,fontSize:15}}>#{data?.orderId}</Text>
        <Text style={{...CommonStyles.fontFamily}}>{moment(data?.ordered_on).format('DD-MM-YYYY hh:mm A')}</Text>
    </View>
    <View>
        <Text style={{...CommonStyles.fontFamily,fontSize:15,paddingVertical:5}}>{data?.store?.storeName}</Text>
        <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
            <Text style={{fontSize:15,...CommonStyles.fontFamily}}>Items: {data?.products?.length}</Text>
            <Text style={{...CommonStyles.fontFamily}}>Total Amount: {data?.total_amount} MXN</Text>
        </View>
      {
        isRider ? 
        <View>
        <Text style={{...CommonStyles.fontFamily,
        paddingVertical:10,color:'grey'}}>{data?.order_status_code == 'PARCEL_DELIVERED' ? 'You successfully delivered this order on' : 'You have to deliver this order before'} <Text style={{color:data?.order_status_code == 'PARCEL_DELIVERED' ? 'green':'red'}}>{moment(data?.order_status_code == 'PARCEL_DELIVERED' ? data?.delivered_on :   data?.to_deliver_on).format('DD - MMMM - YYYY')}</Text></Text>
      </View>
      :
      null
      }
        <View style={{marginTop:10,...CommonStyles.flexDirectionRow,...CommonStyles.justifySpaceBetween,...CommonStyles.horizontalCenter}}>
          <ButtonComponent
          handlePress={onPress}
          buttonText={'Details'}
          width={'80%'}
          colorB={Colors.primaryColor}
          borderRadius={100}
          />
          <Text style={{color:Colors.brightBlue,...CommonStyles.fontFamily,fontSize:17}}>{data?.order_status}</Text>
        </View>
    </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer:{
    width:'95%',
    minHeight:100,
    borderWidth:2,
    borderColor:Colors.white,
    backgroundColor:'white',
    elevation:3,
    margin:15,
    alignSelf:'center',
    paddingHorizontal:15,
    paddingVertical:15,
    borderRadius:10
},
 labelCircle:{
     width:40,
     height:40,
     borderWidth:1,
     borderColor:Colors.darkPink,
     backgroundColor:Colors.lightPink,
     ...CommonStyles.flexCenter,
     borderRadius:40/2
 },
 flexWrapper:{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,paddingLeft:5,paddingTop:5}
})

export default OrderCard;
