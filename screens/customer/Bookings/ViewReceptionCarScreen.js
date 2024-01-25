import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, HStack, Heading, Image, Text, VStack } from 'native-base';
import { base_url } from '../../../util/api/api_essentials';
import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';
import { numberToKm } from '../../../util/utility-functions';

export const ViewReceptionCarScreen = ({ route }) => {

    const { car, reception } = route.params;

    const formInputs = [
        {
            label: 'Espejo Izquierdo',
            inp: 'left_mirror',

            index: 1
        },
        {
            label: 'Espejo Derecho',
            inp: 'right_mirror',

            index: 2
        },
        {
            label: 'Vidrios',
            inp: 'windows',

            index: 3
        },
        {
            label: 'Radio',
            inp: 'radio',

            index: 4
        },
        {
            label: 'Pantalla',
            inp: 'screen',

            index: 5
        },
        {
            label: 'Encendedor',
            inp: 'lighter',

            index: 6
        },
        {
            label: 'Cargador de Celular',
            inp: 'phone_charger',

            index: 7
        },
        {
            label: 'Triángulos',
            inp: 'triangles',

            index: 8
        },
        {
            label: 'Cubresol',
            inp: 'sunshade',
            value: null,
            type: 1,
            index: 9
        },
        {
            label: 'Herramientas',
            inp: 'tools',

            index: 10
        },
        {
            label: 'Gato',
            inp: 'hydraulic_jack',

            index: 11
        },
        {
            label: 'Llanta de Refacción',
            inp: 'spare_tire',


            index: 12
        },
        {
            label: 'Faros/Lunas',
            inp: 'headlights',
            value: null,
            type: 1,
            index: 13
        },
        {
            label: 'Tapa de Gasolina',
            inp: 'gas_cap',

            index: 14
        },
        {
            label: 'Placas',
            inp: 'license_plate',

            index: 15
        },
        {
            label: 'Tapetes',
            inp: 'floor_mats',

            index: 16
        },
        {
            label: 'Extintor',
            inp: 'fire_extinguisher',

            index: 17
        },
        {
            label: 'Llave de Tuercas',
            inp: 'lug_wrench',

            index: 18
        }
    ]
    return (
        <View style={styles.body} >

            <ScrollView>

                <HStack alignItems={'center'} >
                    <Image
                        source={{ uri: `${base_url}/${car?.maker?.photo}` }}
                        alt='marca'
                        style={{ height: 60, width: 60 }}
                        resizeMode='contain'
                    />
                    <Heading size={'sm'} color={Colors.white} >{car?.maker?.name} {car?.model?.name}</Heading>
                </HStack>

                <Box>
                    {
                        formInputs.map((item) => (
                            <HStack
                                borderWidth={0.5}
                                borderColor={Colors.placeholder}
                                p={2}
                                rounded={'sm'}
                                key={item.index}
                                justifyContent={'space-between'}
                                mt={1}
                            >
                                <Text style={styles.label} >{item.label}</Text>
                                <Box style={{
                                    backgroundColor: reception[item.inp] ? Colors.seguimiento : Colors.red,
                                    paddingHorizontal: 10,
                                    borderRadius: 4
                                }} >
                                    <Text style={styles.value} >{reception[item.inp] ? 'Si' : 'No'}</Text>
                                </Box>

                            </HStack>
                        ))

                    }

                    <HStack borderWidth={0.5}
                        borderColor={Colors.placeholder}
                        p={2}
                        rounded={'sm'}
                        justifyContent={'space-between'}
                    >
                        <Text style={styles.label} >Gasolina</Text>
                        <Box
                            style={{
                                backgroundColor: reception.fuel_level >= 50 ? Colors.seguimiento : Colors.red,
                                paddingHorizontal: 10,
                                borderRadius: 4
                            }} >
                            <Text style={styles.value} >{reception.fuel_level}%</Text>
                        </Box>
                    </HStack>

                    <HStack borderWidth={0.5}
                        borderColor={Colors.placeholder}
                        p={2}
                        rounded={'lg'} justifyContent={'space-between'} >
                        <Text style={styles.label} >Kilómetros</Text>
                        <Text style={styles.value} >{numberToKm(parseInt(reception.kilometers))}</Text>
                    </HStack>



                    <VStack
                        justifyContent={'space-between'}
                        borderWidth={0.5}
                        borderColor={Colors.placeholder}
                        p={2}
                        rounded={'lg'}
                    >
                        <Text style={styles.label} >Observaciones</Text>

                        <Text style={styles.value}>{reception.observations}</Text>


                    </VStack>

                </Box>
            </ScrollView>
        </View>
    )
}



const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        paddingVertical: 10
    },
    label: {
        ...CommonStyles.h2,
        // color:Colors.terciarySolid
    },
    value: {
        ...CommonStyles.h2
    }
})