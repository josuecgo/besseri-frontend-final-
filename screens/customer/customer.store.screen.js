import React, { useState, useEffect } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
    Platform,
    ImageBackground,
    FlatList,
    Alert,
} from 'react-native';
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import {
    CUSTOMER_HOME_SCREEN_ROUTES,
    SHARED_ROUTES,
    showToaster,
} from '../../util/constants';
import { useDispatch, useSelector } from 'react-redux';
import * as CartActions from '../../util/ReduxStore/Actions/CustomerActions/CartActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RatingComponent from '../../components/Ratings/rating.component';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { base_url, customer_api_urls } from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';
import { adjust, deviceWidth } from '../../util/Dimentions';
import { useCart } from '../../hooks/useCart';
import DropDownPicker from 'react-native-dropdown-picker';
import { SearchComponent } from '../../components/Customer/SearchComponent';
import { useSearchStore } from '../../hooks/useSearchStore';
import { Empty } from '../../components/Customer/Empty';

const CustomerStoreScreen = props => {
    const { params } = useRoute();

    const [selectedCategoryId, setSelectedCategoryId] = useState('products');
    // const [isLoading, setIsLoading] = useState(false);

    const cart_item_ids = useSelector(state => state?.cart?.cart_items_ids);
    const { addItemToCart } = useCart();

    const store = params.data;
    const [searchText, setSearchText] = useState('');
    const isServices = selectedCategoryId === 'services' ? true : false;
    const [openModel, setOpenModel] = useState(false);
    const [open, setOpen] = useState(false);
    const [openCategorias, setOpenCategorias] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
    ]);
    const {
        marcas,
        valueCategorias,
        setValueCategorias,
        setMarcas,
        resetFiltros,
        modelo,
        setModelo,
        setCategories,
        productFilter,
        valueMaker,
        setValueMaker,
        valueModel,
        setValueModel,
        searchCallStore,
        isLoading,
        comision,
        categories,
        services,
    } = useSearchStore(store);

    useEffect(() => {
        searchCallStore(searchText, isServices);
    }, [searchText]);
    console.log(props.navigation);
    const goArrowBack = () => {
        
        props.navigation.pop()
    }
    return (
        <View style={styles.container}>
            {/* <LoaderComponent isVisible={isLoading} /> */}
            <ImageBackground
                source={{ uri: `${base_url}/${store?.logo}` }}
                style={styles.img}>
                <View style={styles.ImageContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={goArrowBack}
                            style={styles.headerBackButton}>
                            <Ionicons
                                name="md-chevron-back"
                                color={Colors.primarySolid}
                                size={16}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <View style={{ marginHorizontal: 10 }}>
                <Text style={{ ...CommonStyles.fontFamily, fontSize: 20 }}>
                    {store?.storeName}
                </Text>
                {/* <Text style={{color: 'grey', fontSize: 12}}>
          a 0.3 km |{' '}
          <Text style={{fontWeight: 'bold'}}> ${minimumPrice} minimum</Text>
        </Text> */}
                {/* <RatingComponent numOfStars={4}/> */}
                <View
                    style={{
                        ...CommonStyles.flexDirectionRow,
                        ...CommonStyles.horizontalCenter,
                    }}>
                    <Ionicons
                        name="location-sharp"
                        color={Colors.primaryColor}
                        size={20}
                    />
                    <Text
                        style={{ ...CommonStyles.fontFamily, color: 'grey', fontSize: 12 }}>
                        {store?.address}
                    </Text>
                </View>
            </View>

            <View style={{ elevation: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategoryId('products');
                        }}
                        style={{
                            width: deviceWidth / 2,
                            alignItems: 'center',
                            padding: 10,
                            borderBottomWidth: 3,
                            height: 50,
                            borderBottomColor:
                                selectedCategoryId == 'products'
                                    ? Colors.primarySolid
                                    : 'white',
                        }}>
                        <Text
                            style={{
                                ...CommonStyles.fontFamily,
                                color:
                                    selectedCategoryId == 'products'
                                        ? Colors.primarySolid
                                        : 'black',
                            }}>
                            {'Productos'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategoryId('services');
                        }}
                        style={{
                            width: deviceWidth / 2,
                            alignItems: 'center',
                            padding: 10,
                            borderBottomWidth: 3,
                            height: 50,
                            borderBottomColor:
                                selectedCategoryId == 'services'
                                    ? Colors.primarySolid
                                    : 'white',
                        }}>
                        <Text
                            style={{
                                ...CommonStyles.fontFamily,
                                color:
                                    selectedCategoryId == 'services'
                                        ? Colors.primarySolid
                                        : 'black',
                            }}>
                            {'Servicios'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10,
                                zIndex:23
                            }}>
                            <SearchComponent setSearchText={setSearchText} />

                            <View style={styles.filterContent}>
                                <DropDownPicker
                                    open={openCategorias}
                                    value={valueCategorias}
                                    items={categories}
                                    setOpen={setOpenCategorias}
                                    setValue={setValueCategorias}
                                    setItems={setCategories}
                                    containerStyle={styles.picker}
                                    placeholder="Categorias"
                                    schema={{ label: 'name', value: '_id', testID: '_id' }}
                                    labelStyle={{ fontSize: adjust(8) }}
                                    listItemLabelStyle={{ fontSize: adjust(8) }}
                                    arrowIconStyle={{ height: 12, width: 12 }}
                                    textStyle={{
                                        fontSize: adjust(8),
                                    }}
                                    labelProps={{
                                        numberOfLines: 1,
                                    }}
                                />

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
                                    labelStyle={{ fontSize: adjust(8) }}
                                    listItemLabelStyle={{ fontSize: adjust(8) }}
                                    arrowIconStyle={{ height: 12, width: 12 }}
                                    textStyle={{
                                        fontSize: adjust(8),
                                    }}
                                    labelProps={{
                                        numberOfLines: 1,
                                    }}
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
                                        labelStyle={{ fontSize: adjust(8) }}
                                        listItemLabelStyle={{ fontSize: adjust(8) }}
                                        arrowIconStyle={{ height: 12, width: 12 }}
                                        textStyle={{
                                            fontSize: adjust(8),
                                        }}
                                        labelProps={{
                                            numberOfLines: 1,
                                        }}
                                    />
                                ) : (
                                    <View style={styles.picker} />
                                )}
                            </View>
                            <TouchableOpacity onPress={resetFiltros}>
                                <Text>Restablecer filtros</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{zIndex:1}} >
                           <FlatList
                            ListEmptyComponent={<Empty/>}
                            data={selectedCategoryId == 'products' ? productFilter : services}
                            contentContainerStyle={{ marginTop: 10, flexGrow: 1 , zIndex:1 }}
                            renderItem={({ item, index }) => {
                                if (selectedCategoryId == 'products') {
                                    return (
                                        <ProductCardComponent
                                            onViewDetail={() => {
                                                props?.navigation.navigate(
                                                    CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL,
                                                    {
                                                        product: item,
                                                        comision,
                                                    },
                                                );
                                            }}
                                            onAddToCart={() => {
                                                addItemToCart(item);
                                            }}
                                            inCart={cart_item_ids?.includes(item?._id)}
                                            horizontal={true}
                                            data={item}
                                        />
                                    );
                                } else {
                                    return (
                                        <ServicesCardComponent
                                            onViewDetail={() => {
                                                props?.navigation?.navigate(
                                                    SHARED_ROUTES.SERVICE_DETAIL,
                                                    {
                                                        service: item,
                                                        isVendor: false,
                                                        comision,
                                                    },
                                                );
                                            }}
                                            onAddToCart={() => {
                                                addItemToCart(item);
                                            }}
                                            inCart={cart_item_ids?.includes(item?._id)}
                                            horizontal={true}
                                            data={item}
                                        />
                                    );
                                }
                            }}
                        /> 
                        </View>
                        

                {/* </ScrollView> */}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    headerBackButton: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: Colors.white,
        backgroundColor: Colors.white,
        ...CommonStyles.flexCenter,
        borderRadius: 35 / 2,
        marginHorizontal: Platform.OS === 'ios' ? 20 : 14,
        marginVertical: Platform.OS === 'ios' ? 35 : 14,
        zIndex:20
    },
    header: {
        ...CommonStyles.flexDirectionRow,
        ...CommonStyles.horizontalCenter,
        ...CommonStyles.justifySpaceBetween,
    },
    img: { width: '100%', height: 100 },
    ImageContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    filterContent: {
        flexDirection: 'row',
        marginVertical: 5,
        zIndex:20
    },
    picker: {
        width: deviceWidth / 3.5,

        marginHorizontal: 2,
    },
});

export default CustomerStoreScreen;
