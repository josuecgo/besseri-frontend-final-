import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, Platform, PermissionsAndroid, FlatList, ScrollView, Image, useWindowDimensions, Modal} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import { CreateAddressModal, ThinlineSeparator } from '../../components/CommonComponents';
import { getUser, getUserId } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from '@react-native-community/geolocation';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight } from '../../util/Dimentions';
import { useLocation } from '../../hooks/useLocation';


const CustomerAddressesScreen = (props) => {
    const {width,height} = useWindowDimensions();
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const createAddressRef = useRef();
    const [selectedAddressType,setSelectedAddressType] = useState(editMode ? selectedAddress?.label : '');
    const [addressLine,setAddressLine] = useState('');
    const [addresses,setAddresses] = useState([]);
    const [selectedAddress,setSelectedAddress] = useState(null);
    const [info,setInfo] = useState(editMode ? selectedAddress?.info : '');
    const [phone,setPhone] = useState(editMode ? selectedAddress?.phone : '');
    const [location,setLocation] = useState(null);
    const [watchID, setWatchID] = useState(0);


    const [coords,setCoords] = useState({
        longitude: 0,
        latitude: 0
    });
    const handleModalize = (flag) => {
        if(flag == 'open') {
            createAddressRef.current.open();
        } else {
            createAddressRef.current.close();
        }
    }
    
    const getUserDetails = async() => {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
        await getAddresses()
        setLoading(false);
    }
    useEffect(() => {
        getUserDetails();
        getAddresses();
    },[]);

    const getUserLocation = async() => {
        if (Platform.OS === 'ios') {
            getLocation();    
            return;   
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
              setCoords({
                latitude:res?.coords?.latitude,
                longitude:res?.coords?.longitude
              });
              // Geocoder.from(res.coords?.latitude,res?.coords?.longitude).then(response => {
              //     setCity(response.results[0]?.address_components[2]?.long_name);
              //     setAddressLine(response?.results[0]?.formatted_address)
              //     setState(response.results[0]?.address_components[5]?.long_name)
              // }).catch(e => {
              //     console.log(e)
              // })
              // setState(res.coords,SCREEN_STATES.USER_LOCATION);
            });
          } else {
            // console.log("Location permission denied")
          }
      
        } catch(e) {
        //   console.log(e)
         showToaster('No se pudo obtener la ubicación actual.')
        } 
        }

    }

    const getLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const currentLatitude = JSON.stringify(position.coords.latitude);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            setCoords({
                latitude:currentLatitude,
                longitude:currentLongitude
            })
          },
          
        );
        const watchID = Geolocation.watchPosition((position) => {
          const currentLatitude = JSON.stringify(position.coords.latitude);
          const currentLongitude = JSON.stringify(position.coords.longitude);
          setCoords({
            latitude:currentLatitude,
            longitude:currentLongitude
        })
        });
        setWatchID(watchID);
      }
    

    const getAddresses = async() => {
        try {
            setLoading(true);
            const userId = await getUserId();
            const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userId}`);
            setLoading(false);
            if(apiCall.status == api_statuses.success) {
                setAddresses(apiCall.data.data);
            } else {
                showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
            }
        } catch(e) 
        { 
            // console.log(e.response)
            setLoading(false);  
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
        }
    }
    const createAddress = async() => {
       
            if (coords.latitude > 0 || coords.longitude > 0) {
                try {
                    setLoading(true);
                const apiCall = await axios.post(customer_api_urls.create_address,{
                    label:selectedAddressType,
                    address:addressLine,
                    userId:user?._id,
                    created_on:new Date(),
                    phone:phone,
                    info:info,
                    latitude:coords?.latitude,
                    longitude:coords?.longitude
                });
                handleModalize('close')
                setLoading(false);
                if(apiCall.status == api_statuses.success) {
                    showToaster('Dirección creada con éxito');
                    await getAddresses()
                } else {
                    showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
                }

                } catch(e) 
                { 
                    // console.log(e.response.data)
                    setLoading(false);  
                    showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
                }
            }else{
                showToaster('No olvides ingresar tus coordenadas')
            }
            
      
       
        
    }
    const deleteAddress = async(id) => {
        try {
            setLoading(true);
         const apiCall = await axios.delete(`${customer_api_urls.delete_address}/${id}`);
         setLoading(false);
         if(apiCall.status == api_statuses.success) {
            handleModalize('close')
            showToaster('Dirección eliminada');
            getAddresses();
         } else {
             showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
         }
        } catch(e) 
        { 
            // console.log(e.response.data)
            setLoading(false);  
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
        }
    }
    const crearDireccion = () =>{ 
        if (user) {
             createAddressRef.current.open()
        } else {
            props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR) 
        }
       
    }


    
    
    return (
    <View style={{flex:1,backgroundColor:'white'}}>
        <CreateAddressModal
        onClose={() => {
            setEditMode(false);
            setAddressLine('');
            setSelectedAddressType('')
        }}
        onDelete={() => deleteAddress(selectedAddress?._id)}
        value={editMode ? selectedAddress?.addressLine : addressLine}
        onChangeText={al => setAddressLine(al)}
        editMode={editMode}
        createAddressRef={createAddressRef}
        selectedAddressType={selectedAddressType}
        onSelectAddressType={(val) => setSelectedAddressType(val)}
        createAddress={createAddress}
        phoneVal={phone}
        onChangePhone={pn => setPhone(pn)}
        infoVal={info}
        onChangeInfo={inf => setInfo(inf)}
        getCoordinates={getUserLocation} coords={coords}
        />
        <LoaderComponent
        isVisible={loading}
        />
        <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity
            onPress={() => props?.navigation?.goBack()}
            style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mis direcciones</Text>
        </View>
      {
          addresses.length > 0 ? 
          <TouchableOpacity onPress={() => handleModalize('open')} style={{alignSelf:'flex-end',padding:10}}>
          <AntDesign name='plus' color='black' size={30}/>
      </TouchableOpacity>
      : null
      }
     <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white'}}> 
     {
         addresses?.length == 0 ?
         <View style={{...CommonStyles.flexOneCenter}}>
         <Image
         source={require('../../assets/images/location-pin.png')}
         style={{width:200,height:200}}
         />
         <View style={[styles.AddressesDetailsWrapper,{width}]}>
         <Text style={styles.createAddressText}>Crear dirección</Text>
         <Text style={styles.createAddressDetailText}>Cree direcciones y haga que le resulte más fácil seleccionarlas al realizar pedidos, la dirección seleccionada será la dirección de entrega al realizar el pedido</Text>
          <ButtonComponent
          buttonText={'Crea ahora'}
          colorB={Colors.terciarySolid}
          width={width / 1.5}
          margin={10}
          handlePress={crearDireccion}
          />
         </View>
         </View>
         :
        addresses.map((item) => (
            <View key={item._id} >
                <AddressComponent
                info={item.info}
                phone={item.phone}
                onPress={() => {
                    setEditMode(true);
                    setSelectedAddress(item)
                    handleModalize('open')
                }}
                addressLine={item.addressLine} label={item.label}/>
            </View>
        ))
        
        
        
     }
     </ScrollView>
      

    </View>
  );
};
const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
        paddingHorizontal:20,
        alignItems:'center',
        justifyContent:'center'
    },
    headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
    detailCard:{
        width:'100%',
        backgroundColor:'white',
        elevation:5,
        alignSelf:'center',
        padding:20,
    },
    createAddressText:{...CommonStyles.fontFamily,fontSize:20},
    createAddressDetailText:{fontSize:13,fontWeight:'300',width:'90%',alignSelf:'center',textAlign:'center',color:Colors.dark},
    AddressesDetailsWrapper:{justifyContent:'center',alignItems:'center',bottom:40}
})

export default CustomerAddressesScreen;
