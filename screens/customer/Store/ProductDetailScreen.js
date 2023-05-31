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
import { Box, Button, Card, Center, HStack, VStack } from 'native-base';
import { decreaseQuantity, increaseQuantity } from '../../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch } from 'react-redux';
import { BtnCantidad } from '../../../components/button/BtnCantidad';
import ModalChildren from '../../../components/ModalChildren';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';




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
  const [showModal, setShowModal] = useState(false)


  useEffect(() => {
    setEnCarrito(inTheCart(product))
  }, [isChange.current])


  const handleChange = async () => {
    try {
      if (isDisable) {
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

// console.log(product);

  const goCart = async () => {
    const user_id = await getUserId();

    setShowModal(false)
    if (user_id) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)
    } else {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }

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
