import React, { useRef, useState } from 'react';
import { useWindowDimensions, View,Text, Pressable, ImageBackground,StyleSheet,ScrollView,Alert } from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  ROLES,
  SCREEN_HORIZONTAL_MARGIN_FORM,
  showToaster,
} from '../util/constants';
import CommonStyles from '../util/styles/styles';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../util/styles/colors';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';

import ButtonComponent from '../components/button/button.component';
import axios from 'axios';
import { api_statuses, api_urls, vendor_api_urls } from '../util/api/api_essentials';
import LoaderComponent from '../components/Loader/Loader.component';
import ImageCropPicker from 'react-native-image-crop-picker';
import { deviceHeight, deviceWidth } from '../util/Dimentions';
import { ButtonIconoInput } from '../components/button/ButtonIconoInput';
import { comparaText } from '../util/helpers/StatusText';
import CheckboxTerms from '../components/button/CheckboxTerms';
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
  PASSWORDCONFIRM: 'Confirmar contraseña'
};

// text to render based on the role type
const TEXT_TO_RENDER = {
  [ROLES.BUSINESS]: {
    textHeading: 'Crear cuenta comercial',
    
  },
};

const VendorSsSignUpScreen = ({ navigation, route }) => {
  const [showPass, setShowPass] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const getTextObject = TEXT_TO_RENDER[route.params?.role];
  const [logo,setLogo] = useState('');
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
    [CREDENTIAL_KEYS.CONFIRMPASSWORD] : '',
  });
  
  const [showLoader, setShowLoader] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    
    setIsSelected(!isSelected)
    

  };

  const emailRef = useRef();
  const phoneRef = useRef();
  const storeNameRef = useRef();
  const addressLineOneRef = useRef();
  const addressLineTwoRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const countryRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const onChangeText = (inputText, key) => {
    setInputValues({ ...inputValues, [key]: inputText });
  };

  const generateOtp = async () => {
    if (comparaText(inputValues[CREDENTIAL_KEYS.CONFIRMPASSWORD],inputValues[CREDENTIAL_KEYS.PASSWORD]) && inputValues[CREDENTIAL_KEYS.PASSWORD].length > 0 ) {
      if (isSelected) {
        Alert.alert(
          "Código de verificación",
          "¿Porque medio desea recibir su código de verificación?",
          [
            {
              text: "Correo",
              onPress: () => sendCode('email')
            },
            {
              text: "SMS",
              onPress: () => sendCode('sms'),
              
            },
            { text: "Whatsapp", onPress: () => sendCode('whatsapp') }
          ]
        );
      }else{
       showToaster('Acepta términos y condiciones de uso')
      }
     }else{
       showToaster('Contraseñas no coinciden')
     }
    
  }

  const sendCode = async(msj) => {


     try {
      setShowLoader(true);
      const url = api_urls.generate_otp;
      const body = {
        email: inputValues[CREDENTIAL_KEYS.WORK_EMAIL],
        name: inputValues[CREDENTIAL_KEYS.FULL_NAME],
        phone: inputValues[CREDENTIAL_KEYS.PHONE_NUMBER],
        storeName: inputValues[CREDENTIAL_KEYS.STORE_NAME],
        Address: inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_ONE] + " " + inputValues[CREDENTIAL_KEYS.ADDRESS_LINE_TWO],
        state: inputValues[CREDENTIAL_KEYS.STATE],
        country: inputValues[CREDENTIAL_KEYS.COUNTRY],
        city: inputValues[CREDENTIAL_KEYS.CITY],
        password: inputValues[CREDENTIAL_KEYS.PASSWORD],
        isCommonUser:false,
        isVendor:true,
        isRider:false,
        msj
      }
      const apiCall = await axios.post(url,body);
      if (apiCall.status == api_statuses.success && apiCall.data.success == true) {
        setShowLoader(false);
        
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.OTP_PASSWORD, {
          otp: apiCall.data.otp,
          body:body,
          logo:logo
        });
      }
    } catch (e) {
      alert(e.response.data.message)
      console.log(e.response.data)
      setShowLoader(false);
    }
  }
  const pickLogo = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(res => {
      console.log(res);
      setLogo(res);
    }).catch(e => {
      showToaster('Algo salio mal')
    })
  }
 

  return (
    <View style={{flex:1}}>

      <LoaderComponent isVisible={showLoader} />

      <TopCircleComponent
        textHeading={getTextObject.textHeading}
        
      />
      <View
        style={[
          CommonStyles.flexCenter,
          styles.body,
        ]}>
        <ScrollView>
          
        <InputFieldComponent
         
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
          // icon={<FontAwesome5 color={Colors.dark} size={20} name="store-alt" />}
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.STORE_NAME);
          }}
          placeholderText={CREDENTIAL_KEYS.STORE_NAME}
          secureTextEntry={false}
          ref={storeNameRef}
          nextFieldRef={addressLineOneRef}
          value={inputValues[CREDENTIAL_KEYS.STORE_NAME]}
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
          secureTextEntry={showPass}
          value={inputValues[CREDENTIAL_KEYS.PASSWORD]}
          ref={passwordRef}
          showPass={
            <ButtonIconoInput name={showPass ?'eye-slash' : 'eye'} size={16} onPress={() => setShowPass(!showPass) } />
          }
        />

        <InputFieldComponent
            
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.CONFIRMPASSWORD);
            }}
            placeholderText={'Confirmar contraseña'}
            secureTextEntry={showPass2}
            value={inputValues[CREDENTIAL_KEYS.CONFIRMPASSWORD]}
            ref={passwordConfirmRef}
            showPass={
              <ButtonIconoInput name={showPass2 ? 'eye-slash' : 'eye'} size={16} onPress={() => setShowPass2(!showPass2) } />
            }
        />

        <View style={{
          width:'80%',
          borderWidth:1,
          borderColor:Colors.brightBlue,
          backgroundColor:Colors.brightBlue,
          alignSelf:'center',
          borderRadius:10,
          marginVertical:4,
          flexDirection:'row',
          justifyContent:'space-between',alignItems:'center',
          paddingVertical:9,
          paddingHorizontal:5
        }}>
         <View style={{width:'70%'}}>
           <Text style={{color:'white'}}>Cargue el logotipo de la empresa, el logotipo debe ser claro y debe presentar su empresa, cualquier infracción puede suspender su cuenta</Text>
         </View>
        {
          logo ? 
          <ImageBackground source={{uri:logo?.path}} style={{width:70,height:70,right:5}} imageStyle={{borderRadius:5}}>
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.1)',justifyContent:'center',alignItems:'center'}}> 
              <Pressable onPress={pickLogo}>
                <Ionicons name='pencil' color='white' size={25}/>
              </Pressable>
            </View>
          </ImageBackground>
          :
          <Pressable 
          onPress={pickLogo}
          style={{width:60,height:60,borderColor:'white',borderWidth:1,borderRadius:1,borderStyle:'dashed',justifyContent:'center',alignItems:'center',marginRight:10}}>
            <Ionicons name='add-outline' color='white' size={25}/>

          </Pressable>
        }
        </View>


        <CheckboxTerms 
          isSelected={isSelected}
          roleName={'terminos'} 
          text={'He leído y acepto los términos y condiciones de uso'} 
          txtColor='black' 
          handlePress={handlePress} 
          
          />
        <ButtonComponent
          marginTop={0}
          colorB={Colors.terciarySolid}
          buttonText="CREAR CUENTA"
          handlePress={generateOtp}
          width={'100%'}
          borderRadius={0}
    
        />

        <View style={{width:deviceWidth , height : deviceHeight * 0.10}} />
        
      </ScrollView>

      </View>
    </View>
  );
};

export default VendorSsSignUpScreen;


const styles = StyleSheet.create({
  body:{  
    // marginTop: deviceHeight * 0.01, 
    backgroundColor:Colors.white,
    // marginHorizontal:SCREEN_HORIZONTAL_MARGIN_FORM,
    paddingVertical: 10,
    marginBottom:50,
    
  }
})