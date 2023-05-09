import React, { useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, Alert, ImageBackground } from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import InputFieldComponent from '../components/input-field/input-field.component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import KEYBOARD_TYPES from '../util/keyboard-types';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  MAIN_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
  showToaster,
} from '../util/constants';
import ButtonComponent from '../components/button/button.component';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import SideOptionComponent from '../components/top-circle/side-option.component';
import BottomContentComponent from '../components/bottom-content/bottom-content.component';
import { emailValidator, generalNonEmptyValidator } from '../util/validations';
import { api_statuses, api_urls, customer_api_urls, rider_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import Loader from '../components/Loader/Loader.component';
import { saveAdressCustomer, saveBusinessProfile, saveBusinessStatus, saveCarActive, saveRiderProfile, saveUserData, saveUserId, saveUserType } from '../util/local-storage/auth_service';
import { useDispatch } from 'react-redux';
import * as  BusinessProfileActions from '../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';
import { deviceHeight, deviceWidth } from '../util/Dimentions';
import { HeaderTitle } from '../components/Customer/HeaderTitle';
import { NewLogo } from '../components/NewLogo';
import { InputTxt } from '../components/Customer/InputTxt';
import { BtnPrincipal } from '../components/Customer/BtnPrincipal';
import { Center } from 'native-base';
import { useInfoUser } from '../hooks/useInfoUsers';


const CREDENTIAL_KEYS = {
  EMAIL_ADDRESS: 'Email',
  PASSWORD: 'Contraseña',
};

const LoginScreen = ({ navigation }) => {
  const {getUserInfo} = useInfoUser()

  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  const passwordRef = useRef();

  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };




  const handleSignIn = async () => {
    try {
      setShowLoader(true);
      const url = api_urls.login;
      const body = {
        email: userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS],
        password: userCredentials[CREDENTIAL_KEYS.PASSWORD]
      }

      const apiCall = await axios.post(url, body);
      setShowLoader(false);
      if (apiCall?.status != api_statuses.success) {
        showToaster(apiCall?.data?.info?.message ? apiCall?.data?.info?.message : 'Something went wrong');
        return;
      }

     

      if (apiCall.status == api_statuses.success) {
        const {user,garage,address} = apiCall?.data?.data;
        setShowLoader(false);
        
        if (user.isCommonUser) {

          await saveUserId(user?._id);
          await saveUserType(user)
          await saveUserData(user);
          
          if (user?.carActive) {
            await saveCarActive(user?.isCarActive);


          }
          await getUserInfo(user)
          navigation.replace(MAIN_ROUTES.CUSTOMER_HOME_STACK);
        } else {
          showToaster('Usuario no encontrado.')
        }

      }

    } catch (e) {
      console.log("🚀 ~ file: login.screen.js:95 ~ handleSignIn ~ e:", e)
      // console.log(e);
      setShowLoader(false);
      showToaster('Error con el servidor.')
    }
  };

  const goHome = () => {
    navigation.goBack();
  }

  return (
    <CustomSafeAreaViewComponent>
      <Loader isVisible={showLoader} />
      {/* <TopCircleComponent textHeading="Iniciar Sesión" /> */}

      <HeaderTitle titulo={'Iniciar Sesión'} nav={goHome} />
      <View style={styles.logoContent} >
        <NewLogo width={deviceWidth} />
      </View>

      <ImageBackground
        source={require('../assets/images/car_fondo.png')}
        style={[styles.content]}
      >
        <Text style={{ ...CommonStyles.h1 }} >Iniciar sesión</Text>
        <InputTxt
          label={CREDENTIAL_KEYS.EMAIL_ADDRESS}
         
          keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.EMAIL_ADDRESS);
          }}
          placeholderText={CREDENTIAL_KEYS.EMAIL_ADDRESS}
          value={userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS]}
          secureTextEntry={false}
         
          returnType="next"
          // validator={emailValidator}
          hintText="Por favor ingresa un correo valido"
        />
        <InputTxt
          label={CREDENTIAL_KEYS.PASSWORD}
          // placeholderText={'Contraseña'}
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          secureTextEntry={true}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
          }}
          placeholderText={CREDENTIAL_KEYS.PASSWORD}
          value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
          returnType="default"
          validator={generalNonEmptyValidator}
          hintText="Por favor ingresa una contraseña valida"
        />
        {/* <View style={styles.card} >


          <View style={CommonStyles.flexCenter}>
            <InputFieldComponent
              icon={
                <MaterialIcons
                  color={Colors.dark}
                  size={24}
                  name="alternate-email"
                />
              }
              keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
              onChangeText={inputText => {
                onChangeText(inputText, CREDENTIAL_KEYS.EMAIL_ADDRESS);
              }}
              placeholderText={CREDENTIAL_KEYS.EMAIL_ADDRESS}
              value={userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS]}
              secureTextEntry={false}
              nextFieldRef={passwordRef}
              returnType="next"
              validator={emailValidator}
              hintText="Por favor ingresa un correo valido"
            />
            <InputFieldComponent
              icon={
                <MaterialCommunityIcons
                  name="key-variant"
                  color={Colors.dark}
                  size={24}
                />
              }
              keyboardType={KEYBOARD_TYPES.DEFAULT}
              onChangeText={inputText => {
                onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
              }}
              placeholderText={CREDENTIAL_KEYS.PASSWORD}
              value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
              secureTextEntry={true}
              ref={passwordRef}
              returnType="default"
              validator={generalNonEmptyValidator}
              hintText="Por favor ingresa una contraseña valida"
            />

            <View style={{ alignSelf: 'flex-end' }} >
              <SideOptionComponent
                text="¿Olvidaste tu contraseña?"
                textAlign="right"
                navigation={navigation}
                keyToRoute={LOGIN_SIGNUP_FORGOT_ROUTES.FORGOT_PASSWORD}
              />
            </View>

            <ButtonComponent
              width={160}
              marginTop={20}
              colorB={Colors.terciarySolid}
              buttonText="INICIAR SESIÓN"
              handlePress={handleSignIn}
            />
          </View>
          <BottomContentComponent>
            <Text style={[CommonStyles.fontFamily]}>
              <Text>¿No tienes una cuenta? </Text>
              <Text
                onPress={() => {
                  navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.CUSTOMER_SIGN_UP);
                }}
                style={styles.signUpText}>
                Regístrate
              </Text>
            </Text>
          </BottomContentComponent>

        </View> */}
      </ImageBackground>
      <BottomContentComponent>
        <Center>
          <Text style={[CommonStyles.h2]}>
            <Text style={[CommonStyles.h2]} >¿Ya tienes una cuenta? </Text>
            <Text

              onPress={() => {
                navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.CUSTOMER_SIGN_UP);
              }}
              style={[CommonStyles.h2, { textTransform: 'uppercase', color: Colors.brightBlue }]}>
              Regístrate
            </Text>
          </Text>
        </Center>

      </BottomContentComponent>

      <BtnPrincipal
        text={'Ingresar'}
        onPress={handleSignIn}
      />
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({

  header: {
    position: 'absolute',
    top: 20,
  },
  txtHeader: {
    color: Colors.white,
    fontSize: 24,
  },
  content: {
    flex: 1,
    resizeMode: 'contain',
    height: deviceHeight * 0.5,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  logoContent: {
    marginVertical: 30
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: deviceHeight * 0.15,
    elevation: 2
  },
  topColor: {
    backgroundColor: Colors.primaryColor,
    transform: [{ translateY: -150 }],
  },
  brandNameTitle: {
    color: Colors.white,
    fontSize: 40,
    transform: [{ translateY: 120 }],
  },
  forgotPasswordContainer: {
    alignItems: 'flex-start',
  },
  signUpText: {
    // color: Colors.secundarySolid,
    width: 300,
    paddingLeft: 10,
  },
  textoHelper: {
    color: Colors.primarySolid,
  },
});

export default LoginScreen;
