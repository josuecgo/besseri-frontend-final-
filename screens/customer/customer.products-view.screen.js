import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, ScrollView, Platform, PermissionsAndroid, FlatList } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import {  CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import { adjust, deviceWidth } from '../../util/Dimentions';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { customer_api_urls } from '../../util/api/api_essentials';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { useFiltrado } from '../../hooks/useFiltrado';



const SCREEN_STATES = {
  USER_LOCATION:'User location',
  PRODUCTS:'Products',
  CATEGORIES:'Categories'
}

const SelectImgCategory = (category) => {
  switch (category) {
    case 'TRANSMISION':
      return require(`../../assets/images/categorias/transmision.png`);
    case 'FRENOS':
      return require('../../assets/images/categorias/frenos.jpg');
       
  
    default:
      return require('../../assets/images/categorias/frenos.jpg');
  }
}
const CustomerProductsViewScreen = React.memo((props) => {
  const [locationStatus, setLocationStatus] = useState(null)
  const [screenStates, setScreenStates] = useState({
    [SCREEN_STATES.USER_LOCATION]: {},
    [SCREEN_STATES.PRODUCTS]:[],
    [SCREEN_STATES.CATEGORIES]:[]
  });

  const [userLocation,setUserLocation] = useState(null);    
  const [coords,setCoords] = useState({
    longitude: 0,
    latitude: 0
  });
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('')
  const [currentLatitude, setCurrentLatitude] = useState('')
  const {
    categorias,
    comision,modelo,
    setModelo,marcas,
    setMarcas,valueMaker, setValueMaker,
    valueModel, setValueModel,resetFiltro
  } = useContext(ProductContext)

  const {productFilter} = useFiltrado(props?.route?.name)

  //Fetching user location..............................
  const getUserLocation = useCallback(async() => {
    if (Platform.OS === 'ios') {
      getLocation();
      subscribeLocationLocation();
    }else{
       try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Permiso de ubicación',
          'message': 'Esta aplicación necesita acceso a tu ubicación ' +
                      'para que sepamos donde estas.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(res => {
          setUserLocation(res.coords);
          // setState(res.coords,SCREEN_STATES.USER_LOCATION);
        });
      } else {
        console.log("Location permission denied")
      }
  
    } catch(e) {
      console.log(e)
     showToaster('No se pudo obtener la ubicación actual.')
    }
    }
   
  },[setUserLocation])
 

 
  const getLocation = useCallback(
    async() => {
      try {
         await Geolocation.getCurrentPosition(
         (position) => {
           const currentLatitude = JSON.stringify(position.coords.latitude);
           const currentLongitude = JSON.stringify(position.coords.longitude);
           setCoords({
               latitude:currentLatitude,
               longitude:currentLongitude
           })
         },
         (error) => {
           // See error code charts below.
           console.log(error.code, error.message);
           },
           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
     
       
      );
      } catch (error) {
        console.log({cathc:error});
      }
     },
    [setCoords]
  )

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        console.log(position);
 
        //getting the Longitude from the location json        
        const currentLongitude = JSON.stringify(position.coords.longitude);
 
        //getting the Latitude from the location json
        const currentLatitude =  JSON.stringify(position.coords.latitude);
 
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
 
        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  useEffect(() => {
    getUserLocation();
  },[]);



  

  const CategoryButton = ({ category,onPress }) => {
    return (
      <View style={{alignItems:'center'}} >
        <TouchableOpacity onPress={onPress} style={styles.categoryButton}>
           
            <Image source={SelectImgCategory(category)} style={{width:20,height:20}} />
        </TouchableOpacity>
        <Text style={{fontSize:adjust(5)}} >
              {category}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.bgColor,paddingTop:15 }}>
            
     
      
      <View style={{ flex: 1 }}>
        
      <View style={styles.filterContainer}>
        <DropDownPicker
          open={open}
          value={valueMaker}
          items={marcas}
          setOpen={setOpen}
          setValue={setValueMaker}
          setItems={setMarcas}
          containerStyle={styles.picker}
          style={{borderColor:'white', zIndex:990}}
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

          
        <View style={{ 
          paddingVertical: 5,
          backgroundColor: 'transparent',
          alignSelf: 'flex-start', flexDirection: 'row' ,
          zIndex:1
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
    padding: 20,
    backgroundColor: Colors.white,
    ...CommonStyles.flexCenter,
    margin: 5,
    borderRadius: 100,
    // paddingHorizontal: 15
    elevation:2
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
    zIndex:2
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
