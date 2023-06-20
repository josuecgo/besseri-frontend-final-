import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Box, Center, HStack, Image, Text } from 'native-base'
import axios from 'axios'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../../util/styles/styles'

import { base_url, customer_api_urls } from '../../../util/api/api_essentials'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import Colors from '../../../util/styles/colors'
import { adjust } from '../../../util/Dimentions'
import { Empty } from '../../../components/Customer/Empty'
import { useSafeAreaInsets } from 'react-native-safe-area-context'




export const CategoriesServicesScreen = ({navigation}) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const {bottom} = useSafeAreaInsets()
    const getCategories = async () => {
        try {
            setIsLoading(true)
            const apiCall = await axios.get(customer_api_urls.get_categories_services)

            setCategories(apiCall.data.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            showToaster(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <View style={[styles.container]} >

            {isLoading ? (
                <Center justifyContent={'center'} alignItems={'center'} flex={1} >
                    <ActivityIndicator size="large" color={Colors.white} />
                </Center>

            ) : (
                <FlatList
                    data={categories}
                    renderItem={({ item }) => {
                      
                        return (
                            <Pressable
                            onPress={() =>  navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_STACK,{category:item._id}) }
                            >
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
                            </Pressable>

                        )
                    }}
                    ListEmptyComponent={<Empty />}
                />
            )
            }

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
        fontFamily: 'Arial',
        fontSize: adjust(17),
        color: Colors.white
    },
    img: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        padding: 10,
        width: 50,
        height: 50
    }
})