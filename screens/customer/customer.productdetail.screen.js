import React, { useEffect, useState } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, Platform, ScrollView,Image, useWindowDimensions, Linking} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { ThinlineSeparator } from '../../components/CommonComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moneda } from '../../util/Moneda';
const CustomerProductDetailScreen = (props) => {
  const {width,height} = useWindowDimensions();
  const [business,setBusiness] = useState(null);
  const {params} = useRoute();
  const product = params?.product;
  const comision = params?.comision;
  const dispatch = useDispatch();
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);
  const {top} = useSafeAreaInsets()

  
  const addItemToCart = () => {
    if(cartProductIds.includes(product?._id)) {
      dispatch(CartActions.removeItemFromCart(product));
      return;
    }
    dispatch(CartActions.addItemToCart({
      ...product,
      quantity:1
    }))
  }
  const getBusinessDetails = async() => {
    try {
     const businessDetailsAPi = await axios.get(`${customer_api_urls.get_business_details}/${product?.business_id}`)
     if(businessDetailsAPi.status == api_statuses.success) {
       setBusiness(businessDetailsAPi.data.data.store);
       
     } else {
       showToaster('something went wrong')
     }
    } catch(e) {
        showToaster('something went wrong')
    }
  }
  useEffect(() => {
    getBusinessDetails()
  },[]);
  const DetailItem = ({label, value}) => {
    return (
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <Text
          style={{
            ...CommonStyles.fontFamily,
            fontSize: adjust(15),
            color: Colors.primarySolid,
          }}>
          {label}
        </Text>
        <Text style={{...CommonStyles.fontFamily, fontSize: adjust(13)}}> {value}</Text>
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
                    <ThinlineSeparator margin={5} width={'95%'} />
                    <DetailItem label={'Precio: '} value={`${moneda(Number(product?.price) + Number( comision * product?.price / 100))} MXN`} />
                    
                    {/* <DetailItem label={'Modelo: '} value={`${product?.model?.name}`} />
                    <DetailItem label={'Marca: '} value={`${product?.maker?.name}`} />
                    <DetailItem label={'Estado: '} value={`${product?.condition}`} /> */}
                
                
          </View>
        
        <View style={{backgroundColor:Colors.white,elevation:2,marginHorizontal:15,marginTop:10,padding:10}} >
            <Text
                style={{
                ...CommonStyles.fontFamily,
               
                fontSize: 17,
                }}>
                DESCRIPCIÓN
            </Text>
            <Text
                style={{
                ...CommonStyles.fontFamily,
                color: 'grey',
                marginVertical: 20,
                fontSize: 16,
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
                cartProductIds?.includes(product?._id)
                  ? 'QUITAR DEL CARRITO'
                  : 'AÑADIR AL CARRITO'
              }
              borderRadius={0}
              colorB={Colors.terciarySolid}
              width={width}
              handlePress={addItemToCart}
            />
          </View>

          {/* <Text style={{fontSize:adjust(18),color:Colors.white}}>{product?.name}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           
                <Image source={{uri:`${base_url}/${product?.productImg}`}} style={{
                  width:'50%',
                  height:240,
                  borderRadius:10
                }}/>
              <View style={{right:15}}>
              <DetailItem label={'Price'} value={`${product?.price} MXN`}/>
              <DetailItem label={'Model'} value={`${product?.model?.name}`}/>
              <DetailItem label={'Maker'} value={`${product?.maker?.name}`}/>
              <DetailItem label={'Condition'} value={`${product?.condition}`}/>
              <DetailItem label={'Brand'} value={`${product?.brand?.name}`}/>

              </View>
            </View>
            <Text style={{...CommonStyles.fontFamily,color:Colors.primaryColor,fontSize:17}}>DESCRIPTION</Text>
            <Text style={{...CommonStyles.fontFamily,color:'grey',marginVertical:20,fontSize:16}}>{product?.description}</Text>
          <View style={{position:'absolute',bottom:10}}> 
          <TouchableOpacity
          onPress={() => {
            Linking.openURL(`mailto:${business?.email}`)
          }}
          >
            <Text style={{fontSize:18,textAlign:'center',marginBottom:20}}>I want to contact seller,</Text>
          </TouchableOpacity>
          <ButtonComponent
            buttonText={cartProductIds?.includes(product?._id) ? 'REMOVE FROM CART' : 'ADD TO CART'}
            borderRadius={5}
            colorB={Colors.brightBlue}
            width={width / 1.1}
            handlePress={addItemToCart}
            />
          </View>
         */}
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
