import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItemCar } from '../../../components/ItemCar'
import { CarsEmpty } from '../../../components/Empty/CarsEmpty'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { getUserId } from '../../../util/local-storage/auth_service'
import { showAlertLogin, showAlertMsg, showToaster } from '../../../util/constants'
import CommonStyles from '../../../util/styles/styles'
import { useSearchStore } from '../../../hooks/useSearchStore'
import { Button, CheckIcon, FormControl, Input, Modal, Select } from 'native-base'
import { useState } from 'react'
import { deviceWidth } from '../../../util/Dimentions'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { useInfoUser } from '../../../hooks/useInfoUsers'


export const MyCarsScreen = ({ navigation }) => {
  const {
    handleMarca,
    handleModel,
    handleYear,
    resetFiltros
  } = useSearchStore();
  const { 
    cars,marcas, marcaValue, modelos,
    modeloValue, years, yearValue, 
    isLoading,userId 
  } = useSelector(state => state.user);
  const { getUserInfo } = useInfoUser()
  const [km, setKm] = useState('')



  const [showModal, setShowModal] = useState(false)


  const crearVehiculo = async () => {
    const id = await getUserId()
    resetFiltros()
    setShowModal(false)
    setKm('')
    if (!id) {
      let goLogin = () => navigation.navigate('AuthStack')


      showAlertLogin(goLogin)
    }
    setShowModal(true)


  }

  const guardarCar = async () => {

    if (!marcaValue || !modeloValue || !yearValue) {

      showToaster('Faltan campos.');
      return
    }
    try {
     
      const newMarca = marcas.find((el) => el._id === marcaValue);
      const newModel = modelos.find((el) => el._id === modeloValue);
      const data = {
        userId,
        maker: newMarca,
        model: newModel,
        type: newModel?.type?._id,
        year: yearValue,
        km,
      }
     
      const apiCall = await axios.post(`${customer_api_urls.create_car}`,data);
      
      if (apiCall.data.success) {
        getUserInfo();
        showToaster(apiCall?.data?.message)
      }
      resetFiltros()
      setKm('')
      setShowModal(false)
    } catch (error) {
       
      showToaster(error?.response?.data?.message)
      
    }


  }


  const closeModal = () => {
    resetFiltros()
    setKm('')
    setShowModal(false)
  }

  return (
    <View style={styles.cars} >

      <FlatList
        data={cars}
        renderItem={({ item }) => <ItemCar data={item} />}
        keyExtractor={item => item._id}
        ListEmptyComponent={<CarsEmpty />}
        showsVerticalScrollIndicator={false}
      />

      <ModalCreateCar
        showModal={showModal}
        setShowModal={setShowModal}
        marcas={marcas}
        modelo={modelos}
        years={years}
        valueMaker={marcaValue}
        valueModel={modeloValue}
        valueYear={yearValue}
        handleMarca={handleMarca}
        handleModel={handleModel}
        handleYear={handleYear}
        resetFiltros={closeModal}
        km={km}
        setKm={setKm}

        guardarCar={guardarCar}
      />

      <BtnPrincipal
        onPress={crearVehiculo}
        text={'Agregar nuevo vehiculo'}
        
      />

      <View style={{ width: 10, height: 15 }} />
    </View>
  )
}

const ModalCreateCar = ({
  showModal,setShowModal,marcas,
  modelo,years,valueMaker,valueModel,
  valueYear,handleMarca,handleModel,handleYear,
  resetFiltros,guardarCar,km,setKm
}) => {

  const handleTextChange = (text) => {
    const regex = /^[0-9]*$/; // Expresión regular que solo permite números
    if (regex.test(text)) {
      setKm(text);
    }
  };

  return (
    <Modal isOpen={showModal} 
    onClose={() => {
      setShowModal(false)
      resetFiltros()
    }}
   
    >
      <Modal.Content 
       backgroundColor={Colors.bgColor}
      >
        <Modal.CloseButton />
        <Modal.Header
        backgroundColor={Colors.bgColor}
        _text={{ style: styles.label }}
        >Crea tú auto</Modal.Header>
        <Modal.Body>

          <FormControl>
            <FormControl.Label _text={{ style: styles.label }} >Marca</FormControl.Label>
            <Select
              
              variant='unstyled'
              selectedValue={valueMaker}
              // minWidth={deviceWidth * 0.32}
              accessibilityLabel="Marca"
              placeholder=""
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }}
              rounded={'lg'}
              placeholderTextColor={Colors.white}
              onValueChange={itemValue => handleMarca(itemValue)}
              textStyle={{color:Colors.white}}
              color={Colors.white}
              borderColor={Colors.lightBorder}
              backgroundColor={Colors.lightBlack}
              dropdownIcon={<MaterialCommunityIcons 
                name='menu-down' 
                color={Colors.white} 
                size={35}
              />}
            >
              {
                marcas.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
              }

            </Select>
          </FormControl>

          {
            modelo && (
              <FormControl mt="3">
                <FormControl.Label _text={{ style: styles.label }} >Modelo</FormControl.Label>
                <Select
                  selectedValue={valueModel}
                  minWidth={deviceWidth * 0.33}
                  accessibilityLabel="Modelo"
                  placeholder=""
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }}
                  color={Colors.white}
                  onValueChange={itemValue => handleModel(itemValue)}
                
                  borderColor={Colors.lightBorder}
                  backgroundColor={Colors.lightBlack}
                  dropdownIcon={<MaterialCommunityIcons 
                    name='menu-down' 
                    color={Colors.white} 
                    size={35}
                  />}
                >
                  {
                    modelo.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                  }
                </Select>
              </FormControl>
            )
          }

          <FormControl>
            <FormControl.Label _text={{ style: styles.label }} >Año</FormControl.Label>
            <Select
              selectedValue={valueYear}
              minWidth={deviceWidth * 0.25}
              accessibilityLabel="Año"
              placeholder=""
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }}

              onValueChange={itemValue => handleYear(itemValue)}
              style={styles.select}
              borderColor={Colors.lightBorder}
              backgroundColor={Colors.lightBlack}
              color={Colors.white}
              dropdownIcon={<MaterialCommunityIcons 
                name='menu-down' 
                color={Colors.white} 
                size={35}
              />}
            >
              {
                years.map((item, i) => <Select.Item key={item} label={item.toString()} value={item} />)
              }
            </Select>
          </FormControl>
         
          <FormControl>
            <FormControl.Label _text={{ style: styles.label }} >kilometraje</FormControl.Label>
            <Input
            value={km.toString()}
            keyboardType='numeric'
            onChangeText={handleTextChange}
            borderColor={Colors.lightBorder}
            />
          </FormControl>
        </Modal.Body>




        <Modal.Footer
        backgroundColor={Colors.bgColor}
        >
          <Button.Group space={2}>
            <Button variant="ghost"  onPress={() => {
              resetFiltros();
              setShowModal(false);

            }}
            _text={{ style: styles.label }}
            >
              Cancelar
            </Button>
            <Button onPress={() => {
              // setShowModal(false); 
              guardarCar()
            }}
            _text={{ style: styles.label }}
            backgroundColor={Colors.primaryColor}
            >
              Guardar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

const styles = StyleSheet.create({
  cars: {
    ...CommonStyles.screenY,

  },
  label:{
    ...CommonStyles.h2
  }
})