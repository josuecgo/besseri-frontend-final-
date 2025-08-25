import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../util/styles/colors';
import { SelectCar } from '../../../components/Customer/SelectCar';
import { showToaster } from '../../../util/constants';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { CheckIcon, Select } from 'native-base';
import { DropdownSelect } from '../../../components/Customer/DropdownSelect';
import { deviceWidth } from '../../../util/Dimentions';
import { useSelector } from 'react-redux';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUser } from '../../../util/local-storage/auth_service';



export const QuoteFormScreen = () => {
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
      const findAddress = addresses[formData.addressId - 1]
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
       
       setFormData({
         category: '',
          subCategory: '',
          addressId:''
          }
      )
      }
      
       setIsLoading(false)
    } catch (error) {
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
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Cotización</Text>

 <Text style={styles.label}>Selecciona el vehiculo:</Text>
      <View style={{ marginBottom: 20,borderWidth:0.5,borderRadius:10 }}>
       

        <SelectCar reset={false} />
      </View>

      <View>
        <Text style={styles.label}>Selecciona la categoria del producto</Text>

        <DropdownSelect
          items={categories}
          onChange={handleChange}
          inp={'category'}
          value={formData.category}
          label="name"
          placeholder={'Seleccione'}
          w={deviceWidth * 0.89}
        />

        <Text style={styles.label}>Selecciona la subcategoría del producto</Text>
        <DropdownSelect
          items={subcategories}
          onChange={handleChange}
          inp={'subCategory'}
          value={formData.subCategory}
          label="name"
          placeholder={'Seleccione'}
          w={deviceWidth * 0.89}
        />
        
        <Text style={styles.label}>Selecciona tu direccion</Text>
              <Select
          selectedValue={ formData?.addressId}
          defaultValue={formData?.addressId}
          minWidth={'40%'}
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
          size={'xs'}
          // dropdownIcon={<MaterialCommunityIcons name="menu-down" size={23} color={Colors.white} />}
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
        text={'Solicitar cotización'}
        onPress={handleSubmit}
        />

      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 20,
    // backgroundColor: '#000000ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.black
  },
  label: {
    fontSize: 16,

    color: Colors.black
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