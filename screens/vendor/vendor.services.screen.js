import React, { useEffect, useState } from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import ProductComponent from '../../components/vendor-shared/product.component';
import {PRODUCT_STATUS, SHARED_ROUTES, showToaster, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {StyleSheet, View,Image,Text, Pressable,TouchableOpacity} from 'react-native';
import {getBusinessId, getBusinessProfile} from '../../util/local-storage/auth_service';
import {base_url, vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import Loader from '../../components/Loader/Loader.component'
import { useIsFocused } from '@react-navigation/native';
import RatingComponent from '../../components/Ratings/rating.component';
import CommonStyles from '../../util/styles/styles';
import { useSelector } from 'react-redux';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';
import { moneda } from '../../util/Moneda';
const VendorServicesScreen = ({navigation, route}) => {
  const [services,setServices] = useState([]);
  const [showLoader,setShowLoader] = useState(false);
  const [business,setBusiness] = useState(null);
  const isFocused = useIsFocused();
  const business_profile = useSelector(state => state?.businessActions);

  const floatButtonHandler = () => {
    if(!business?.location?.latitude || !business?.location?.longitude || !business?.location?.city || !business?.location?.state) {
      showToaster('Su ubicación no está configurada completamente, configúrela desde la configuración');
      return
    }
    if(business.status == 'BLOCKED') {
      showToaster('No puedes crear el servicio ya que tu cuenta está bloqueada');
      return;
    }
    if(!business?.wallet_id || !business_profile?.wallet?.charges_enabled) {
      showToaster('Es necesario configurar una cuenta comercial de Stripe antes de vender, vaya al panel y agregue la cuenta');
      return;
    }
    navigation.navigate(VENDOR_DETAILS_ROUTES.CREATE_SERVICE);
  };
  const openProductDetails = productDetails => {
    navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS, {data:productDetails});
  };
  const getMyServices = async() => {
    try {
      setShowLoader(true);
    const businessId = await getBusinessId();
    const businessprofile = await getBusinessProfile();
    setBusiness(businessprofile);
    const url = `${vendor_api_urls.get_services}/${businessId}`
    const apiCall = await axios.get(url);
    setShowLoader(false);
    if(apiCall.status == 200) {
     setServices(apiCall.data.data);
    //  console.log(businessId)
     return;
    }
    showToaster('Algo salió mal')
    } catch(e) {
      setShowLoader(false);
      //  console.log(e.response.data);
       showToaster('Algo salió mal')
    }
  }
  useEffect(() => {
    getMyServices();
  },[isFocused]);
  return (
    <VendorScreenContainerComponent
    needFloatingActionButton={true}
    floatButtonHandler={floatButtonHandler}
    showHeader={true}
    screenHeading="Servicios">
      <Loader
      isVisible={showLoader}
      />
    <View style={{flex:1}} >

    {
        services.map((item) => (
          <Pressable
          onPress={() => {
              navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                  service:item,
                  isBusiness:true,
                  isVendor:true
              })
          }}
          key={item._id}
          >
            <View style={styles.card} >
              <Image
              source={{uri:`${base_url}/${item?.coverImg}`}}
              style={{width:'40%',height:150,resizeMode:'stretch',borderRadius:0,marginRight:10}}
              />
              <View style={{flexDirection:'column',justifyContent:'space-between',width:'50%'}}>
                <View>
                  <Text style={{...CommonStyles.fontFamily,fontSize:17}}>{item?.name}</Text>
                  <Text style={{color:'grey'}}>{item?.category?.name}</Text> 
                 
                  <Text style={{...CommonStyles.fontFamily,fontSize:16}}>MXN {moneda(item?.price)}</Text>
                                  
                  
                </View> 
               
                  <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => {
                    navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                        service:item,
                        isBusiness:true,
                        isVendor:true
                    })
                }}
                  >
                    <Text style={styles.detailButtonText}>Mostrar detalles</Text>
                  </TouchableOpacity>
           
               
              </View>
            </View>

             
               
          </Pressable>
        ))
      }

     
    </View>
    {/*<AllEmptyComponent />*/}
    <View style={{height:deviceHeight * 0.2}} />
  </VendorScreenContainerComponent>
);
};

export default VendorServicesScreen;


const styles = StyleSheet.create({
card:{
  
    backgroundColor:Colors.white,
    borderColor: Colors.light,
    marginVertical: 8,
    padding: 15,
    marginHorizontal: deviceWidth * 0.03,
    elevation:1,
    flexDirection:'row'
    
 
},
statusContainer: {
  alignItems: 'flex-end',
  marginTop: 8,
},
detailButton: {
  paddingHorizontal: 15,
  height: deviceHeight * 0.05 ,
  borderWidth: 1,
  borderColor: Colors.primarySolid,
  backgroundColor: Colors.primarySolid,
  ...CommonStyles.horizontalCenter,
  ...CommonStyles.verticalCenter,
  borderRadius: 2,
  width:'100%'
},
detailButtonText: {
  ...CommonStyles.fontFamily,
  color: 'white'
}
})
