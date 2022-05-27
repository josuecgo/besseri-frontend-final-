import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Colors from '../util/styles/colors';
import { getBusinessId } from '../util/local-storage/auth_service';
import { api_statuses, api_urls, base_url, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster, VENDOR_DETAILS_ROUTES } from '../util/constants';

import { adjust, deviceWidth } from '../util/Dimentions';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { moneda } from '../util/Moneda';

export const NotificationCard = ({item,orderDetail}) => {
  const {_id,orderId} = item?.body;
  const [order, setOrder] = useState([]);
  const [orderStatus, setOrderStatus] = useState([])
  const [loading, setLoading] = useState(false);

 
  const getOrderDetails = async() => {
    try {
      setLoading(true)
     const apiCall = await axios.get(`${api_urls.get_order_details}/${_id}`);
    
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        setOrder(apiCall.data.data[0]);
      
        setOrderStatus(apiCall.data.data[0]?.order_status_code)
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo 1');
      //  navigation.goBack()
     }
    } catch(e) {
      setLoading(false);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo 2');
     
    }
  }


  useEffect(() => {
    getOrderDetails();
  }, [])
  
  

  

  
  

  return (
    <View >
   
      
      <Text style={styles.titulo} >{item.titulo}</Text>
      <View style={styles.contentFecha} >
        <MaterialIcons name='event' color={Colors.textSecundary} />
        <Text style={styles.fecha} >{moment(item?.date).format('DD - MMMM - YY')}</Text>
      </View>
     
      <View style={{height:100}} >
        <ScrollView  contentContainerStyle={styles.scroll} >
        {
          order?.products && order?.products.map((item) => (
            <View key={item._id} style={styles.details}  >
              <View style={{flexDirection:'row', alignItems:'center',marginRight:20}} >
                <Image source={{ uri: `${base_url}/${item?.productImg}` }} style={styles.imageStyles} />
               
              </View>
              <View>
                <Text style={styles.name} >{item.name}</Text>
                <Text style={styles.price}>{moneda(item.price)}</Text>
              </View>
             
              
            </View>
          ))
        }
        </ScrollView>
      
      
      </View>
      
     
      </View>
  );
};

const d = [
  {
    _id: '628bf1e5726ae4b8f1318748',
    body: {
      __v: 0,
      _id: '628bf1e5726ae4b8f1318746',
      assigned_to_rider_on: null,
      besseri_comission: 3,
      chargeId: 'pi_3L2i5SEZl12SIefH0tK6kHA9',
      delivered_on: null,
      delivery_address: {
        __v: 0,
        _id: '62851ac759efa41d4ba21227',
        addressLine: 'Calle principal',
        created_on: '2022-05-18T16:11:51.019Z',
        info: 'Repartidor',
        label: 'Home',
        latitude: 18.066576,
        longitude: -93.169733,
        phone: '9141272333',
        userId: '62851a4d59efa41d4ba21209',
      },
      delivery_fee: 12.02,
      delivery_security_code: '314td',
      orderId: 'BESS-45',
      order_status: 'Processing',
      order_status_code: 'PROCESSING',
      ordered_by_id: '62851a4d59efa41d4ba21209',
      ordered_on: '2022-05-23T20:43:17.178Z',
      products: [[Object]],
      rating: null,
      review: null,
      riderId: null,
      storeId: '628bde138adad296b8c8b629',
      to_deliver_on: null,
      total_amount: 55,
      view: false,
    },
    date: '2022-05-23T20:43:17.270Z',
    titulo: "Hola Mario'Store, has recibido un pedido de Ezequiel 🎉",
  },
];


const styles = StyleSheet.create({
  
  titulo:{
    fontSize:adjust(12),
    fontWeight:'bold',

  },
  scroll:{
    
    
  },
  details:{
    marginVertical:5,
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    // justifyContent:'space-around'
  },
  name:{
    fontSize:adjust(10)
  },
  price:{
    fontSize:adjust(8)
  },
  contentFecha:{
    flexDirection:'row', 
    // justifyContent:'space-between', 
    alignItems:'center',
    marginTop:5,
    marginBottom:10,
    flexGrow:2
  },
  fecha:{
    color:Colors.textSecundary,
    left:5
  },
  imageStyles: {
    height: deviceWidth * 0.10,
    width: deviceWidth * 0.10,
    borderRadius:  5,
    marginHorizontal:5
  },
});