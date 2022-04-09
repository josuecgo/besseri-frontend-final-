import React, { useEffect, useState } from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import ProductComponent from '../../components/vendor-shared/product.component';
import {PRODUCT_STATUS, SHARED_ROUTES, showToaster, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import {FlatList, View,Image,Text, Pressable} from 'react-native';
import {getBusinessId, getBusinessProfile} from '../../util/local-storage/auth_service';
import {base_url, vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import Loader from '../../components/Loader/Loader.component'
import { useIsFocused } from '@react-navigation/native';
import RatingComponent from '../../components/Ratings/rating.component';
import CommonStyles from '../../util/styles/styles';
import { useSelector } from 'react-redux';
const VendorServicesScreen = ({navigation, route}) => {
  const [services,setServices] = useState([]);
  const [showLoader,setShowLoader] = useState(false);
  const [business,setBusiness] = useState(null);
  const isFocused = useIsFocused();
  const business_profile = useSelector(state => state?.businessActions);

  const floatButtonHandler = () => {
    if(!business?.location?.latitude || !business?.location?.longitude || !business?.location?.city || !business?.location?.state) {
      showToaster('Your location is not setup completetly, please set it up from settings');
      return
    }
    if(business.status == 'BLOCKED') {
      showToaster('You cant create service as your account is blocked');
      return;
    }
    if(!business?.wallet_id || !business_profile?.wallet?.charges_enabled) {
      showToaster('Setting up stripe business account is must before selling, go to dashboard and add the account');
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
     console.log(businessId)
     return;
    }
    showToaster('something went wrong')
    } catch(e) {
      setShowLoader(false);
       console.log(e.response.data);
       showToaster('something went wrong')
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
      screenHeading="Services">
        <Loader
        isVisible={showLoader}
        />
      <View>
        <FlatList
        data={services}
        keyExtractor={item => item?._id}
        renderItem={({item}) => {
          return (
            <Pressable
            onPress={() => {
                navigation.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                    service:item,
                    isBusiness:true,
                    isVendor:true
                })
            }}
            >
                <Image
                source={{uri:`${base_url}/${item?.coverImg}`}}
                style={{width:'100%',height:150,resizeMode:'cover',borderRadius:10}}
                />
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <View>
                  <Text style={{...CommonStyles.fontFamily,fontSize:17}}>{item?.name}</Text>
                    <Text style={{color:'grey'}}>{item?.category?.name}</Text>
                    {/* <RatingComponent numOfStars={5} totalReviews={10}/> */}
                    </View>
                    <Text style={{...CommonStyles.fontFamily,fontSize:16}}>MXN {item?.price}</Text>
                    </View>
                 
                </Pressable>
          )
        }}
        />
       
      </View>
      {/*<AllEmptyComponent />*/}
    </VendorScreenContainerComponent>
  );
};

export default VendorServicesScreen;
