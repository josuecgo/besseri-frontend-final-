import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../util/styles/colors'
import { adjust } from '../../../util/Dimentions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'
import { Box, Divider, FlatList, HStack, Spinner, TextArea } from 'native-base'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import { getUser } from '../../../util/local-storage/auth_service';
import { showToaster } from '../../../util/constants';


export const DetailQuestionScreen = ({ route }) => {
    const [question, setQuestion] = useState(route.params)
    const [answer, setAnswer] = useState("")
    const [isSending, setIsSending] = useState(false)


    const createAnswer = async () => {
        try {
            const user = await getUser()

            if (!user)  return showToaster('Necesitas iniciar sesión para responder preguntas')

            if(user.role !== 'mechanic') return showToaster('No tienes permiso para responder preguntas')

            setIsSending(true)
           
            const apiCall = await axios.post(`${customer_api_urls.response_question}/${question._id}`, {
                answeredBy: user._id,
                answer: answer
            });

            setQuestion(apiCall.data.data)

            setAnswer("")
            setIsSending(false)
        } catch (error) {

            setIsSending(false)

        }
    }



    return (
         <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={100} // Ajusta si tienes Header
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box>
          {/* Título y pregunta */}
          <HStack alignItems={'center'} space={2}>
            <MaterialCommunityIcons name='frequently-asked-questions' color={Colors.black} size={20} />
            <Text style={styles.title}>{question.title}</Text>
          </HStack>

          <HStack mb={2}>
            <MaterialCommunityIcons name='account' color={Colors.primaryColor} size={20} />
            <Text style={styles.user}>{question.askedBy.name} - </Text>
            <Text style={styles.date}>{moment(question.createdAt).fromNow() || ''}</Text>
          </HStack>

          <Divider color={'gray.100'} />
          <Text style={styles.date}>Respuestas {question.answers.length}</Text>

          {/* Respuestas */}
          {question.answers.map((item) => (
            <Box my={5} key={item._id}>
              <HStack alignItems={'center'}>
                <MaterialCommunityIcons name='account' color={Colors.primaryColor} size={20} />
                <Text style={styles.user}>{item?.answeredBy.name}- </Text>
                <Text style={styles.date}>
                  {moment(item?.answeredAt).fromNow() || ''}
                </Text>
              </HStack>
              <Text style={styles.answer}>{item?.answer}</Text>
            </Box>
          ))}

          {/* Tu respuesta */}
          <Box mt={4}>
            <Text style={styles.title}>Tu Respuesta</Text>
            <TextArea
              onChangeText={(text) => setAnswer(text)}
              value={answer}
              placeholder='Responder'
              placeholderTextColor="gray.400"
              color="black"
              totalLines={4}
            />
            {!isSending  ? (
              <BtnPrincipal
                text={'Añadir una respuesta'}
                onPress={createAnswer}
              />
            ) : (
              <Spinner />
            )}
          </Box>
        </Box>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        flex: 1
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
    answer: {
        color: Colors.black,
    }
})