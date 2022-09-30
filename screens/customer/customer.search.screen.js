import React, { useEffect, useState } from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    Image, ScrollView, 
    useWindowDimensions, 
    PermissionsAndroid, 
    FlatList, Pressable, Dimensions } from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import { customer_api_urls, vendor_api_urls } from '../../util/api/api_essentials';
import { CUSTOMER_HOME_SCREEN_ROUTES, SHARED_ROUTES, showToaster } from '../../util/constants';
import SpinKit from 'react-native-spinkit'
import ProductCardComponent from '../../components/customer-components/product-card.component';
import * as CartActions  from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useRoute } from '@react-navigation/native';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import DropDownPicker from 'react-native-dropdown-picker';


const CustomerSearchScreen = React.memo((props) => {

    const dispatch = useDispatch()
    const [selectedTab,setSelectedTab] = useState('Products');
    const {params} = useRoute();
    const isServices = props.route.params.isService;
    // const isServices = false;
    const isProductTab = selectedTab == 'Products';
    const isServicesTab  = selectedTab == 'Services';
    const isStoresTab = selectedTab == 'Stores';
    const [searchText,setSearchtext] = useState('');
    const [productsData,setProductsData] = useState(null);
    const [servicesData,setServicesData] = useState(null);
    const [loading,setLoading] = useState(false);
    const comision = props.route.params.comision;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'}
    ]);
    const [marcas, setMarcas] = useState([])

   
    
    React.useLayoutEffect(() => {
        getMakersModels();
    });
    const getMakersModels = async() => {

        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            if (apiCall.status == 200) {
                setMarcas(apiCall.data?.data)
            } else {
                
            }
        } catch (error) {
            // console.log(error);
        }

    }
 

 
    const searchCall = async(st) => {
        
        try 
        {
        setLoading(true);
        if(isServices) {
            const apiCall = await axios.post(customer_api_urls?.service_search,{
            searchText:st,
        });
        setServicesData(apiCall.data.Data);
        setLoading(false);

        } else {
            const apiCall = await axios.post(customer_api_urls?.search_api,{
            searchText:st,
        });
        setProductsData(apiCall.data.Data);
        setLoading(false);

        }
        setLoading(false);
        } catch(e) {
            // console.log(e?.response?.data)
            setLoading(false);
        showToaster('something went wrong')
        }
    } 
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const addItemToCart = (item) => {
        if(cartProductIds.includes(item?._id)) {
        dispatch(CartActions.removeItemFromCart(item));
        return;
        }
        dispatch(CartActions.addItemToCart({
        ...item,
        quantity:1
        }))
    }


    return (
        <View style={{ ...CommonStyles.flexOne,backgroundColor:Colors.white }}>
        <HeaderBackground/>
        <View style={styles.header}>
            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',padding:10}}>
                <Pressable onPress={() => props.navigation.goBack()}>
                    <MaterialCommunityIcon  name='keyboard-backspace' size={30} color={Colors.white}/>
                </Pressable>
                <View style={{
                    width:'85%',height:45,
                    borderWidth:1,
                    borderColor:'#f8f8f8',
                    backgroundColor:'#f8f8f8',
                    borderRadius:5,
                    paddingLeft:10,
                    color:'grey',
                    flexDirection:'row',
                    justifyContent:'space-between',alignItems:'center'
                }}>
                <TextInput
                value={searchText}
                onChangeText={st => {
                    setSearchtext(st);
                    setTimeout(() => {
                        searchCall(st);
                    }, 3000);
                }}
                placeholder={`Buscar`}
                placeholderTextColor={'grey'}
                style={{
                    paddingLeft:10,
                    color:'grey',
                    flex:1
                }}/>
                {loading ?   <SpinKit
                    type='ThreeBounce'
                    isVisible={loading}
                    color={Colors.primarySolid}
                    size={30}
                    /> : null}
                </View>
            </View>
           
        </View>
        
        <View style={styles.filterContainer} >
                <DropDownPicker
                open={open}
                value={value}
                items={marcas}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={styles.picker}
                placeholder='Marca'
                schema={{label:'name', value:'name',testID:'_id'}}
                />
        </View>
        <FlatList
        data={isServices ? servicesData : productsData}
        keyExtractor={item => item?._id}
        renderItem={(itemData) => {
            if(isServices) {
            return (
            <ServicesCardComponent
            onViewDetail={() => {
                props?.navigation?.navigate(SHARED_ROUTES.SERVICE_DETAIL,{
                service:itemData?.item,
                isVendor:false,
                comision:comision
                });
            }}
            data={itemData?.item} horizontal={true}/>
            )
            } else {
            return (
            <ProductCardComponent
            onViewDetail={() => {
                props?.navigation?.navigate(CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,{
                product:itemData.item,
                comision:comision
                });
            }}
            onAddToCart={() => addItemToCart(itemData.item)} data={itemData?.item} horizontal={true}/>
            )
            }
        }}
        />
        </View>
    );
})


const styles = StyleSheet.create({
    header: {
        height: Platform.OS == 'ios' ? deviceHeight * 0.13  : deviceHeight * 0.10,
        width: deviceWidth,
    
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,
        // alignItems: 'center'
    },
    filterContainer:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    picker:{
        width:deviceWidth / 2.2
    },
    categoryButton: {
        padding: 10,
        backgroundColor: Colors.primaryColor,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        ...CommonStyles.flexCenter,
        margin: 5,
        borderRadius: 10,
        paddingHorizontal: 15
    },
    categoryButtonText: {
        ...CommonStyles.fontFamily,
        color: Colors.white, fontSize: 15,

    },
    offerCardImg: {
        width: '93%',
        height: 170,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 10
    },
    tabStyle:{
        width:Dimensions.get('screen').width/3,paddingVertical:10,borderBottomWidth:2.5,justifyContent:'center',alignItems:'center',
        borderColor:'white'
    }
})
export default CustomerSearchScreen;
