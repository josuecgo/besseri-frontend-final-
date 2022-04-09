import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View,StyleSheet, Alert, PermissionsAndroid, FlatList, ScrollView, Image, useWindowDimensions, Modal} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../util/styles/styles';
import ButtonComponent from '../../components/button/button.component';
import { CreateAddressModal, ThinlineSeparator } from '../../components/CommonComponents';
import { getUser, getUserId } from '../../util/local-storage/auth_service';
import axios from 'axios';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { showToaster } from '../../util/constants';
import LoaderComponent from '../../components/Loader/Loader.component';
import AddressComponent from '../../components/customer-components/customer.addresscard.component';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from '@react-native-community/geolocation';
const CustomerAddressesScreen = (props) => {
    const {width,height} = useWindowDimensions();
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const createAddressRef = useRef();
    const [selectedAddressType,setSelectedAddressType] = useState(editMode ? selectedAddress?.label : '');
    const [addressLine,setAddressLine] = useState(editMode ? selectedAddress?.addressLine : '');
    const [addresses,setAddresses] = useState([]);
    const [selectedAddress,setSelectedAddress] = useState(null);
    const [info,setInfo] = useState(editMode ? selectedAddress?.info : '');
    const [phone,setPhone] = useState(editMode ? selectedAddress?.phone : '');
    const [location,setLocation] = useState(null);
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
    const getLocation = async() => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Besseri',
              'message': 'Besseri wants to know your location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(position => {
                
                setLocation(position.coords)
            })
          } else {
            console.log("location permission denied")
            showToaster("Location permission denied");
          }
        } catch(e) {
            showToaster('Couldnt get your location')
        }
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
             showToaster('Something went wrong please try again :/')
         }
        } catch(e) 
        { 
            console.log(e.response)
            setLoading(false);  
            showToaster('Something went wrong please try again :/')
        }
    }
    const createAddress = async() => {
        try {
            setLoading(true);
         const location = Geolocation.getCurrentPosition(async(position) => {
            const apiCall = await axios.post(customer_api_urls.create_address,{
                label:selectedAddressType,
                address:addressLine,
                userId:user?._id,
                created_on:new Date(),
                phone:phone,
                info:info,
                latitude:position?.coords?.latitude,
                longitude:position?.coords?.longitude
            });
            handleModalize('close')
            setLoading(false);
            if(apiCall.status == api_statuses.success) {
                showToaster('Address created successfully');
                await getAddresses()
            } else {
                showToaster('Something went wrong please try again :/')
            }
         })
       
        } catch(e) 
        { 
            console.log(e.response.data)
            setLoading(false);  
            showToaster('Something went wrong please try again :/')
        }
    }
    const deleteAddress = async(id) => {
        try {
            setLoading(true);
         const apiCall = await axios.delete(`${customer_api_urls.delete_address}/${id}`);
         setLoading(false);
         if(apiCall.status == api_statuses.success) {
            handleModalize('close')
            showToaster('Address deleted');
            getAddresses();
         } else {
             showToaster('Something went wrong please try again :/')
         }
        } catch(e) 
        { 
            console.log(e.response.data)
            setLoading(false);  
            showToaster('Something went wrong please try again :/')
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
        value={addressLine}
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

        />
        <LoaderComponent
        isVisible={loading}
        />
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
            <Text style={styles.headerText}>My Addresses</Text>
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
         <Text style={styles.createAddressText}>Create Address</Text>
         <Text style={styles.createAddressDetailText}>Create addresses and make it easier for you to select them while placing orders, selected address will be delivery address while placing order</Text>
          <ButtonComponent
          buttonText={'Create Now'}
          colorB={Colors.primaryColor}
          width={width / 1.5}
          margin={10}
          handlePress={() => createAddressRef.current.open()}
          />
         </View>
         </View>
         :
         <FlatList
         data={addresses}
         keyExtractor={item => item?._id}
         renderItem={itemData => (
             <AddressComponent
             info={itemData.item.info}
             phone={itemData.item.phone}
             onPress={() => {
                 setEditMode(true);
                 setSelectedAddress(itemData.item)
                 handleModalize('open')
             }}
             addressLine={itemData.item.addressLine} label={itemData.item.label}/>
         )}
         />
     }
     </ScrollView>
      

    </View>
  );
};
const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:80,
        backgroundColor:Colors.primaryColor,
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
