import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { getUser } from '../../../util/local-storage/auth_service'
import axios from 'axios'
import { HStack } from 'native-base'
import Colors from '../../../util/styles/colors'
import moment from 'moment'

export const MyQuoteScreen = () => {
    const [quotes, setQuotes] = useState([])


    const getMyQuotes = async () => {
        try {
            const user = await getUser();
            const id = user._id;

            const url = `${customer_api_urls.my_quote}/${id}`
            const apiCall = await axios.get(url)

            setQuotes(apiCall?.data?.data)

        } catch (error) {
            console.log(error);

        }
    }


    const formatDate = (dateString) => {
         const momentDate = moment(dateString);


        const formattedDate = momentDate.format('D [de] MMMM [de] YYYY'); // Ejemplo: 25 de Agosto de 2025


        return formattedDate
    }


    useEffect(() => {
        getMyQuotes()
    }, [])

    return (
        <View>

            <FlatList
                data={quotes}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <HStack
                            justifyContent="space-evenly"
                            borderBottomWidth={1}
                            borderBottomColor={Colors.placeholder}>
                            <Text style={styles.label}>{item?.maker?.name}</Text>
                            <Text style={styles.label}>{item?.model?.name}</Text>
                            <Text style={styles.label}>{item?.year}</Text>
                        </HStack>
                        <HStack justifyContent="space-evenly"  mt={2} mb={2} >
                            <Text style={styles.label}>{item?.category?.name}</Text>
                            <Text style={styles.label}>{item?.subCategory?.name}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} alignItems={'center'}  >

                            
                            <Text style={styles.label} >{formatDate(item.createdAt)}</Text>
                            <View style={styles.status} >
                                <Text style={styles.textStatus} >{item?.status}</Text>
                            </View>
                           
                                
                            
                        </HStack>
                    </View>
                )}
            />
        </View>
    )
}



const styles = StyleSheet.create({

    label: {
        color: Colors.bgColor,
    },
    card: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        borderColor: Colors.bgColor,
        borderWidth: 1,
       
    },
    status:{
        backgroundColor:Colors.brightBlue,
        paddingVertical:5,
        paddingHorizontal:20,
        borderRadius:15,
    },
    textStatus:{
        color:Colors.white,
        fontWeight:'bold',
        textTransform:'capitalize'
    }

})