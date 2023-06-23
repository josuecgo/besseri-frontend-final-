import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,

    FlatList,
   
    ActivityIndicator,
} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import axios from 'axios';
import {
    customer_api_urls,
    vendor_api_urls,
} from '../../util/api/api_essentials';
import { useSelector } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useCart } from '../../hooks/useCart';
import { SearchInput } from '../../components/customer-components/SearchInput';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, Select } from 'native-base';
import { CarDefault } from '../../components/Customer/CarDefault';
import { matchMaker, matchModel, matchYear } from '../../util/utility-functions';



const CustomerMoreProductsScreen = props => {
    const {bottom} = useSafeAreaInsets()
    const { addItemToCart } = useCart();
    const { params } = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    // const [comision, setComision] = useState(false);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [valueYear, setValueYear] = useState("")
  
    const [marcas, setMarcas] = useState([]);
    const [modelo, setModelo] = useState(false);
   
    const cart_items = useSelector(state => state?.cart?.cart_items);
    
   
    const [searchText, setSearchtext] = useState('');
    const [productFilter, setProductFilter] = useState(false);
    const {comision,years,resetFiltro,carDefault,carCompatible} = useContext(ProductContext);


    const handleMarca = (item) => {
       
        // //console.log(item);
        setValueMaker(item)
        setValueYear('')

    }
    const handleModel = (item) => {
        setValueModel(item);

    }
    const handleYear = (item) => {
        
        setValueYear(item);

    }

    const resetFiltros = async() => {
        setValueMaker("");
        setValueModel("");
        setValueYear("")
        setModelo(false);
        getMarcas();
        getProducts();
        resetFiltro()
    }
  


    // useEffect(() => {
    //     let abortController = new AbortController();  
    //     getProducts();
    //     return () => {  
    //         abortController.abort();  
    //     }  
    // }, []);

    const getProducts = async () => {
        try {
            const apiCall = await axios.get(
                `${customer_api_urls.get_category_products}/${params?.category?._id}`,
            );

            setProducts(apiCall.data.data);
            

        } catch (e) {
            showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
    };

   


    useEffect(() => {
        let abortController = new AbortController();  
        makerFilter();
        return () => {  
            abortController.abort();  
        }  
    }, [products,valueMaker,valueModel,valueYear])
    

    useEffect(() => {
        let abortController = new AbortController();  
        if (searchText.length > 1) {
            searchCategoria();
        }else{
            getProducts()
        }
        return () => {  
            abortController.abort();
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
       
    
        let filtrado = []
        if (valueModel && valueYear && modelo) {
            let carModel = modelo.find((item) => item._id === valueModel )
            carCompatible({model:carModel,year:valueYear})
        }else{
            carCompatible(false)
        }
        if (valueMaker) {
          if (valueModel) {
           
            const modelo =  matchModel(products,valueMaker,valueModel,valueYear)
            filtrado = modelo ? modelo : []
           
           
          }else{

            const marca = matchMaker(products,valueMaker,valueYear);

            filtrado = marca ? marca : []
             
           
             
          }
    
        }else{
          filtrado = products
         
        }
    
        if (valueYear) {
            let match = matchYear(filtrado,valueModel,valueYear)
          
            setProductFilter(match)
        }else{
            setProductFilter(filtrado)
        }
       
        
        
        
       
    }




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
            // //console.log(error);
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
            alert('Algo salió mal');
        }
    };

    useEffect(() => {
        let abortController = new AbortController(); 
        getMarcas();
        return () => {  
            abortController.abort();  
        }  
    }, []);

    useEffect(() => {
        let abortController = new AbortController(); 
        if (valueMaker) {
            
            getModelo(valueMaker); 
            
        }
        return () => {  
            abortController.abort();
        }
    }, [valueMaker]);


    const renderItem = ({item}) => (
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
    );

    const memorizedValue = useMemo(() => renderItem, [productFilter]);

    useEffect(() => {
        handleMarca(carDefault?.maker?._id)
        handleYear(carDefault?.year)
    }, [carDefault])

    useEffect(() => {
      if (carDefault && modelo) {
        handleModel(carDefault?.model?._id)
      }
    }, [modelo,carDefault])
    
    
    
    return (
        <View style={{ ...CommonStyles.flexOne }}>
            <View style={{ flex: 1,paddingBottom:bottom + 80 }}>
                <HeaderBackground />
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            carCompatible(false)
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
                    <Select
                    variant='unstyled'
                    selectedValue={valueMaker}
                    minWidth={deviceWidth * 0.32}
                    accessibilityLabel="Marca"
                    placeholder="Marca"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    
                    onValueChange={itemValue => handleMarca(itemValue)}
                    style={styles.select}
                    borderColor={Colors.white}
                    backgroundColor={Colors.white}
                >
                    {
                        marcas.map((item) => <Select.Item 
                        
                        key={item._id} 
                        label={item.name} 
                        value={item._id} 
                        textTransform='uppercase' 
                        />)
                    }

                    </Select>

            

                    {modelo ? (
                    <Select
                        selectedValue={valueModel}
                        minWidth={deviceWidth * 0.33}
                        accessibilityLabel="Modelo"
                        placeholder="Modelo"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }}
                    
                        onValueChange={itemValue => handleModel(itemValue)}
                        style={styles.select}
                        borderColor={Colors.white}
                        backgroundColor={Colors.white}
                    >
                        {
                            modelo.map((item) => <Select.Item textTransform='uppercase' key={item._id} label={item.name} value={item._id} />)
                        }
                    </Select>
                    ) : (
                        <View style={styles.picker} />
                    )}

                    <Select
                        selectedValue={valueYear}
                        minWidth={deviceWidth * 0.25}
                        accessibilityLabel="Año"
                        placeholder="Año"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }}

                        onValueChange={itemValue => handleYear(itemValue)}
                        style={styles.select}
                        borderColor={Colors.white}
                        backgroundColor={Colors.white}
                    >
                        {
                            years.map((item, i) => <Select.Item key={item} label={item.toString()} value={item} />)
                        }
                    </Select>
                   
                </View>

                <View style={styles.reset} >
                    <View style={{marginVertical:10}} >
                        <CarDefault navigation={props.navigation} />
                    </View>
                    {
                        modelo && (
                        <TouchableOpacity 
                        onPress={resetFiltros}
                        style={styles.btnReset} 
                        >
                            <Text style={styles.txtReset} >Limpiar filtros</Text>
                        </TouchableOpacity>
                        
                        )
                        
                    }
                    
                </View>

                

                <View style={{  marginVertical: bottom + 20 }}>
                    {
                        productFilter && comision ? (
                            
                            <FlatList
                            data={productFilter}
                            numColumns={2}
                            keyExtractor={item => item?._id}
                            renderItem={memorizedValue}
                            ListFooterComponent={<View style={{
                                width:'100%',
                                marginBottom:bottom + 10,height:deviceHeight * 20 / 100 + bottom,backgroundColor:'red'
                                
                            }} />}
                            contentContainerStyle={{alignItems:'center'}}
                            initialNumToRender={5}
                            />
                            
                           
            
                        ):(
                        <View
                        style={{
                            alignItems:'center',
                            justifyContent: 'center',
                        }}>
                            <ActivityIndicator/>
                            <Text>Cargando</Text>                        
                        </View>
                        )
                    }
                    

                </View>
            </View>
            <View style={{ width: deviceWidth, height: deviceHeight * 0.1  }} />
              
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
    reset:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginHorizontal:10
      },
      btnReset:{
       marginVertical:10
      },
      txtReset:{
        borderBottomWidth:1,
        color:Colors.primarySolid,
        borderColor:Colors.primarySolid,
        fontSize:adjust(10)
      }
});
export default CustomerMoreProductsScreen;