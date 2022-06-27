import React, { useEffect, useState,useRef } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, Platform, ScrollView,Image, useWindowDimensions, Linking} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import { showToaster } from '../../util/constants';


import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url, customer_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { ThinlineSeparator } from '../../components/CommonComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moneda } from '../../util/Moneda';
import { useCart } from '../../hooks/useCart'

const CustomerProductDetailScreen = (props) => {
  const {width} = useWindowDimensions();
  const [business,setBusiness] = useState(null);
  const {params} = useRoute();
  const [enCarrito, setEnCarrito] = useState(false)
  const product = params?.product;
  const comision = params?.comision;
  const {top} = useSafeAreaInsets()
  const {addItemToCart,inTheCart,inCart} = useCart()
  const isChange = useRef(false);


  useEffect(() => {
    setEnCarrito(inTheCart(product))
  }, [isChange.current])

 
  const handleChange = () => {
    addItemToCart(product)
    isChange.current = !isChange.current
  }

  const getBusinessDetails = async() => {
    try {
     const businessDetailsAPi = await axios.get(`${customer_api_urls.get_business_details}/${product?.business_id}`)
     if(businessDetailsAPi.status == api_statuses.success) {
       setBusiness(businessDetailsAPi.data.data.store);
       
     } else {
       showToaster('Algo salio mal')
     }
    } catch(e) {
        showToaster('Algo salio mal')
    }
  }
  useEffect(() => {
    getBusinessDetails()
  },[]);


  const DetailItem = ({label, value,size = 15,sizeValue = 13}) => {
    return (
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'}}>
        <Text
          style={{
            ...CommonStyles.fontFamily,
            fontSize: adjust(size),
            color: Colors.primarySolid,
          }}>
          {label}
        </Text>
        <Text style={{...CommonStyles.fontFamily, fontSize: adjust(sizeValue)}}> {value}</Text>
      </View>
    );
  };


 
  return (
    <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:Colors.bgColor}}>
        <View style={{flex:1}}>
          <HeaderBackground/>
          
            <View style={styles.header} >
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <MaterialCommunityIcons
                    name='keyboard-backspace'
                    color={Colors.white}
                    size={30}
                    style={{left:10}}
                    />
              </TouchableOpacity>

              <Text style={{fontSize:adjust(18),color:Colors.white}}>Detalles de producto</Text>

              <View style={{width:23,height:30}} />
            </View>

            









            <View style={{backgroundColor:Colors.white,elevation:1,marginBottom:10}} >
                      <Image
                      source={{uri: `${base_url}/${product?.productImg}`}}
                      style={{
                          width: deviceWidth,
                          height: 240,
                          // borderRadius: 10,
                      }}
                      resizeMode='stretch'
                      />    
            </View>

            <View style={{backgroundColor:Colors.white,marginHorizontal:15,paddingVertical:10,elevation:1}} >
                     
                      
                      <DetailItem label={product?.name} />
                      <DetailItem label={'Marca: '} value={product?.brand.name} size={12} sizeValue={13} />
                      <ThinlineSeparator margin={5} width={'95%'} />
                      <DetailItem 
                      label={'Precio: '} 
                      value={`${moneda(Number(product?.price) + Number( comision * product?.price / 100))} MXN`}
                      size={12} sizeValue={13}
                      />
                      <DetailItem 
                      label={'Tiempo de entrega: '} 
                      value={`${product?.estimatedDelivery} aprox.`}
                      size={12} sizeValue={13}
                      />
                      
                      {/* <DetailItem label={'Modelo: '} value={`${product?.model?.name}`} />
                      <DetailItem label={'Marca: '} value={`${product?.maker?.name}`} />
                      <DetailItem label={'Estado: '} value={`${product?.condition}`} /> */}
                  
                  
            </View>
          
          <View style={{backgroundColor:Colors.white,elevation:2,marginHorizontal:15,marginTop:10,padding:10}} >
              <Text
                  style={{
                  ...CommonStyles.fontFamily,
                  fontSize: adjust(15),
                  }}>
                  DESCRIPCIÓN
              </Text>
              <Text
                  style={{
                  ...CommonStyles.fontFamily,
                  color: 'grey',
                  marginVertical: 20,
                  fontSize: adjust(13),
                  }}>
                  {product?.description}
              </Text>
          </View>



          <View style={{position: 'absolute', bottom: 10 + top}}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`mailto:${business?.email}`);
                }}>
                <Text
                  style={{fontSize: 18, textAlign: 'center', marginBottom: 20, textDecorationLine:'underline',}}>
                  Quiero contactar al vendedor.
                </Text>
              </TouchableOpacity>
              <ButtonComponent
                buttonText={
                  enCarrito
                    ? 'QUITAR DEL CARRITO'
                    : 'AÑADIR AL CARRITO'
                }
                borderRadius={0}
                colorB={Colors.terciarySolid}
                width={width}
                handlePress={handleChange}
              />
            </View>

      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
    header:{
      width: '100%',
      height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
      //  borderWidth:1,
      // ...CommonStyles.horizontalCenter,
      justifyContent:'space-between',
      marginBottom:10,
      flexDirection:'row',
      alignItems:'center'
    },
    headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20},
    detailCard:{
        width:'94%',
        backgroundColor:'white',
        elevation:5,
        alignSelf:'center',
        marginTop:'10%',
        padding:20,
        marginBottom:10
    }
})

export default CustomerProductDetailScreen;
