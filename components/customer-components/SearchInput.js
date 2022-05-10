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
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export const SearchInput = ({ onDebounce, navigation, loading }) => {
    const [textValue, setTextValue] = useState('');

    const deboncedValue = useDebouncedValue(textValue);

    useEffect(() => {
        onDebounce(deboncedValue);
    }, [deboncedValue]);

    return (
        <>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={textValue}
                onChangeText={setTextValue}
                placeholder={`Buscar`}
                placeholderTextColor={'grey'}
                style={{
                    paddingLeft: 10,
                    color: 'grey',
                    flex: 1,
                }}
            />
            {loading ? (
                <SpinKit
                    type="ThreeBounce"
                    isVisible={loading}
                    color={Colors.primarySolid}
                    size={30}
                />
            ) : null}
        </>
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
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
