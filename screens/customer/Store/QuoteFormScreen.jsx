import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Dimensions, Pressable, Animated, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../util/styles/colors';
import { SelectCar } from '../../../components/Customer/SelectCar';
import { showToaster } from '../../../util/constants';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { Box, Center, CheckIcon, ScrollView, Select, useColorModeValue } from 'native-base';
import { DropdownSelect } from '../../../components/Customer/DropdownSelect';
import { adjust, deviceWidth } from '../../../util/Dimentions';
import { useSelector } from 'react-redux';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUser } from '../../../util/local-storage/auth_service';

import { TabView, SceneMap } from 'react-native-tab-view';
import HomeStoreScreen from './HomeStoreScreen';

const FirstRoute = () => {
    const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    addressId:''
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const {  addresses,marcaValue,modeloValue,yearValue } = useSelector(state => state.user);



  const handleChange = (value, name) => {

    
    setFormData({ ...formData, [name]: value });
  };


  const getCategories = async () => {
    try {

      setIsLoading(true)
      const url = `${vendor_api_urls.get_categories}`

      const apiCall = await axios.get(url)
      setCategories(apiCall?.data?.data)

      setIsLoading(false)
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false)
      const errorMessage = error?.response?.data?.message ? error?.response?.data?.message : "Error de conexión";

      showToaster(errorMessage);
    }
  }

  const getSubCategories = async (categoryId) => {
    try {

      const apiCall = await axios.get(
        `${vendor_api_urls.get_sub_categories}/${categoryId}`,
      );



      if (apiCall?.status == api_statuses?.success) {

        setSubcategories(apiCall.data.data);
      }




    } catch (error) {
// console.log(error);

      showToaster('No hay conexion con el servidor')

    }
  };

  
  
  const handleSubmit = async() => {
    try {

      setIsLoading(true)
      const findAddress = typeof formData.addressId === 'number' ?  addresses[formData.addressId - 1]  : addresses.find(address => address._id === formData.addressId);

      const user = await getUser();

       if (Object.values(formData).some(value => value === '') || !marcaValue || !modeloValue || !yearValue) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
        setIsLoading(false)
      return;
    }

      const data = { 
        category : formData.category, 
        subCategory:formData.subCategory, 
        maker:marcaValue, 
        model:modeloValue, 
        year:yearValue,
        userId:user?._id,
        address:findAddress
      }



      const url = `${customer_api_urls.search_or_quote}`;
      const apiCall = await axios.post(url,data)

      if (apiCall) {
       showToaster('Solicitud de cotización enviada correctamente')
       navigation.goBack()
       setFormData({
         category: '',
          subCategory: '',
          addressId:''
          }
      )
      }
      
       setIsLoading(false)
    } catch (error) {
      console.log(error);
      
       showToaster('Error al enviar la solicitud de cotización')
       setIsLoading(false)
      
    }
   

  
  };



  useEffect(() => {
    getCategories()
  }, [])

  useEffect(() => {
    if (formData.category) {
      getSubCategories(formData.category)
    }

  }, [formData.category])

  return (
    <Box flex={1} >
      <ScrollView>
        <Text style={styles.title}>¿QUÉ REFACCIÓN QUIERES COTIZAR?</Text>
        <Text style={styles.label}>Selecciona el vehiculo:</Text>
        <View style={{ marginBottom: 20,borderWidth:0.5,borderRadius:10 }}>
          <SelectCar reset={false} />
        </View>

        <View 
        // style={{width:deviceWidth * 0.9 }} 
        >
          {/* <Text style={styles.label}>Selecciona la categoria del producto</Text> */}

          <DropdownSelect
            items={categories}
            onChange={handleChange}
            inp={'category'}
            value={formData.category}
            label="name"
            placeholder={'Selecciona la categoria'}
            w={'100%'}
          />

          {/* <Text style={styles.label}>Selecciona la subcategoría del producto</Text> */}
          <DropdownSelect
            items={subcategories}
            onChange={handleChange}
            inp={'subCategory'}
            value={formData.subCategory}
            label="name"
            placeholder={'Selecciona la subcategoría'}
             w={'100%'}
          />
          

          <View>
                      <Text style={styles.label}>¿ADONDE LA ENVIARIAMOS?</Text>
                <Select
            selectedValue={ formData?.addressId}
            defaultValue={formData?.addressId}
            minWidth={'100%'}
            accessibilityLabel="Elegir direccion"
            placeholder={'Elegir direccion'}
            placeholderTextColor={Colors.white}
            variant='unstyled'
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}

            onValueChange={(newAddress) => handleChange(newAddress,'addressId')}
            borderColor={Colors.white}
            color={Colors.white}
            backgroundColor={Colors.bgColor}
            borderWidth={'1px'}
        borderRadius={'10px'}
            size={'xs'}
            _text={{
              numberOfLines: 1,
              ellipsizeMode: 'clip',
            }}
          >
            {
              addresses.length > 0 && addresses.map((item) => (
                <Select.Item 
                key={item._id} 
                label={item.formatted_address} 
                value={item._id}  
                
            
                />
              ))
            }


          </Select>
          </View>

          <View style={{marginTop:50}} >
          <BtnPrincipal
          text={'COTIZAR A REFACCIONARIAS'}
          onPress={handleSubmit}
          marginHorizontal={0}
          />

        </View>
        </View>


     
         
      </ScrollView>
    </Box>
  )
}

const SecondRoute = () => <HomeStoreScreen/>



const initialLayout = {
  width: Dimensions.get('window').width
};
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute
});




export const QuoteFormScreen = ({navigation}) => {

const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{
    key: 'first',
    title: 'Cotizar'
  }, {
    key: 'second',
    title: 'Tienda'
  }]);

  const renderTabBar = props => {
   
    return <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {


        const borderColor = index === i ? Colors.black : useColorModeValue('coolGray.200', 'gray.200');
        return (
          <Box 
          key={i} 
          borderBottomWidth="3" 
          borderColor={borderColor} 
          flex={1} 
          alignItems="center" 
          // p="3"
          py={"1"} 
          cursor="pointer"
          backgroundColor={Colors.white}
          >
              <Pressable onPress={() => {
            
            setIndex(i);
          }}>
                <Text 
                style={{
                  color:Colors.black,
                  fontWeight:'bold',
                  fontSize:18
                }}
                >{route.title}</Text>
              </Pressable>
            </Box>
        )
      })}
      </Box>;
  };



  return (
    <View style={styles.container}>
      <TabView 
      navigationState={{
        index,
        routes
      }} 
      renderScene={renderScene} 
      renderTabBar={renderTabBar} 
      onIndexChange={setIndex} 
      initialLayout={initialLayout} 
      />
      

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:10,
    flex: 1,
    // justifyContent: 'center',
    // padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: adjust(16),
    fontWeight: 'bold',
    color: Colors.black
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    textAlign:'left'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});