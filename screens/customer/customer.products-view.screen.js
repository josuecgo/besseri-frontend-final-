import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, Platform, PermissionsAndroid, FlatList } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import {  CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import { adjust, deviceWidth } from '../../util/Dimentions';
import DropDownPicker from 'react-native-dropdown-picker';

import { ProductContext } from '../../util/context/Product/ProductContext';
import { useFiltrado } from '../../hooks/useFiltrado';



const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}


const CustomerProductsViewScreen = React.memo((props) => {


  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const {
    categorias,
    comision,modelo,
    setModelo,marcas,
    setMarcas,valueMaker, setValueMaker,
    valueModel, setValueModel,resetFiltro
  } = useContext(ProductContext)

  const {productFilter} = useFiltrado(props?.route?.name)

 
 

  const CategoryButton = ({ category,onPress }) => {
    return (
      <View style={{alignItems:'center'}} >
        <TouchableOpacity onPress={onPress} style={styles.categoryButton}>
          <Text style={{fontSize:adjust(9)}} >
                {category}
          </Text>
            
        </TouchableOpacity>
       
      </View>
    )
  }

  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor,paddingTop:15 }}>
            
     
      
      <View style={{flex:1}} >
        
        <View style={Platform.OS === 'ios' ? styles.filterContainer : styles.filterContainer2}>
          <DropDownPicker
            open={open}
            value={valueMaker}
            items={marcas}
            setOpen={setOpen}
            setValue={setValueMaker}
            setItems={setMarcas}
            containerStyle={styles.picker}
            style={{borderColor:'white'}}
            placeholder="Marca"
            schema={{label: 'name', value: '_id', testID: '_id'}}
            zIndex={1000}
          />

          {modelo ? (
            <DropDownPicker
              open={openModel}
              value={valueModel}
              items={modelo}
              setOpen={setOpenModel}
              setValue={setValueModel}
              setItems={setModelo}
              containerStyle={styles.picker}
              style={{borderColor:'white'}}
              placeholder="Modelo"
              schema={{label: 'name', value: '_id', testID: '_id'}}
              zIndex={1000}
            />
          ) : (
            <View style={styles.picker} />
          )}
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
          renderItem={({item}) => (
            <CategoryButton
            onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.MORE_PRODUCTS,{category:item})}
            category={item.name} />
          )}
          />
        </View>
        

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 5 }}>

         {
            categorias.map((item)=>(
              <View key={item._id} >
                <ProductListing
                navigation={props.navigation}
                category={item.name} 
                products={productFilter.filter(product => product.categoryId == item._id)} 
                comision={comision}
                />
              </View>
            ))
          }
        <View style={{height:deviceWidth *0.05,width:deviceWidth,marginBottom:0}} />
        </ScrollView>
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
    elevation:2,
    // width:50,
    // height:50
  },
  categoryButtonText: {
    ...CommonStyles.fontFamily,
    color: Colors.white, fontSize: 15,

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
    marginTop: 10,
    // zIndex:2
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    zIndex:2,
    
  },
  reset:{
    
    alignItems:'flex-end',
    marginHorizontal:10
  },
  btnReset:{
    // borderBottomWidth:1
  },
  txtReset:{
    borderBottomWidth:1,
    color:Colors.primarySolid,
    borderColor:Colors.primarySolid,
    fontSize:adjust(10)
  }
})
export default CustomerProductsViewScreen;
