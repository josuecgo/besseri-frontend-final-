import React, { useEffect, useState } from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
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
const { width, height } = Dimensions.get('screen');
const VendorSettingsScreen = ({ navigation }) => {
    const [showLoader, setShowLoader] = useState(false);
    const commonTextStyle = {
        fontSize: 18,
        color: Colors.white,
        ...CommonStyles.fontFamily,
        paddingLeft: 5
    }
   const logoutUser = async() => {
       Alert.alert('Are you sure?','Do you really want to logout?',
       [
           {
               text:'No'
           },
           {
               text:'yes',
               onPress:async() => {
                   setShowLoader(true);
                   const logoutUser =  await logout(); 
                   setShowLoader(false);
                   if(logoutUser) {
                       navigation.replace(MAIN_ROUTES.AUTH_STACK);
                   } else {
                       showToaster('Something went wrong please try again later :/')
                   }
               }
           }
       ]
       )
   }
    return (
        <View style={styles.container}>
            <Loader isVisible={showLoader} />
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.pop()} style={styles.headerIcon}>
                    <MaterialCommunityIcons name='keyboard-backspace' color='white' size={25} />
                </TouchableOpacity>
                <Text style={commonTextStyle}>App Settings</Text>
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
                    label='Privacy Policy'
                    icon={
                        <MaterialIcons
                            name='privacy-tip'
                            color={Colors.white}
                            size={23}
                        />
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} />

                <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)}
                    label='Developer Team'
                    icon={
                        <Entypo
                            name='code'
                            color={Colors.white}
                            size={23}
                        />
                    }
                />
                <ThinlineSeparator margin={5} width={'95%'} />
                <MenuItem
                    onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.BUSINESS_LOCATION)}
                    label='Business Location'
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
        height: 65,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        backgroundColor: Colors.primaryColor,
        ...CommonStyles.horizontalCenter,
        ...CommonStyles.flexDirectionRow
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
