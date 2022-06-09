import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,
    useWindowDimensions,
    PermissionsAndroid,
    FlatList,
    Pressable,
    Dimensions,
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import {
    customer_api_urls,
    vendor_api_urls,
} from '../../util/api/api_essentials';
import {
    CUSTOMER_HOME_SCREEN_ROUTES,
    SHARED_ROUTES,
    showToaster,
} from '../../util/constants';
import SpinKit from 'react-native-spinkit';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useRoute } from '@react-navigation/native';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import DropDownPicker from 'react-native-dropdown-picker';
import { SearchInput } from '../../components/customer-components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import { useCart } from '../../hooks/useCart';
import { useCostos } from '../../hooks/useCostos';

export const SearchScreen = props => {
    const isServices = props.route.params.isService;

    const [searchText, setSearchtext] = useState('');
    const [open, setOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    //   const [value, setValue] = useState(null);
    //   const [valueModel, setValueModel] = useState(null);
    const {
        searchCall,
        productsData,
        servicesData,
        loading,
        marcas,
        setMarcas,
        getModelo,
        modelo,
        setModelo,
        makerFilter,
        productFilter,
        valueMaker,
        setValueMaker,
        valueModel,
        setValueModel,
    } = useSearch(isServices);
    const { addItemToCart } = useCart();
    const { comision } = useCostos();

    useEffect(() => {
        if (searchText.length > 1) {
            searchCall(searchText, isServices);
        }
    }, [searchText]);


    

    return (
        <View style={{ ...CommonStyles.flexOne, backgroundColor: Colors.white }}>
            <HeaderBackground />
            <View style={styles.header}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        padding: 10,
                    }}>
                    <Pressable onPress={() => props.navigation.goBack()}>
                        <MaterialCommunityIcon
                            name="keyboard-backspace"
                            size={30}
                            color={Colors.white}
                        />
                    </Pressable>
                    <View style={styles.top}>
                        <SearchInput onDebounce={value => setSearchtext(value)} />

                        {loading ? (
                            <SpinKit
                                type="ThreeBounce"
                                isVisible={loading}
                                color={Colors.primarySolid}
                                size={30}
                            />
                        ) : null}
                    </View>
                </View>
            </View>
            <View style={styles.filterContainer}>
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
                    style={{borderColor:'white'}}
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
                        style={{borderColor:'white'}}
                    />
                ) : (
                    <View style={styles.picker} />
                )}
            </View>
            <FlatList
                data={isServices ? productFilter : productFilter}
                keyExtractor={item => item?._id}
                renderItem={itemData => {
                    if (isServices) {
                        return (
                            <ServicesCardComponent
                                onViewDetail={() => {
                                    props?.navigation?.navigate(SHARED_ROUTES.SERVICE_DETAIL, {
                                        service: itemData?.item,
                                        isVendor: false,
                                        comision: comision,
                                    });
                                }}
                                data={itemData?.item}
                                horizontal={true}
                            />
                        );
                    } else {
                        return (
                            <ProductCardComponent
                                onViewDetail={() => {
                                    props?.navigation?.navigate(
                                        CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,
                                        {
                                            product: itemData.item,
                                            comision: comision,
                                        },
                                    );
                                }}
                                onAddToCart={() => addItemToCart(itemData.item)}
                                data={itemData?.item}
                                horizontal={true}
                            />
                        );
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: Platform.OS == 'ios' ? deviceHeight * 0.13 : deviceHeight * 0.1,
        width: deviceWidth,

        flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,
        // alignItems: 'center'
    },
    top: {
        width: '85%',
        height: 45,
        borderWidth: 1,
        borderColor: '#f8f8f8',
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        paddingLeft: 10,
        color: 'grey',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    picker: {
        width: deviceWidth / 2.2,
    },
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
        fontSize: adjust(12),
    },
    offerCardImg: {
        width: '93%',
        height: 170,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 10,
    },
    tabStyle: {
        width: deviceWidth / 3,
        paddingVertical: 10,
        borderBottomWidth: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
    },
});

