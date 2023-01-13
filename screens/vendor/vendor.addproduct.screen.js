import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,

  FlatList,
  Image,
  Platform,

} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {

  AddBrandModal,
} from '../../components/CommonComponents';

import Entypo from 'react-native-vector-icons/Entypo';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getBusinessId,
} from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component';
import {
  BOTTOM_TAB_VENDOR_ROUTES,
  showToaster,
  VENDOR_DETAILS_ROUTES,
} from '../../util/constants';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import ButtonComponent from '../../components/button/button.component';
import axios from 'axios';
import {
  api_statuses,
  base_url,
  vendor_api_urls,
} from '../../util/api/api_essentials';
import ImagePicker from 'react-native-image-crop-picker';
import {useRoute} from '@react-navigation/native';
import {adjust, deviceHeight, deviceWidth} from '../../util/Dimentions';
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenFocusProduct, stringIsEmpty } from '../../util/helpers/StatusText';
import { RenderItemAplication } from '../../components/Vendor/RenderItemAplication';
import { ListEmpty } from '../../components/Vendor/ListEmpty';


const {width} = Dimensions.get('screen');


export const CREDENTIAL_KEYS = {
  NAME: 'Product name',
  STOCK: 'Product stock',
  DESCRIPTION: 'Description',
  FROM_YEAR: 'From year',
  TO_YEAR: 'To year',
  PRICE: 'Price',
  ESTIMATED_DELIVERY: 'Estimated Delivery',
  PRODUCT_IMAGE: 'Product Image',
  PRODUCT_MODEL: 'Product Model',
  PRODUCT_APLICATION: 'Product Aplication',
  PRODUCT_CONDITION: 'Product Conditon',
  PRODUCT_MAKER: 'Product Maker',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_BRAND: 'Product Brand',
};
export const SCREEN_TYPES = {
  PRODUCT_NAME: 'Nombre del producto',
  CHOOSE_MAKER: 'Elija el fabricante',
  UPLOAD_IMAGE: 'Subir imagen',
  PRODUCT_DESCRIPTION: 'Descripción del producto',
  PRODUCT_PRICE: 'Precio del producto',
  ESTIMATED_DELIVERY: 'Tiempo de entrega',
  CHOOSE_CATEGORY: 'Elegir la categoría',
  CHOOSE_MODEL: 'Elegir modelo',
  CHOOSE_APLICATION: 'Elegir año compatible',
  PRODUCT_CONDITION: 'Condición del producto',
  PRODUCT_SUMMARY: 'Resumen del producto',
  CHOOSE_SUB_CATEGORY: 'Subcategoría',
  PRODUCT_BRAND: 'Marca del producto',
};
const HEADER_TITLE = {
  [SCREEN_TYPES?.PRODUCT_NAME]: 'Nombre del producto',
  [SCREEN_TYPES?.PRODUCT_DESCRIPTION]: 'Descripcion del producto.',
  [SCREEN_TYPES?.PRODUCT_PRICE]: '¿Cuál es el precio del producto?',
  [SCREEN_TYPES?.ESTIMATED_DELIVERY]: '¿Tiempo de entrega del producto?',
  [SCREEN_TYPES?.CHOOSE_MAKER]: '¿Quién es el fabricante del producto?',
  [SCREEN_TYPES?.CHOOSE_MODEL]: '¿Cuál es el modelo del producto?',
  [SCREEN_TYPES?.CHOOSE_APLICATION]: '¿Cuál es el año del vehiculo compatible?',
  [SCREEN_TYPES?.CHOOSE_CATEGORY]: '¿Cuál es la categoría del producto?',
  [SCREEN_TYPES?.CHOOSE_SUB_CATEGORY]: '¿Cuál es la subcategoría del producto?',
  [SCREEN_TYPES?.PRODUCT_CONDITION]: '¿Cuál es el estado del producto?',
  [SCREEN_TYPES?.UPLOAD_IMAGE]: 'Sube la imagen, que muestra el producto',
  [SCREEN_TYPES?.PRODUCT_SUMMARY]: 'Resumen del producto',
  [SCREEN_TYPES?.PRODUCT_BRAND]:'¿Cuál es la marca del producto que está creando?',
};
const VendorAddProductScreen = ({navigation}) => {
  const {params} = useRoute();
  const {top} = useSafeAreaInsets()
  const isEditMode = params?.isEdit;
  const toBeEditedProduct = params?.product;
  
  let images = ''; 
  
  if (isEditMode) {
    if (toBeEditedProduct.urlsImg.length > 0) {
      console.log(toBeEditedProduct.urlsImg,'to edit');
      images = toBeEditedProduct?.urlsImg.map((i)=>  `${base_url}/${i?.path}`)
    }else{
      
      images = [{path:`${base_url}/${toBeEditedProduct.productImg}`}]
    }
  }


  const [inputValues, setInputValues] = useState({
    [CREDENTIAL_KEYS.NAME]: isEditMode ? toBeEditedProduct?.name : '',
    [CREDENTIAL_KEYS.STOCK]: isEditMode ? toBeEditedProduct?.stock : '',
    [CREDENTIAL_KEYS.DESCRIPTION]: isEditMode
      ? toBeEditedProduct?.description
      : '',
    [CREDENTIAL_KEYS.FROM_YEAR]: isEditMode ? toBeEditedProduct?.fromyear : '',
    [CREDENTIAL_KEYS.TO_YEAR]: isEditMode ? toBeEditedProduct?.toyear : '',
    [CREDENTIAL_KEYS.PRICE]: isEditMode ? toBeEditedProduct?.price : '',
    [CREDENTIAL_KEYS.ESTIMATED_DELIVERY]: isEditMode ? toBeEditedProduct?.estimatedDelivery : '',
    [CREDENTIAL_KEYS.PRODUCT_IMAGE]: images,
    [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: isEditMode
      ? toBeEditedProduct?.categoryId
      : '',
    [CREDENTIAL_KEYS.PRODUCT_CONDITION]: isEditMode
      ? toBeEditedProduct?.condition
      : '',
    [CREDENTIAL_KEYS.PRODUCT_MAKER]: isEditMode ? toBeEditedProduct?.maker : '',
    [CREDENTIAL_KEYS.PRODUCT_MODEL]: isEditMode ? toBeEditedProduct?.model : '',
    [CREDENTIAL_KEYS.PRODUCT_APLICATION]: isEditMode ? toBeEditedProduct?.aplication : '',
    [CREDENTIAL_KEYS?.PRODUCT_BRAND]: isEditMode
      ? toBeEditedProduct?.brand
      : '',
  });
  
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSummaryMode, setisSummaryMode] = useState(false);
  const [selectedBrand, setselectedBrand] = useState(
    isEditMode ? toBeEditedProduct?.brand : null,
  );
  const [aplication, setAplication] = useState([]);
  const [models, setModels] = useState([]);
  const [makers, setMakers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const selectedEditedCateg = categories.filter(
    categ => categ?._id == toBeEditedProduct?.categoryId,
  );
  const [selectedCategory, setSelectedcategory] = useState(selectedEditedCateg);
  const [selectedSubCategory, setSelectedSubCategory] = useState();
  const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.PRODUCT_NAME);
  const isProductNameScreen = currentScreen == SCREEN_TYPES?.PRODUCT_NAME;
  const isDescriptionScreen = currentScreen == SCREEN_TYPES?.PRODUCT_DESCRIPTION;
  const isPriceScreen = currentScreen == SCREEN_TYPES?.PRODUCT_PRICE;
  const isDeliveryScreen = currentScreen == SCREEN_TYPES?.ESTIMATED_DELIVERY;
  const isChooseMaker = currentScreen == SCREEN_TYPES?.CHOOSE_MAKER;
  const isChooseModel = currentScreen == SCREEN_TYPES?.CHOOSE_MODEL;
  const isChooseAplication = currentScreen == SCREEN_TYPES?.CHOOSE_APLICATION;
  const isChooseCategory = currentScreen == SCREEN_TYPES?.CHOOSE_CATEGORY;
  const isProductCondition = currentScreen == SCREEN_TYPES?.PRODUCT_CONDITION;
  const isUploadImage = currentScreen == SCREEN_TYPES?.UPLOAD_IMAGE;
  const isProductSummary = currentScreen == SCREEN_TYPES?.PRODUCT_SUMMARY;
  const isBrandScreen = currentScreen == SCREEN_TYPES?.PRODUCT_BRAND;
  const optionDelivery = [
    {
      _id:1,
      name:'1-2 horas'
    },{
      _id:2,
      name:'2-4 horas'
    },
    {
      _id:3,
      name:'5-6 horas'
    },
    {
      _id:4,
      name:'Dia siguiente'
    },
  ]
  const [pantallaSelect, setpantallaSelect] = useState('')


  const textinputVal = isProductNameScreen
    ? inputValues[CREDENTIAL_KEYS.NAME]
    : isDescriptionScreen
    ? inputValues[CREDENTIAL_KEYS.DESCRIPTION]
    : isPriceScreen
    ? inputValues[CREDENTIAL_KEYS.PRICE]
    : '';

  // console.log(isDeliveryScreen);
  const textinputKeys = isProductNameScreen
    ? CREDENTIAL_KEYS.NAME
    : isDescriptionScreen
    ? CREDENTIAL_KEYS.DESCRIPTION
    : isPriceScreen
    ? CREDENTIAL_KEYS.PRICE
    : '';
  
  
  const isSubCategory = currentScreen == SCREEN_TYPES?.CHOOSE_SUB_CATEGORY;
  const addbrandModelRef = useRef();
  const [brandName, setBrandName] = useState('');

  const onChangeText = (inputText, key) => {
   
    setInputValues({...inputValues, [key]: inputText});
 
  };
  

  //Create Brand

  const createBrand = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.post(vendor_api_urls.create_brand, {
        name: brandName,
      });
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        addbrandModelRef?.current?.close();
        getBrands();
        setselectedBrand(apiCall.data.data);
      }
    } catch (e) {
      setShowLoader(false);
      // console.log(e.response.data);
      alert('Algo salió mal');
    }
  };

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
      // console.log(e?.response?.data);
      setShowLoader(false);
      alert('Algo salió mal');
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  // GETTING MODELS FOR CREATING PRODUCTS
  const getModels = async () => {
    try {
      if (inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id) {
        setShowLoader(true);
        const apiCall = await axios.get(
          `${vendor_api_urls.get_models}/${
            inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id
          }`,
        );
        setShowLoader(false);
        if (apiCall?.status == api_statuses?.success) {
          setModels(apiCall.data.data);
        }
      } else {
        return;
      }
    } catch (e) {
      setShowLoader(false);
      alert('Algo salió mal');
    }
  };

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
      if (isEditMode) {
        const apiData = apiCall.data.data;
        for (var d = 0; d < apiData.length; d++) {
          if (apiData[d]?._id == toBeEditedProduct?.categoryId) {
            setSelectedcategory(apiData[d]);
          }
        }
        // console.log(selectedCategory);
      }
    } catch (e) {
      setShowLoader(false);
      alert('Algo salió mal');
    }
  };

  const getSubCategories = async () => {
    try {
      if (selectedCategory?._id) {
        setShowLoader(true);
        const apiCall = await axios.get(
          `${vendor_api_urls.get_sub_categories}/${selectedCategory?._id}`,
        );
        setShowLoader(false);

        if (apiCall?.status == api_statuses?.success) {
          setSubcategories(apiCall.data.data);
        }
        if (isEditMode) {
          const apiData = apiCall.data.data;
          for (var d = 0; d < apiData.length; d++) {
            if (apiData[d]?._id == toBeEditedProduct?.subCategoryId) {
              setSelectedSubCategory(apiData[d]);
            }
          }
          // console.log(selectedCategory);
        }
      }
     
    } catch (e) {
      // console.log(e?.response?.data);
      setShowLoader(false);
    }
  };

  const getAplications = async() => {
    
    try {
      const apiCall = await axios.post(
        `${vendor_api_urls.get_aplication}`,{
          selectedSubCategory:selectedSubCategory._id,
          model:inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]._id
        }
      );

      
      setAplication(apiCall.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (selectedSubCategory) {
      getAplications()
    }
   
  }, [selectedSubCategory])
  

  useEffect(() => {
    getSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    getCategories();
  }, []);

  // GETTING MAKERS FOR CREATING PRODUCTS
  const getMakers = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.get(vendor_api_urls.get_makers_vendor);
      setShowLoader(false);
      
      if (apiCall?.status == api_statuses?.success) {
        setMakers(apiCall.data.data);
      }
    } catch (e) {
      setShowLoader(false);
      // console.log(e.response.data);
      alert('Algo salió mal');
    }
  };

  useEffect(() => {
    getMakers();
  }, []);


  const commonTextStyle = {
    fontSize: adjust(14),
    color: Colors.black,
    ...CommonStyles.fontFamily,
    // paddingLeft: 5,
    fontWeight:'bold'
  };

  // Creating In screen components here
  const ListCard = ({name, onPress, backgroundColor, selected}) => {
    
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.flatListCardBtn,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        <Text
          style={{
            ...styles.flatListCardBtnText,
            fontWeight: selected ? 'bold' : 'normal',
          }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };
 
  // console.log(toBeEditedProduct.productImg);
  const ProductSummaryCard = ({label, value, onPress, isImageTab}) => {
    if (isImageTab) {
      console.log(value);
    }
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          ...CommonStyles.flexDirectionRow,
          ...CommonStyles.justifySpaceBetween,
          width: '100%',
          padding: 10,
          ...CommonStyles.horizontalCenter,
          borderBottomWidth: 0.4,
        }}>
        <View style={{width: '90%'}}>
          <Text style={{fontWeight: '300', color: 'grey', fontSize: 13}}>
            {label}
          </Text>
          {isImageTab ? 
            
        
            <>
            <View style={{flexDirection:'row'}} >
              {/* {
                toBeEditedProduct?.urlsImg  ? (
                  toBeEditedProduct?.urlsImg.map((item,index) => {
                    
                  if (index < 3) {
                    return(
                      <View key={item?.path}  >
                       
                        <Image source={{uri: `${base_url}/${item.path}`}} style={{width: deviceWidth / 3.5, height: 100}}  resizeMode='cover' />
                      </View>
                    )
                  }
                  return null
                })
              ):(
                <View  >
                   
                  <Image source={{uri: }} stle={{width: deviceWidth / 3.5, height: 100}}  resizeMode='cover' />
                 </View>
              )
             
            } */}
            {
              value.map((item,i) => (
                <View key={i} >
                  <Image source={{uri: value.length > 0 ? item.path : item }} 
                  style={{width: deviceWidth / 3.5, height: 100}}  
                  resizeMode='cover' 
                  />
                </View>
              ))
            }
            </View>
             
          
            </>
            
           

           : (
            <Text style={styles.flatListCardBtnText}>{value}</Text>
          )}
        </View>
        <Ionicons
          name={'chevron-forward'}
          color={Colors.primaryColor}
          size={30}
        />
      </TouchableOpacity>
    );
  };
  // Creating In Screen component ends here

  const pickProductImg1 = () => {
    ImagePicker.openPicker({
      multiple: true,
      width: 300,
      height: 400,
      maxFiles:3,
      mediaType:'photo',
      compressImageQuality:0.5,
      compressImageMaxHeight:400,
      compressImageMaxWidth:300
      
    }).then((image) => {
      
      onChangeText(image, CREDENTIAL_KEYS.PRODUCT_IMAGE);
      setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
      setisSummaryMode(true);
     
    });
  };

  // console.log(toBeEditedProduct);
  
