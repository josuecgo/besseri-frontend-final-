import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  FlatList,
  Image,
  ToastAndroid,
} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import {
  ThinlineSeparator,
  MenuItem,
  Heading,
} from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getBusinessId,
  getBusinessProfile,
} from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component';
import {
  BOTTOM_TAB_VENDOR_ROUTES,
  SHARED_ROUTES,
  showToaster,
  VENDOR_DETAILS_ROUTES,
} from '../../util/constants';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ButtonComponent from '../../components/button/button.component';
import axios from 'axios';
import {api_statuses, vendor_api_urls} from '../../util/api/api_essentials';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {adjust, deviceHeight, deviceWidth} from '../../util/Dimentions';
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import {ListAddService} from '../../components/Vendor/ListAddService';
import { moneda } from '../../util/Moneda';
import { screenFocus, stringIsEmpty } from '../../util/helpers/StatusText';
const {width, height} = Dimensions.get('screen');

export const CREDENTIAL_KEYS = {
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
  PRODUCT_MAKERS_IDS: 'MAKER IDS',
};
export const SCREEN_TYPES = {
  SERVICE_NAME: 'Nombre del Servicio',
  CHOOSE_MAKER: 'Elija el fabricante',
  UPLOAD_IMAGE: 'Subir imagen del producto',
  SERVICE_DESCRIPTION: 'Descripción del producto',
  SERVICE_PRICE: 'Precio del servicio',
  CHOOSE_CATEGORY: 'Elegir la categoría',
  CHOOSE_MODEL: 'Elige modelo',
  PRODUCT_CONDITION: 'Condición del producto',
  SERVICE_SUMMARY: 'Resumen del producto',
};
const HEADER_TITLE = {
  [SCREEN_TYPES?.SERVICE_NAME]: 'Escriba el nombre del servicio ',
  [SCREEN_TYPES?.SERVICE_DESCRIPTION]: 'Describa su servicio.',
  [SCREEN_TYPES?.SERVICE_PRICE]: '¿Cuál es el precio del servicio?',
  [SCREEN_TYPES?.CHOOSE_MAKER]: '¿Para qué marca es este servicio?',
  [SCREEN_TYPES?.CHOOSE_MODEL]: '¿Cuál es el modelo del producto?',
  [SCREEN_TYPES?.CHOOSE_CATEGORY]: '¿Cuál es la categoría del producto?',
  [SCREEN_TYPES?.PRODUCT_CONDITION]: '¿Cuál es el estado del producto?',
  [SCREEN_TYPES?.UPLOAD_IMAGE]: 'Sube una imagen del servicio',
  [SCREEN_TYPES?.SERVICE_SUMMARY]: 'Resumen del servicio',
};


