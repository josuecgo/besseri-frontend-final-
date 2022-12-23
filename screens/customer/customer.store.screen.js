import React, { useState, useEffect, useContext } from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonStyles from '../../util/styles/styles';
import ProductCardComponent from '../../components/customer-components/product-card.component';
import ButtonComponent from '../../components/button/button.component';
import {
  CUSTOMER_HOME_SCREEN_ROUTES,
  SHARED_ROUTES,
} from '../../util/constants';
import {  useSelector } from 'react-redux';
import { CheckIcon, Select } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

import { base_url } from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import ServicesCardComponent from '../../components/customer-components/ServicesCard.component';
import {  deviceHeight, deviceWidth } from '../../util/Dimentions';
import { useCart } from '../../hooks/useCart';

import { useSearchStore } from '../../hooks/useSearchStore';
import { Empty } from '../../components/Customer/Empty';
import { ProductContext } from '../../util/context/Product/ProductContext';

const CustomerStoreScreen = props => {
  const { params } = useRoute();

  const [selectedCategoryId, setSelectedCategoryId] = useState('products');
  // const [isLoading, setIsLoading] = useState(false);

  const cart_item_ids = useSelector(state => state?.cart?.cart_items_ids);
  const { addItemToCart } = useCart();


  const [searchText, setSearchText] = useState('');
  const isServices = selectedCategoryId === 'services' ? true : false;
 
  const {
    store,
    comision,
    years
  } = useContext(ProductContext)

  const {
    marcas,
    resetFiltros,
    modelo,
    productFilter,
    searchCallStore,
    services,
    getStore,
    isLoading,
    valueMaker,
    valueModel,
    valueYear,
    handleMarca,
    handleModel,
    handleYear
  } = useSearchStore();

  useEffect(() => {
    searchCallStore(searchText, isServices);
  }, [searchText]);

  const goArrowBack = () => {
    props.navigation.pop();
  };


  // console.log(productFiltradoStore[0]?.business_id);
  // console.log(params?.data);
  useEffect(() => {
    if (params?.data) {

      getStore(params?.data);
    }

  }, [params?.data]);




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

      <View style={{flex:1}} >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedCategoryId('products');
            }}
            style={{
              width: deviceWidth,
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
        
        </View>

        {
          isLoading ? (
            <LoaderComponent isVisible={isLoading} />
            
          ) : (
            <>
              <View style={
                Platform.OS === 'ios' ? styles.filterContainer : styles.filterContainer2
                }>
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
                            modelo.map((item) => <Select.Item 
                            key={item._id} 
                            label={item.name} 
                            value={item._id} 
                            textTransform='uppercase'
                            />)
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
              <TouchableOpacity
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', right: 5 }}
                onPress={resetFiltros}>
                <Text>Restablecer filtros</Text>
              </TouchableOpacity>


              <View style={{ marginTop: 3 }}>

                <FlatList
                  ListEmptyComponent={<Empty />}
                  data={selectedCategoryId == 'products' ? productFilter : services}
                  contentContainerStyle={{ marginTop: 20, flexGrow: 1 }}
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
                  ListFooterComponent={()=>(<View style={{height:deviceHeight*0.20,width:'100%'}} />)}
                />


              </View>
            </>
          )
        }

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
    //zIndex: 20,
  },
  header: {
    ...CommonStyles.flexDirectionRow,
    ...CommonStyles.horizontalCenter,
    ...CommonStyles.justifySpaceBetween,
  },
  img: { width: '100%', height: 100 },
  ImageContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
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
    zIndex: 20,
  },
  picker: {
    width: deviceWidth / 2.5,
    marginHorizontal:2,
    // zIndex:2
  },
});

export default CustomerStoreScreen;
