import { FlatList, Pressable, StyleSheet,  View } from 'react-native'
import React from 'react'
import { Box, Button, Divider, HStack, Text } from 'native-base'
import Colors from '../../../util/styles/colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import moment from 'moment';

export const QuestionScreen = ({route,navigation}) => {
    const questions = route.params
   

    
    return (
        <View>
            <FlatList
            data={questions}
            renderItem={({item}) => (
                <Box marginX={2} marginY={5}  >

                    <Pressable
                    onPress={() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETAILQUESTIONSCREEN,item)}
                    >
                        <HStack space={2} alignItems={'center'} >
                            <MaterialCommunityIcons name='frequently-asked-questions' color={Colors.black} size={25}/>
                            <Text style={styles.title} >{item.title}</Text>
                        </HStack>
                        <HStack space={2} alignItems={'center'}>
                            <MaterialCommunityIcons name='account' color={Colors.primaryColor} size={20} />
                            <Text style={styles.user} >{item.askedBy.name}-</Text>
                            <Text style={styles.date} >{moment(item.createdAt).fromNow() || ''}</Text>
                        </HStack>
                        
                        <Divider/>
                    </Pressable>
                    
                </Box>
            )}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    title:{
        color:Colors.textPrimary,
        fontSize:16
    },
    user:{
        color:Colors.primaryColor,
        fontSize:14
    },
    date:{
        color: Colors.textSecundary,
    }
})