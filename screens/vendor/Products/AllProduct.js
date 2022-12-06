import { FlatList, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import TopCircleComponent from '../../../components/top-circle/top-circle.component';
import { useVendor } from '../../../hooks/useVendor';
import Loading from '../../../components/Loader/Loading';
import { Box, Center, CheckIcon, Select } from 'native-base';
import ProductComponent from '../../../components/vendor-shared/product.component';
import { VENDOR_DETAILS_ROUTES } from '../../../util/constants';

export const AllProduct = (props) => {
    let idSubCategoria = props.route.params.item;
    const { productSubCategoria, showLoader,
         marcas, modelos, getModelo, years,
        filterProducts, productsFilter } = useVendor();
    const [marcaSelect, setMarcaSelect] = useState("")
    const [modeloSelect, setModeloSelect] = useState("");
    const [yearSelect, setYearSelect] = useState("")
    // console.log(marcaSelect);

    useEffect(() => {
        productSubCategoria(idSubCategoria)
    }, [idSubCategoria]);

    useEffect(() => {
        filterProducts(marcaSelect, modeloSelect, yearSelect)
    }, [marcaSelect, modeloSelect, yearSelect])


    const openProductDetails = productDetails => {
        props.navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS, { data: productDetails });
    };

    

    const renderItem = ({ item }) => (
        <ProductComponent
            data={item}
            openProductDetails={openProductDetails}
        />
    )



    const memorizedValue = useMemo(() => renderItem, [productsFilter]);
    
   
   

    const handleMarca = (item) => {
        setModeloSelect('')
        setMarcaSelect(item)
        getModelo(item);

    }

    const handleModel = (item) => {
        setModeloSelect(item);

    }

    const handleYear = (item) => {
        setYearSelect(item);

    }

    const resetFilter = () => {
        setMarcaSelect('');
        setModeloSelect('');
        setYearSelect('');
    }



  
   

    return (
        <View style={{ flex: 1 }} >
            <TopCircleComponent textHeading={idSubCategoria?.name} />

            <View
                style={styles.select}
            >
                <Select
                    variant='unstyled'
                    selectedValue={marcaSelect}
                    minWidth="100"
                    accessibilityLabel="Marca"
                    placeholder="Marca"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={itemValue => handleMarca(itemValue)}
                >
                    {
                        marcas.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                    }

                </Select>
                <Select
                    selectedValue={modeloSelect}
                    minWidth="100"
                    accessibilityLabel="Modelo"
                    placeholder="Modelo"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={itemValue => handleModel(itemValue)}
                >
                    {
                        modelos.map((item) => <Select.Item key={item._id} label={item.name} value={item._id} />)
                    }
                </Select>

                <Select
                    selectedValue={yearSelect}
                    minWidth="100"
                    accessibilityLabel="Año"
                    placeholder="Año"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }} mt={1}
                    onValueChange={itemValue => handleYear(itemValue)}
                
                >
                    {
                        years.map((item, i) => <Select.Item key={item} label={item.toString()} value={item} />)
                    }
                </Select>

            </View>
            <TouchableOpacity 
            style={{alignItems:'flex-end', margin:10}} 
            onPress={resetFilter}
            >
                <Text>Reset filtro</Text>
            </TouchableOpacity>
            
            {
                showLoader ? (
                    <Loading />
                ):(
                    <FlatList
                        data={productsFilter}
                        renderItem={memorizedValue}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }
           


        </View>
    )
}



const styles = StyleSheet.create({
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'red',
        alignItems: 'center',
        marginHorizontal: 5
    }
})