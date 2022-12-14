import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import Colors from '../util/styles/colors'
import { useContext } from 'react'
import { ProductContext } from '../util/context/Product/ProductContext'
import { deviceHeight, deviceWidth } from '../util/Dimentions'
import { CheckIcon, Select } from 'native-base'
import { useEffect } from 'react'

export const SelectFilter = () => {

    const {
        modelo,
        marcas,
        valueMaker, setValueMaker,
        valueModel, setValueModel, years, setValueYear, valueYear,
        carActive,productos,carDefault
    } = useContext(ProductContext);

    const handleMarca = (item) => {
       
        setValueModel('')
        setValueMaker(item)
        

    }

    const handleModel = (item) => {
        setValueModel(item);

    }



    const handleYear = (item) => {
        setValueYear(item);

    }
    
    useEffect(() => {
        if (productos && carDefault?.maker?._id  ) {
            handleMarca(carDefault?.maker?._id)
            handleYear(carDefault.year)
        }
    }, [productos,carDefault])


    useEffect(() => {
        if (modelo && carDefault?.model?._id && valueMaker) {
            setTimeout(() => {
                handleModel(carDefault?.model?._id)
            }, 2000);
           
        }
    }, [modelo,carDefault])
    
    // console.log({
    //     valueMaker,
    //     valueModel,
    //     valueYear
    // });
    // console.log(carDefault);
    

    return (
        <>
            <Select
                variant='unstyled'
                selectedValue={valueMaker}
                minWidth={deviceWidth * 0.35}
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
                    marcas.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
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
                    modelo.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                }
            </Select>
            ) : (
                <View style={styles.picker} />
            )}

            <Select
                selectedValue={valueYear}
                minWidth={deviceWidth * 0.23}
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
        </>
    )
}



const styles = StyleSheet.create({
    picker: {
        // width: deviceWidth / 2.2,
        width: deviceWidth / 3.2,
    },
    select: {
        backgroundColor: 'white',
        height: deviceHeight * 0.05
    }
})