const VendorAddServiceScreen = ({navigation}) => {
    const [inputValues, setInputValues] = useState({
        [CREDENTIAL_KEYS.NAME]: '',
        [CREDENTIAL_KEYS.DESCRIPTION]: '',
        [CREDENTIAL_KEYS.FROM_YEAR]: '',
        [CREDENTIAL_KEYS.TO_YEAR]: '',
        [CREDENTIAL_KEYS.PRICE]: '',
        [CREDENTIAL_KEYS.SERVICE_COVER]: '',
        [CREDENTIAL_KEYS.PRODUCT_CATEGORY]: null,
        [CREDENTIAL_KEYS.PRODUCT_CONDITION]: '',
        [CREDENTIAL_KEYS.PRODUCT_MAKER]: '',
        [CREDENTIAL_KEYS.PRODUCT_MAKERS_IDS]: '',
        [CREDENTIAL_KEYS.PRODUCT_MODEL]: '',
    });
    const [showLoader, setShowLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSummaryMode, setisSummaryMode] = useState(false);
    const [models, setModels] = useState([]);
    const [makers, setMakers] = useState([]);
    const [selectedMakers, setSelectedMakers] = useState([]);
    const [selectedMakersIds, setSelectedMakersIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.SERVICE_NAME);
    const isServiceNameScreen = currentScreen == SCREEN_TYPES?.SERVICE_NAME;
    const isDescriptionScreen = currentScreen == SCREEN_TYPES?.SERVICE_DESCRIPTION;
    const isPriceScreen = currentScreen == SCREEN_TYPES?.SERVICE_PRICE;
    const isChooseMaker = currentScreen == SCREEN_TYPES?.CHOOSE_MAKER;
    const isChooseModel = currentScreen == SCREEN_TYPES?.CHOOSE_MODEL;
    const isBrandScreen = currentScreen == SCREEN_TYPES?.PRODUCT_BRAND;
    const isChooseCategory = currentScreen == SCREEN_TYPES?.CHOOSE_CATEGORY;
    const isProductCondition = currentScreen == SCREEN_TYPES?.PRODUCT_CONDITION;
    const isUploadImage = currentScreen == SCREEN_TYPES?.UPLOAD_IMAGE;
    const isProductSummary = currentScreen == SCREEN_TYPES?.SERVICE_SUMMARY;
    const [uri, setUri] = useState('')
    const textinputVal = isServiceNameScreen
        ? inputValues[CREDENTIAL_KEYS.NAME]
        : isDescriptionScreen
        ? inputValues[CREDENTIAL_KEYS.DESCRIPTION]
        : isPriceScreen
        ? inputValues[CREDENTIAL_KEYS.PRICE]
        : '';
    const textinputKeys = isServiceNameScreen
        ? CREDENTIAL_KEYS.NAME
        : isDescriptionScreen
        ? CREDENTIAL_KEYS.DESCRIPTION
        : isPriceScreen
        ? CREDENTIAL_KEYS.PRICE
        : '';

    const onChangeText = (inputText, key) => {
        setInputValues({...inputValues, [key]: inputText});
    };

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
        console.log(e);
        alert('something went wrong - 1');
        }
    };
    useEffect(() => {
        getCategories();
    }, []);

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
        console.log(e.response.data);
        alert('something went wrong - 2');
        }
    };

    useEffect(() => {
        getMakers();
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

    const commonTextStyle = {
        fontSize: 17,
        color: Colors.black,
        ...CommonStyles.fontFamily,
        paddingLeft: 5,
    };

    const ProductSummaryCard = ({
        label,
        value,
        onPress,
        isImageTab,
        multiText,
    }) => {
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
            {isImageTab ? (
                <View>
                <Image source={{uri: value}} style={{width: 150, height: 150}} />
                </View>
            ) : (
                <View>
                {multiText ? (
                    <FlatList
                    horizontal
                    data={value}
                    keyExtractor={item => item?._id}
                    renderItem={itemData => (
                        <Text>
                        {itemData.item.name}
                        {itemData.index == value.length ? '' : ' ,'}{' '}
                        </Text>
                    )}
                    />
                ) : (
                    <Text>{value}</Text>
                )}
                </View>
            )}
            </View>
            <Ionicons
            name={'chevron-forward'}
            color={Colors.terciarySolid}
            size={30}
            />
        </TouchableOpacity>
        );
    };
    // Creating In Screen component ends here

    const pickServiceImage = () => {
        ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        }).then(image => {
        
        onChangeText(image, CREDENTIAL_KEYS.SERVICE_COVER);
        setCurrentScreen(SCREEN_TYPES?.SERVICE_SUMMARY);
        setisSummaryMode(true);
        setUri(image.path);
        //   props.onChange?.(image);
        });
    };

    const createService = async () => {
    // const apiBody = {
    //   name: inputValues[CREDENTIAL_KEYS.NAME],
    //   // business_id: businessId,
    //   description: inputValues[CREDENTIAL_KEYS.DESCRIPTION],
    //   makersIds: inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]._id,
    //   modelId:inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]._id,
    //   isBlocked: false,
    //   // coverImg: serviceUploadImg.data.data,
    //   categoryId: inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?._id,
    //   category: inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY],
    //   price: inputValues[CREDENTIAL_KEYS.PRICE],
    // };
   
        try {
            setShowLoader(true);
            const businessId = await getBusinessId();
            const imageFormData = new FormData();
            imageFormData.append('serviceImage', {
                uri: inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.path,
                type: inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.mime,
                name: 'photo.jpg'
            });

            const serviceUploadImg = await axios.post(vendor_api_urls.upload_service_image, imageFormData);

            if (serviceUploadImg.status == api_statuses.success) {
                const apiBody = {
                    name: inputValues[CREDENTIAL_KEYS.NAME],
                    business_id: businessId,
                    description: inputValues[CREDENTIAL_KEYS.DESCRIPTION],
                    makerId: inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER]._id,
                    modelId:inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]._id,
                    isBlocked: false,
                    coverImg: serviceUploadImg.data.data,
                    categoryId: inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?._id,
                    category: inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY],
                    price: inputValues[CREDENTIAL_KEYS.PRICE],
                }

                const apiCall = await axios.post(vendor_api_urls?.create_service, apiBody);
                setShowLoader(false);

                if (apiCall.status == api_statuses.success) {
                    showToaster('Su servicio ha sido creado con éxito');
                    navigation.navigate(BOTTOM_TAB_VENDOR_ROUTES.SERVICES)
                }
            }
            else {
                showToaster('Algo salió mal - , inténtalo de nuevo');
                setShowLoader(false);
            }

        } catch (e) {
            setShowLoader(false);
            showToaster('Algo salió mal - , inténtalo de nuevo')
        }
    };
    
    const [pantallaSelect, setpantallaSelect] = useState('')
    useEffect(() => {
        setpantallaSelect(screenFocus(currentScreen))
    }, [currentScreen])
    
   
    const nextPage = () => {
       
        if (stringIsEmpty(inputValues[pantallaSelect]) ){
            setCurrentScreen(
                isServiceNameScreen
                  ? SCREEN_TYPES?.SERVICE_DESCRIPTION
                  : isDescriptionScreen
                  ? SCREEN_TYPES?.SERVICE_PRICE
                  : isPriceScreen
                  ? SCREEN_TYPES?.CHOOSE_MAKER
                  : isChooseMaker
                  ? SCREEN_TYPES?.CHOOSE_MODEL
                  : isChooseModel
                  ? SCREEN_TYPES?.CHOOSE_CATEGORY
                  : isChooseCategory
                  ? SCREEN_TYPES?.UPLOAD_IMAGE
                  : null,
              );
  
          
              setProgress(progress + 100 / 5);
        }else{
            showToaster('Rellena el campo')
        }
  
    }
   
  
    return (
    <View style={styles.container}>
        <Loader isVisible={showLoader} />
        <HeaderBackground />
        <View style={styles.header}>
            <View
            style={{
                ...CommonStyles.flexDirectionRow,
                ...CommonStyles.horizontalCenter,
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.pop()}
                style={styles.headerIcon}>
                <MaterialCommunityIcons
                name="keyboard-backspace"
                color="white"
                size={25}
                />
            </TouchableOpacity>
            <View style={{width: '95%', paddingLeft: 10}}>
                <Text style={{fontSize: adjust(15), color: Colors.white}}>
                Añadir Servicio
                </Text>
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

        {isChooseModel || isChooseCategory || isChooseMaker ? (
        <View style={styles.searchBarWrapper}>
          <InputFieldComponent
            width={'90%'}
            height={40}
            marginTop={20}
            borderRadius={10}
            icon={
              <MaterialIcons name="search" size={25} color={Colors.darker} />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={inputText => {
              onChangeText(
                inputText,
                isServiceNameScreen
                  ? inputValues[CREDENTIAL_KEYS.NAME]
                  : isDescriptionScreen
                  ? inputValues[CREDENTIAL_KEYS.DESCRIPTION]
                  : isPriceScreen
                  ? inputValues[CREDENTIAL_KEYS.PRICE]
                  : '',
              );
            }}
            // placeholderText={isServiceNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
            secureTextEntry={false}
            value={
              isServiceNameScreen
                ? inputValues[CREDENTIAL_KEYS.NAME]
                : isDescriptionScreen
                ? inputValues[CREDENTIAL_KEYS.DESCRIPTION]
                : isPriceScreen
                ? inputValues[CREDENTIAL_KEYS.PRICE]
                : ''
            }
            returnType="next"
            color={Colors.dark}
            />
        </View>
        ) : null}

        <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={commonTextStyle}>{HEADER_TITLE[currentScreen]}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.InputWrapper}>
            {isServiceNameScreen || isDescriptionScreen || isPriceScreen ? (
                <InputFieldComponent
                width={'89%'}
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                    onChangeText(inputText, textinputKeys);
                }}
                // placeholderText={isServiceNameScreen ? CREDENTIAL_KEYS.NAME : isDescriptionScreen ? CREDENTIAL_KEYS?.DESCRIPTION : isPriceScreen ? CREDENTIAL_KEYS?.PRICE : ''}
                secureTextEntry={false}
                value={textinputVal}
                returnType="next"
                color={Colors.dark}
                />
            ) : null}

            {isChooseModel ||
            isChooseMaker ||
            isChooseCategory ||
            isBrandScreen ? (
                <View style={{flex: 1}}>
                {isChooseModel ? (
                    <Text
                    style={{
                        fontSize: 18,
                        ...CommonStyles.fontFamily,
                        padding: 10,
                    }}>
                    Marca : {inputValues[CREDENTIAL_KEYS?.PRODUCT_MAKER]?.name}
                    </Text>
                ) : null}

                <ListAddService
                    data={
                    isChooseMaker
                        ? makers
                        : isChooseModel
                        ? models
                        : isChooseCategory
                        ? categories
                        : []
                    }
                    selectedMakersIds={selectedMakersIds}
                    setSelectedMakersIds={setSelectedMakersIds}
                    selectedMakers={selectedMakers}
                    setSelectedMakers={setSelectedMakers}
                    credencial={
                    isChooseMaker
                        ? CREDENTIAL_KEYS?.PRODUCT_MAKER
                        : isChooseModel
                        ? CREDENTIAL_KEYS?.PRODUCT_MODEL
                        : isChooseCategory
                        ? CREDENTIAL_KEYS.PRODUCT_CATEGORY
                        : false
                    }
                    isChooseMaker={isChooseMaker}
                    isChooseModel={isChooseModel}
                    isChooseCategory={isChooseCategory}
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                />
                </View>
            ) : null}

            {isUploadImage ? (
                <View style={styles.uploadImgContainer}>
                <Entypo name="camera" color={Colors.primarySolid} size={100} />
                <Text style={styles.uploadImgContainerHeading}>
                    Sube la imagen del servicio
                </Text>
                <Text style={styles.uploadImgContainerDescription}>
                    La imagen debe ser muy clara y debe representar el servicio que
                    desea vender, recuerde que una imagen perfecta atrae clientes.
                </Text>
                <View style={styles.buttonWrapper}>
                    <ButtonComponent
                    buttonText={'Subir'}
                    colorB={Colors.terciarySolid}
                    width={width}
                    margin={15}
                    borderRadius={1}
                    handlePress={pickServiceImage}
                    />
                </View>
                </View>
            ) : null}
            </View>
            {isProductSummary ? (
            <View style={{flex: 1}}>
                <ProductSummaryCard
                onPress={pickServiceImage}
                value={inputValues[CREDENTIAL_KEYS.SERVICE_COVER]?.path}
                label="Imagen"
                isImageTab={true}
                />
                <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.SERVICE_NAME)}
                value={inputValues[CREDENTIAL_KEYS.NAME]}
                label="Título"
                />
                <ProductSummaryCard
                onPress={() =>
                    setCurrentScreen(SCREEN_TYPES?.SERVICE_DESCRIPTION)
                }
                value={inputValues[CREDENTIAL_KEYS.DESCRIPTION]}
                label="Descripción"
                />
                <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.SERVICE_PRICE)}
                value={ `$ ${inputValues[CREDENTIAL_KEYS.PRICE]}  MXN`}
                label="Precio"
                />
                <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_CATEGORY)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_CATEGORY]?.name}`}
                label="Categoría"
                />
                <ProductSummaryCard
                
                onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MAKER)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MAKER].name}`}
                label="Fabricante"
                />
                <ProductSummaryCard
                onPress={() => setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL)}
                value={`${inputValues[CREDENTIAL_KEYS.PRODUCT_MODEL]?.name}`}
                label="Modelo"
                />
                <Text
                style={{
                    fontSize: 13,
                    fontWeight: '300',
                    width: '100%',
                    padding: 10,
                    alignSelf: 'center',
                }}>
                Asegúrese de estar de acuerdo con el{' '}
                <Text style={{fontWeight: 'bold', color: Colors.brightBlue}}>
                    términos y políticas
                </Text>{' '}
                de{' '}
                <Text style={{fontWeight: 'bold', color: Colors.primaryColor}}>
                    Besseri{' '}
                </Text>
                antes de crear el producto, ir en contra de las políticas podría
                suspender su cuenta.
                </Text>
            </View>
            ) : null}

            {isUploadImage ? null : (
            <View style={styles.buttonWrapper}>
                <ButtonComponent
                buttonText={'Continuar'}
                colorB={Colors.terciarySolid}
                width={width}
                margin={5}
                borderRadius={1}
                handlePress={async () => {
                
                    if (isSummaryMode && isProductSummary) {
                        
                    await createService();
                    }
                    if (isSummaryMode) {
                        if (isChooseMaker) {
                            
                            getModels();
                            setCurrentScreen(SCREEN_TYPES?.CHOOSE_MODEL);

                        } else {
                            setCurrentScreen(SCREEN_TYPES?.SERVICE_SUMMARY);
                        }
                    } else {
                        if (currentScreen == SCREEN_TYPES?.CHOOSE_MAKER) {
                            getModels();
                        }
                        nextPage()
                    }
                }}
                />
            </View>
            )}
        </ScrollView>
      {/* Fin scroll */}
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
    minHeight: 65,
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,
    paddingVertical: 20,
    padding: 10,
    justifyContent: 'center',
  },
  headerIcon: {
    // paddingHorizontal: 10
  },
  InputWrapper: {
    flex: 1,
    ...CommonStyles.horizontalCenter,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: 15,
  },
  scrollViewContainerSummary: {
    flexGrow: 1,
    backgroundColor: 'red',
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
export default VendorAddServiceScreen;

