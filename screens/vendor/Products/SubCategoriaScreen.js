import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { useVendor } from '../../../hooks/useVendor'
import TopCircleComponent from '../../../components/top-circle/top-circle.component';

import { Avatar, Box, FlatList, HStack, Spacer, VStack, Text, Pressable } from 'native-base';

import Loading from '../../../components/Loader/Loading';
import { VENDOR_DETAILS_ROUTES } from '../../../util/constants';

export const SubCategoriaScreen = (props) => {
    const { subcategories,getSubCategories,showLoader,setShowLoader } = useVendor();
    
    let idCategoria = props.route.params.item;
    const setView = (item) => {
       
        props.navigation.navigate(VENDOR_DETAILS_ROUTES.ALL_PRODUCT,{item})
    }

    const renderItem = ({ item }) => (
        <Box borderBottomWidth="1"
            _dark={{
                borderColor: "muted.50"
            }}
            borderColor="muted.800"
            pl={["0", "4"]} pr={["0", "5"]}
            py="2"

        >
            <TouchableOpacity
                onPress={() => setView(item)}
            >
                <HStack
                    space={[2, 3]}
                    justifyContent="center"
                    alignItems={'center'}
                    style={styles.list}
                >
                    {/* <Avatar size="40px" source={getIcon(item.name)} /> */}

                    <VStack>
                        <Text
                            _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800"
                            bold
                        >
                            {item.name}
                        </Text>
                    </VStack>
                    <Spacer />

                </HStack>
            </TouchableOpacity>

        </Box>
    )


    const memorizedValue = useMemo(() => renderItem, [subcategories]);

    

    useEffect(() => {
        getSubCategories(idCategoria)
    }, [props])

    return (
        <View style={{ flex: 1 }} >
            <TopCircleComponent textHeading={'Subcategorías '} />
            {
            showLoader ? (
            <Loading/>
            ) 
            : (
                <FlatList
                    data={subcategories}
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
    list: {
        marginHorizontal: 5
    }
})