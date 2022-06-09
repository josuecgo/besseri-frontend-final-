import React, { useContext, useEffect, useState } from 'react';
import {  View, StyleSheet,  ScrollView, TouchableOpacity,Text } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';


import ServiceListing from '../../components/customer-components/ServiceListing';
import { useLocation } from '../../hooks/useLocation';
import { useFiltrado } from '../../hooks/useFiltrado';
import { deviceWidth } from '../../util/Dimentions';
import { ProductContext } from '../../util/context/Product/ProductContext';


const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}
const CustomerProductsViewScreen = (props) => {
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const {userLocation :coords} = useLocation()
  // const [userLocation,setUserLocation] = useState(coords);
  //Fetching user location..............................
  // const getUserLocation = async() => {

  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         'title': 'Permiso de ubicación',
  //         'message': 'Esta aplicación necesita acceso a tu ubicación ' +
  //                    'para que sepamos donde estas.'
  //       }
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       await Geolocation.getCurrentPosition(res => {
  //         setUserLocation(res.coords);
  //         // setState(res.coords,SCREEN_STATES.USER_LOCATION);
  //       });
  //     } else {
  //       console.log("Location permission denied")
  //     }
  
  //   } catch(e) {
  //     console.log(e)
  //    showToaster('No se pudo obtener la ubicación actual.')
  //   }
  // }
  const {
    categorias,
    comision,modelo,
    setModelo,marcas,
    setMarcas,valueMaker, setValueMaker,
    valueModel, setValueModel,resetFiltro
  } = useContext(ProductContext)

  const {serviciosFiltrados} = useFiltrado(props?.route?.name)
 


  
  

  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor,paddingTop:15 }}>
      <View style={styles.filterContainer}>
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
      
      <View style={{ flex: 1 }}>
       
        

        <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
      
          {/* <FlatList
          data={categorias}
          keyExtractor={item => item?._id}
          renderItem={itemData => (
            <ServiceListing
            navigation={props.navigation}
            category={itemData.item.name} services={servicesFilter.filter(service => service.categoryId == itemData.item._id)} />
          )}
          /> */}
          {
            categorias.map( (item) => (
              <View key={item._id} >
                <ServiceListing
                navigation={props.navigation}
                category={item.name} 
                services={serviciosFiltrados.filter(service => service.categoryId == item._id)} 
                comision={comision}
                />
              </View>
              
           
            ))
          }

        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  categoryButton: {
    padding: 10,
    backgroundColor: Colors.primaryColor,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    ...CommonStyles.flexCenter,
    margin: 5,
    borderRadius: 10,
    paddingHorizontal: 15
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
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
    borderColor:Colors.primarySolid
  }
})
export default CustomerProductsViewScreen;
