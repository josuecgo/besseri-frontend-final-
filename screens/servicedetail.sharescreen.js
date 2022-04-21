import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions,TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ButtonComponent from '../components/button/button.component';
import Colors from '../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import CommonStyles from '../util/styles/styles';
import { api_statuses, base_url, customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import RatingComponent from '../components/Ratings/rating.component';
import { BOTTOM_TAB_VENDOR_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES, showToaster, VENDOR_DETAILS_ROUTES } from '../util/constants';
import LoaderComponent from '../components/Loader/Loader.component';
import { getBusinessId, getUserId } from '../util/local-storage/auth_service';
import { adjust, deviceHeight, deviceWidth } from '../util/Dimentions';
import { HeaderBackground } from '../components/Background/HeaderBackground';
import { moneda } from '../util/Moneda';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const ShareServiceDetail = (props) => {
  const {width,height} = useWindowDimensions();
  const {params} = useRoute();
  const {top} = useSafeAreaInsets()
  const [loading,setLoading] = useState(false);
  const isVendor = params.isVendor;
  const [comision, setComision] = useState(0)
  const [service,setService] = useState(params?.service);
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    getComision();
  }, [])
  
  
  const getComision = async( ) => {

    try {
      setLoading(true);
      const getFee = await axios.get(customer_api_urls?.get_fees);
      
      
      
      
      if(getFee.status == api_statuses.success) {
          
        setLoading(false);
        setComision(getFee.data.data[0]?.besseri_comission); 
      } else {
        showToaster('Algo salió mal');
      }
      const getUser = await getUserId();
      setIsLogin(getUser)
    } catch (error) {
      setLoading(false);
      console.log(error);
      showToaster('Algo salió mal, inténtalo de nuevo más tarde');
    }
    
  }
  const changeServiceAvailability = async() => {
    try {
      setLoading(true);
       const apiCall = await axios.post(vendor_api_urls.change_service_availability,{
         serviceId:service?._id,
         flag:!service.active
       });
       

       if(apiCall.status == api_statuses.success) {
         
         setLoading(false);
         setService(apiCall.data.data);
       } else {
         showToaster('Algo salió mal');
       }
    } catch(e) {
      console.log(e)
        setLoading(false);
        showToaster('Algo salió mal, inténtalo de nuevo más tarde');
    }
  }

  const deleteService = async() => {
    try {
      setLoading(true);
      const businessId = await getBusinessId();
      const userId = await getUserId();
      console.log(businessId,userId,service?._id)
       const apiCall = await axios.post(vendor_api_urls.delete_service,{
         serviceId:service?._id,
         businessId:businessId,
         userId:userId
       });
       setLoading(false);
       if(apiCall.status == api_statuses.success) {
         showToaster('Servicio eliminado con éxito');
         props.navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.SERVICES);
       } else {
         showToaster('Algo salió mal');
       }
    } catch(e) {
      console.log(e.response.data)
        setLoading(false);
        showToaster('Algo salió mal, inténtalo de nuevo más tarde');
    }
  }
  
  const goReservar = () => {
  
    if (isLogin) {
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.BOOK_SERVICE,{
      service:service
      });
    }else{
      props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.INICIAR)
    }

  }
 

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
    <LoaderComponent isVisible={loading}/>
      
      <HeaderBackground/>

      <View
          style={styles.header}
          >
          
          <View style={{...CommonStyles.flexDirectionRow,alignItems:'center',width:deviceWidth,paddingLeft:5}}>
            <View>
              <TouchableOpacity 
              onPress={() => props.navigation.goBack()}
              style={{alignSelf:'flex-start'}}>
                  <MaterialCommunityIcons
                  name='keyboard-backspace'
                  color={Colors.white}
                  size={25}
                  />
              </TouchableOpacity>
            </View>
            {/* <View style={{width:45,height:45,borderWidth:1,borderColor:Colors.white,backgroundColor:Colors.white,...CommonStyles.flexCenter,borderRadius:5}}>
             <MaterialIcons name='miscellaneous-services' size={30} color={Colors.primaryColor}/>
            </View> */}
            <View style={{flex:1,marginLeft:(deviceWidth / 12) * 1.2  }}>
              <Text style={styles.headerText}>{service?.name}</Text>
              <Text style={{...CommonStyles.fontFamily,fontSize:13,paddingLeft:12,color:isVendor ?  service?.active ? Colors.lightGreen : Colors.red : Colors.red}}>{isVendor ?  service?.active ? 'Activo' : 'In Active' : 'Service detail'}</Text>
            </View>
          </View>
      </View>




    <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'25%'}}> 
    <View style={{width:'95%',alignSelf:'center'}}>
     <Image
      source={{uri:`${base_url}/${service?.coverImg}`}}
      style={{width:'100%',height:200,borderRadius:10,alignSelf:'center',margin:10}}
      />
     <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                <Text style={{...CommonStyles.fontFamily,fontSize:17}}>{service?.name}</Text>
                  <Text style={{color:'grey'}}>{service?.category?.name}</Text>
                  {/* <RatingComponent numOfStars={5} totalReviews={10}/> */}
                  </View>
                  <Text style={{...CommonStyles.fontFamily,fontSize:16}}> 
                    { isVendor ? moneda(service.price) : moneda(service?.price + comision * service?.price / 100 )}
                  </Text>
                  </View>
                  <Text style={{fontSize:12,color:'grey'}}>{service?.description}</Text>

     </View>
    </ScrollView>
      {
        isVendor ? 
        <View style={{
          ...CommonStyles.flexDirectionRow,
          justifyContent:'space-around',
          backgroundColor:'transparent',
          position:'absolute',
          bottom:15+top
          }}>
        <ButtonComponent
        buttonText={service?.active ? 'Inactivo' : 'Activo'}
        width={width / 2.2}
        colorB={Colors.secondaryColorGreenShade}
        borderRadius={10}
        margin={10}
        handlePress={() => {
          Alert.alert(`${service?.active ? 'MARKING SERVICE IN-ACTIVE' : 'MARKING SERVICE ACTIVE'}`,'¿Realmente quieres cambiar su disponibilidad?',
          [{text:'Si',onPress:changeServiceAvailability},{text:'No'}]
          )
        }}
        />
         <ButtonComponent
        buttonText={'Borrar'}
        width={width / 2.2}
        colorB={Colors.red}
        borderRadius={10}
        margin={10}
        handlePress={() => {
          Alert.alert('ELIMINANDO SERVICIO','¿Realmente desea eliminar este servicio?',
          [{text:'Si',onPress:deleteService},{text:'No'}]
          )
        }}
        />
    </View>  
    :
    (
      isVendor ? 
      null:
      <View style={{bottom:top + 20}} >
        <ButtonComponent
          buttonText={'Reservar ahora'}
          width={width - 20}
          colorB={Colors.brightBlue}
          borderRadius={5}
          margin={10}
          handlePress={goReservar}
    
        />
      </View>
     
    )
      }
  </View>
);
};
const styles = StyleSheet.create({
placeOrderText: { ...CommonStyles.fontFamily, fontSize: 20 },
placeOrderTextDetail: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
header:{
  width:'100%',
 
  height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10 ,
  // paddingHorizontal:20,
  justifyContent:'center',
  flexDirection:'row'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:adjust(16),paddingLeft:10},
})
export default ShareServiceDetail;
