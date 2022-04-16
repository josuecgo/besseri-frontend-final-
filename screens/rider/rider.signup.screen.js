import React, {useRef, useState} from 'react';
import {
  useWindowDimensions,
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import InputFieldComponent from '../../components/input-field/input-field.component';
import {api_statuses, api_urls} from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import CustomSafeAreaViewComponent from '../../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../../components/top-circle/top-circle.component';
import ButtonComponent from '../../components/button/button.component';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  ROLES,
  SCREEN_HORIZONTAL_MARGIN_FORM,
  RIDER_ROUTES,
  showToaster,
  MAIN_ROUTES,
} from '../../util/constants';
import {deviceHeight} from '../../util/Dimentions';
const CREDENTIAL_KEYS = {
  WORK_EMAIL: 'Correo electrónico del trabajo',
  STORE_NAME: 'Nombre de la tienda',
  FULL_NAME: 'Nombre completo',
  PHONE_NUMBER: 'Número de teléfono',
  ADDRESS_LINE_ONE: 'Dirección Línea Uno',
  ADDRESS_LINE_TWO: 'Dirección Línea Dos',
  STATE: 'Estado',
  CITY: 'Ciudad',
  COUNTRY: 'País',
  PASSWORD: 'Contraseña',
};
// text to render based on the role type
const TEXT_TO_RENDER = {
  [ROLES.BUSINESS]: {
    textHeading: 'Crear cuenta de Repartidor',
  },
};

