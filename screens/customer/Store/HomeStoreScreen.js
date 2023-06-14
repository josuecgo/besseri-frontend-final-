import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, ActivityIndicator, Dimensions, Animated, Pressable } from 'react-native';


import { Center, Text, } from 'native-base';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';

import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import ProductListing from '../../../components/customer-components/ProductsListing.component';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';

import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useFiltrado } from '../../../hooks/useFiltrado';
import { ListEmpty } from '../../../components/Vendor/ListEmpty';
import { useSelector } from 'react-redux';





const HomeStoreScreen = React.memo((props) => {
  const {
    getCategorias,
    categorias,activeCategory,activarCategoria,
    comision,
   loading, carCompatible,productos,isLoading,getProducts
  } = useContext(ProductContext);
  
  const { carActive } = useSelector(state => state.user);


  const CategoryButton = ({ category, onPress }) => {
   
    return (
      <View style={{ alignItems: 'center'}} >
        <TouchableOpacity onPress={onPress} style={[styles.categoryButton,
          {
            borderBottomWidth: activeCategory?.name === category ? 2  : 0,
            borderColor:Colors.brightBlue
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
      <ProductListing
        navigation={props.navigation}
        category={item}
        products={productos}
        comision={comision}
        carCompatible={carCompatible}
      />
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

  const memorizedValueCategoria = useMemo(() => renderItemCategorias, [categorias,activeCategory]);

  const memorizedValue = useMemo(() => renderItem, [productos]);




  useEffect(() => {
    let isMounted = true; // Variable para rastrear si el componente está montado
  
    const fetchData = async () => {
      // Realizar la solicitud de API u otras operaciones asíncronas
      try {
        await getProducts(activeCategory, carActive);
        if (isMounted) {
          
        }
      } catch (error) {
        
      }
    };
  
    if (activeCategory && carActive) {
      fetchData(); // Llamar a la función asíncrona
    }
  
    return () => {
      isMounted = false; 
    };
  }, [activeCategory, carActive]);
  

    

  return (
    <View style={{ 
      ...CommonStyles.flexOne, 
      backgroundColor: Colors.white 
      }}>

      <View style={{ flex: 1, backgroundColor: Colors.white }} >
        <View style={{
          backgroundColor: 'transparent',
          paddingVertical:0
        }}>

          <Text style={{ ...CommonStyles.h1, color: Colors.black, fontWeight: 'bold', marginLeft: 10,paddingVertical:10 }} >
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


        <View style={{ flexGrow: 1, marginTop: 5 }}>
          {
            comision && productos && !isLoading
              ?
              (
                <FlatList
                  data={productos}
                  initialNumToRender={5}
                  keyExtractor={item => item?._id}
                  renderItem={memorizedValue}
                  
                  ListFooterComponent={<View style={{ width: '100%', marginBottom: 10, height: deviceHeight * 20 / 100 }} />}
                  showsVerticalScrollIndicator={false}
                  onRefresh={() => {

                    getCategorias();

                  }}
                  refreshing={loading}
                  ListEmptyComponent={() => <Center><ListEmpty msg={'No hay productos para tu vehiculo'} /></Center>}
                 />

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
    color:Colors.black
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
  }
})
export default HomeStoreScreen;
