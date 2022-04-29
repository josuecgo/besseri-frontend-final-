import { StyleSheet, Text, View,Platform,TouchableOpacity,Button } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { HeaderBackground } from '../../components/Background/HeaderBackground'
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions'

import Colors from '../../util/styles/colors';
import ButtonComponent from '../../components/button/button.component';
import { CUSTOMER_HOME_SCREEN_ROUTES, LOGIN_SIGNUP_FORGOT_ROUTES } from '../../util/constants';

export const iniciar = (props) => {

    
    const goLogin = () => {
        // props.navigation.replace('AuthStack');
        props.navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
    }

    const goSignIn = () => {
        props.navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP_CUSTOMER);
    }


    return (
    <View style={styles.body} >
        <HeaderBackground/>
            <View style={styles.header} >
            {/* <TouchableOpacity onPress={() => props.navigation.goBack()}>
                  <MaterialCommunityIcons
                  name='keyboard-backspace'
                  color={Colors.white}
                  size={30}
                  style={{left:10}}
                  />
            </TouchableOpacity> */}

            {/* <Text style={{fontSize:adjust(18),color:Colors.white}}>Detalles de producto</Text>

            <View style={{width:23,height:30}} /> */}
          </View>

          <View style={styles.content} >
              <View style={styles.card} >
                <Text style={styles.texto} >¡Hola! Para continuar, ingresa a tu cuenta</Text>

                <ButtonComponent
                handlePress={goSignIn}
                borderRadius={2}
                colorT={Colors.white}
                buttonText={'Crear cuenta'}
                colorB={Colors.terciarySolid}
                width={deviceWidth * 0.69}
                margin={30}
                />

                <TouchableOpacity onPress={goLogin} >
                    <Text style={styles.btnText} >Ingresar</Text>
                </TouchableOpacity>
                
              </View>
              
          </View>

    </View>
  )
}



const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:Colors.bgColor,
       
    },
    header:{
        width: '100%',
        height: Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.10,
        //  borderWidth:1,
        // ...CommonStyles.horizontalCenter,
        justifyContent:'space-between',
        marginBottom:10,
        flexDirection:'row',
        alignItems:'center'
    },
    content:{
        // justifyContent:'center',
        alignItems:'center',
        marginTop:deviceWidth * 0.2,
        flex:1
    },
    card:{
        backgroundColor:Colors.white,
        width:deviceWidth * 0.95,
        height:deviceWidth * 0.8,
        elevation:2,
        // justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal:7
    },
    texto:{
        fontSize:adjust(17),
        fontWeight:'bold',
        textAlign:'center'
    },
    btnText:{
        color:Colors.terciarySolid,
        fontSize:adjust(12)
    }
})