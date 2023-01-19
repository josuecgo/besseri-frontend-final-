import React, { useEffect, useState,useRef, useContext } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, Platform, ScrollView,Image, useWindowDimensions, Linking, Modal} from 'react-native';


import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CommonStyles from '../../util/styles/styles';

import ButtonComponent from '../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';


import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url, customer_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { ThinlineSeparator } from '../../components/CommonComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moneda } from '../../util/Moneda';
import { useCart } from '../../hooks/useCart'
import { ProductImg } from '../../components/image-carousel/ProductImg';
import { ChatContext } from '../../util/context/Chat/ChatContext';
import { getUserId } from '../../util/local-storage/auth_service';

const CustomerProductDetailScreen = (props) => {
  const {width} = useWindowDimensions();
  const [business,setBusiness] = useState(null);
  const {params} = useRoute();
  const [enCarrito, setEnCarrito] = useState(false)
  const product = params?.product;
  const comision = params?.comision;
  const {top} = useSafeAreaInsets()
  const {addItemToCart,inTheCart} = useCart()
  const isChange = useRef(false);
  const [isDisable, setIsDisable] = useState(false);
  
  const {activarChat} = useContext(ChatContext)
 

  useEffect(() => {
    setEnCarrito(inTheCart(product))
  }, [isChange.current])

 
  const handleChange = async() => {
    setIsDisable(true)
    const {data} = await axios.get(`${customer_api_urls.inStock_product}/${product._id}`)
    
    if (data?.product) {
      addItemToCart(product)
      isChange.current = !isChange.current
    }else{
      showToaster('Producto sin existencias, lamentamos el inconveniente.')
    }
    setIsDisable(false)
   
  }

  const getBusinessDetails = async() => {
    try {
     const businessDetailsAPi = await axios.get(`${customer_api_urls.get_business_details}/${product?.business_id}`)
     if(businessDetailsAPi.status == api_statuses.success) {
       setBusiness(businessDetailsAPi.data.data.store);
       
     } else {
       showToaster('Algo salio mal code 1')
     }
    } catch(e) {
        showToaster('No se pudo traer informacion del vendedor')
       
        
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
    <>
        <View style={{flex:1,backgroundColor:Colors.bgColor}}>
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
            <View style={{backgroundColor:Colors.white,elevation:1,marginBottom:5}} >
            {
             product?.urlsImg ? (
              product?.urlsImg?.length > 0 ? (
                <ProductImg imgs={product?.urlsImg} />
                ):(
                  <Image
                    source={{uri: `${base_url}/${product?.productImg}`}}
                    style={styles.productImg}
                  />
                )
             ):(
              <Image
                source={{uri: `${base_url}/${product?.productImg}`}}
                style={styles.productImg}
              />
            )
            }
              {/* {
                product?.urlsImg.length > 0 ? (
                  <ProductImg imgs={product?.urlsImg} />
                ):(
                  <Image
                    source={{uri: `${base_url}/${product?.productImg}`}}
                    style={styles.productImg}
                  />
                )
              } */}

              
            </View>
          

          <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow:1}}
          >
            <View style={{backgroundColor:Colors.white,marginHorizontal:10,paddingVertical:10,elevation:1}} >
                      
                        
                      <DetailItem label={product?.name} />
                      <DetailItem label={'Marca: '} value={product?.brand.name} size={12} sizeValue={13} />
                      <ThinlineSeparator margin={5} width={'95%'} />
                      <DetailItem 
                      label={'Precio: '} 
                      value={`${moneda(Number(product?.price) + Number( comision * product?.price / 100))} MXN`}
                      size={12} sizeValue={13}
                      />
                      {
                        product?.estimatedDelivery && (
                        <DetailItem 
                        label={'Tiempo de entrega: '} 
                        value={`${product?.estimatedDelivery} aprox.`}
                        size={12} sizeValue={13}
                        />
                        )
                      }
                      
                      
                
                  
                  
            </View>
            <View style={{backgroundColor:Colors.white,elevation:2,marginHorizontal:10,marginTop:10,padding:10}} >
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

            <TouchableOpacity
            onPress={async () => {
              // Linking.openURL(`mailto:${business?.email}? subject=Golf 1.8&body=Golf`)
                const id = await getUserId(); 
                await activarChat({
                  de:id,
                  para:business.account_id,
                  room:product._id
                })

                let data = {
                  product,
                  de:id,
                  para:{name:business.storeName}
                }
                
                
                props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.CHAT_SCREEN,{data})
          
                // Linking.openURL(`mailto:${business?.email}?subject=''&body=Producto:${product?.name}
                // Marca:${product?.model?.maker?.name}
                // Modelo: ${product?.model.name}`)
            }}
            style={{
              marginVertical:10,
              marginBottom:50 + top
            }}
            >
              <Text
              style={{fontSize: adjust(15), textAlign: 'center', marginBottom: 20, textDecorationLine:'underline',}}>
                Quiero contactar al vendedor.
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={{position:'absolute',bottom:0}} >


              <ButtonComponent
              disabled={isDisable}
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
    </>
  );
};
const styles = StyleSheet.create({
    header:{
      width: '100%',
      height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
      //  borderWidth:1,
      // ...CommonStyles.horizontalCenter,
      justifyContent:'space-between',
      marginBottom:1,
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
    },
    productImg:{
      width: deviceWidth,
      height: 240,
      resizeMode:'contain'
    }
})

export default CustomerProductDetailScreen;
