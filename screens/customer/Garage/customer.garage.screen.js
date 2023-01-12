import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeaderBackground } from '../../../components/Background/HeaderBackground'
import Colors from '../../../util/styles/colors'
import CommonStyles from '../../../util/styles/styles';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { Box, Button, CheckIcon, FormControl, Input, Modal, Radio, Select } from "native-base";
import { ScrollView } from 'native-base';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useSearchStore } from '../../../hooks/useSearchStore';
import { getUserId } from '../../../util/local-storage/auth_service';
import { showToaster } from '../../../util/constants';
import { api_statuses, customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { useEffect } from 'react';
import { ItemCar } from '../../../components/ItemCar';
import { ThinlineSeparator } from '../../../components/CommonComponents';

export const GarageScreen = (props) => {
  const {
    years,
    activeCar,
    carDefault,
    activeCarLoading,
    getGarage,
    cars
  } = useContext(ProductContext);
  const {
    marcas,
    resetFiltros,
    modelo,
    valueMaker,
    valueModel,
    valueYear,
    handleMarca,
    handleModel,
    handleYear
  } = useSearchStore();
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  
  const [carSelect, setCarSelect] = useState(false)
  const [value, setValue] = useState(carDefault ? carDefault._id : '')

  const handleModalize = () => {
    setShowModal(true)
  }
  const handleModalizeDelete = (data) => {
    setCarSelect(data)
    setShowModalDelete(true)
  }

  const guardarCar = async () => {
    const userId = await getUserId();
    try {
      if (!userId) {
        showToaster('Inicia sesión')
        return
      }
      const apiCall = await axios.post(`${customer_api_urls.create_car}`, {
        userId,
        maker: valueMaker,
        model: valueModel,
        year: valueYear
      });

      if (apiCall.status == api_statuses.success) {
       
        setShowModal(false)
        getGarage()
        resetFiltros()
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
      }

    } catch (error) {
     
      showToaster('No hay conexion con el servidor')
    }
  }


  const onDelete = async(car) => {
    try {
      
      const apiCall = await axios.delete(`${customer_api_urls.delete_garage}/${car._id}`);

      if (apiCall.status == api_statuses.success) {
       
        getGarage()
        setShowModalDelete(false)
      } else {
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo :/')
      }

    } catch (error) {

      showToaster('No hay conexion con el servidor')
    }
  }

  const changeCarDefault = async(car) => {
    let firstCar = cars.find((c) => c._id === car)
    
    activeCar(firstCar)
    setValue(car)
  }


  // console.log(carDefault);

  return (
    <>
      <ModalCreateCar
        showModal={showModal}
        setShowModal={setShowModal}
        marcas={marcas}
        modelo={modelo}
        valueMaker={valueMaker}
        valueModel={valueModel}
        valueYear={valueYear}
        handleMarca={handleMarca}
        handleModel={handleModel}
        handleYear={handleYear}
        resetFiltros={resetFiltros}
        years={years}
        guardarCar={guardarCar}
      />
      <ModalDeleteCar
       showModalDelete={showModalDelete}
       setShowModalDelete={setShowModalDelete}
       onDelete={onDelete}
       carSelect={carSelect}
      />
      <HeaderBackground />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props?.navigation?.goBack()}
          style={{ alignSelf: 'flex-start' }}>
          <MaterialCommunityIcons
            name='keyboard-backspace'
            color={Colors.white}
            size={25}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Garage</Text>
      </View>




      <FlatList
        data={cars}
        keyExtractor={item => item?._id}
        
        renderItem={({ item }) => (
          <Box
          backgroundColor={Colors.white}
          style={styles.box}
          // pl={["0", "4"]} pr={["0", "5"]}
          // padding='1'

           >
            <Radio.Group 
            name="myRadioGroup" 
            accessibilityLabel="favorite car" 
            value={value} 
            onChange={nextValue => {
              changeCarDefault(nextValue);
            }}
           
            
            >
              <ItemCar isDisabled={activeCarLoading} data={item} handleModalizeDelete={handleModalizeDelete} />
            </Radio.Group>
            <ThinlineSeparator/>
          </Box>
         
        )
        }
        ListHeaderComponent={() => (
          <TouchableOpacity onPress={handleModalize} style={{ alignSelf: 'flex-end', padding: 10 }}>
            <AntDesign name='plus' color='black' size={30} />
          </TouchableOpacity>
        )}
      />

     
    </>
  )
}

const ModalCreateCar = ({
  showModal,
  setShowModal,
  marcas,
  modelo,
  years,
  valueMaker,
  valueModel,
  valueYear,
  handleMarca,
  handleModel,
  handleYear,
  resetFiltros,
  guardarCar
}) => {

  return (
    <Modal isOpen={showModal} onClose={() => {
      setShowModal(false)
      resetFiltros()
    }}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Crea tú auto</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Marca</FormControl.Label>
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

              onValueChange={itemValue => handleMarca(itemValue)}
              style={styles.select}
              borderColor={Colors.white}
              backgroundColor={Colors.white}
            >
              {
                marcas.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
              }

            </Select>
          </FormControl>
          {
            modelo && (
              <FormControl mt="3">
                <FormControl.Label>Modelo</FormControl.Label>
                <Select
                  selectedValue={valueModel}
                  minWidth={deviceWidth * 0.33}
                  accessibilityLabel="Modelo"
                  placeholder=""
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
                    modelo.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                  }
                </Select>
              </FormControl>
            )
          }
          <FormControl>
            <FormControl.Label>Año</FormControl.Label>
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
              borderColor={Colors.white}
              backgroundColor={Colors.white}
            >
              {
                years.map((item, i) => <Select.Item key={item} label={item.toString()} value={item} />)
              }
            </Select>
          </FormControl>

        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              resetFiltros();
              setShowModal(false);

            }}>
              Cancelar
            </Button>
            <Button onPress={() => {
              // setShowModal(false); 
              guardarCar()
            }}>
              Guardar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

const ModalDeleteCar = ({
  showModalDelete,
  setShowModalDelete,
  onDelete,
  carSelect
}) => {

  return (
    <Modal isOpen={showModalDelete} onClose={() => {
      setShowModalDelete(false)
      
    }}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header> Eliminar  </Modal.Header>
        <Modal.Body>
        
          <Text>{carSelect?.maker?.name}</Text>
          <Text>{carSelect?.model?.name}  </Text>
          <Text>{carSelect?.year} </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              
              setShowModalDelete(false);

            }}>
              Cancelar
            </Button>
            <Button 
            colorScheme={'error'}
            onPress={() => {
              onDelete(carSelect);
            }}>
              Eliminar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}



const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20, position: 'absolute' },
  box:{
    marginHorizontal:10,
    paddingHorizontal:5,
    paddingVertical:5
  }
})