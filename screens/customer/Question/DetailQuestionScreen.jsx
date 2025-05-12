import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { adjust } from '../../../util/Dimentions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'
import { Box, Divider, FlatList, HStack, TextArea } from 'native-base'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';


export const DetailQuestionScreen = ({ route }) => {
    const question = route.params
    console.log(question.answers);

    return (
        <View style={styles.container} >
            <Box>
                <HStack alignItems={'center'} space={2} >
                <MaterialCommunityIcons name='frequently-asked-questions' color={Colors.black} size={20} />
                <Text style={styles.title} >{question.title}</Text>
            </HStack>

            <HStack mb={2} >
                <MaterialCommunityIcons name='account' color={Colors.primaryColor} size={20} />
                <Text style={styles.user} >{question.askedBy.name} - </Text>
                <Text style={styles.date} >{moment(question.createdAt).fromNow() || ''}</Text>
            </HStack>

            <Divider color={'gray.100'} />

            <Text style={styles.date} >Respuestas {question.answers.length}</Text>
            <Box>

            </Box>

                <FlatList
                data={question.answers}
                renderItem={({item}) => {
                    console.log(item);
                    
                    return(
                    <Box my={5} >
                        <HStack alignItems={'center'} >
                            <MaterialCommunityIcons name='account' color={Colors.primaryColor} size={20} />
                            <Text style={styles.user} >{item?.answeredBy.name}- </Text>
                              <Text style={styles.date} >{moment(item?.answeredBy.answeredAt).fromNow() || ''}</Text>
                            
                        </HStack>
                        <Text style={styles.answer} >{item?.answer}</Text>
                    </Box>
                )}}
                keyExtractor={(item) => item._id.toString()}
                />
            </Box>



           
            <Box>
                <Text style={styles.title} >Tu Respuesta</Text>
                <TextArea
                />
                <BtnPrincipal
                text={'Añadir una respuesta'}

                />
            </Box>
            
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        justifyContent:'space-between',
        flex:1
    },
    title: {
        color: Colors.black,
        fontSize: adjust(19)
    },
    user: {
        color: Colors.primaryColor,
    },
    date: {
        color: Colors.textSecundary,
    },
    answer:{
         color: Colors.black,
    }
})