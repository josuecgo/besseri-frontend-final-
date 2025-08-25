import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, Button, Spinner, Text } from 'native-base'
import Colors from '../../util/styles/colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const CardQuestion = ({ questions, onPress, fetchLoading }) => {
    let emptyQuestion = questions.length > 0

    if (fetchLoading) return (
        <Box justifyContent={'center'} alignItems={'center'} >
            <Spinner />
        </Box>
    );


    return (
        <>

            <Box  >
            
                <Box
                    borderWidth={1}
                    padding={3}
                    marginBottom={5}
                    marginX={2}
                    borderRadius={10}
                >
                <Text style={{color:Colors.bgColor}} >
                    Foro de preguntas y respuestas
                </Text>
                    {

                        emptyQuestion && questions.map((item, i) => {

                            if (i >= 3) return null;
                            return (
                                <Box
                                    key={i}

                                    marginBottom={2}
                                    flexDirection={'row'}
                                    alignItems={'center'}

                                >
                                    <MaterialCommunityIcons name='frequently-asked-questions' color={Colors.black} size={20} />
                                    <Text paddingX={1} color={Colors.black} >{item?.title}</Text>
                                </Box>
                            )
                        })
                    }

                    <Button
                        // text={'¿Tienes alguna pregunta?'}
                        variant={'link'}
                        onPress={onPress}

                    >
                        {emptyQuestion ? 'Ver mas' : 'Crear pregunta'}
                    </Button>
                    {/* <View style={{ width: 10, height: 20 }} /> */}

                </Box>
            </Box>

        </>
    )
}


