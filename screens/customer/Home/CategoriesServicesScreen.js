import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Box, HStack, Image, Text } from 'native-base'
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../../util/styles/styles'

import { base_url, customer_api_urls } from '../../../util/api/api_essentials'
import { showToaster } from '../../../util/constants'
import Colors from '../../../util/styles/colors'
import { adjust } from '../../../util/Dimentions'



export const CategoriesServicesScreen = () => {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const apiCall = await axios.get(customer_api_urls.get_categories_services)

            setCategories(apiCall.data.data)
        } catch (error) {
            console.log(error);
            showToaster(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <View style={styles.container} >
            <Text>CategoriesServicesScreen</Text>
            <FlatList
                data={categories}
                renderItem={({ item }) => {

                    return (
                        <HStack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            style={styles.type} >

                            <HStack alignItems={'center'} space={4}  >
                                <Box style={styles.img} >
                                    <Image
                                        source={{ uri: `${base_url}/${item.img}` }}
                                        style={{
                                            width: 40,
                                            height: 30
                                        }}
                                        resizeMode='contain'
                                        alt={item.name}
                                    />
                                </Box>

                                <Box>
                                    <Text style={styles.name} >{item.name}</Text>

                                </Box>


                            </HStack>
                            <MaterialIcons name='arrow-right-circle' size={30} color={'#868686'} />
                        </HStack>
                    )
                }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        ...CommonStyles.screenY
    },
    type: {
        // backgroundColor:'red',
        marginVertical: 5,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: Colors.borderColor
    },
    name: {
        fontFamily:'Arial',
        fontSize:adjust(17),
        color:Colors.white
    },
    img: {
        backgroundColor: Colors.white, 
        borderRadius: 100,
        padding:10,
        width:50,
        height:50
    }
})