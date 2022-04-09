import React, { useEffect, useState } from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import ProductComponent from '../../components/vendor-shared/product.component';
import {PRODUCT_STATUS, showToaster, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {FlatList, View} from 'react-native';
import {getBusinessId, getBusinessProfile} from '../../util/local-storage/auth_service';
import {vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import Loader from '../../components/Loader/Loader.component'
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const VendorProductsScreen = ({navigation, route}) => {
  const [products,setProducts] = useState([]);
  const [showLoader,setShowLoader] = useState(false);
  const isFocused = useIsFocused();
  const [business,setBusinessDetails] = useState(null);
  const business_profile = useSelector(state => state?.businessActions);
  const floatButtonHandler = () => {
    console.log(business.location)
    if(!business?.location?.latitude || !business?.location?.longitude || !business?.location?.city || !business?.location?.state) {
      showToaster('Your location is not setup completetly, please set it up from settings');
      return
    }
    if(business?.status == 'BLOCKED') {
      showToaster('You cant create product as your account is blocked');
      return;
    }
    if(!business?.wallet_id || !business_profile?.wallet?.charges_enabled) {
      showToaster('Setting up stripe business account is must before selling, go to dashboard and add the account');
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
      console.log(profile)
    const businessId = await getBusinessId();
    const url = `${vendor_api_urls.get_products}/${businessId}`
    const apiCall = await axios.get(url);
    setShowLoader(false);
    if(apiCall.status == 200) {
     setProducts(apiCall.data.data);
     console.log(businessId)
     return;
    }
    alert('something went wrong');
    } catch(e) {
      setShowLoader(false);
       console.log(e.response.data);
       alert('an error occured');
    }
  }
  useEffect(() => {
    getMyProducts();
  },[isFocused]);
  return (
    <VendorScreenContainerComponent
      needFloatingActionButton={true}
      floatButtonHandler={floatButtonHandler}
      screenHeading="Products">
        <Loader
        isVisible={showLoader}
        />
      <View>
        <FlatList
        data={products}
        keyExtractor={item => item?._id}
        renderItem={({item}) => {
          return (
            <ProductComponent
            data={item}
            openProductDetails={openProductDetails}
            // productId={item?._id}
            // productImage={personMockImage}
            // productStatus={PRODUCT_STATUS.IN_STOCK}
            // openProductDetails={openProductDetails}
          />
          )
        }}
        />
       
      </View>
      {/*<AllEmptyComponent />*/}
    </VendorScreenContainerComponent>
  );
};

export default VendorProductsScreen;
