import React, { useEffect, useState, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, ScrollView, Image, useWindowDimensions } from 'react-native';

import axios from 'axios';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';
import ButtonComponent from '../../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, MAIN_ROUTES, showToaster } from '../../../util/constants';
import { useRoute } from '@react-navigation/native';
import {  base_url, customer_api_urls } from '../../../util/api/api_essentials';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moneda } from '../../../util/Moneda';
import { useCart } from '../../../hooks/useCart'
import { ProductImg } from '../../../components/image-carousel/ProductImg';
import { getUserId } from '../../../util/local-storage/auth_service';
import { CardFeedback } from '../../../components/Feedback/CardFeedback';
import { Box, Button, Card, Center, HStack, VStack } from 'native-base';

import ModalChildren from '../../../components/ModalChildren';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { Alert } from 'react-native';




const ProductDetailScreen = (props) => {
  const { width } = useWindowDimensions();
  const {bottom} = useSafeAreaInsets()
  const [feedback, setFeedback] = useState([]);
  const { params } = useRoute();
  const [enCarrito, setEnCarrito] = useState(false)
  const product = params?.product;
  const comision = params?.comision;
  const { addItemToCart, inTheCart } = useCart()
  const isChange = useRef(false);
  const [isDisable, setIsDisable] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const isMounted = useRef(true);

  useEffect(() => {
    setEnCarrito(inTheCart(product))
  }, [isChange.current])


  const handleChange = async () => {
    try {
      const userId = await getUserId()
      if (isDisable) {
        return
      }

      if (!userId) {
        Alert.alert('No has iniciado sesión', 'Inicia sesión o regístrate', [
          {
            text: 'Cancelar',
            onPress: () => props.navigation.goBack(),
            style: 'cancel',
          },
          { text: 'Crear', onPress: () => props.navigation.navigate(MAIN_ROUTES.AUTH_STACK) },
        ]);
        return 
      }
      setIsDisable(true)
 
      const { data } = await axios.get(`${customer_api_urls.inStock_product}/${product._id}`)

      if (data?.product) {
        let resp = addItemToCart(product)
     
        setShowModal(resp)
        isChange.current = !isChange.current

      } else {
        showToaster('Producto sin existencias, lamentamos el inconveniente.')
      }
    

    setIsDisable(false)
    } catch (error) {
      setIsDisable(false)
    }

  }
  const goReviews = () => {
    if (feedback.length === 0) {
      return
    }
    props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_REVIEWS,feedback)
  }



  const getFeedbacks = async() => {
    try {
      const apiCall = await axios.get(`${customer_api_urls.get_feedback}/${product?._id}`);

      
      if (apiCall.status === 200) {
        if (isMounted) {
          setFeedback(apiCall?.data?.data)
        }
      
      }
     } catch(e) {
        //  showToaster('No se pudo traer informacion del vendedor')
        
         setFeedback([])
     }
  }

  const goCart = async () => {
    const user_id = await getUserId();
    if (isMounted.current) {
      setShowModal(false);
      if (user_id) {
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK);
      } else {
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR);
      }
    }
  };
  
  const incrementPriece = (price, discount) => {
    let increase = (price * discount) / 100;
    // Sumar el 10% al precio original
    let newPrice = price + increase;

    return moneda(newPrice);
  }

  

useEffect(() => {
    isMounted.current = true;
    getFeedbacks();

    return () => {
        isMounted.current = false; // Marca como no montado al desmontar
    };
}, []);


  
  return (
    <>
      <View
      style={[CommonStyles.screenWhiteY,{paddingBottom:bottom + 20}]}
      >


       


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
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
          <VStack space={2} style={styles.detailCard} >
          <Text style={{...CommonStyles.h1,color:Colors.black, fontWeight:'bold'}} >{product?.name}</Text>
            {
               product?.discount > 0 && (
                <Text 
                style={{...CommonStyles.h2,color:'#727272',textDecorationLine:'line-through'}}
                >
                  {incrementPriece((Number(product?.price) + Number(comision * product?.price / 100)),product?.discount)} MXN
                </Text>
              )
            }
            
            <HStack alignItems={'center'}  >
            <Text style={{...CommonStyles.h2,color:Colors.black}} >{`${moneda(Number(product?.price) + Number(comision * product?.price / 100))} MXN `}</Text>
            {
               product?.discount > 0 && (
                <Text 
                style={{...CommonStyles.h2,color:'#727272',fontWeight:'bold'}}
                >
                  {product?.discount}% OFF
                </Text>
              )
            }

            </HStack>

            
            

            
            <Center mt={'15px'}>
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

          <View style={styles.description}>
            <Text
              style={styles.cardSubtitle}>
              {product?.description}
            </Text>
          </View>

          {
              feedback.length > 0 && ( 
                <CardFeedback feedback={feedback} onPress={goReviews} colorTxt={Colors.bgColor} />
              )
            }
          
          <ModalChildren showModal={showModal} handleModal={(e) => setShowModal(e)} >
            <Box style={CommonStyles.modal}  >
              <TouchableOpacity style={styles.btnClose} 
              onPress={() => setShowModal(false)}
              >
                <Image
                source={require('../../../assets/images/close.png')}
                style={styles.close}
                />
              </TouchableOpacity>
              <VStack space={2} >
                <Center mb={10}>
                  <Text style={[CommonStyles.h1,{fontWeight:'bold',marginBottom:10}]} >Producto Agregado</Text>
                  <Text style={CommonStyles.h2} >Tu producto ha sido agregado con éxito</Text>
                </Center>
                
                  
                <Button 
                variant={'outline'}  
                _text={{
                  fontWeight: '700',
                  fontSize: '18px',
                  color: Colors.white,
                  fontStyle:'normal'
                }} 
                onPress={() => setShowModal(false)}
                >
                  Seguir en tienda
                </Button>
              
                

                <BtnPrincipal
                text={'Pagar'}
                marginHorizontal={0}
                onPress={goCart}
                />
              </VStack>
              
            </Box>
          </ModalChildren>



        </ScrollView>

        

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
  },
  description:{ 
    backgroundColor: Colors.white, 
    marginTop: 10, 
    padding: 10 
  },
  close:{
    width:30,
    height:30
  },
  btnClose:{
    position:'absolute',
    right:10,
    top:5
  }
})

export default ProductDetailScreen;
