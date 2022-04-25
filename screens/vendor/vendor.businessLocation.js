import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, useWindowDimensions,TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import CommonStyles from '../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoaderComponent from '../../components/Loader/Loader.component';
import Colors from '../../util/styles/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import { Modalize } from 'react-native-modalize';
import { SetUpLocationModal } from '../../components/CommonComponents';
import { useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { api_statuses, vendor_api_urls } from '../../util/api/api_essentials';
import {getBusinessId,getBusinessProfile,getUserId, saveBusinessProfile} from '../../util/local-storage/auth_service'
import { showToaster } from '../../util/constants';
import MapView, { Circle, Marker } from 'react-native-maps';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight } from '../../util/Dimentions';
import { useLocation } from '../../hooks/useLocation';

const CustomerOrdersViewScreen = (props) => {
  Geocoder.init('AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o');
  const { width, height } = useWindowDimensions()
  const [loading, setLoading] = useState(false);
  const [addressLine,setAddressLine] = useState('');
  const [state,setState] = useState('');
  const [city,setCity] = useState('');
  const {params} = useRoute();
  const ShowSetUpLocationRef = useRef();
  const [coords,setCoords] = useState(null);
  const [editMode,setEditMode] = useState(false);
  const [locationData,setLocation] = useState()
  const {getLocationHook,userLocation} = useLocation()

  const getBusiness = async() => {
    try {
     const businessData = await getBusinessProfile();
     setLocation(businessData);
     
     if(businessData?.location) {
       setCity(businessData?.location?.city);
       setState(businessData?.location?.state);
       setAddressLine(businessData?.location?.address);
       setCoords({
         latitude:businessData?.location?.latitude,
         longitude:businessData?.location?.longitude
       })
     }
     
    } catch(e) {
      showToaster('Algo salió mal')
    }
  }
  useEffect(() => {
    getBusiness()
    // getLocationHook()
  },[]);
  const getUserLocation = async() => {
      setCoords(userLocation)
   
  }
  const setUpLocation = async() => {
    try {
      setLoading(true);
      if(!city) {
        showToaster('Por favor proporcione la ciudad');
        return;
      }
      if(!state) {
        showToaster('Por favor proporcione el estado');
        return;
      }
      if(!addressLine) {
        showToaster('Por favor proporcione la dirección');
        return;
      }
      
      if(!coords?.latitude) {
        showToaster('Por favor proporcione latitud')
        return;
      }
      if(!coords?.longitude) {
        showToaster('Por favor proporcione la longitud')
        return;
      }
      const userId = await getUserId();
      const businessId = await getBusinessId();
      const apiCall = await axios.post(vendor_api_urls?.setup_address,{
          addressLine,
          city,
          state,
          latitude:coords?.latitude,
          longitude:coords?.longitude,
          businessId:businessId,
          userId:userId
      });
      setLoading(false);
      if(apiCall?.status == api_statuses?.success) {
        console.log(apiCall.data.data);;
        if(apiCall?.data?.data) {
          await saveBusinessProfile(apiCall?.data?.data);
          getBusiness();
        }
         showToaster('Location set up.');
         ShowSetUpLocationRef?.current?.close();
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo.')
      }
  
    } catch(e) {
      setLoading(false);
     showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
     console.log(e?.response?.data)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SetUpLocationModal 
        showDel={false}
        editMode={editMode}
        locationData={locationData}
        city={city}
        state={state}
        onChangeCity={(ct) => setCity(ct)}
        onChangeState={(cs) => setState(cs)}
        onChangeText={(ct) => setAddressLine(ct)}
        value={addressLine}
        onDone={setUpLocation}
        getCoordinates={getUserLocation} coords={coords} showSetUpLocationRef={ShowSetUpLocationRef}/>
        <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mi ubicacion</Text>
        </View>
      <LoaderComponent isVisible={loading}/>
    
      <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'5%'}}> 
   {
      locationData?.location?.latitude && locationData?.location?.longitude ? 
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         <View style={{width:'95%',marginTop:10,padding:10,backgroundColor:Colors.terciarySolid,borderRadius:5}}>
         <View style={{flexDirection:'row',alignItems:'center'}}>
           <Entypo name='location-pin' color={Colors.primarySolid} size={20}/>
           <Text style={{fontSize:17,fontWeight:'bold',color:Colors.white}}>Mi ubicación comercial</Text>
         </View>
       <View style={{width:'85%',alignSelf:'center'}}>
       <Text style={{color:Colors.white}} >{locationData?.location?.address}</Text>
         <Text style={{color:Colors.white}}>{locationData?.location?.city}</Text>
         <Text style={{color:Colors.white}}>{locationData?.location?.state}</Text>
       </View>
       <TouchableOpacity
       style={{
         height:45,
         padding:10,
         backgroundColor:Colors.primarySolid,
         borderWidth:1,
         borderColor:Colors.primarySolid,
         borderRadius:3,
         justifyContent:'center',
         alignItems:'center',
         alignSelf:'flex-end',
         width:100
       }}
       onPress={() => {
         setEditMode(true)
        ShowSetUpLocationRef?.current?.open();
       }}
       >
         <Text style={{color:Colors.white,...CommonStyles.fontFamily,fontSize:15}}>Editar</Text>
       </TouchableOpacity>
       </View>
     {
       locationData?.location?.latitude && locationData?.location?.longitude ? 
        <View>
          <MapView
            style={{height:height / 1.5,width:width,margin:10}}
            //specify our coordinates.
            showsUserLocation
            initialRegion={{
              latitude: Number(locationData?.location?.latitude),
              longitude: Number(locationData?.location?.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
         {/* <Marker
            coordinate={{
              latitude: Number(locationData?.location?.latitude),
              longitude: Number(locationData?.location?.longitude),
            }}
            title={'Ubicación de su tienda'}
            pinColor='#F7E3BD'
          /> */}
       </MapView>
       </View>
       :
       null
     }
      </View>
       :
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Entypo name='location-pin' color={Colors.red} size={100}/>
        <Text style={{fontWeight:'bold',fontSize:19}}>Ubicación de la empresa</Text>
        <Text style={{fontWeight:'300',fontSize:13,color:'grey',textAlign:'center',width:'80%',alignSelf:'center',marginVertical:10}}>
        Configure la ubicación de su negocio, para que los clientes puedan ver dónde se encuentra, cuando presione configurar, su ubicación actual aparecerá
          ser utilizado, así que configure la ubicación cuando esté en la tienda.
        </Text>
          <TouchableOpacity 
          onPress={() => {
            if(locationData) {
              setCity(locationData?.location?.city);
              setState(locationData?.location?.state);
              setAddressLine(locationData?.location?.address)
            }
              console.log(ShowSetUpLocationRef);
            ShowSetUpLocationRef?.current?.open();
          }}
          style={{width:150,height:50,borderWidth:1,borderColor:Colors.lightRed,backgroundColor:Colors.lightRed,justifyContent:'center',alignItems:'center',borderRadius:5,alignSelf:'center'}}>
              <Text style={{fontSize:15,fontWeight:'bold',color:'red'}}>SET UP</Text>
          </TouchableOpacity>
      </View>
    }
      </ScrollView>
      
     
    </View>
  );
};
const styles = StyleSheet.create({
  placeOrderText: { ...CommonStyles.fontFamily, fontSize: 20 },
  placeOrderTextDetail: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
  placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
  header:{
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    //  borderWidth:1,
    ...CommonStyles.horizontalCenter,
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
})
export default CustomerOrdersViewScreen;
