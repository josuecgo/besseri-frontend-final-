import { StyleSheet, Text,View,Image } from 'react-native'
import React from 'react'


import { BackgroundImage } from '../components/Background/BackgroundImage'
import { BottomGradient } from '../components/BottomGradient/BottomGradient'
import { ButtonSolid } from '../components/button/ButtonSolid'
import Colors from '../util/styles/colors'
import { deviceWidth } from '../util/Dimentions'
import { LOGIN_SIGNUP_FORGOT_ROUTES } from '../util/constants'


export const HomePageScreen = ({navigation}) => {


    const goSignUp = () => {
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP_CUSTOMER);
    }

    const goLogin = () => {
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
    }

    return (
    <View style={styles.body} >
        <BackgroundImage/>
        <View style={{justifyContent:'center', alignItems:'center'}} >
            <Image
            source={require('../assets/images/logo1.png')}
            style={styles.logo}
            />
            
            {/* <ButtonSolid nav={goLogin} texto={'INICIAR SESIÓN'} bgColor={Colors.terciarySolid} colorTxt={'white'} /> */}
            <BottomGradient txtColor={'white'} texto='INICIAR SESIÓN' colorGradient={Colors.secondaryGradient} nav={goLogin } 
            />
            <BottomGradient txtColor={'white'} texto='CREAR CUENTA' nav={goSignUp} 
            />
        </View>
       

       
        
    </View>
  )
}



const styles = StyleSheet.create({
    body:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        
    },
    
    logo:{
        resizeMode:'stretch',
        height: deviceWidth * 0.40,
        //   top: 1, 
        width: deviceWidth * 0.70,
    
    }
    
})