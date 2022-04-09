import React, { useEffect, useState } from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity, View, ScrollView, BackHandler, FlatList,Image, ToastAndroid } from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator, MenuItem, Heading } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBusinessId, getBusinessProfile } from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import { BOTTOM_TAB_VENDOR_ROUTES, SHARED_ROUTES, showToaster, VENDOR_DETAILS_ROUTES } from '../../util/constants';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto'
import ButtonComponent from '../../components/button/button.component';
import axios from 'axios';
import { api_statuses, vendor_api_urls } from '../../util/api/api_essentials';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
const { width, height } = Dimensions.get('screen');

const CREDENTIAL_KEYS = {
  NAME: 'Service name',
  STOCK: 'Product stock',
  DESCRIPTION: 'Description',
  FROM_YEAR: 'From year',
  TO_YEAR: 'To year',
  PRICE: 'Price',
  SERVICE_COVER: 'Product Image',
  PRODUCT_MODEL: 'Product Model',
  PRODUCT_CONDITION: 'Product Conditon',
  PRODUCT_MAKER: 'Product Maker',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_MAKERS_IDS:'MAKER IDS'
};
const SCREEN_TYPES = {
  SERVICE_NAME: 'Service Name',
  CHOOSE_MAKER: 'Choose Maker',
  UPLOAD_IMAGE: 'Upload Product Image',
  SERVICE_DESCRIPTION: 'Product Description',
  SERVICE_PRICE: 'Service price',
  CHOOSE_CATEGORY: 'Choose Category',
  CHOOSE_MODEL: 'Choose Model',
  PRODUCT_CONDITION: 'Product condition',
  SERVICE_SUMMARY: 'Product Summary',

}
const HEADER_TITLE = {
  [SCREEN_TYPES?.SERVICE_NAME]: 'Indicate your service, write the name of the service you want to sell',
  [SCREEN_TYPES?.SERVICE_DESCRIPTION]: 'Describe your service, write the description of your service.',
  [SCREEN_TYPES?.SERVICE_PRICE]: 'What is the price of the service which you want to sell?',
  [SCREEN_TYPES?.CHOOSE_MAKER]: 'Which brand this service is for? i-e Wolksvagen, BMW? /n You can select multi',
  [SCREEN_TYPES?.CHOOSE_MODEL]: 'What is the model of the product you want to sell?',
  [SCREEN_TYPES?.CHOOSE_CATEGORY]: 'What is the category of the product which you want to sell?',
  [SCREEN_TYPES?.PRODUCT_CONDITION]: 'What is the condition of the product?',
  [SCREEN_TYPES?.UPLOAD_IMAGE]: 'Upload the image, which shows the product you want to sell',
  [SCREEN_TYPES?.SERVICE_SUMMARY]: 'Service Summary',
  
}
const VendorAddServiceScreen = ({ navigation }) => {

  const [inputValues, setInputValues] = useState({
    [CREDENTIAL_KEYS.NAME]: '',
    [CREDENTIAL_KEYS.DESCRIPTION]: '',
    [CREDENTIAL_KEYS.FROM_YEAR]: '',
    [CREDENTIAL_KEYS.TO_YEAR]: '',
    [CREDENTIAL_KEYS.PRICE]: '',
    [CREDENTIAL_KEYS.SERVICE_COVER]: '',
    [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: null,
    [CREDENTIAL_KEYS.PRODUCT_CONDITION]: '',
    [CREDENTIAL_KEYS.PRODUCT_MAKER]: [],
    [CREDENTIAL_KEYS.PRODUCT_MAKERS_IDS]:[]
  });
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSummaryMode,setisSummaryMode] = useState(false);
  const [models, setModels] = useState([]);
  const [makers, setMakers] = useState([]);
  const [selectedMakers,setSelectedMakers] = useState([]);
  const [selectedMakersIds,setSelectedMakersIds] = useState([]);
  const [categories,setCategories] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.SERVICE_NAME);
  const isServiceNameScreen = currentScreen == SCREEN_TYPES?.SERVICE_NAME;
  const isDescriptionScreen = currentScreen == SCREEN_TYPES?.SERVICE_DESCRIPTION;
  const isPriceScreen = currentScreen == SCREEN_TYPES?.SERVICE_PRICE;
  const isChooseMaker = currentScreen == SCREEN_TYPES?.CHOOSE_MAKER;
  const isChooseModel = currentScreen == SCREEN_TYPES?.CHOOSE_MODEL;
  const isChooseCategory = currentScreen == SCREEN_TYPES?.CHOOSE_CATEGORY;
  const isProductCondition = currentScreen == SCREEN_TYPES?.PRODUCT_CONDITION;
  const isUploadImage = currentScreen == SCREEN_TYPES?.UPLOAD_IMAGE;
  const isProductSummary = currentScreen == SCREEN_TYPES?.SERVICE_SUMMARY;
  const textinputVal = isServiceNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : '';
  const textinputKeys = isServiceNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS.PRICE : '';

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

  // GETTING MODELS FOR CREATING PRODUCTS
  // const getModels = async () => {
  //   try {
  //     setShowLoader(true);
  //     const apiCall = await axios.get(vendor_api_urls.get_models);
  //     setShowLoader(false);
  //     if (apiCall?.status == api_statuses?.success) {
  //       setModels(apiCall.data.data);
  //     }
  //   } catch (e) {
  //     setShowLoader(false);
  //     alert('something went wrong');
  //   }
  // }

  // useEffect(() => {
  //   getModels();
  // }, []);

  //GETTING CATEGORIES FOR CREATING PRODUCTS
  const getCategories = async () => {
    try {
      setShowLoader(true);
      const apiCall = await axios.get(vendor_api_urls.get_categories);
      setShowLoader(false);
      if (apiCall?.status == api_statuses?.success) {
        setCategories(apiCall.data.data);
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e)
      alert('something went wrong - 1');
    }
  }
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
      alert('something went wrong - 2');
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
  //     if(isChooseMaker) setCurrentScreen(SCREEN_TYPES?.SERVICE_PRICE);
  //     if(isPriceScreen) setCurrentScreen(SCREEN_TYPES?.SERVICE_DESCRIPTION);
  //     if(isDescriptionScreen) setCurrentScreen(SCREEN_TYPES?.SERVICE_NAME);
  //     // if(isServiceNameScreen) navigation.goBack()
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
  const ProductSummaryCard = ({ label, value, onPress,isImageTab,multiText }) => {
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
             <View>
                {
                    multiText ? 
                    <FlatList
                    horizontal
                    data={value}
                    keyExtractor={item => item?._id}
                    renderItem={(itemData) => (
                        <Text>{itemData.item.name}{itemData.index == value.length ? '' : ' ,'} </Text>
                    )}
                    />
                    :
                    <Text>{value}</Text>
                }
                 </View>
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

  const pickServiceImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image)
      onChangeText(image, CREDENTIAL_KEYS.SERVICE_COVER);
      setCurrentScreen(SCREEN_TYPES?.SERVICE_SUMMARY);
      setisSummaryMode(true);
      setUri(image.path);
      props.onChange?.(image);
    });
  };

  const createService = async() => {
    try {
      setShowLoader(true);
      const businessId = await getBusinessId();
      const imageFormData = new FormData();
      imageFormData.append('serviceImage',{
        uri:inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.path,
        type:inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.mime,
        name:'photo.jpg'
      });
      console.log(inputValues)
      const serviceUploadImg = await axios.post(vendor_api_urls.upload_service_image,imageFormData);
      console.log('apicalled')
      if(serviceUploadImg.status == api_statuses.success) {
        const apiBody = {
          name:inputValues[CREDENTIAL_KEYS.NAME],
          business_id:businessId,
          description:inputValues[CREDENTIAL_KEYS.DESCRIPTION],
          makersIds:selectedMakersIds,
          isBlocked:false,
          coverImg:serviceUploadImg.data.data,
          categoryId:inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?._id,
          category:inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY],
          price:inputValues[CREDENTIAL_KEYS.PRICE],
        }
        console.log(apiBody);
        const apiCall = await axios.post(vendor_api_urls?.create_service,apiBody);
        setShowLoader(false);
        if(apiCall.status == api_statuses.success) {
          showToaster('Your service has been created successfully');
          navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.SERVICES)
        }
      }
       else {
         showToaster('Something went wrong - 3, please try again');
         setShowLoader(false);
       }
     
    } catch(e) {
      console.log(e?.response)
      setShowLoader(false);
       showToaster('Something went wrong - 4, please try again, -2')
    }
  }

  return (
    <View style={styles.container}>
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
        {
          isChooseCategory || isChooseMaker?
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
                  onChangeText(inputText, isServiceNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : '');
                }}
                placeholderText={isServiceNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
                secureTextEntry={false}
                value={isServiceNameScreen ? inputValues[CREDENTIAL_KEYS.NAME] : isDescriptionScreen ? inputValues[CREDENTIAL_KEYS.DESCRIPTION] : isPriceScreen ? inputValues[CREDENTIAL_KEYS.PRICE] : ''}
                returnType="next"
                color={Colors.dark}
              />
            </View>
            :
            null
        }
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
            isServiceNameScreen || isDescriptionScreen || isPriceScreen ?
              <InputFieldComponent
                width={'95%'}
                icon={
                  isServiceNameScreen ?
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
                placeholderText={isServiceNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
                secureTextEntry={false}
                value={textinputVal}
                returnType="next"
                color={Colors.dark}
              />
              :
              null
          }

          {
            isChooseMaker || isChooseCategory ?
              <FlatList
                data={isChooseMaker ? makers : isChooseCategory ? categories : []}
                keyExtractor={item => item?._id}
                renderItem={itemData => (
                  <ListCard
                  selected={isChooseMaker ? selectedMakersIds.includes(itemData.item?._id) : isChooseModel ? inputValues[CREDENTIAL_KEYS?.PRODUCT_MODEL]?._id == itemData.item?._id : isChooseCategory ? inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?._id == itemData?.item?._id : false}
                  onPress={() => {
                    if (isChooseMaker) {
                        if(selectedMakersIds.includes(itemData.item._id)) {
                            const removedIdMakers = selectedMakersIds.filter(item => item != itemData.item?._id);
                            const removedMakers =selectedMakers.filter(mkr => mkr?._id != itemData.item._id);
                            setSelectedMakersIds(removedIdMakers)
                            setSelectedMakers(removedMakers);
                        } else {
                            setSelectedMakers([...selectedMakers,itemData.item]);
                            setSelectedMakersIds([...selectedMakersIds,itemData.item._id]);
                        }
                        
                        // setInputValues({...inputValues,[CREDENTIAL_KEYS.PRODUCT_MAKERS_IDS]:[...inputValues[CREDENTIAL_KEYS.PRODUCT_MAKERS_IDS],itemData.item._id]});
                        // setInputValues({...inputValues,[CREDENTIAL_KEYS.PRODUCT_MAKER]:[...inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER],itemData.item]});
                    }
                    if (isChooseCategory) setInputValues({ ...inputValues, [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: itemData.item });
                  }} name={itemData.item.name} />
                )}
              />
              :
              null
          }

        

          {
            isUploadImage ?
              <View style={styles.uploadImgContainer}>
                <Entypo name='camera' color={Colors.primaryColor} size={100} />
                <Text style={styles.uploadImgContainerHeading}>Upload the image of service</Text>
                <Text style={styles.uploadImgContainerDescription}>The image should be very clear and should represent the service you want to sell, remember that a perfect picture attracts customers.</Text>
                <View style={styles.buttonWrapper}>
                  <ButtonComponent
                    buttonText={'Upload'}
                    colorB={Colors.brightBlue}
                    width={width / 2}
                    margin={15}
                    borderRadius={10}
                    handlePress={pickServiceImage}
                  />
                </View>
              </View>
              :
              null
          }
        </View>
        {
          isProductSummary ?
            <View style={CommonStyles.flexOne}>
              <ProductSummaryCard
                onPress={pickServiceImage}
                value={inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.path}
                label='Image'
                isImageTab={true}
              />
              <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.SERVICE_NAME)}
                value={inputValues[CREDENTIAL_KEYS.NAME]}
                label='Title'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.SERVICE_DESCRIPTION)}
                value={inputValues[CREDENTIAL_KEYS.DESCRIPTION]}
                label='Description'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.SERVICE_PRICE)}
                value={`MXN ${inputValues[CREDENTIAL_KEYS.PRICE]}`}
                label='Price'
              />
              <ProductSummaryCard
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_CATEGORY)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?.name}`}
                label='Category'
              />
              <ProductSummaryCard
              multiText={true}
              onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MAKER)}
                value={selectedMakers}
                label='Makers'
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
                    await createService();
                  }
                  if(isSummaryMode) {
                    setCurrentScreen(SCREEN_TYPES?.SERVICE_SUMMARY);
                  } else {
                    setCurrentScreen(isServiceNameScreen ? SCREEN_TYPES?.SERVICE_DESCRIPTION : isDescriptionScreen ? SCREEN_TYPES?.SERVICE_PRICE : isPriceScreen ? SCREEN_TYPES?.CHOOSE_MAKER : isChooseMaker ? SCREEN_TYPES?.CHOOSE_CATEGORY : isChooseCategory ? SCREEN_TYPES?.UPLOAD_IMAGE : null);
                    setProgress(progress + (100 / 5))
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
export default VendorAddServiceScreen;
