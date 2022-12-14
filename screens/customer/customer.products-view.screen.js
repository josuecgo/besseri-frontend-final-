import React, {  useContext, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, FlatList, ActivityIndicator } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';

import {  CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import DropDownPicker from 'react-native-dropdown-picker';

import { ProductContext } from '../../util/context/Product/ProductContext';
import { useFiltrado } from '../../hooks/useFiltrado';
import { SelectFilter } from '../../components/SelectFilter';
import { Empty } from '../../components/Customer/Empty';





const CustomerProductsViewScreen = React.memo((props) => {



  const {
    categorias,
    comision,modelo,
    resetFiltro,productFiltrado,getProducts,loading
  } = useContext(ProductContext);

  
  const {productFilter,loadingFilter} = useFiltrado();
 

  const CategoryButton = ({ category,onPress }) => {
    return (
      <View style={{alignItems:'center'}} >
        <TouchableOpacity onPress={onPress} style={styles.categoryButton}>
          <Text style={styles.categoryButtonText} >
                {category}
          </Text>
            
        </TouchableOpacity>
       
      </View>
    )
  }

  



  const renderItem = ({item}) => {
   
    return(
      <ProductListing
      navigation={props.navigation}
      category={item} 
      products={ productFilter.filter(product => product.categoryId == item._id) } 
      comision={comision}
      />
    )
  }

  const renderItemCategorias = ({item}) => (
    <CategoryButton
    onPress={() => {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MORE_PRODUCTS,{category:item})
    }}
    category={item.name} 
    />
  )

  const memorizedValueCategoria = useMemo(() => renderItemCategorias, [categorias]);

  const memorizedValue = useMemo(() => renderItem, [productFilter]);

   
  
  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor }}>
            
     
      
      <View style={{flex:1,backgroundColor:Colors.bgColor}} >
        
        <View style={Platform.OS === 'ios' ? styles.filterContainer : styles.filterContainer2}>
          <SelectFilter/>
       
        </View>
        <View style={styles.reset} >
          {
            modelo && (
              <TouchableOpacity 
              onPress={resetFiltro}
              style={styles.btnReset} 
              >
                <Text style={styles.txtReset} >Limpiar filtros</Text>
              </TouchableOpacity>
              
            )
            
          }
          
        </View>

          
        <View style={{ 
          paddingVertical: 5,
          backgroundColor: 'transparent',
          alignSelf: 'flex-start', flexDirection: 'row' ,
         
        }}>
         
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
            comision && !!productFiltrado && !loadingFilter
            ?
            (
              <FlatList
              data={categorias}
              initialNumToRender={5}
              keyExtractor={item => item?._id}
              renderItem={memorizedValue}
             
              ListFooterComponent={<View style={{width:'100%',marginBottom:10,height:deviceHeight * 20 / 100}} />}
              showsVerticalScrollIndicator={false}
              onRefresh={() => {
                
                getProducts();

              }}
              refreshing={loading}
              />
             
            ):(
              <View
              style={{
              alignItems:'center',
              justifyContent: 'center',
              }}>
                <ActivityIndicator/>
                <Text>Cargando</Text>                        
              </View>
            )
          }

         
        <View style={{height:deviceWidth *0.05,width:deviceWidth,marginVertical:30}} />
        </View>
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  categoryButton: {
    padding: 8,
    backgroundColor: Colors.white,
    ...CommonStyles.flexCenter,
    margin: 5,
    borderRadius: 100,
    // paddingHorizontal: 15
    // elevation:2,
    // width:50,
    // height:50
  },
  categoryButtonText: {
    ...CommonStyles.fontFamily,
    color:Colors.textPrimary,
    fontWeight:'bold',
    fontSize:adjust(8),

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
    zIndex:2,
    
  },
  reset:{
    
    alignItems:'flex-end',
    marginHorizontal:10
  },
  btnReset:{
   marginVertical:10
  },
  txtReset:{
    borderBottomWidth:1,
    color:Colors.primarySolid,
    borderColor:Colors.primarySolid,
    fontSize:adjust(10)
  }
})
export default CustomerProductsViewScreen;
