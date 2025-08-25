import { FlatList, Pressable, StyleSheet,  View } from 'react-native'
import React, { useState } from 'react'
import { Box, Button, Divider, Fab, HStack, Input, Modal, Text } from 'native-base'
import Colors from '../../../util/styles/colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants';
import moment from 'moment';
import { getUser } from '../../../util/local-storage/auth_service';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';

export const QuestionScreen = ({route,navigation}) => {
    const {product} = route.params;
    const [questions, setQuestions] = useState(route.params.questions)
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({
        title:"",
        description:"",
        askedBy:""
    })

    

    const openModalQuestion = async() => { 
        const user = await getUser();

      
        
        if(!user) return showToaster('Necesitas iniciar sesión para preguntar')

        if(user.role !== 'mechanic') return showToaster('No tienes permiso para preguntar')
        setForm({
            ...form,
            askedBy: user._id
        })  
        setOpenModal(true)

    }

    const createQuestion = async() => {
        try {
            const apiCall = await axios.post(`${customer_api_urls.create_questions}/${product?._id}`,form);

            const {data} = apiCall.data;
            setQuestions(data)
            setOpenModal(false)
            setForm({
                title:"",
                description:"",
               
            })  

        } catch (error) {
            console.log(error);
            
            showToaster('Error al crear la pregunta')
        }    
    }
   
//   {
//   title:"¿Este producto tiene garantía?",
//   description: "descripcion y mas informacion de la pregunta",
//   askedBy:"67781e2e825d3d3e151d4fe7"
// }
    
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
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <Box marginX={2} marginY={5} >
                </Box>
            )}
            />
            <Fab label="Preguntar" onPress={openModalQuestion} />

            <Modal isOpen={openModal} onClose={() => setOpenModal(false)} >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Crear pregunta</Modal.Header>
                    <Modal.Body>
                       
                        
                        <Input 
                        onChangeText={(text) =>  setForm({
                            ...form,
                            title:text
                        })} 
                        placeholder='Título' 
                        />
                        <Input 
                        onChangeText={(text) =>  setForm({
                            ...form,
                            description:text
                        })} placeholder='Descripción' 
                        />
                       
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => setOpenModal(false)}>
                                Cancelar
                            </Button>
                            <Button onPress={createQuestion}>Crear</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>

            </Modal>
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