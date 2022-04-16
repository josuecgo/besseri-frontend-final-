import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
    ImageBackground
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    getRiderProfile,
    logout,
    saveRiderProfile,
} from '../../util/local-storage/auth_service';
import {
    api_statuses,
    base_url,
    rider_api_urls,
    vendor_api_urls,
} from '../../util/api/api_essentials';
import { MenuItem, ThinlineSeparator } from '../../components/CommonComponents';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import {
    LOGIN_SIGNUP_FORGOT_ROUTES,
    MAIN_ROUTES,
    showToaster,
} from '../../util/constants';
import { setWalletDetails } from '../../util/ReduxStore/Actions/RiderActions/RiderActions';
import axios from 'axios';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
const RiderProfileScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const [riderProfile, setRiderProfile] = useState(null);
    const rider_wallet = useSelector(state => state?.rider?.wallet);
    const earnigns = useSelector(state => state?.rider?.earnings);
    console.log(earnigns);
    const TABS = [
        {
            label: 'Orders',
            icon: <Entypo name="shopping-bag" color="white" size={40} />,
        },
        {
            label: 'Explore',
            icon: <MaterialIcons name="explore" color="white" size={40} />,
        },
        {
            label: 'Profile',
            icon: <FontAwesome5Icon name="user-tie" color="white" size={40} />,
        },
        {
            label: 'Settings',
            icon: <Ionicons name="md-settings" color="white" size={40} />,
        },
    ];
    const getUserData = async () => {
        const data = await getRiderProfile();
        console.log(`${base_url}/${riderProfile?.profile}`);
        setRiderProfile(data);
        getWalletDetails();
    };
    useEffect(() => {
        getUserData();
    }, []);
    const getWalletDetails = async () => {
        try {
            if (!riderProfile || !riderProfile?.wallet_id) {
                return;
            } else {
                const url = `${vendor_api_urls.get_stripe_account_details}/${riderProfile?.wallet_id}`;
                const apiCall = await axios.get(url);
                if (apiCall.status == api_statuses.success) {
                    dispatch(setWalletDetails(apiCall.data.Data));
                } else {
                    showToaster('Perdón por la interrupción, esta solicitud falló');
                    return;
                }
            }
            console.log('line 57', rider_wallet?.charges_enabled);
        } catch (e) {
            console.log('line 38', e);
            showToaster('Perdón por la interrupción, esta solicitud falló');
        }
    };
    useEffect(() => {
        if (riderProfile) {
            getWalletDetails();
        }
    }, [riderProfile]);
    const logoutUser = async () => {
        Alert.alert(
            'Saliendo de tu cuenta',
            '¿Realmente desea cerrar la sesión de esta cuenta?',
            [
                {
                    text: 'No',
                },
                {
                    text: 'Si',
                    onPress: async () => {
                        const isLoggedOut = await logout();
                        if (isLoggedOut) {
                            navigation.replace(MAIN_ROUTES.AUTH_STACK);
                        }
                    },
                },
            ],
        );
    };

    const createAccount = async () => {
        try {
            const riderId = await getRiderProfile()?._id;
            const apiCall = await axios.post(rider_api_urls?.create_stripe_account, {
                //  email:businessDetails?.email,
                riderId: riderId,
            });
            if (apiCall?.status == api_statuses?.success) {
                Linking.openURL(apiCall?.data?.link?.url);
                await saveRiderProfile([apiCall?.data?.profile]);
            }
        } catch (e) {
            console.log(e);
            showToaster('Algo salió mal, intenta de nuevo');
        }
    };
    console.log(rider_wallet);
    return (
        <View style={{ flex: 1, backgroundColor:Colors.bgColor }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <HeaderBackground/>
                <View
                    style={{
                        width: '100%',
                        height: deviceHeight * 0.23,

                        // marginBottom: 10,
                    }}
                >
                    
                    <ImageBackground
                    source={require('../../assets/images/header2.png')}
                    resizeMode="stretch"
                    style={{ flexDirection: 'row', alignItems: 'center',height: deviceHeight * 0.20, paddingLeft:10 }}
                    >
                        <Image
                            //  source={{uri:`${base_url}/${riderProfile?.profile}`}}
                            source={{ uri: `${base_url}/${riderProfile?.profile}` }}
                            style={{
                                width: deviceWidth * 0.15,
                                height: deviceWidth * 0.15,
                                borderWidth: 3,
                                borderRadius: 80 / 2,
                                borderColor: Colors.primaryColor,
                            }}
                        />
                        <View>
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    paddingLeft: 10,
                                }}>
                                {riderProfile?.riderName}
                            </Text>
                            <Text style={{ fontSize: adjust(12), color: '#f8f8f8', paddingLeft: 10 }}>
                                {riderProfile?.email}
                            </Text>
                        </View>
                    </ImageBackground>
                    <View
                        style={{
                            width: '90%',
                            height: deviceHeight * 0.14,
                            backgroundColor: Colors.white,
                            alignSelf: 'center',
                            position: 'absolute',
                            bottom: -50,
                            borderRadius: 10,
                            elevation: 4,
                        }}>
                        <View style={{ margin: 15 }}>
                            <Text style={{ ...CommonStyles.fontFamily, color: 'grey' }}>
                            Ganado hoy
                            </Text>
                            <Text
                                style={{
                                    ...CommonStyles.fontFamily,
                                    color: 'black',
                                    fontSize: adjust(20),
                                    marginTop: 5,
                                }}>
                                {earnigns?.todays.toFixed(2)} MXN
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: '20%',backgroundColor:'white',marginHorizontal:5 }}>
                    {!riderProfile?.wallet_id || !rider_wallet?.charges_enabled ? (
                        <MenuItem
                            onPress={createAccount}
                            label="Configurar cuenta de Stripe"
                            icon={
                                <MaterialIcons
                                    name="privacy-tip"
                                    color={Colors.white}
                                    size={23}
                                />
                            }
                        />
                    ) : null}
                    <MenuItem
                        label="Ganancias Totales"
                        value={`${moneda(earnigns?.total?.toFixed(2))} MXN`}
                        icon={
                            <MaterialIcons
                                name="attach-money"
                                color={Colors.white}
                                size={25}
                            />
                        }
                    />
                    <ThinlineSeparator margin={5} width={'95%'} />

                    <MenuItem
                        onPress={() =>
                            navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY)
                        }
                        label="Política de privacidad"
                        icon={
                            <MaterialIcons
                                name="privacy-tip"
                                color={Colors.white}
                                size={23}
                            />
                        }
                    />
                    <ThinlineSeparator margin={5} width={'95%'} />

                    {/* <MenuItem
            onPress={() =>
              navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)
            }
            label="Developer Team"
            icon={<Entypo name="code" color={Colors.white} size={23} />}
          /> */}
                    {/* <ThinlineSeparator margin={5} width={'95%'} /> */}

                    <MenuItem
                        onPress={logoutUser}
                        logoutBtn={true}
                        icon={<AntDesign name="logout" color="white" size={20} />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default RiderProfileScreen;
