import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { CheckIcon, Select } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProductContext } from '../../util/context/Product/ProductContext'
import Colors from '../../util/styles/colors'
import { useDispatch, useSelector } from 'react-redux';
import { getMakerValueCars, getModelValueCars, getYearValueCar } from '../../util/ReduxStore/Actions/CustomerActions/UserInfoActions';


export const SelectCar = () => {
    const {
         setValueMaker, 
        modelo, marcas, years
    } = useContext(ProductContext)
    const dispatch = useDispatch()
    const {marcaValue,modeloValue,yearValue} = useSelector(state => state.user)




    const handleMarca = (item) => {
        dispatch(getMakerValueCars(item))      
        setValueMaker(item)
    }

    const handleModel = (item) => {
        dispatch(getModelValueCars(item))
   

    }

    const handleYear = (item) => {
       
        dispatch(getYearValueCar(item))
       

    }

    const resetFilter = () => {
       
    
       
    }

   
    return (
        <>


            <View style={styles.select}>
                <Select
                    variant='unstyled'
                    selectedValue={marcaValue}
                    minWidth="30%"
                    // minHeight={'2%'}
                    accessibilityLabel="Marca"
                    placeholder="Marca"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                        
                    }}
                    mt={1}
                    onValueChange={itemValue => handleMarca(itemValue)}
                    color={'black'}
                    dropdownIcon={<MaterialCommunityIcons name="menu-down" size={23} color={Colors.black} />}
                >
                    {
                        marcas.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                    }

                </Select>
                <Select
                    color={'black'}
                    variant='unstyled'
                    selectedValue={modeloValue}
                     minWidth="30%"
                    accessibilityLabel="Modelo"
                    placeholder="Modelo"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={itemValue => handleModel(itemValue)}
                    dropdownIcon={<MaterialCommunityIcons name="menu-down" size={23} color={Colors.black} />}
                >
                    {
                        modelo.length > 0 ? modelo.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />) : (
                            <Text>Seleccione una marca</Text>
                        )
                    }
                </Select>

                <Select
                    color={'black'}
                    variant='unstyled'
                    selectedValue={yearValue}
                    minWidth="24%"
                    accessibilityLabel="Año"
                    placeholder="Año"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }} mt={1}
                    onValueChange={itemValue => handleYear(itemValue)}
                    dropdownIcon={<MaterialCommunityIcons name="menu-down" size={23} color={Colors.black} />}
                >
                    {
                        years.map((item, i) => <Select.Item key={item} label={item.toString()} value={item} />)
                    }
                </Select>

            </View>
            {/* <Pressable
                style={{ alignItems: 'flex-end', margin: 10 ,}}
                onPress={resetFilter}
            >
                <Text style={{color:'black'}} >Reset filtro</Text>
            </Pressable> */}





        </>
    )
}



const styles = StyleSheet.create({
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'red',
        alignItems: 'center',
        marginHorizontal: 1,


    }
})