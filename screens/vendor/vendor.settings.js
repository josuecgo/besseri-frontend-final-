import React, { useEffect, useState } from 'react';
import { Platform, Text, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator, MenuItem, Heading } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBusinessProfile, logout } from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import { LOGIN_SIGNUP_FORGOT_ROUTES, MAIN_ROUTES, showToaster, VENDOR_DETAILS_ROUTES } from '../../util/constants';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { HeaderBackground } from '../../components/Background/HeaderBackground';



const VendorSettingsScreen = ({ navigation }) => {
    const [showLoader, setShowLoader] = useState(false);
    
    const commonTextStyle = {
        fontSize: 18,
        color: Colors.white,
        ...CommonStyles.fontFamily,
        paddingLeft: 5
    }
   const logoutUser = async() => {
       Alert.alert('¿Estas seguro?','¿Realmente quieres cerrar sesión?',
       [
           {
               text:'No'
           },
           {
               text:'Si',
               onPress:async() => {
                   setShowLoader(true);
                   const logoutUser =  await logout(); 
                   setShowLoader(false);
                   if(logoutUser) {
                       navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
                   } else {
                       showToaster('Algo salió mal, inténtalo de nuevo más tarde. :/')
                   }
               }
           }
       ]
       )
   }
    return (
        <View style={[styles.container]}>
            <Loader isVisible={showLoader} />

            <HeaderBackground/>
            <View  style={styles.header} >
                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.pop()} style={styles.headerIcon}>
                            <MaterialCommunityIcons name='keyboard-backspace' color='white' size={25} />
                    </TouchableOpacity>
                </View> 
                <View style={{flex:1,marginLeft:deviceWidth / 5.2}}>
                        <Text style={commonTextStyle}>App Settings</Text>
                </View>
            </View>

           

            <View style={styles.menusWrapper}>
                {/* <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)}
                    label='Change Language'
                    value='English'
                    icon={
                        <Entypo
                            name='language'
                            color={Colors.white}
                            size={20}
                        />
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} /> */}

                {/* <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)}
                    label='Profile Settings'
                    icon={
                        <MaterialCommunityIcons
                            name='account'
                            color={Colors.white}
                            size={23}
                        />
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} /> */}

                <MenuItem
                    onPress={() => navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY)}
                    label='Política de privacidad'
                    icon={
                        <MaterialIcons
                            name='privacy-tip'
                            color={Colors.white}
                            size={23}
                        />
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} />

                {/* <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)}
                    label='Developer Team'
                    icon={
                        <Entypo
                            name='code'
                            color={Colors.white}
                            size={23}
                        />
                    }
                /> */}
                {/* <ThinlineSeparator margin={5} width={'95%'} /> */}
                <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.BUSINESS_LOCATION)}
                    label='Ubicación de la empresa'
                    logoutBtn={false}
                    icon={
                        <Entypo name='location-pin' color='white' size={20}/>
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} />
                <MenuItem
                    onPress={logoutUser}
                    logoutBtn={true}
                    icon={
                        <AntDesign name='logout' color='white' size={20}/>
                    }
                    label="Cerrar sesión"
                />
 


            </View>
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
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
        //  borderWidth:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    profileBtn: {
        width: '95%',
        height: 55,
        borderWidth: 1,
        borderColor: Colors.brightBlue,
        backgroundColor: Colors.brightBlue,
        ...CommonStyles.verticalCenter,
        ...CommonStyles.horizontalCenter,
        borderRadius: 3,
        alignSelf: 'center',
        margin: 10
    },
    headerIcon: {
        paddingHorizontal: 10
    },
    menusWrapper:{width:'98%',alignSelf:'center',padding:5,paddingTop:'5%'}
})
export default VendorSettingsScreen;
