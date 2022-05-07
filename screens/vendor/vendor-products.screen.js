import React, { useEffect, useState } from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import ProductComponent from '../../components/vendor-shared/product.component';
import {PRODUCT_STATUS, showToaster, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {StyleSheet, View} from 'react-native';
import {getBusinessId, getBusinessProfile} from '../../util/local-storage/auth_service';
import {vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import Loader from '../../components/Loader/Loader.component'
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { deviceHeight } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';
const VendorProductsScreen = ({navigation, route}) => {
  const [products,setProducts] = useState([]);
  const [showLoader,setShowLoader] = useState(false);
  const isFocused = useIsFocused();
  const [business,setBusinessDetails] = useState(null);
  const business_profile = useSelector(state => state?.businessActions);

  const floatButtonHandler = () => {
    if(!business?.location?.latitude || !business?.location?.longitude || !business?.location?.city || !business?.location?.state) {
      showToaster('Su ubicación no está configurada completamente, configúrela desde la configuración');
      return
    }
    if(business?.status == 'BLOCKED') {
      showToaster('No puedes crear productos porque tu cuenta está bloqueada');
      return;
    }
    if(!business?.wallet_id || !business_profile?.wallet?.charges_enabled) {
      showToaster('Es necesario configurar una cuenta comercial de Stripe antes de vender, vaya al panel y agregue la cuenta');
      return;
    }
    navigation.navigate(VENDOR_DETAILS_ROUTES.CREATE_PRODUCT,{
      product:null,
      isEdit:false
    });
  };

  const openProductDetails = productDetails => {
    navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS, {data:productDetails});
  };
  const getMyProducts = async() => {
    try {
      setShowLoader(true);
      const profile = await getBusinessProfile();
      setBusinessDetails(profile);
     
      const businessId = await getBusinessId();
      const url = `${vendor_api_urls.get_products}/${businessId}`
      const apiCall = await axios.get(url);
      setShowLoader(false);
      if(apiCall.status == 200) {
        setProducts(apiCall.data.data);
        return;
      }
    alert('No hay conexion con el servidor');
    } catch(e) {
      setShowLoader(false);
       console.log(e.response.data);
       alert('ocurrió un error');
    }
  }
  useEffect(() => {
    getMyProducts();
  },[isFocused]);
  return (
    <VendorScreenContainerComponent
      needFloatingActionButton={true}
      floatButtonHandler={floatButtonHandler}
      screenHeading="Productos">
      
        <Loader
        isVisible={showLoader}
        />
      <View style={{marginBottom: Platform.OS == 'ios' ? 80 : 50}} >
    
        {products.map((item) => {
          
          return (
            <View style={styles.card} key={item._id} >
              <ProductComponent
              data={item}
              openProductDetails={openProductDetails}
              />
            </View>
            
          )
        })}
        <View style={{height:deviceHeight * 0.11}} />
      </View>
     
    </VendorScreenContainerComponent>
  );
};

export default VendorProductsScreen;

const styles = StyleSheet.create({
  card:{
    backgroundColor:Colors.bgColor,
   
  }
})