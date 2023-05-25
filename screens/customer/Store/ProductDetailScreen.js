import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, ScrollView, Image, useWindowDimensions, Linking, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';
import ButtonComponent from '../../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url, customer_api_urls } from '../../../util/api/api_essentials';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { HeaderBackground } from '../../../components/Background/HeaderBackground';
import { ThinlineSeparator } from '../../../components/CommonComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moneda } from '../../../util/Moneda';
import { useCart } from '../../../hooks/useCart'
import { ProductImg } from '../../../components/image-carousel/ProductImg';
import { ChatContext } from '../../../util/context/Chat/ChatContext';
import { getUserId } from '../../../util/local-storage/auth_service';
import { CardFeedback } from '../../../components/Feedback/CardFeedback';
import { Card, Center, HStack, VStack } from 'native-base';
import { decreaseQuantity, increaseQuantity } from '../../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch } from 'react-redux';
import { BtnCantidad } from '../../../components/button/BtnCantidad';




const ProductDetailScreen = (props) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [business, setBusiness] = useState(null);
  const { params } = useRoute();
  const [enCarrito, setEnCarrito] = useState(false)
  const product = params?.product;
  const comision = params?.comision;
  const { addItemToCart, inTheCart } = useCart()
  const isChange = useRef(false);
  const [isDisable, setIsDisable] = useState(false);



  useEffect(() => {
    setEnCarrito(inTheCart(product))
  }, [isChange.current])


  const handleChange = async () => {
    setIsDisable(true)
    const { data } = await axios.get(`${customer_api_urls.inStock_product}/${product._id}`)

    if (data?.product) {

      addItemToCart(product)

      isChange.current = !isChange.current

    } else {
      showToaster('Producto sin existencias, lamentamos el inconveniente.')
    }
    setIsDisable(false)

  }

  const getBusinessDetails = async () => {
    try {
     
      const businessDetailsAPi = await axios.get(`${customer_api_urls.get_business_details}/${product?.business_id}`)
      if (businessDetailsAPi.status == api_statuses.success) {
        setBusiness(businessDetailsAPi.data.data.store);

      } else {
        showToaster('Algo salio mal code 1')
      }
    } catch (e) {
      showToaster('No se pudo traer informacion del vendedor')


    }
  }

  const increaseQuantity = () => {
    dispatch(CartActions.increaseQuantity(product._id, product?.price));
  }
  const decreaseQuantity = () => {
    dispatch(CartActions.decreaseQuantity(product._id, product?.price));
  }







  useEffect(() => {
    getBusinessDetails()
  }, []);

 


  


  return (
    <>
      <View
      style={[CommonStyles.screenWhiteY]}
      >


        <Card 
        style={styles.cardImg} >
          <Text style={[CommonStyles.h2,{color:Colors.black,fontWeight:'bold',marginBottom:10}]} >{product?.category?.name} / {product?.subCategory?.name}</Text>
          
          <Center>
          {
            product?.urlsImg ? (
              product?.urlsImg?.length > 0 ? (
                <ProductImg imgs={product?.urlsImg} />
              ) : (
                <Image
                  source={{ uri: `${base_url}/${product?.productImg}` }}
                  style={styles.productImg}
                />
              )
            ) : (
              <Image
                source={{ uri: `${base_url}/${product?.productImg}` }}
                style={styles.productImg}
              />
            )
          }
          </Center>
          



        </Card>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack space={2} style={styles.detailCard} >
            <Text style={{...CommonStyles.h1,color:Colors.black, fontWeight:'bold'}} >{product?.name}</Text>

            <Text style={{...CommonStyles.h2,color:Colors.black}} >{`${moneda(Number(product?.price) + Number(comision * product?.price / 100))} MXN`}</Text>
            

            <HStack justifyContent={'space-between'} alignItems={'center'} >
              <Text style={{...CommonStyles.h2,color:Colors.black,fontWeight:'bold'}} >Cantidad</Text>
              <BtnCantidad 
              increaseQuantity={increaseQuantity} 
              decreaseQuantity={decreaseQuantity} 
              product={product}
              />

            </HStack>
            <Center>
              <ButtonComponent
                disabled={isDisable}
                buttonText={
                  enCarrito
                    ? 'Quitar del carrito'
                    : 'Añadir a carrito'
                }
                borderRadius={20}
                // colorB={Colors.primaryColor}
                width={width * 0.8}
                handlePress={handleChange}
              />
            </Center>
            

          </VStack>
          <View style={{ backgroundColor: Colors.white, elevation: 1, marginTop: 10, padding: 10 }} >
           
            <Text
              style={styles.cardSubtitle}>
              {product?.description}
            </Text>
          </View>




        </ScrollView>

        <View style={{ position: 'absolute', bottom: 0 }} >


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
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    //  borderWidth:1,
    // ...CommonStyles.horizontalCenter,
    justifyContent: 'space-between',
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardImg:{
    // Add the shadow properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,

    // Add other styles as needed
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal:10,
    top:-5
    // alignItems:'center'
  
  },
  headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20 },
  detailCard: {
    marginHorizontal:10,
    backgroundColor:Colors.white
  },
  productImg: {
    width: deviceWidth,
    height: 240,
    resizeMode: 'contain'
  },
  cardTitle: {
    fontWeight: 'bold',
    ...CommonStyles.fontFamily,
    fontSize: adjust(15),

  },
  cardSubtitle: {
    ...CommonStyles.fontFamily,
    ...CommonStyles.h3,
    marginVertical: 20,
    color:Colors.black
  }
})

export default ProductDetailScreen;
