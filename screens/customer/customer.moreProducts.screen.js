import React, { useEffect, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
    ScrollView,
    useWindowDimensions,
    PermissionsAndroid,
    FlatList,
    TextInput,
} from 'react-native';
import ProductListing from '../../components/customer-components/ProductsListing.component';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import Geolocation from '@react-native-community/geolocation';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import axios from 'axios';
import {
    customer_api_urls,
    vendor_api_urls,
} from '../../util/api/api_essentials';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import InputFieldComponent from '../../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import { getUserId } from '../../util/local-storage/auth_service';
import { useCart } from '../../hooks/useCart';
import { SearchInput } from '../../components/customer-components/SearchInput';
import DropDownPicker from 'react-native-dropdown-picker';
const SCREEN_STATES = {
    USER_LOCATION: 'User location',
    PRODUCTS: 'Products',
    CATEGORIES: 'Categories',
};
const CustomerMoreProductsScreen = props => {
    const { addItemToCart } = useCart();
    const { params } = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [comision, setComision] = useState(0);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [open, setOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [modelo, setModelo] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const cart_items = useSelector(state => state?.cart?.cart_items);
    const [isLogin, setIsLogin] = useState(false);
    const [coords, setCoords] = useState({
        longitude: 0,
        latitude: 0,
    });
    const [searchText, setSearchtext] = useState('');
    const [productFilter, setProductFilter] = useState([]);
    //Fetching user location..............................
    const getUserLocation = async () => {
        if (Platform.OS === 'ios') {
            getLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permiso de ubicaci??n',
                        message:
                            'Esta aplicaci??n necesita acceso a tu ubicaci??n' +
                            ' para que podamos saber d??nde est??s.',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await Geolocation.getCurrentPosition(res => {
                        setUserLocation(res.coords);
                        // setState(res.coords,SCREEN_STATES.USER_LOCATION);
                    });
                } else {
                    console.log('Permiso de ubicaci??n denegado');
                }
            } catch (e) {
                console.log(e);
                showToaster('No se pudo obtener la ubicaci??n actual.');
            }
        }
    };

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const currentLatitude = JSON.stringify(position.coords.latitude);
                const currentLongitude = JSON.stringify(position.coords.longitude);
                setCoords({
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                });
            },
            error => alert(error.message),
        );
        const watchID = Geolocation.watchPosition(position => {
            const currentLatitude = JSON.stringify(position.coords.latitude);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            setCoords({
                latitude: currentLatitude,
                longitude: currentLongitude,
            });
        });
        setWatchID(watchID);
    };

    useEffect(() => {
        getUserLocation();
    }, []);
    //Getting user location ends here....................

    //Get Products to show
    const getProducts = async () => {
        try {
            const apiCall = await axios.get(
                `${customer_api_urls.get_category_products}/${params?.category?._id}`,
            );

            const getUser = await getUserId();

            setIsLogin(getUser);

            setProducts(apiCall.data.data);
            //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
            //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
    
        } catch (e) {
            showToaster('Algo sali?? mal. Por favor, vuelva a intentarlo');
        }
    };

    const getComision = async () => {
        try {
            const getFee = await axios.get(customer_api_urls?.get_fees);
            setComision(getFee.data.data[0]?.besseri_comission);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        getComision();
    }, []);

    useEffect(() => {
        makerFilter();
    }, [products,valueMaker,valueModel])
    

    useEffect(() => {
        if (searchText.length > 1) {
            searchCategoria();
        }else{
            getProducts()
        }
    }, [searchText]);

    const searchCategoria = () => {
        let itemData;

        const search = products.filter(item => {
            itemData = item.name ? item?.name.toLowerCase() : ''.toLowerCase();
            let searchTextData = searchText.toLowerCase();
            return itemData.indexOf(searchTextData) > -1;
        });

        setProductFilter(search);
    };

    const makerFilter = () => {
       
        if (valueMaker) {
            if (valueModel) {
               
                let itemData;
                let itemModel;
                const marca = products.filter((item) => {
                    itemData = item.maker ? item?.maker?._id : '';
                    let searchTextData = valueMaker;
                   
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                const modelo = marca.filter((item) => {
                    console.log(item.model._id);
                    itemModel = item.model ? item?.model?._id : '';
                    let searchTextData = valueModel;
                   
                    return itemModel.indexOf(searchTextData) > -1;
                })

                setProductFilter(modelo ? modelo : []);
               
               
            } else {
                const marca = products.filter((item) => {
                    let itemData = item.maker ? item?.maker?._id : '';
                    let searchTextData = valueMaker;
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                setProductFilter(marca ? marca : []);
            }
            
          
        }else{  
           
            setProductFilter(products)
        }
       
    };

    const goCart = () => {
        props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK);
    };

    const getMarcas = async () => {
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers);
            if (apiCall.status == 200) {
                setMarcas(apiCall.data?.data);
            } else {
                setMarcas([]);
                showToaster('No tienes conexion a la red');
            }
        } catch (error) {
            console.log(error);
            setMarcas([]);
        }
        setIsLoading(false);
    };

    const getModelo = async id => {
        try {
            setIsLoading(true);
            const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`);
            setIsLoading(false);
            if (apiCall?.status == 200) {
                setModelo(apiCall.data.data);
            }
        } catch (e) {
            setIsLoading(false);
            alert('Algo sali?? mal');
        }
    };

    useEffect(() => {
        getMarcas();
    }, []);

    useEffect(() => {
        if (valueMaker) {
            getModelo(valueMaker);
        }
    }, [valueMaker]);

    return (
        <View style={{ ...CommonStyles.flexOne }}>
            <View style={{ flex: 1 }}>
                <HeaderBackground />
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <MaterialCommunityIcons
                            name="keyboard-backspace"
                            color={Colors.white}
                            size={25}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goCart}>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK)} > */}
                        <MaterialCommunityIcons
                            color={Colors.white}
                            size={30}
                            name="cart"
                        />
                        {/* </TouchableOpacity> */}
                        {cart_items.length > 0 ? (
                            <View style={styles.cartItemsLengthWrapper}>
                                <Text style={styles.cartItemsLengthWrapperText}>
                                    {cart_items.length}
                                </Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '95%',
                        height: 45,
                        borderWidth: 1,
                        borderColor: Colors.light,
                        backgroundColor: Colors.light,
                        alignSelf: 'center',
                        margin: 20,
                        ...CommonStyles.flexDirectionRow,
                        ...CommonStyles.horizontalCenter,
                    }}>
                    <Ionicons
                        style={{ marginLeft: 10, left: 5 }}
                        color={Colors.dark}
                        size={25}
                        name="search"
                    />
                    <SearchInput onDebounce={value => setSearchtext(value)} />
                </View>
                <Text
                    style={{
                        fontSize: 15,
                        ...CommonStyles.fontFamily,
                        paddingLeft: 10,
                        bottom: 10,
                    }}>
                    Productos por : {params?.category?.name}
                </Text>

                
                <View style={Platform.OS === 'ios' ? styles.filterContainer : styles.filterContainer2}  >
                    <DropDownPicker
                        open={open}
                        value={valueMaker}
                        items={marcas}
                        setOpen={setOpen}
                        setValue={setValueMaker}
                        setItems={setMarcas}
                        containerStyle={styles.picker}
                        placeholder="Marca"
                        schema={{ label: 'name', value: '_id', testID: '_id' }}
                    />

                    {modelo ? (
                        <DropDownPicker
                            open={openModel}
                            value={valueModel}
                            items={modelo}
                            setOpen={setOpenModel}
                            setValue={setValueModel}
                            setItems={setModelo}
                            containerStyle={styles.picker}
                            placeholder="Modelo"
                            schema={{ label: 'name', value: '_id', testID: '_id' }}
                        />
                    ) : (
                        <View style={styles.picker} />
                    )}
                </View>

                

                <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}>
                        {productFilter.map(item => (
                            <View key={item._id}>
                                <ProductCardComponent
                                    onAddToCart={() => addItemToCart(item)}
                                    data={item}
                                    cartProduct={false}
                                    onViewDetail={() => {
                                        props?.navigation.navigate(
                                            CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,
                                            {
                                                product: item,
                                                comision: comision,
                                            },
                                        );
                                    }}
                                    comision={comision}
                                />
                            </View>
                        ))}
                    </View>

                    <View style={{ width: deviceWidth, height: deviceHeight * 0.05 }} />
                </ScrollView>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    categoryButton: {
        padding: 10,
        backgroundColor: Colors.primaryColor,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        ...CommonStyles.flexCenter,
        margin: 5,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    categoryButtonText: {
        ...CommonStyles.fontFamily,
        color: Colors.white,
        fontSize: 15,
    },
    offerCardImg: {
        width: '93%',
        height: 170,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 10,
    },
    header: {
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,
        width: deviceWidth,

        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    cartItemsLengthWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 20 / 2,
        borderColor: Colors.red,
        backgroundColor: 'red',
        ...CommonStyles.flexCenter,
    },
    cartItemsLengthWrapperText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    filterContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        // zIndex:2
       
      },
      filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        zIndex:20,
        
        
      },
    picker: {
        width: deviceWidth / 2.2,
    },
});
export default CustomerMoreProductsScreen;
