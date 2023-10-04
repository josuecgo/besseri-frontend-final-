import React, { useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, Alert, ImageBackground, Pressable } from 'react-native';
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
import { Center, Input, VStack } from 'native-base';
import { useInfoUser } from '../hooks/useInfoUsers';
import { addToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';


const CREDENTIAL_KEYS = {
  EMAIL_ADDRESS: 'Email',
  PASSWORD: 'Contraseña',
};

const LoginScreen = ({ navigation }) => {
  const { getUserInfo, getPedidosUser } = useInfoUser()
  const dispatch = useDispatch()
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
  });
  const [showLoader, setShowLoader] = useState(false);
  const [show, setShow] = useState(false)


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
        const { user } = apiCall?.data?.data;
        setShowLoader(false);


        if (user.isCommonUser) {

          await saveUserId(user?._id);
          await saveUserType(user)
          await saveUserData(user);
          dispatch(addToUser(user))
          if (user?.carActive) {
            await saveCarActive(user?.isCarActive);


          }
          await getUserInfo(user)
          await getPedidosUser()
          navigation.replace(MAIN_ROUTES.CUSTOMER_HOME_STACK);


        } else {
          showToaster('Usuario no encontrado.')
        }

      }

    } catch (e) {


      setShowLoader(false);
      showToaster('Error con el servidor.')
    }
  };


  return (
    <CustomSafeAreaViewComponent>
      <Loader isVisible={showLoader} />
      <VStack>
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
            autoCapitalize="none"
            returnType="next"
            // validator={emailValidator}
            hintText="Por favor ingresa un correo valido"
          />


          <View style={{ marginVertical: 10, width: deviceWidth - 30 }}  >
            <Text style={{ ...CommonStyles.h2 }} >{CREDENTIAL_KEYS.PASSWORD}</Text>
          
            <Input
              backgroundColor={Colors.bgInput}
              borderColor={Colors.darker}
              borderWidth={'1px'}
              borderRadius={'10px'}
              onChangeText={inputText => {
                onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
              }}
              color={Colors.white}
              placeholder={CREDENTIAL_KEYS.PASSWORD}
              value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
              mt={'13px'}
              size={Platform.OS === 'ios' ? '2xl' : 'lg'}
              type={show ? "text" : "password"}
              InputRightElement={<Pressable onPress={() => setShow(!show)}
              style={{padding:10}}
              >
                <MaterialIcons name={show ? "visibility" : "visibility-off"}
                  size={25}
                  color={Colors.white}
                />
              </Pressable>}

            />
          </View>

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
      </VStack>


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
    height: deviceHeight * 0.65,
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
