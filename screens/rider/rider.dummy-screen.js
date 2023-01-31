import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Image,
    Linking,
    Pressable,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Alert,
    Platform
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    getRiderId,
    getRiderProfile,
    saveRiderProfile,
} from '../../util/local-storage/auth_service';
import {
    api_statuses,
    base_url,
    rider_api_urls,
    vendor_api_urls,
} from '../../util/api/api_essentials';
import { BOTTOM_TAB_RIDER_ROUTES, showToaster } from '../../util/constants';
import { getRiderEarnings } from '../../util/api/CommonFunctions';
import {
    setEarnings,
    setWalletDetails,
} from '../../util/ReduxStore/Actions/RiderActions/RiderActions';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import TopCircleComponent from '../../components/top-circle/top-circle.component';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../../hooks/useLocation';
import LoaderComponent from '../../components/Loader/Loader.component';

const RiderDummyScreen = props => {
    const { width } = useWindowDimensions();
    const [riderProfile, setRiderProfile] = useState(null);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const reloadEarnings = useSelector(state => state?.rider?.reloadEarnings);
    const rider_wallet = useSelector(state => state?.rider?.wallet);
   
    const TABS = [
        {
            label: 'Pedidos',
            icon: (
                <Entypo name="shopping-bag" color={Colors.primarySolid} size={40} />
            ),
            func: () =>
                props.navigation.navigate(BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS),
        },
        {
            label: 'Explorar',
            icon: (
                <MaterialIcons name="explore" color={Colors.primarySolid} size={40} />
            ),
            func: () =>
                props.navigation.navigate(BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE),
        },
        {
            label: 'Perfil',
            icon: (
                <FontAwesome5Icon
                    name="user-tie"
                    color={Colors.primarySolid}
                    size={40}
                />
            ),
            func: () =>
                props.navigation.navigate(BOTTOM_TAB_RIDER_ROUTES.RIDER_PROFILE),
        },
        {
            label: 'Soporte',
            icon: (
                <MaterialCommunityIcons
                    name="face-agent"
                    color={Colors.primarySolid}
                    size={40}
                />
            ),
            func: () => {
                Linking.openURL(
                    'mailto:soporte@besseri.com?subject=Customer Support Ticket BY RIDER',
                );
            },
        },
    ];
    const {updateUbication} = useLocation();

    const geyMyEarningsAndData = async () => {
        try {
            const riderProfile = await getRiderProfile();
            setRiderProfile(riderProfile);
            const earnings = await getRiderEarnings(riderProfile?._id);
            dispatch(setEarnings(earnings));
            
            
        } catch (e) {
            // console.log(e);
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo - 1');
        }
    };
    useEffect(() => {
        geyMyEarningsAndData();
    }, [reloadEarnings]);
   
    const getWalletDetails = async () => {
        try {
            const riderData = await getRiderProfile();
            
            if (!riderData || !riderData?.wallet_id) {
                return;
            } else {
                const url = `${vendor_api_urls.get_stripe_account_details}/${riderData?.wallet_id}`;
                const apiCall = await axios.get(url);
                if (apiCall.status == api_statuses.success) {
                    dispatch(setWalletDetails(apiCall.data.Data));
                } else {
                    showToaster('Perdón por la interrupción, esta solicitud falló');
                    return;
                }
            }
            // console.log('line 57', rider_wallet?.charges_enabled);
        } catch (e) {
            // console.log('line 38', e);
            showToaster('Perdón por la interrupción, esta solicitud falló');
        }
    };
    useEffect(() => {
        if (riderProfile) {
            getWalletDetails();
        }
    }, [riderProfile]);

    const createAccount = async () => {
        try {
            setLoader(true);
            // const riderD = await getRiderProfile();
            
            const apiCall = await axios.post(rider_api_urls?.create_stripe_account, {
                //  email:businessDetails?.email,
                riderId: riderProfile?._id,
            });
            setLoader(false);

            if (apiCall?.status == api_statuses?.success) {
                await saveRiderProfile([apiCall?.data?.profile]);

                Linking.openURL(apiCall?.data?.link?.url);
                // console.log('line 106', riderD);
                // console.log('line 107', apiCall.data.profile);
                //  if(apiCall.data.profile != null) {
                //  }
            }
        } catch (e) {
            setLoader(false);

            console.log(e,'createAccount');
            showToaster('Algo salió mal, intenta de nuevo');
        }
    };



    const location = async( ) => {
        const p = await getRiderProfile();
        
        if (p.location.latitude == 0) {
          updateUbication()
        }
      }

      useEffect(() => {
        location();
      }, [])
  
    
    return (
        <View style={[styles.container]}>
            
            <TopCircleComponent textHeading={'Repartidor'} />
           
            
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent:'space-around',
                    width:deviceWidth,
                    marginVertical:20,
                    flexWrap:'wrap'
                }}>
                <Image
                    source={{ uri: `${base_url}/${riderProfile?.profile}` }}
                    style={{
                        width: width * 0.15,
                        height: width * 0.15,
                        borderWidth: 3,
                        borderRadius: 55 / 2,
                        borderColor: Colors.white,
                    }}
                />
                <View>
                    <Text style={{ fontSize: adjust(18)}}>
                        Bienvenido {riderProfile?.riderName}
                    </Text>
                    <Text style={{ fontSize: adjust(10), }}>
                        Revisa los nuevos pedidos cercanos
                    </Text>
                </View>
                
            </View>

            {rider_wallet?.charges_enabled && riderProfile?.wallet_id ? null : (
                <View style={styles.actionBg}>
                    <Text style={styles.actionText}>
                        {
                            'Configure su cuenta comercial de Stripe para que pueda recibir pagos'
                        }
                    </Text>
                    <TouchableOpacity onPress={createAccount} style={styles.actionButton}>
                        {loader ? (
                            <ActivityIndicator size={'small'} color="black" />
                        ) : (
                            <Text style={styles.actionButtonText}>Configuración</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={TABS}
                numColumns={2}
                renderItem={itemData => (
                    <Pressable
                        onPress={() => itemData?.item?.func()}
                        style={{
                            width: width / 2.3,
                            margin: 10,
                            minHeight: 150,
                            borderWidth: 1,
                            borderRadius: 2,
                            elevation: 2,
                            borderColor: Colors.white,
                            backgroundColor: Colors.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {itemData?.item?.icon}
                        <Text
                            style={{
                                ...CommonStyles.fontFamily,
                                color: Colors.primarySolid,
                                fontSize: 18,
                                marginVertical: 5,
                            }}>
                            {itemData?.item?.label}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.bgColor,
        
    },
    actionBg: {
        width: '93%',
        padding: 16,
        borderWidth: 1,
        top: 10,
        borderRadius: 10,
        backgroundColor: Colors.lightRed,
        borderColor: Colors.lightRed,
        alignSelf: 'center',
        marginVertical: 10,
    },
    actionText: { color: Colors.darker, fontWeight: '300' },
    actionButton: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.alertRed,
        backgroundColor: Colors.alertRed,
        ...CommonStyles.flexCenter,
        alignSelf: 'flex-end',
        padding: 5,
        borderRadius: 4,
    },
    actionButtonText: {
        fontWeight: '300',
    },
});

export default RiderDummyScreen;
