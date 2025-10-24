import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';

import { Center, Fab, Text, } from 'native-base';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';

import { CUSTOMER_HOME_SCREEN_ROUTES, MAIN_ROUTES, showToaster } from '../../../util/constants';
import ProductListing from '../../../components/customer-components/ProductsListing.component';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';

import { ProductContext } from '../../../util/context/Product/ProductContext';
import { ListEmpty } from '../../../components/Vendor/ListEmpty';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import { getUser, getUserId } from '../../../util/local-storage/auth_service';
import { ServiceSkeleton } from '../../../components/Services/ServiceSkeleton';
import { useCart } from '../../../hooks/useCart';
import { useLocation } from '../../../hooks/useLocation';
import { SelectCar } from '../../../components/Customer/SelectCar';
import HeaderStore from '../../../components/Customer/HeaderStore';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';





const HomeStoreScreen = (props) => {
  const {
    categorias, activeCategory, activarCategoria,
    comision,
    loading, productos, isLoading, getProducts,
  } = useContext(ProductContext);
  const [addresses, setAddresses] = useState(null)
  const { carActive, address, marcaValue, modeloValue, yearValue, user } = useSelector(state => state.user);
  const direccionStore = useSelector(state => state.user.addresses);
  const [defaultAddress, setDefaultAddress] = useState(address?._id ?? 1)
  const dispatch = useDispatch()
  const cartProductIds = useSelector(state => state.cart.cart_items_ids);

  const { addItemToCart } = useCart()
  const { getLocationHook } = useLocation()
  const focused = useIsFocused()
  const {bottom} = useSafeAreaInsets()



  const goQuoteForm = async () => {
    const user = await getUser()
    if (user) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.QUOTE_FORM_SCREEN)
    } else {
      Alert.alert('No has iniciado sesión', 'Inicia sesión o regístrate', [
        {
          text: 'Cancelar',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'Crear', onPress: () => props.navigation.navigate(MAIN_ROUTES.AUTH_STACK) },
      ]);
    }
  }


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

              dispatch={dispatch}
              cartProductIds={cartProductIds}
              addItemToCart={addItemToCart}
            />
          )
        }

      </View>

    )
  }





  const renderItemCategorias = ({ item }) => (
    <CategoryButton
      onPress={() => {

        activarCategoria(item)
      }}
      category={item.name}
    />
  )


  const memorizedProductos = useMemo(() => renderItem, [productos]);

  const memorizedValueCategoria = useMemo(() => renderItemCategorias, [categorias, activeCategory]);




  useEffect(() => {
    if (focused && direccionStore.length === 0) {


      getLocationHook()
    }

  }, [focused, direccionStore]);





  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {


          if (!addresses && !direccionStore) return;


          const address = direccionStore[defaultAddress - 1] || direccionStore.find(item => item?._id === defaultAddress)

          const car = carActive ? carActive : {
            maker: { _id: marcaValue },
            model: { _id: modeloValue },
            year: yearValue
          }

          // console.log(car,'car');


          await getProducts(activeCategory, car, address);
        }
      } catch (error) {


        showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 3');
      }
    };

    if (activeCategory && defaultAddress && direccionStore && !isLoading) {
      fetchData(); // Llamar a la función asíncrona
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [activeCategory, defaultAddress, direccionStore, marcaValue, modeloValue, yearValue, carActive]);








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

        {
          user?.role !== 'client' && (
            <SelectCar />
          )
        }



        <View style={{ marginTop: 0 }}>

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
                      <ListEmpty msg={direccionStore.length <= 0 ? 'Necesitas agregar tu dirección' : 'No hay productos para tu vehiculo'} />
                    </Center>
                    }
                  />
                </>


              ) : !addresses && isLoading ? (
                <ServiceSkeleton />
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

          {focused && (
            <Fab
              label="COTIZAR"
              size='lg'
              marginBottom={79}

              onPress={goQuoteForm}
              backgroundColor={Colors.primarySolid}
            />
          )
          }

          <View style={{ height: deviceWidth * 0.05, width: deviceWidth, marginVertical: 30 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 13,
    backgroundColor: Colors.white,
    ...CommonStyles.flexCenter,
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