const uploadProductImg = async () => {
  setShowLoader(true);
  const imageFormData = new FormData();
  let images = inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE];
 
  for (let index = 0; index < images.length; index++) {  
    
    imageFormData.append('imageFormData', {
      uri: Platform.OS === 'ios' ? images[index]?.path : images[index]?.path,
      type: images[index]?.mime,
      name: 'photo.jpg',
    });
  }
  

  var requestoptions = {
    method: 'POST',
    body: imageFormData,
    headers:{
      'Content-Type' : 'multipart/form-data'
    }
  };

  let resp = await  fetch(vendor_api_urls.upload_product_image,requestoptions);
  // await  data.then(res => {
  //    //console.log(res.json());

  //     res.json()
  //   })
  //   .then(result => {
  //     setShowLoader(false);
      
  //     console.log(result);
  //     if (result?.success) {
  //       // return result?.data;
        
  //       return result?.data
  //     } else {
  //       return false;
  //     }
  //   } )
  //   .catch(error =>{
  //      console.log(error,'fetch')
  //      setShowLoader(false);
  //     })
  const data = await resp.json();
  // console.log(data);
  if (data?.success) {
    return data?.data
  }
  return false
  
};

  
  const createProduct = async () => {
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();

      
      const productImgUpload = await uploadProductImg();
      // console.log({productImgUpload});
      if (productImgUpload) {
        const apiBody = {
          name: inputValues[CREDENTIAL_KEYS.NAME],
          business_id: businessId,
          description: inputValues[CREDENTIAL_KEYS.DESCRIPTION],
          modelId: inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?._id,
          makerId: inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id,
          isBlocked: false,
          productImg: productImgUpload[0]?.path,
          urlsImg:productImgUpload,
          categoryId: selectedCategory?._id,
          category: selectedCategory,
          price: inputValues[CREDENTIAL_KEYS.PRICE],
          condition: inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION],
          subCategory: selectedSubCategory,
          brand: selectedBrand,
          brandId: selectedBrand?._id,
          estimatedDelivery: inputValues[CREDENTIAL_KEYS.ESTIMATED_DELIVERY].name,
          aplicacion:{
            de:inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.de,
            al:inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.al
          }
        };
        
        const apiCall = await axios.post(
          vendor_api_urls?.create_product,
          apiBody,
        );
        setShowLoader(false);
        if (apiCall.status == api_statuses.success) {
          showToaster('Su producto ha sido creado con éxito');
          navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS, {
            data: apiCall.data.data,
          });
        }
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        setShowLoader(false);
      }
      setShowLoader(false);
    } catch (e) {
      setShowLoader(false);
      // console.log(e,'create');
  
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  };

  
  const editProduct = async () => {
   
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();
      let productImgUpload = null;
      const productImg = `${base_url}/${toBeEditedProduct?.productImg}`;
      if (inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE] != productImg) {
        productImgUpload = await uploadProductImg();
      }
      const apiBody = {
        productId: toBeEditedProduct?._id,
        name: inputValues[CREDENTIAL_KEYS.NAME],
        business_id: businessId,
        description: inputValues[CREDENTIAL_KEYS.DESCRIPTION],
        modelId: inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?._id,
        makerId: inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?._id,
        isBlocked: false,
        productImg: productImgUpload
          ?  productImgUpload[0]?.path
          : toBeEditedProduct?.productImg,
        urlsImg:productImgUpload,
        categoryId: selectedCategory?._id,
        category: selectedCategory,
        price: inputValues[CREDENTIAL_KEYS.PRICE],
        condition: inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION],
        estimatedDelivery: inputValues[CREDENTIAL_KEYS.ESTIMATED_DELIVERY].name,
        aplicacion:{
          de:inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.de,
          al:inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.al
        }
      };
      const apiCall = await axios.patch(vendor_api_urls?.edit_product, apiBody);
      setShowLoader(false);
      if (apiCall.status == api_statuses.success) {
        showToaster('Su producto ha sido editado con éxito');
        navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS);
      } else {
        showToaster(
          'Algo salió mal, inténtalo de nuevo, contacte con él administrador',
        );
        setShowLoader(false);
      }
    } catch (e) {
      setShowLoader(false);
      // console.log(e,'e');
      // console.log(e.response.data);
      showToaster(
        'Algo salió mal, inténtalo de nuevo, contacte con él administrador',
      );
    }
  };

  
 
 
  
  useEffect(() => {
    setpantallaSelect(screenFocusProduct(currentScreen))
  }, [currentScreen])
    
 
  const nextPage = () => {
        
        if (stringIsEmpty(inputValues[pantallaSelect]) ){
          if (inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]._id === '639cb2cacd30bfa4463f12a7') {
            setCurrentScreen(
              isProductNameScreen
                ? SCREEN_TYPES?.PRODUCT_DESCRIPTION
                : isDescriptionScreen
                ? SCREEN_TYPES?.PRODUCT_PRICE
                : isPriceScreen
                ? SCREEN_TYPES?.ESTIMATED_DELIVERY
                : isDeliveryScreen
                ? SCREEN_TYPES?.CHOOSE_MAKER
                : isChooseMaker
                ? SCREEN_TYPES?.CHOOSE_MODEL
                : isChooseModel
                ? SCREEN_TYPES?.CHOOSE_CATEGORY
                : isChooseCategory
                ? SCREEN_TYPES?.CHOOSE_SUB_CATEGORY
                : isSubCategory
                ? SCREEN_TYPES?.PRODUCT_BRAND
                : isBrandScreen
                ? SCREEN_TYPES?.PRODUCT_CONDITION
                : isProductCondition
                ? SCREEN_TYPES?.UPLOAD_IMAGE
                : null
            );
          }else{
            setCurrentScreen(
              isProductNameScreen
                ? SCREEN_TYPES?.PRODUCT_DESCRIPTION
                : isDescriptionScreen
                ? SCREEN_TYPES?.PRODUCT_PRICE
                : isPriceScreen
                ? SCREEN_TYPES?.ESTIMATED_DELIVERY
                : isDeliveryScreen
                ? SCREEN_TYPES?.CHOOSE_MAKER
                : isChooseMaker
                ? SCREEN_TYPES?.CHOOSE_MODEL
                : isChooseModel
                ? SCREEN_TYPES?.CHOOSE_CATEGORY
                : isChooseCategory
                ? SCREEN_TYPES?.CHOOSE_SUB_CATEGORY
                : isSubCategory
                ? SCREEN_TYPES.CHOOSE_APLICATION
                : isChooseAplication
                ? SCREEN_TYPES?.PRODUCT_BRAND
                : isBrandScreen
                ? SCREEN_TYPES?.PRODUCT_CONDITION
                : isProductCondition
                ? SCREEN_TYPES?.UPLOAD_IMAGE
                : null
            );
          }
          
          setProgress(progress + 100 / 8);
        }else{
          if (isChooseAplication) {
            showToaster('No puedes crear este producto')
          }else{
            showToaster('Rellena el campo')
          }
          
        }
  
  }

  
  const backPage = () => {
    if (inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]._id === '639cb2cacd30bfa4463f12a7') {
      setCurrentScreen(
        isProductNameScreen
          ? navigation.pop()
          : isDescriptionScreen
          ? SCREEN_TYPES?.PRODUCT_NAME
          : isPriceScreen
          ? SCREEN_TYPES?.PRODUCT_DESCRIPTION
          :isDeliveryScreen
          ?SCREEN_TYPES?.PRODUCT_PRICE
          : isChooseMaker
          ? SCREEN_TYPES?.ESTIMATED_DELIVERY
          : isChooseModel
          ? SCREEN_TYPES?.CHOOSE_MAKER
          : isChooseCategory
          ? SCREEN_TYPES?.CHOOSE_MODEL
          : isSubCategory
          ? SCREEN_TYPES?.CHOOSE_CATEGORY
          : isBrandScreen
          ? SCREEN_TYPES?.CHOOSE_SUB_CATEGORY
          : isProductCondition 
          ? SCREEN_TYPES?.PRODUCT_BRAND
          : isUploadImage
          ? SCREEN_TYPES?.PRODUCT_CONDITION
          : isProductSummary
          ? SCREEN_TYPES?.UPLOAD_IMAGE
          : null
      );
      setProgress(progress - 100 / 8);
    }else{
      setCurrentScreen(
        isProductNameScreen
          ? navigation.pop()
          : isDescriptionScreen
          ? SCREEN_TYPES?.PRODUCT_NAME
          : isPriceScreen
          ? SCREEN_TYPES?.PRODUCT_DESCRIPTION
          :isDeliveryScreen
          ?SCREEN_TYPES?.PRODUCT_PRICE
          : isChooseMaker
          ? SCREEN_TYPES?.ESTIMATED_DELIVERY
          : isChooseModel
          ? SCREEN_TYPES?.CHOOSE_MAKER
          : isChooseCategory
          ? SCREEN_TYPES?.CHOOSE_MODEL
          : isSubCategory
          ? SCREEN_TYPES?.CHOOSE_CATEGORY
          : isBrandScreen
          ? SCREEN_TYPES.CHOOSE_APLICATION
          : isChooseAplication
          ? SCREEN_TYPES?.CHOOSE_SUB_CATEGORY
        
          : isProductCondition 
          ? SCREEN_TYPES?.PRODUCT_BRAND
          : isUploadImage
          ? SCREEN_TYPES?.PRODUCT_CONDITION
          : isProductSummary
          ? SCREEN_TYPES?.UPLOAD_IMAGE
          : null
      );
      setProgress(progress - 100 / 8);
    }
    
  }


  const handleChange = (item) => {
    
    setInputValues({
      ...inputValues,
      [CREDENTIAL_KEYS.PRODUCT_APLICATION]: item,
    })

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
      <HeaderBackground />
      <View style={styles.header}>
        <View style={{flexDirection: 'row', width: deviceWidth}}>
          <View style={{marginLeft: 10}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={backPage}
              style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="keyboard-backspace"
                color={Colors.white}
                size={25}
              />
            </TouchableOpacity>
          </View>

          <View style={{marginLeft: 15}}>
            <Text style={styles.headerTitulo}>Añadir Producto</Text>
          </View>
        </View>
      </View>
      <View
        style={{
            width: `${progress}%`,
            height: 5,
            backgroundColor: Colors.brightBlue,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            }}
        />
      <View style={{ ...CommonStyles.flexDirectionRow, ...CommonStyles.horizontalCenter,alignItems:'center' }}>
          
          <View style={{ width: '100%',alignItems:'center' }}>
            <Text style={commonTextStyle}>{HEADER_TITLE[currentScreen]}</Text>
          </View>

      </View>
        
      {/* cambio scroll */}

       <View style={{flex:1}} >

        <View style={styles.InputWrapper}>
          {isProductNameScreen || isDescriptionScreen || isPriceScreen  ? (
            <InputFieldComponent
              width={'95%'}
              
              keyboardType={KEYBOARD_TYPES.DEFAULT}
              onChangeText={inputText => {
                onChangeText(inputText, textinputKeys);
              }}

              secureTextEntry={false}
              value={textinputVal}
              returnType="next"
              color={Colors.dark}
            />
          ) : null}

          {
            isChooseAplication && (
              <FlatList
                data={aplication}
                keyExtractor={item => item?._id}
                renderItem={ ({item}) => ( 
                  <RenderItemAplication 
                  handleChange={ handleChange}
                  credential={CREDENTIAL_KEYS?.PRODUCT_APLICATION}
                  item={item} 
                  selected={inputValues[CREDENTIAL_KEYS?.PRODUCT_APLICATION]?._id} 
                  /> 
                ) }
                ListEmptyComponent={() => (
                  <ListEmpty 
                  msg={'No hay vehiculos compatibles con tu producto, contacte al administrador'} 
                  />
                )}
                style={{flex:1}}
                
              />
            )
            
          }

          {isChooseModel ||
          isChooseMaker ||
          isChooseCategory ||
          isSubCategory ||
          isBrandScreen ||
          isDeliveryScreen ? (
            <View style={{flex: 1}}>
              {isChooseModel ? (
                <Text
                  style={{
                    fontSize: 18,
                    ...CommonStyles.fontFamily,
                    padding: 10,
                  }}>
                  Marca :{' '}
                  {inputValues[CREDENTIAL_KEYS?.PRODUCT_MAKER]?.name}
                </Text>
              ) : null}
              {isBrandScreen ? (
                <TouchableOpacity
                  onPress={() => addbrandModelRef?.current?.open()}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: Colors.primarySolid,
                    backgroundColor: Colors.primarySolid,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    borderRadius: 1,
                    marginRight: 10,
                    margin: 5,
                  }}>
                  <Text style={{...CommonStyles.fontFamily, color: 'white'}}>
                  Agregar
                  </Text>
                </TouchableOpacity>
              ) : null}
              <FlatList
                data={
                  isChooseMaker
                    ? makers
                    : isChooseModel
                    ? models
                    : isChooseCategory
                    ? categories
                    : isSubCategory
                    ? subcategories
                    : isBrandScreen
                    ? brands
                    : isDeliveryScreen
                    ? optionDelivery
                    : []
                }
                keyExtractor={item => item?._id}
                renderItem={itemData => (
                  <ListCard
                    selected={
                      isDeliveryScreen 
                      ? inputValues[CREDENTIAL_KEYS?.ESTIMATED_DELIVERY]?._id ==
                      itemData.item._id
                      : isChooseMaker
                        ? inputValues[CREDENTIAL_KEYS?.PRODUCT_MAKER]?._id ==
                          itemData.item._id
                        : isChooseModel
                        ? inputValues[CREDENTIAL_KEYS?.PRODUCT_MODEL]?._id ==
                          itemData.item?._id
                        : isChooseCategory
                        ? inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY] ==
                          itemData?.item?._id
                        : isSubCategory
                        ? selectedSubCategory?._id == itemData?.item?._id
                        : isChooseAplication
                        ? itemData.item.al
                        : isBrandScreen
                        ? selectedBrand?._id == itemData?.item?._id
                        : false
                    }
                    onPress={() => {
                      if (isDeliveryScreen)
                        setInputValues({
                          ...inputValues,
                          [CREDENTIAL_KEYS.ESTIMATED_DELIVERY]: itemData.item,
                        });
                      if (isChooseMaker)
                        setInputValues({
                          ...inputValues,
                          [CREDENTIAL_KEYS.PRODUCT_MAKER]: itemData.item,
                        });
                      if (isChooseModel)
                        setInputValues({
                          ...inputValues,
                          [CREDENTIAL_KEYS.PRODUCT_MODEL]: itemData.item,
                        });
                      if (isChooseCategory) {
                        setInputValues({
                          ...inputValues,
                          [CREDENTIAL_KEYS.PRODUCT_CATEGORY]:
                            itemData.item?._id,
                        });
                        setSelectedcategory(itemData.item);
                        getSubCategories();
                      }
                      if (isSubCategory) {
                        setSelectedSubCategory(itemData.item);
                      }
                      if (isChooseAplication) {
                        
                      }
                      if (isBrandScreen) {
                        setselectedBrand(itemData?.item);
                        setInputValues({
                          ...inputValues,
                          [CREDENTIAL_KEYS.PRODUCT_BRAND]:
                            itemData.item,
                        });
                      }
                    }}
                    name={itemData.item.name}
                  />
                )}
              />
            </View>
          ) : null}

          {isProductCondition ? (
            <View>
              <ListCard
                selected={
                  inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] == 'New'
                }
                onPress={() => {
                  onChangeText('New', CREDENTIAL_KEYS.PRODUCT_CONDITION);
                }}
                name="Nuevo"
              />
              <ListCard
                selected={
                  inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] == 'Used'
                }
                onPress={() => {
                  onChangeText('Used', CREDENTIAL_KEYS.PRODUCT_CONDITION);
                }}
                name="Usado"
              />
              <ListCard
                selected={
                  inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION] ==
                  'Reconditioned'
                }
                onPress={() => {
                  onChangeText(
                    'Reconditioned',
                    CREDENTIAL_KEYS.PRODUCT_CONDITION,
                  );
                }}
                name="Reacondicionado"
              />
            </View>
          ) : null}



          {isUploadImage ? (
            <View style={styles.uploadImgContainer}>
              {isEditMode ?  (
                <Image
                  source={{uri: `${base_url}/${toBeEditedProduct?.productImg}`}}
                  style={{width: 100, height: 100, borderRadius: 100 / 2}}
                />
              ) : (
                <Entypo name="camera" color={Colors.primarySolid} size={100} />
              )}
              <Text style={styles.uploadImgContainerHeading}>
                {isEditMode
                  ? '¿Quieres editar la imagen del producto?'
                  : 'Sube la imagen del producto'}
              </Text>
              <Text style={styles.uploadImgContainerDescription}>
              La imagen debe ser muy clara y debe representar el producto.
                 quieres vender, recuerda que una foto perfecta atrae
                 clientes.
              </Text>
              <View style={styles.buttonWrapper}>
                <ButtonComponent
                  buttonText={isEditMode ? 'Editar' : 'Subir'}
                  colorB={Colors.terciarySolid}
                  width={width / 3.3}
                  margin={1}
                  borderRadius={10}
                  handlePress={()=>pickProductImg1()}
                />
              </View>
              {isEditMode ? (
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
              ) : null}
            </View>
          ) : null}
        </View>
        {isProductSummary ? (
          <ScrollView contentContainerStyle={styles.scrollViewContainer} >

        
          <View style={styles.InputWrapper} >
            <ProductSummaryCard
              onPress={pickProductImg1}
              value={inputValues[CREDENTIAL_KEYS.PRODUCT_IMAGE]}
              label="Imagen"
              isImageTab={true}
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_NAME)}
              value={inputValues[CREDENTIAL_KEYS.NAME]}
              label="Título"
            />
            <ProductSummaryCard
              onPress={() =>
                setCurrentScreen(SCREEN_TYPES?.PRODUCT_DESCRIPTION)
              }
              value={inputValues[CREDENTIAL_KEYS.DESCRIPTION]}
              label="Descripción"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_PRICE)}
              value={`MXN ${inputValues[CREDENTIAL_KEYS.PRICE]}`}
              label="Precio"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.ESTIMATED_DELIVERY)}
              value={`${inputValues[CREDENTIAL_KEYS.ESTIMATED_DELIVERY].name}`}
              label="Tiempo de entrega"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_CATEGORY)}
              value={`${selectedCategory?.name}`}
              label="Categoría"
            />
            <ProductSummaryCard
              onPress={() =>
                setCurrentScreen(SCREEN_TYPES?.CHOOSE_SUB_CATEGORY)
              }
              value={`${selectedSubCategory?.name}`}
              label="Subcategoría"
            />

            
            {
              inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.de && (
                <ProductSummaryCard
                  onPress={() =>
                    setCurrentScreen(SCREEN_TYPES?.CHOOSE_APLICATION)
                  }
                  value={`del: ${inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.de} al: ${inputValues[CREDENTIAL_KEYS.PRODUCT_APLICATION]?.al}`}
                  label="Año"
                />
              )
              
            }
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MAKER)}
              value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]?.name}`}
              label="Fabricante"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL)}
              value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?.name}`}
              label="Modelo"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_BRAND)}
              value={`${selectedBrand?.name}`}
              label="Marca del Producto"
            />
            <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.PRODUCT_CONDITION)}
              value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_CONDITION]}`}
              label="Condición"
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '300',
                width: '100%',
                padding: 10,
                alignSelf: 'center',
              }}>
              Asegúrese de estar de acuerdo con los{' '}
              <Text style={{fontWeight: 'bold', color: Colors.brightBlue}}>
                términos y políticas
              </Text>{' '}
              de{' '}
              <Text style={{fontWeight: 'bold', color: Colors.primaryColor}}>
                Besseri{' '}
              </Text>
              antes de crear el producto, ir en contra de las políticas podría resultar
               su cuenta suspendida.
            </Text>
          </View>
         
    <View style={{flex:1,width:deviceWidth,height:top + 5}} />

          </ScrollView>

        ) : null}

        {isUploadImage ? null : (
          <View style={styles.buttonWrapper}>
            <ButtonComponent
              buttonText={'Continuar'}
              colorB={Colors.terciarySolid}
              width={width}
              margin={5}
              borderRadius={0}
              handlePress={async () => {
                if (isSummaryMode && isProductSummary) {
                  if (isEditMode) {
                    await editProduct();
                  }
                  if (!isEditMode) {
                    await createProduct();
                  }
                }
                if (isSummaryMode) {
                  if (isChooseMaker) {
                    getModels();
                    setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL);
                  } else {
                    setCurrentScreen(SCREEN_TYPES?.PRODUCT_SUMMARY);
                  }
                } else {
                  if (currentScreen == SCREEN_TYPES?.CHOOSE_MAKER) {
                    getModels();
                  }
                  if (currentScreen == SCREEN_TYPES?.CHOOSE_SUB_CATEGORY) {
                    getSubCategories();
                  }
                  nextPage()
                }
              }}
            />
          </View>
        )}

      </View>

      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    width: deviceWidth,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,
    paddingHorizontal: deviceWidth * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    color: Colors.white,
    fontSize: adjust(16),
  },
  headerIcon: {

  },
  InputWrapper: {
    flex: 1,
    ...CommonStyles.horizontalCenter,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: 5,
    
  },
  buttonWrapper: {
    ...CommonStyles.flexDirectionRow,
    width: width,
    ...CommonStyles.flexCenter,
  },
  searchBarWrapper: {
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
    ...CommonStyles.flexCenter,
  },
  flatListCardBtn: {
    padding: 10,
    borderBottomWidth: 0.5,
    width: width,
    ...CommonStyles.flexCenter,
  },
  flatListCardBtnText: {fontSize: 19, fontWeight: '300'},
  uploadImgContainer: {
    ...CommonStyles.flexOneCenter,
    width: '90%',
    alignSelf: 'center',
   
    
  },
  uploadImgContainerHeading: {
    ...CommonStyles.fontFamily,
    textAlign: 'center',
    fontSize: 18,
  },
  uploadImgContainerDescription: {textAlign: 'center', fontSize: 14},
});
export default VendorAddProductScreen;