const RiderSignup = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const getTextObject = TEXT_TO_RENDER[route.params?.role];
  const [logo, setLogo] = useState('');
  const [inputValues, setInputValues] = useState({
    [CREDENTIAL_KEYS.WORK_EMAIL]: '',
    [CREDENTIAL_KEYS.STORE_NAME]: '',
    [CREDENTIAL_KEYS.FULL_NAME]: '',
    [CREDENTIAL_KEYS.PHONE_NUMBER]: '',
    [CREDENTIAL_KEYS.ADDRESS_LINE_ONE]: '',
    [CREDENTIAL_KEYS.ADDRESS_LINE_TWO]: '',
    [CREDENTIAL_KEYS.STATE]: '',
    [CREDENTIAL_KEYS.CITY]: '',
    [CREDENTIAL_KEYS.COUNTRY]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  const emailRef = useRef();
  const phoneRef = useRef();
  const storeNameRef = useRef();
  const addressLineOneRef = useRef();
  const addressLineTwoRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const countryRef = useRef();
  const passwordRef = useRef();
  const onChangeText = (inputText, key) => {
    setInputValues({...inputValues, [key]: inputText});
  };

  const generateOtp = async () => {
    try {
      setShowLoader(true);
      const url = api_urls.generate_otp;
      const body = {
        email: inputValues[CREDENTIAL_KEYS.WORK_EMAIL],
        name: inputValues[CREDENTIAL_KEYS.FULL_NAME],
        phone: inputValues[CREDENTIAL_KEYS.PHONE_NUMBER],
        Address:
          inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_ONE] +
          ' ' +
          inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_TWO],
        state: inputValues[CREDENTIAL_KEYS.STATE],
        country: inputValues[CREDENTIAL_KEYS.COUNTRY],
        city: inputValues[CREDENTIAL_KEYS.CITY],
        password: inputValues[CREDENTIAL_KEYS.PASSWORD],
        isCommonUser: false,
        isVendor: false,
        isRider: true,
      };
      console.log(body);
      const apiCall = await axios.post(url, body);
      if (
        apiCall.status == api_statuses.success &&
        apiCall.data.success == true
      ) {
        setShowLoader(false);
        console.log(apiCall.data);
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.OTP_PASSWORD, {
          otp: apiCall.data.otp,
          body: body,
          logo: logo,
        });
      }
    } catch (e) {
      setShowLoader(false);
      console.log(e);
      alert(e.response.data.message);
      console.log(e.response.data);
      setShowLoader(false);
    }
  };
  const pickLogo = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(res => {
        console.log(res);
        setLogo(res);
      })
      .catch(e => {
        showToaster('something went wrong');
      });
  };

  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={showLoader} />

      <TopCircleComponent
        textHeading={getTextObject.textHeading}
        subText={getTextObject.subText}
      />
      <View style={[CommonStyles.flexCenter, styles.body]}>
        <InputFieldComponent
          // icon={<Ionicons color={Colors.dark} size={20} name="person" />}
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.FULL_NAME);
          }}
          placeholderText={CREDENTIAL_KEYS.FULL_NAME}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.FULL_NAME]}
          nextFieldRef={emailRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.WORK_EMAIL);
          }}
          placeholderText={CREDENTIAL_KEYS.WORK_EMAIL}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.WORK_EMAIL]}
          nextFieldRef={phoneRef}
          ref={emailRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.PHONE_PAD}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.PHONE_NUMBER);
          }}
          placeholderText={CREDENTIAL_KEYS.PHONE_NUMBER}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.PHONE_NUMBER]}
          ref={phoneRef}
          nextFieldRef={storeNameRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.ADDRESS_LINE_ONE);
          }}
          placeholderText={CREDENTIAL_KEYS.ADDRESS_LINE_ONE}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_ONE]}
          nextFieldRef={addressLineTwoRef}
          ref={addressLineOneRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.ADDRESS_LINE_TWO);
          }}
          placeholderText={CREDENTIAL_KEYS.ADDRESS_LINE_TWO}
          secureTextEntry={false}
          ref={addressLineTwoRef}
          value={inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_TWO]}
          nextFieldRef={stateRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.STATE);
          }}
          placeholderText={CREDENTIAL_KEYS.STATE}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.STATE]}
          nextFieldRef={cityRef}
          ref={stateRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.CITY);
          }}
          placeholderText={CREDENTIAL_KEYS.CITY}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.CITY]}
          ref={cityRef}
          nextFieldRef={countryRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.COUNTRY);
          }}
          placeholderText={CREDENTIAL_KEYS.COUNTRY}
          secureTextEntry={false}
          value={inputValues[CREDENTIAL_KEYS.COUNTRY]}
          ref={countryRef}
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
          }}
          placeholderText={CREDENTIAL_KEYS.PASSWORD}
          secureTextEntry={true}
          value={inputValues[CREDENTIAL_KEYS.PASSWORD]}
          ref={passwordRef}
        />
        <View
          style={{
            width: '80%',
            borderWidth: 1,
            borderColor: Colors.brightBlue,
            backgroundColor: Colors.brightBlue,
            alignSelf: 'center',
            borderRadius: 10,
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 5,
          }}>
          <View style={{width: '70%'}}>
            <Text style={{color: 'white'}}>
              Cargue su perfil, el perfil debe ser claro y debe presentarlo,
              cualquier violación puede suspender su cuenta
            </Text>
          </View>
          {logo ? (
            <ImageBackground
              source={{uri: logo?.path}}
              style={{width: 70, height: 70, right: 5}}
              imageStyle={{borderRadius: 5}}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Pressable onPress={pickLogo}>
                  <Ionicons name="pencil" color="white" size={25} />
                </Pressable>
              </View>
            </ImageBackground>
          ) : (
            <Pressable
              onPress={pickLogo}
              style={{
                width: 60,
                height: 60,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 1,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Entypo name="plus" color="white" size={25} />
            </Pressable>
          )}
        </View>

        <ButtonComponent
          marginTop={0}
          colorB={Colors.terciarySolid}
          buttonText="CREAR CUENTA"
          handlePress={generateOtp}
          width={200}
        />
      </View>
    </CustomSafeAreaViewComponent>
  );
};

export default RiderSignup;

const styles = StyleSheet.create({
  body: {
    marginTop: deviceHeight * 0.03,
    backgroundColor: Colors.white,
    paddingVertical: deviceHeight * 0.04,
    marginHorizontal: SCREEN_HORIZONTAL_MARGIN_FORM,
    elevation: 1,
  },
});
