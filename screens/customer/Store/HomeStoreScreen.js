import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';


import { Center, CheckIcon, HStack, Image, Select, Text, } from 'native-base';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';

import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, MAIN_ROUTES, showAlertLogin, showToaster } from '../../../util/constants';
import ProductListing from '../../../components/customer-components/ProductsListing.component';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';

import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useFiltrado } from '../../../hooks/useFiltrado';
import { ListEmpty } from '../../../components/Vendor/ListEmpty';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import { getUserId } from '../../../util/local-storage/auth_service';
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton';
import { useStoreLocation } from '../../../hooks/useStoreLocation';
import { useCart } from '../../../hooks/useCart';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { useLocation } from '../../../hooks/useLocation';





const HomeStoreScreen = React.memo((props) => {
  const {
    getCategorias,
    categorias, activeCategory, activarCategoria,
    comision,
    loading, carCompatible, productos, isLoading, getProducts,
  } = useContext(ProductContext);
  const [addresses, setAddresses] = useState(null)
  const { carActive, address } = useSelector(state => state.user);

  const direccionStore = useSelector(state => state.user.addresses);

  const [defaultAddress, setDefaultAddress] = useState(address?._id ?? null)

  const dispatch = useDispatch()
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);

  const { addItemToCart } = useCart()
const { getLocationHook } = useLocation()


  

  const CategoryButton = ({ category, onPress }) => {

    return (
      <View style={{ alignItems: 'center' }} >
        <TouchableOpacity onPress={onPress} style={[styles.categoryButton,
        {
          borderBottomWidth: activeCategory?.name === category ? 2 : 0,
          borderColor: Colors.brightBlue
        }]}>
          <Text style={styles.categoryButtonText} >
            {category}
          </Text>

        </TouchableOpacity>

      </View>
    )
  }



  const renderItem = ({ item }) => {

    return (
      <View key={item._id} style={{
        flex: 1,
        // alignItems: 'center', 
        marginVertical: 5,
        marginHorizontal: 10
      }} >
        {
          !isLoading && (
            <ProductListing
              navigation={props.navigation}
              category={item}
              products={item}
              comision={comision}
              carCompatible={carCompatible}
              dispatch={dispatch}
              cartProductIds={cartProductIds}
              addItemToCart={addItemToCart}
            />
          )
        }

      </View>

    )
  }
  const memorizedProductos = useMemo(() => renderItem, [productos]);

  const renderItemCategorias = ({ item }) => (
    <CategoryButton
      onPress={() => {

        activarCategoria(item)
      }}
      category={item.name}
    />
  )

  const memorizedValueCategoria = useMemo(() => renderItemCategorias, [categorias, activeCategory]);

  const getAddresses = async () => {
    try {

      const userId = await getUserId();

      const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userId}`);



      if (apiCall?.data?.data.length <= 0) {
        if (direccionStore) {
          const data = {
            _id: 1,
            ...direccionStore[0]
          }

          setAddresses([data]);
          setDefaultAddress(1)
          return
        }

        Alert.alert('No tienes ninguna direccion', 'Crea una direccion', [
          {
            text: 'Cancelar',
            onPress: () => props.navigation.goBack(),
            style: 'cancel',
          },
          { text: 'Crear', onPress: () => props.navigation.navigate('Mi dirección') },
        ]);
      } else {
        setAddresses(apiCall.data.data);
        if (apiCall?.data?.data.length > 0) {
          setDefaultAddress(apiCall.data.data[0]._id)

        } else {
          setDefaultAddress(null)
        }
      }

    } catch (e) {
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2')
    }

  }





  const handleAddress = (address) => {

    setDefaultAddress(address)
  }


  useEffect(() => {
    getLocationHook()
}, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {

      if (isMounted) {
        await getAddresses();
      }

    };

    fetchData(); // Llamada a la función asíncrona

    return () => {
      isMounted = false;
    }
  }, [])






  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {
          if (!addresses) return;


          const findAddres = addresses.find(item => item?._id === defaultAddress);


          await getProducts(activeCategory, carActive, findAddres);
        }
      } catch (error) {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2');
      }
    };

    if (activeCategory && carActive && defaultAddress && addresses && !isLoading) {
      fetchData(); // Llamar a la función asíncrona
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [activeCategory, carActive, defaultAddress, addresses]);



  if (!addresses && isLoading) return <ServiceSkeleton />



  const goToMyAddress = () => {
    props.navigation.navigate(MAIN_ROUTES.CUSTOMER_STACK);
  };






  return (
    <View style={{
      ...CommonStyles.flexOne,
      backgroundColor: Colors.white
    }}>


      <View style={{ flex: 1, backgroundColor: Colors.white }} >
        <View style={{
          backgroundColor: 'transparent',
          paddingVertical: 0
        }}>

          <Text style={{ ...CommonStyles.h1, color: Colors.black, fontWeight: 'bold', marginLeft: 10, paddingVertical: 10 }} >
            Categorías
          </Text>

          <FlatList
            data={categorias}
            horizontal
            keyExtractor={item => item?._id}
            renderItem={memorizedValueCategoria}
            showsHorizontalScrollIndicator={false}

          />
        </View>
        <HStack alignItems={'center'} justifyContent={'center'} space={1} mt={1} size={'xs'} >


          {
            direccionStore.length <= 0 ? (
              <BtnPrincipal onPress={goToMyAddress} text={'Crear una direccion'} marginHorizontal={1} />
            ) : (
              <>
                <Image
                  source={require('../../../assets/images/1.png')}
                  alt='dirrecion'
                  style={styles.icon}
                />
                <Select
                  selectedValue={defaultAddress}
                  defaultValue={defaultAddress}
                  minWidth={deviceWidth - 60}
                  accessibilityLabel="Elegir direccion"
                  placeholder={'Elegir direccion'}
                  placeholderTextColor={Colors.white}
                  variant='unstyled'
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }}

                  onValueChange={itemValue => handleAddress(itemValue)}
                  borderColor={Colors.bgColor}
                  color={Colors.bgColor}
                  backgroundColor={Colors.white}
                  size={'xs'}
                >
                  {
                    direccionStore.map((item) => (
                      <Select.Item key={item._id} label={item.formatted_address} value={item._id} />
                    ))
                  }


                </Select>
              </>

            )

          }

        </HStack>

        {/* PRODUCTOS */}
        <View style={{ marginTop: 5 }}>
          {
            comision && !isLoading
              ?
              (
                <>
                  <FlatList
                    data={productos}
                    keyExtractor={item => item?._id}
                    renderItem={memorizedProductos}
                    contentContainerStyle={{ marginTop: 15 }}
                    numColumns={2} // Set the number of columns to 2
                    columnWrapperStyle={{ justifyContent: 'center' }}
                    ListFooterComponent={<View style={{ width: '100%', marginBottom: 10, height: deviceHeight * 20 / 100 }} />}
                    showsVerticalScrollIndicator={false}

                    refreshing={loading}
                    ListEmptyComponent={() => <Center>
                      <ListEmpty msg={direccionStore.length <= 0 ? 'Necesitas agregar tu dirección' :'No hay productos para tu vehiculo'} />
                    </Center>
                    }
                  />
                </>


              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator />
                  <Text>Cargando...</Text>
                </View>
              )
          }


          <View style={{ height: deviceWidth * 0.05, width: deviceWidth, marginVertical: 30 }} />
        </View>
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 13,
    backgroundColor: Colors.white,
    ...CommonStyles.flexCenter,

    margin: 5,
    // borderRadius: 100,
    // paddingHorizontal: 15
    // elevation:2,
    // width:50,
    // height:50
  },
  categoryButtonText: {

    ...CommonStyles.h2,
    color: Colors.black
  },
  offerCardImg: {
    width: '93%',
    height: 170,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10
  },
  picker: {
    width: deviceWidth / 2.2,

  },
  filterContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    // zIndex:2
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    zIndex: 2,

  },
  reset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  btnReset: {
    marginVertical: 10
  },
  txtReset: {
    borderBottomWidth: 1,
    color: Colors.primarySolid,
    borderColor: Colors.primarySolid,
    fontSize: adjust(10)
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
})
export default HomeStoreScreen;
