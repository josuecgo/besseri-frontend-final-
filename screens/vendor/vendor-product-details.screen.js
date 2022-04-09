import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View,Image, Alert, ScrollView} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import ImageCarouselComponent from '../../components/image-carousel/image-carousel.component';
import ButtonComponent from '../../components/button/button.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN_HORIZONTAL_MARGIN, showToaster, VENDOR_DETAILS_ROUTES} from '../../util/constants';
import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url } from '../../util/api/api_essentials';
import axios from 'axios';
import {vendor_api_urls} from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import { getBusinessId, getUserId } from '../../util/local-storage/auth_service';
const VendorProductDetailsScreen = ({navigation, route}) => {
  const {height, width} = useWindowDimensions();
  const {params} = useRoute();
  const [product,setProduct] = useState(params.data);
  const [showLoader,setShowLoader] = useState(false);
  console.log('line 19 product',product);
  const goBack = () => {
    navigation.goBack();
  };
 
  const changeProductsStock = async() => {
    try {
      setShowLoader(true);
      const uri = product?.inStock ? vendor_api_urls.out_of_stock : vendor_api_urls.inStock;
    const apiCall = await axios.post(uri,{
      productId:product?._id
    })
    setShowLoader(false);
    if(apiCall.status == api_statuses.success) {
      setProduct(apiCall.data.data);
      console.log(apiCall.data);
      showToaster(`This product was marked as ${product?.inStock ? 'out of' : 'In'} stock.`)
    } else {
      showToaster('Something went wrong please try again later -1');
    }
    } catch(e) {
      console.log(e)
      setShowLoader(false);
      showToaster('Something went wrong please try again later');
    }
  }

  const deleteProduct = async() => {
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();
      const userId = await getUserId();
    const apiCall = await axios.post(vendor_api_urls.delete_product,{
      productId:product?._id,
      userId:userId,
      businessId:businessId
    })
    setShowLoader(false);
    if(apiCall.status == api_statuses.success) {
      setProduct(apiCall.data.data);
      console.log(apiCall.data);
      showToaster('This product was deleted successfully.');
      navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_LISTING);
    } else {
      showToaster('Something went wrong please try again later');
      console.log(apiCall.data)
    }
    } catch(e) {
      console.log('Error',e.response.data)
      setShowLoader(false);
      showToaster('Something went wrong please try again later');
    }
  }
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: route.params?.productName.toString().toUpperCase(),
  //   });
  // }, [route.params?.productName, navigation]);

  return (
   <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'white'}}>
      <View style={[CommonStyles.flexDirectionColumn]}>
      <LoaderComponent isVisible={showLoader}/>
      <View style={{height: height, backgroundColor: Colors.white}}>
        {/* <ImageCarouselComponent /> */}
        <Image
        source={{uri:`${base_url}/${product?.productImg}`}}
        style={styles.productImg}
        />
      </View>
      <ButtonComponent
        icon={<Ionicons size={20} color={Colors.black} name="chevron-back" />}
        colorB={Colors.white}
        width={30}
        height={30}
        handlePress={goBack}
        borderRadius={30 / 2}
        zIndex={2}
        position="absolute"
        top={20}
        left={20}
      />
      <View
        style={[
          {margin: SCREEN_HORIZONTAL_MARGIN},
          styles.contentContainer,
          CommonStyles.horizontalCenter,
        ]}>
        <View
          style={[
            CommonStyles.flexDirectionRow,
            {width: width - SCREEN_HORIZONTAL_MARGIN * 2},
          ]}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[CommonStyles.fontFamily, styles.productHeading]}>
            {product?.name}
          </Text>
          <View
            style={[
              CommonStyles.verticalCenter,
              {flex: 1, alignItems: 'flex-end'},
            ]}>
            <Text style={[CommonStyles.fontFamily, styles.price]}>MXN {product?.price}</Text>
          </View>
        </View>
        <View
          style={{
            width: width - SCREEN_HORIZONTAL_MARGIN * 2,
          }}>
          <Text
            style={[
              styles.productHeading,
              CommonStyles.fontFamily,
              styles.productDetails,
              {opacity: 0.5, textTransform: 'uppercase'},
            ]}>
            Product Details
          </Text>
          <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color: Colors.primaryColor, fontSize: 16}}>⬤ </Text>
            <Text style={{fontSize: 16}}>
              {product?.description}
            </Text>
          </Text>

          <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color: Colors.primaryColor, fontSize: 16}}>⬤MODAL: </Text>
            <Text style={{fontSize: 16}}>
              {product?.model?.name}
            </Text>
          </Text>

          <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color: Colors.primaryColor, fontSize: 16}}>⬤MAKER: </Text>
            <Text style={{fontSize: 16}}>
              {product?.maker?.name}
            </Text>
          </Text>

          {/* <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color: Colors.primaryColor, fontSize: 16}}>⬤FROM YEAR: </Text>
            <Text style={{fontSize: 16}}>
              {product?.fromYear}
            </Text>
          </Text> */}

          {/* <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color: Colors.primaryColor, fontSize: 16}}>⬤FROM YEAR: </Text>
            <Text style={{fontSize: 16}}>
              {product?.toYear}
            </Text>
          </Text> */}

          <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
            <Text style={{color:product?.inStock ? '#0bda51' : 'red', fontSize: 16}}>⬤STOCK STATUS: </Text>
            <Text style={{fontSize: 16,color:product?.inStock ? '#0bda51' : 'red'}}>
              {product?.inStock ? 'This product is in stock' : 'This product is out of stock, customers can not order this.'}
            </Text>
          </Text>
        </View>
        <ButtonComponent
          marginTop={40}
          colorB={Colors.primaryColor}
          buttonText={product?.inStock ? "Out of stock" : "Mark this as In stock product now"}
          handlePress={() => {
            Alert.alert(product?.inStock ? 'Is this product really out of stock?' : 'Is the product back in stock?',product?.inStock ? 'After marking this product out of stock customers will not be able to order this product.' : 'After marking this product in stock customers will be able to order this product.',
            [
              {
                text:'No'
              },
              {
                text:'Yes',
                onPress:changeProductsStock
              }
            ]
            )
          }}
          padding={15}
        />
          <ButtonComponent
          marginTop={10}
          width={width / 1.5}
          colorB={'#0bda51'}
          buttonText="Edit Product"
          handlePress={() => {
          navigation.navigate(VENDOR_DETAILS_ROUTES.CREATE_PRODUCT,{
            isEdit:true,
            product:product
          })
          }}
          padding={15}
        />
         <ButtonComponent
          marginTop={10}
          width={width / 1.5}
          colorB={Colors.red}
          buttonText="Delete Product"
          handlePress={() => {
            Alert.alert('Do you really want to delete this product?','After deleting this product, you can not restore it and the customers will not be able to order this product again',
            [
              {
                text:'No'
              },
              {
                text:'Yes',
                onPress:deleteProduct
              }
            ]
            )
          }}
          padding={15}
        />
      </View>
    </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
  productDetailsScreen: {
    backgroundColor: Colors.white,
  },
  backButton: {
    zIndex: 2,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  contentContainer: {
    position: 'absolute',
    top: 220,
  },
  productHeading: {
    fontSize: 20,
    flex: 3,
  },
  price: {
    fontSize: 18,
    opacity: 0.5,
  },
  productDetails: {
    marginVertical: 20,
  },
  productImg:{
    width:'100%',
    height:250,
    resizeMode:'cover'
  }
});

export default VendorProductDetailsScreen;
