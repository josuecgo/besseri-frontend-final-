import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity, View, ScrollView, BackHandler, FlatList,Image, ToastAndroid, Alert } from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator, MenuItem, Heading, AddBrandModal } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBusinessId, getBusinessProfile } from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import { BOTTOM_TAB_VENDOR_ROUTES, showToaster, VENDOR_DETAILS_ROUTES } from '../../util/constants';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto'
import ButtonComponent from '../../components/button/button.component';
import axios from 'axios';
import { api_statuses, base_url, vendor_api_urls } from '../../util/api/api_essentials';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');

const CREDENTIAL_KEYS = {
  NAME: 'Product name',
  STOCK: 'Product stock',
  DESCRIPTION: 'Description',
  FROM_YEAR: 'From year',
  TO_YEAR: 'To year',
  PRICE: 'Price',
  PRODUCT_IMAGE: 'Product Image',
  PRODUCT_MODEL: 'Product Model',
  PRODUCT_CONDITION: 'Product Conditon',
  PRODUCT_MAKER: 'Product Maker',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_BRAND:'Product Brand'
};
const SCREEN_TYPES = {
  PRODUCT_NAME: 'Product Name',
  CHOOSE_MAKER: 'Choose Maker',
  UPLOAD_IMAGE: 'Upload Product Image',
  PRODUCT_DESCRIPTION: 'Product Description',
  PRODUCT_PRICE: 'Product price',
  CHOOSE_CATEGORY: 'Choose Category',
  CHOOSE_MODEL: 'Choose Model',
  PRODUCT_CONDITION: 'Product condition',
  PRODUCT_SUMMARY: 'Product Summary',
  CHOOSE_SUB_CATEGORY:'Sub Category',
  PRODUCT_BRAND:'Product Brand'
}
const HEADER_TITLE = {
  [SCREEN_TYPES?.PRODUCT_NAME]: 'Indicate your product, write the name of the product you want to sell',
  [SCREEN_TYPES?.PRODUCT_DESCRIPTION]: 'Describe your product, write the description of your product.',
  [SCREEN_TYPES?.PRODUCT_PRICE]: 'What is the price of the product which you want to sell?',
  [SCREEN_TYPES?.CHOOSE_MAKER]: 'Who is the maker of the product you want to sell?',
  [SCREEN_TYPES?.CHOOSE_MODEL]: 'What is the model of the product you want to sell?',
  [SCREEN_TYPES?.CHOOSE_CATEGORY]: 'What is the category of the product which you want to sell?',
  [SCREEN_TYPES?.CHOOSE_SUB_CATEGORY]:'What is the subcategory of the product which you want to sell?',
  [SCREEN_TYPES?.PRODUCT_CONDITION]: 'What is the condition of the product?',
  [SCREEN_TYPES?.UPLOAD_IMAGE]: 'Upload the image, which shows the product you want to sell',
  [SCREEN_TYPES?.PRODUCT_SUMMARY]: 'Product Summary',
  [SCREEN_TYPES?.PRODUCT_BRAND] : 'What is the brand of the product you are creating?'
}
const VendorAddProductScreen = ({ navigation }) => {
  const {params} = useRoute();
  console.log(params.product)
 const isEditMode = params?.isEdit;
 const toBeEditedProduct = params?.product;
  const [inputValues, setInputValues] = useState({
    [CREDENTIAL_KEYS.NAME]: isEditMode ? toBeEditedProduct?.name :  '',
    [CREDENTIAL_KEYS.STOCK]: isEditMode ? toBeEditedProduct?.stock :  '',
    [CREDENTIAL_KEYS.DESCRIPTION]: isEditMode ? toBeEditedProduct?.description : '',
    [CREDENTIAL_KEYS.FROM_YEAR]: isEditMode ? toBeEditedProduct?.fromyear : '',
    [CREDENTIAL_KEYS.TO_YEAR]: isEditMode ? toBeEditedProduct?.toyear : '',
    [CREDENTIAL_KEYS.PRICE]: isEditMode ? toBeEditedProduct?.price : '',
    [CREDENTIAL_KEYS.PRODUCT_IMAGE]: isEditMode ? `${base_url}/${toBeEditedProduct?.productImg}` : '',
    [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: isEditMode ? toBeEditedProduct?.categoryId : '',
    [CREDENTIAL_KEYS.PRODUCT_CONDITION]:isEditMode ? toBeEditedProduct?.condition : '',
    [CREDENTIAL_KEYS.PRODUCT_MAKER]: isEditMode ? toBeEditedProduct?.maker : '',
    [CREDENTIAL_KEYS.PRODUCT_MODEL]: isEditMode ? toBeEditedProduct?.model : '',
    [CREDENTIAL_KEYS?.PRODUCT_BRAND] : isEditMode ? toBeEditedProduct?.brand : ''
  });
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSummaryMode,setisSummaryMode] = useState(false);
  const [selectedBrand,setselectedBrand] = useState(isEditMode ? toBeEditedProduct?.brand : null)
  const [models, setModels] = useState([]);
  const [makers, setMakers] = useState([]);
  const [brands,setBrands] = useState([])
  const [categories,setCategories] = useState([]);
  const [subcategories,setSubcategories] = useState([]);
  const selectedEditedCateg = categories.filter(categ => categ?._id == toBeEditedProduct?.categoryId)
  const [selectedCategory,setSelectedcategory] = useState(selectedEditedCateg);
  const [selectedSubCategory,setSelectedSubCategory] = useState();
  const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.PRODUCT_NAME);
  const isProductNameScreen = currentScreen == SCREEN_TYPES?.PRODUCT_NAME;
  const isDescriptionScreen = currentScreen == SCREEN_TYPES?.PRODUCT_DESCRIPTION;
  const isPriceScreen = currentScreen == SCREEN_TYPES?.PRODUCT_PRICE;
  const isChooseMaker = currentScreen == SCREEN_TYPES?.CHOOSE_MAKER;
  const isChooseModel = currentScreen == SCREEN_TYPES?.CHOOSE_MODEL;
  const isChooseCategory = currentScreen == SCREEN_TYPES?.CHOOSE_CATEGORY;
  const isProductCondition = currentScreen == SCREEN_TYPES?.PRODUCT_CONDITION;
  const isUploadImage = currentScreen == SCREEN_TYPES?.UPLOAD_IMAGE;
  const isProductSummary = currentScreen == SCREEN_TYPES?.PRODUCT_SUMMARY;
  const isBrandScreen = currentScreen == SCREEN_TYPES?.PRODUCT_BRAND;
  const textinputVal = isProductNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : '';
  const textinputKeys = isProductNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS.PRICE : '';
  const isSubCategory = currentScreen == SCREEN_TYPES?.CHOOSE_SUB_CATEGORY
  const addbrandModelRef = useRef()
  const [brandName,setBrandName] = useState('');

  const onChangeText = (inputText, key) => {
    setInputValues({ ...inputValues, [key]: inputText });
  };
  function previousItem() {
    let object = SCREEN_TYPES;
    let str = currentScreen;
    console.log(object, str);
    let lastKey = "";

    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (key == str) {
          lastKey = lastKey || key;
          let obj = {};
          obj[lastKey] = object[lastKey];
          return obj;
        } else {
          lastKey = key;
        }
      }
    }
  }

   //Create Brand

   const createBrand = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.post(vendor_api_urls.create_brand,{
        name:brandName
      });
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        addbrandModelRef?.current?.close()
        getBrands();
        setselectedBrand(apiCall.data.data);
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e.response.data)
      alert('something went wrong');
    }
  }
   
   // GETTING Brands FOR CREATING PRODUCTS
   const getBrands = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.get(vendor_api_urls.get_brands);
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        setBrands(apiCall.data.data);
      }
      
    } catch (e) {
      console.log(e?.response?.data)
      setShowLoader(false);
      alert('something went wrong');
    }
  }
  useEffect(() => {
    getBrands();
  },[]);



  // GETTING MODELS FOR CREATING PRODUCTS
  const getModels = async () => {
    try {
      if(inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id) {
        setShowLoader(true);
      const apiCall = await axios.get(`${vendor_api_urls.get_models}/${inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id}`);
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        setModels(apiCall.data.data);
      }
      } else {
        return;
      }
    } catch (e) {
      setShowLoader(false);
      alert('something went wrong');
    }
  }

  useEffect(() => {
    getModels();
  }, []);

  //GETTING CATEGORIES FOR CREATING PRODUCTS
  const getCategories = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.get(vendor_api_urls.get_categories);
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        setCategories(apiCall.data.data);
      }
      if(isEditMode) {
        const apiData = apiCall.data.data;
        for(var d = 0; d<apiData.length;d++) {
          if(apiData[d]?._id == toBeEditedProduct?.categoryId) {
            setSelectedcategory(apiData[d])
          }
        }
        console.log(selectedCategory)
      }
    } catch (e) {
      setShowLoader(false);
      alert('something went wrong');
    }
  }
  const getSubCategories = async () => {
    try {
    if(selectedCategory?._id) {
      setShowLoader(true);
      const apiCall = await axios.get(`${vendor_api_urls.get_sub_categories}/${selectedCategory?._id}`);
      setShowLoader(false);

      if (apiCall?.status == api_statuses?.success) {
        setSubcategories(apiCall.data.data);
      }
      if(isEditMode) {
        const apiData = apiCall.data.data;
        for(var d = 0; d<apiData.length;d++) {
          if(apiData[d]?._id == toBeEditedProduct?.subCategoryId) {
            setSelectedSubCategory(apiData[d])
          }
        }
        console.log(selectedCategory)
      }
    }
    } catch (e) {
      console.log(e?.response?.data)
      setShowLoader(false);
    }
  }
  useEffect(() => {
    getSubCategories()
  },[selectedCategory]);
  useEffect(() => {
    getCategories();
  },[]);


  // GETTING MAKERS FOR CREATING PRODUCTS

  const getMakers = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.get(vendor_api_urls.get_makers);
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        setMakers(apiCall.data.data);
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e.response.data)
      alert('something went wrong');
    }
  }

  useEffect(() => {
    getMakers();
  }, []);

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     if(isUploadImage) setCurrentScreen(SCREEN_TYPES?.PRODUCT_CONDITION);
  //     if(isProductCondition) setCurrentScreen(SCREEN_TYPES?.CHOOSE_CATEGORY);
  //     if(isChooseCategory) setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL);
  //     if(isChooseModel) setCurrentScreen(SCREEN_TYPES?.CHOOSE_MAKER);
  //     if(isChooseMaker) setCurrentScreen(SCREEN_TYPES?.PRODUCT_PRICE);
  //     if(isPriceScreen) setCurrentScreen(SCREEN_TYPES?.PRODUCT_DESCRIPTION);
  //     if(isDescriptionScreen) setCurrentScreen(SCREEN_TYPES?.PRODUCT_NAME);
  //     // if(isProductNameScreen) navigation.goBack()
  //     // const previousScreen = previousItem();
  //     // console.log(previousScreen);
  //     return true
  //     // setCurrentScreen(previousScreen);
  //     // return true 
  //   });
  // }, [])

  //


  const commonTextStyle = {
    fontSize: 17,
    color: Colors.white,
    ...CommonStyles.fontFamily,
    paddingLeft: 5
  }


  // Creating In screen components here
  const ListCard = ({ name, onPress,backgroundColor,selected }) => {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.flatListCardBtn,{
        backgroundColor:backgroundColor
      }]}>
        <Text style={{...styles.flatListCardBtnText,fontWeight:selected ? 'bold' : 'normal'}}>{name}</Text>
      </TouchableOpacity>
    )
  }
  const ProductSummaryCard = ({ label, value, onPress,isImageTab }) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ ...CommonStyles.flexDirectionRow, ...CommonStyles.justifySpaceBetween, width: '100%', padding: 10, ...CommonStyles.horizontalCenter, borderBottomWidth: 0.4 }}>
        <View style={{ width: '90%' }}>
          <Text style={{ fontWeight: '300', color: 'grey', fontSize: 13 }}>{label}</Text>
         {
           isImageTab ? 
            <View>
              <Image
              source={{uri:value}}
              style={{width:150,height:150}}
              />
              </View>
              :
              <Text style={styles.flatListCardBtnText}>{value}</Text>
         }
        </View>
        <Ionicons
          name={'chevron-forward'}
          color={Colors.primaryColor}
          size={30}
        />
      </TouchableOpacity>
    )
  }
  // Creating In Screen component ends here

  const pickProductImg = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image)
      onChangeText(image?.path, CREDENTIAL_KEYS.PRODUCT_IMAGE);
      setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
      setisSummaryMode(true);
      // setUri(image.path);
      props.onChange?.(image);
    });
  };

  const uploadProductImg = async() => {
    try {
      setShowLoader(true);
      const imageFormData = new FormData();
      imageFormData.append('productImg',{
        uri:inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE],
        type:'image/jpg',
        name:'photo.jpg'
      });
      const productImgUpload = await axios.post(vendor_api_urls.upload_product_image,imageFormData);
      setShowLoader(false)
      if(productImgUpload?.status == api_statuses.success) {
        return productImgUpload?.data?.data
      } else {
        return false;
      }
    }catch(e) {
       showToaster('Something went wrong while upload product img');
       console.log(e)
    }
  }

  const createProduct = async() => {
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();
      // const imageFormData = new FormData();
      // imageFormData.append('productImg',{
      //   uri:inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE],
      //   type:'image/jpg',
      //   name:'photo.jpg'
      // });
      const productImgUpload = await uploadProductImg();
      if(productImgUpload) {
        const apiBody = {
          name:inputValues[CREDENTIAL_KEYS.NAME],
          business_id:businessId,
          description:inputValues[CREDENTIAL_KEYS.DESCRIPTION],
          modelId:inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?._id,
          makerId:inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id,
          isBlocked:false,
          productImg:productImgUpload,
          categoryId:selectedCategory?._id,
          category:selectedCategory,
          price:inputValues[CREDENTIAL_KEYS.PRICE],
          condition:inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION],
          subCategory:selectedSubCategory,
          brand:selectedBrand,
          brandId:selectedBrand?._id
        }
        console.log(apiBody);
        const apiCall = await axios.post(vendor_api_urls?.create_product,apiBody);
        setShowLoader(false);
        if(apiCall.status == api_statuses.success) {
          showToaster('Your product has been created successfully');
          navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS,{
            data:apiCall.data.data
          })
        }
      }
       else {
         showToaster('Something went wrong, please try again');
         setShowLoader(false);
       }
     
    } catch(e) {
      setShowLoader(false);
      console.log(e)
      console.log(e.response.data)
       showToaster('Something went wrong, please try again, -2')
    }
  }



  const editProduct = async() => {
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();
      let productImgUpload = null;
      const productImg = `${base_url}/${toBeEditedProduct?.productImg}`;
      if(inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE] != productImg) {
        productImgUpload = await uploadProductImg();
      }
        const apiBody = {
          productId:toBeEditedProduct?._id,
          name:inputValues[CREDENTIAL_KEYS.NAME],
          business_id:businessId,
          description:inputValues[CREDENTIAL_KEYS.DESCRIPTION],
          modelId:inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?._id,
          makerId:inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id,
          isBlocked:false,
          productImg:productImgUpload ? productImgUpload : toBeEditedProduct?.productImg,
          categoryId:selectedCategory?._id,
          category:selectedCategory,
          price:inputValues[CREDENTIAL_KEYS.PRICE],
          condition:inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION]
        }
        const apiCall = await axios.patch(vendor_api_urls?.edit_product,apiBody);
        setShowLoader(false);
        if(apiCall.status == api_statuses.success) {
          showToaster('Your product has been edited successfully');
          navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS)
        }else {
          showToaster('Something went wrong, please try again-1');
          setShowLoader(false);
        }
      
       
     
    } catch(e) {
      setShowLoader(false);
      console.log(e)
      console.log(e.response.data)
       showToaster('Something went wrong, please try again, -2')
    }
  }

  return (
    <View style={styles.container}>
      <AddBrandModal
       addbrandModelRef={addbrandModelRef}
      //  onClose={() => addbrandModelRef?.current?.close()}
       name={brandName}
       onChangeName={nm => setBrandName(nm)}
       onProceed={createBrand}
      />
      <Loader isVisible={showLoader} />
      <View style={styles.header}>
        <View style={{ ...CommonStyles.flexDirectionRow, ...CommonStyles.horizontalCenter }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.pop()} style={styles.headerIcon}>
            <MaterialCommunityIcons name='keyboard-backspace' color='white' size={25} />
          </TouchableOpacity>
          <View style={{ width: '95%' }}>
            <Text style={commonTextStyle}>{HEADER_TITLE[currentScreen]}</Text>
          </View>

        </View>
        {/* {
          isChooseCategory || isChooseMaker || isChooseModel || isSubCategory || isBrandScreen ?
            <View style={styles.searchBarWrapper}>
              <InputFieldComponent
                width={'90%'}
                height={40}
                marginTop={20}
                borderRadius={10}
                icon={
                  <MaterialIcons
                    name='search'
                    size={25}
                    color={Colors.darker}
                  />
                }
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                  onChangeText(inputText, isProductNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : '');
                }}
                placeholderText={isProductNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
                secureTextEntry={false}
                value={isProductNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : ''}
                returnType="next"
                color={Colors.dark}
              />
            </View>
            :
            null
        } */}
      </View>

      <View
        style={{
          width: `${progress}%`,
          height: 5,
          backgroundColor: Colors.brightBlue,
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30
        }}
      />


      <ScrollView contentContainerStyle={styles.scrollViewContainer}>

        <View style={styles.InputWrapper}>
          {
            isProductNameScreen || isDescriptionScreen || isPriceScreen ?
              <InputFieldComponent
                width={'95%'}
                icon={
                  isProductNameScreen ?
                    <MaterialIcons color={Colors.dark} size={20} name="drive-file-rename-outline" />
                    :
                    isDescriptionScreen ?
                      <MaterialIcons color={Colors.dark} size={20} name="description" />
                      :
                      isPriceScreen ?
                        <Fontisto color={Colors.dark} size={20} name="dollar" />
                        :
                        null
                }
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                  onChangeText(inputText, textinputKeys);
                }}
                placeholderText={isProductNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
                secureTextEntry={false}
                value={textinputVal}
                returnType="next"
                color={Colors.dark}
              />
              :
              null
          }

          {
            isChooseModel || isChooseMaker || isChooseCategory  || isSubCategory || isBrandScreen?
            <View style={{flex:1}}>
               {
                 isChooseModel ? 
                 <Text style={{fontSize:18,...CommonStyles.fontFamily,padding:10}}>Selected Modal : {inputValues[CREDENTIAL_KEYS?.PRODUCT_MAKER]?.name}</Text>
                 :
                 null
               }
               {
                 isBrandScreen ? 
                   <TouchableOpacity
                   onPress={() => addbrandModelRef?.current?.open()}
                   style={{
                     paddingHorizontal:20,
                     paddingVertical:10,
                     borderWidth:1,
                     borderColor:Colors.primaryColor,
                     backgroundColor:Colors.primaryColor,
                     justifyContent:'center',
                     alignItems:'center',
                     alignSelf:'flex-end',
                     borderRadius:5,
                     marginRight:10,
                     margin:5
                   }}>
                     <Text style={{...CommonStyles.fontFamily,color:'white'}}>Add Brand</Text>
                     </TouchableOpacity>
                     :
                     null
               }
                <FlatList
                data={isChooseMaker ? makers : isChooseModel ? models : isChooseCategory ? categories : isSubCategory ? subcategories : isBrandScreen ? brands : []}
                keyExtractor={item => item?._id}
                renderItem={itemData => (
                  <ListCard
                  selected={isChooseMaker ? inputValues[CREDENTIAL_KEYS?.PRODUCT_MAKER]?._id == itemData.item._id : isChooseModel ? inputValues[CREDENTIAL_KEYS?.PRODUCT_MODEL]?._id == itemData.item?._id : isChooseCategory ? inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY] == itemData?.item?._id : isSubCategory ? selectedSubCategory?._id == itemData?.item?._id  : isBrandScreen ? selectedBrand?._id == itemData?.item?._id:   false}
                  onPress={() => {
                    if (isChooseMaker) setInputValues({ ...inputValues, [CREDENTIAL_KEYS.PRODUCT_MAKER]: itemData.item });
                    if (isChooseModel) setInputValues({ ...inputValues, [CREDENTIAL_KEYS.PRODUCT_MODEL]: itemData.item });
                    if (isChooseCategory) {
                      setInputValues({ ...inputValues, [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: itemData.item?._id });
                      setSelectedcategory(itemData.item);
                      getSubCategories()
                    }
                    if(isSubCategory) {
                      setSelectedSubCategory(itemData.item)

                    }
                    if(isBrandScreen) {
                      setselectedBrand(itemData?.item)
                    }
                  }} name={itemData.item.name} />
                )}
              />
              </View>
              :
              null
          }

          {
            isProductCondition ?
              <View>
                <ListCard selected={inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] == 'New'} onPress={() => {
                  onChangeText('New', CREDENTIAL_KEYS.PRODUCT_CONDITION)
                  
                }} name='New' />
                <ListCard selected={inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] == 'Used'} onPress={() => {
                  onChangeText('Used', CREDENTIAL_KEYS.PRODUCT_CONDITION);
                  
                }} name='Used' />
                <ListCard
                selected={inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] == 'Reconditioned'}
                  onPress={() => {
                    onChangeText('Reconditioned', CREDENTIAL_KEYS.PRODUCT_CONDITION);
                    
                  }}
                  name='Reconditioned' />
              </View>
              :
              null
          }

          {
            isUploadImage ?
              <View style={styles.uploadImgContainer}>
                {
                  isEditMode ? 
                  <Image
                  source={{uri:`${base_url}/${toBeEditedProduct?.productImg}`}}
                  style={{width:100,height:100,borderRadius:100/2}}
                  />
                  :
                  <Entypo name='camera' color={Colors.primaryColor} size={100} />
                }
                <Text style={styles.uploadImgContainerHeading}>{isEditMode ? 'Want to edit product Image?' : 'Upload the image of product'}</Text>
                <Text style={styles.uploadImgContainerDescription}>The image should be very clear and should represent the product you want to sell, remember that a perfect picture attracts customers.</Text>
                <View style={styles.buttonWrapper}>
                  <ButtonComponent
                    buttonText={isEditMode ? 'Edit' : 'Upload'}
                    colorB={Colors.brightBlue}
                    width={width / 2}
                    margin={15}
                    borderRadius={10}
                    handlePress={pickProductImg}
                  />
                   
                </View>
                {
                  isEditMode ? 
                  <ButtonComponent
                    buttonText={'Next'}
                    colorB={'#0bda51'}
                    width={width / 2}
                    borderRadius={10}
                    handlePress={() => {
                      setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
      setisSummaryMode(true);
                    }}
                  />
                  :
                  null
                }
              </View>
              :
              null
          }
        </View>
        {
          isProductSummary ?
            <View style={CommonStyles.flexOne}>
              <ProductSummaryCard
                onPress={pickProductImg}
                value={inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE]}
                label='Image'
                isImageTab={true}
              />
              <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_NAME)}
                value={inputValues[CREDENTIAL_KEYS.NAME]}
                label='Title'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_DESCRIPTION)}
                value={inputValues[CREDENTIAL_KEYS.DESCRIPTION]}
                label='Description'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_PRICE)}
                value={`MXN ${inputValues[CREDENTIAL_KEYS.PRICE]}`}
                label='Price'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_CATEGORY)}
                value={`${selectedCategory?.name}`}
                label='Category'
              />
               <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_SUB_CATEGORY)}
                value={`${selectedSubCategory?.name}`}
                label='Sub Category'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MAKER)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?.name}`}
                label='Maker'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?.name}`}
                label='Model'
              />
               <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_BRAND)}
                value={`${selectedBrand?.name}`}
                label='Product Brand'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_CONDITION)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION]}`}
                label='Condition'
              />
              <Text style={{fontSize:13,fontWeight:'300',width:'100%',padding:10,alignSelf:'center'}}>Make sure that you agree to the <Text style={{fontWeight:'bold',color:Colors.brightBlue}}>terms and policies</Text> of <Text style={{fontWeight:'bold',color:Colors.primaryColor}}>Besser </Text>before creating the product, going against the policies might get your account suspended.</Text>
            </View>
            :
            null
        }


        {
          isUploadImage ?
            null
            :
            <View style={styles.buttonWrapper}>
              <ButtonComponent
                buttonText={'Proceed'}
                colorB={Colors.brightBlue}
                width={width - 25}
                margin={5}
                borderRadius={10}
                handlePress={async() => {
                  if(isSummaryMode && isProductSummary) {
                    if(isEditMode) {
                      await editProduct()
                    }
                    if(!isEditMode) {
                      await createProduct()
                    }
                  }
                  if(isSummaryMode) {
                    if(isChooseMaker) {
                      getModels();
                      setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL);
                    } else {
                      setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
                    }
                    
                  } else {
                    if(currentScreen == SCREEN_TYPES?.CHOOSE_MAKER) {
                      getModels();
                    }
                    if(currentScreen == SCREEN_TYPES?.CHOOSE_SUB_CATEGORY) {
                      getSubCategories();
                    }
                    setCurrentScreen(isProductNameScreen ? SCREEN_TYPES?.PRODUCT_DESCRIPTION : isDescriptionScreen ? SCREEN_TYPES?.PRODUCT_PRICE : isPriceScreen ? SCREEN_TYPES?.CHOOSE_MAKER : isChooseMaker ? SCREEN_TYPES?.CHOOSE_MODEL : isChooseModel ? SCREEN_TYPES?.CHOOSE_CATEGORY : isChooseCategory ? SCREEN_TYPES?.CHOOSE_SUB_CATEGORY : isSubCategory ? SCREEN_TYPES?.PRODUCT_BRAND : isBrandScreen ?  SCREEN_TYPES?.PRODUCT_CONDITION : isProductCondition ? SCREEN_TYPES?.UPLOAD_IMAGE : null);
                  setProgress(progress + (100 / 8))
                  }
                }}
              />
            </View>
        }





      </ScrollView>



    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    width: '100%',
    minHeight: 65,
    paddingVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    ...CommonStyles.horizontalCenter,
  },
  headerIcon: {
    // paddingHorizontal: 10
  },
  InputWrapper: {
    flex: 1,
    ...CommonStyles.horizontalCenter
  },
  scrollViewContainer: {
    flexGrow: 1, paddingVertical: 15
  },
  buttonWrapper: {
    ...CommonStyles.flexDirectionRow, width: width, ...CommonStyles.flexCenter
  },
  searchBarWrapper: {
    marginTop: 10, width: '100%', alignSelf: 'center', ...CommonStyles.flexCenter
  },
  flatListCardBtn: { padding: 10, borderBottomWidth: 0.5, width: width, ...CommonStyles.flexCenter },
  flatListCardBtnText: { fontSize: 19, fontWeight: '300' },
  uploadImgContainer: { ...CommonStyles.flexOneCenter, width: '90%', alignSelf: 'center' },
  uploadImgContainerHeading: { ...CommonStyles.fontFamily, textAlign: 'center', fontSize: 18 },
  uploadImgContainerDescription: { textAlign: 'center', fontSize: 14 }
})
export default VendorAddProductScreen;
