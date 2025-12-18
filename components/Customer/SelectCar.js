import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, Text } from 'native-base';
import { useSelector } from 'react-redux';
import { useSearchStore } from '../../hooks/useSearchStore';
import { deviceHeight } from '../../util/Dimentions';
import Colors from '../../util/styles/colors'

export const SelectCar = React.memo(({ reset = true }) => {
    const { marcaValue, modeloValue, yearValue, marcas, modelos, years } = useSelector(state => state.user)
    const { handleMarca, handleModel, handleYear, getModelo, resetCar } = useSearchStore();
    
    const [marcasIsVisible, setMarcasIsVisible] = useState(false)
    const [modelosIsVisible, setModelosIsVisible] = useState(false)
    const [yearsIsVisible, setYearsIsVisible] = useState(false)

 
    const marcaPlaceholder = useMemo(() => {
        if (marcaValue && marcas.length > 0) {
            const find = marcas.find((item) => marcaValue === item._id)
            return find?.name || 'Marca'
        }
        return 'Marca'
    }, [marcaValue, marcas])

    const modeloPlaceholder = useMemo(() => {
        if (modeloValue && modelos.length > 0) {
            const find = modelos.find((item) => modeloValue === item._id)
            return find?.name || 'Modelo'
        }
        return 'Modelo'
    }, [modeloValue, modelos])

    const yearPlaceholder = useMemo(() => {
        if (yearValue && years.length > 0) {
            return yearValue
        }
        return 'Año'
    }, [yearValue, years])

    
    const onOpen = useCallback((inputValue) => {
        if (inputValue === 'marcas' && marcas.length > 0) {
            setMarcasIsVisible(true)
            return
        }
        if (inputValue === 'modelos' && modelos.length > 0) {
            setModelosIsVisible(true)
            return
        }
        if (inputValue === 'years' && years.length > 0) {
            setYearsIsVisible(true)
            return
        }
    }, [marcas.length, modelos.length, years.length])

    const handleMarcaSelect = useCallback((id) => {
    handleMarca(id)
    // Pequeño delay solo para la animación del modal
        requestAnimationFrame(() => setMarcasIsVisible(false))
    }, [handleMarca])

    const handleModeloSelect = useCallback((id) => {
        handleModel(id)
        requestAnimationFrame(() => setModelosIsVisible(false))
    }, [handleModel])

    const handleYearSelect = useCallback((year) => {
        handleYear(year)
        requestAnimationFrame(() => setYearsIsVisible(false))
    }, [handleYear])

    useEffect(() => {
        if (marcaValue) {
            getModelo(marcaValue)
        }
    }, [marcaValue, getModelo])

    return (
        <>
            <View style={styles.select}>
                <Pressable
                    style={styles.btnSelect}
                    onPress={() => onOpen('marcas')}>
                    <Text style={styles.textSelect}>{marcaPlaceholder}</Text>
                    <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
                </Pressable>
                <Pressable
                    style={styles.btnSelect}
                    onPress={() => onOpen('modelos')}>
                    <Text style={styles.textSelect}>{modeloPlaceholder}</Text>
                    <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
                </Pressable>
                <Pressable
                    style={[styles.btnSelect, { maxWidth: '25%' }]}
                    onPress={() => onOpen('years')}>
                    <Text style={styles.textSelect}>{yearPlaceholder}</Text>
                    <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
                </Pressable>
            </View>

            {reset && (
                <Pressable
                    style={{ alignItems: 'flex-end', marginHorizontal: 10, marginVertical: 4, padding: 4 }}
                    onPress={resetCar}>
                    <Text style={{ color: 'black', textDecorationLine: 'underline' }}>Limpiar filtro</Text>
                </Pressable>
            )}

            {/* Modal Marcas */}
            <Modal
                testID={'marcas'}
                isVisible={marcasIsVisible}
                onSwipeComplete={() => setMarcasIsVisible(false)}
                onBackdropPress={() => setMarcasIsVisible(false)}
                swipeDirection={['down']}
                scrollOffsetMax={400 - 300}
                propagateSwipe={true}
                style={styles.modal}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}>
                <View style={styles.scrollableModal}>
                    <ScrollView scrollEventThrottle={16}>
                        <Pressable onPress={() => setMarcasIsVisible(false)} style={styles.btnClose}>
                            <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
                        </Pressable>
                        <Box mx={5} my={5}>
                            {marcas.map(item => (
                                <Pressable
                                    key={item._id}
                                    onPress={() => handleMarcaSelect(item._id)}
                                    style={styles.btnItem}>
                                    <Text style={{ color: 'black' }}>{item.name}</Text>
                                </Pressable>
                            ))}
                        </Box>
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal Modelos */}
            <Modal
                testID={'modelos'}
                isVisible={modelosIsVisible}
                onSwipeComplete={() => setModelosIsVisible(false)}
                onBackdropPress={() => setModelosIsVisible(false)}
                swipeDirection={['down']}
                scrollOffsetMax={400 - 300}
                propagateSwipe={true}
                style={styles.modal}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}>
                <View style={styles.scrollableModal}>
                    <ScrollView scrollEventThrottle={16}>
                        <Pressable onPress={() => setModelosIsVisible(false)} style={styles.btnClose}>
                            <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
                        </Pressable>
                        <Box mx={5} my={5}>
                            {modelos.map(item => (
                                <Pressable
                                    key={item._id}
                                    onPress={() => handleModeloSelect(item._id)}
                                    style={styles.btnItem}>
                                    <Text style={{ color: 'black' }}>{item.name}</Text>
                                </Pressable>
                            ))}
                        </Box>
                    </ScrollView>
                </View>
            </Modal>

            {/* Modal Years */}
            <Modal
                testID={'years'}
                isVisible={yearsIsVisible}
                onSwipeComplete={() => setYearsIsVisible(false)}
                onBackdropPress={() => setYearsIsVisible(false)}
                swipeDirection={['down']}
                scrollOffsetMax={400 - 300}
                propagateSwipe={true}
                style={styles.modal}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}>
                <View style={styles.scrollableModal}>
                    <ScrollView scrollEventThrottle={16}>
                        <Pressable onPress={() => setYearsIsVisible(false)} style={styles.btnClose}>
                            <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
                        </Pressable>
                        <Box mx={5} my={5}>
                            {years.map(item => (
                                <Pressable
                                    key={item}
                                    onPress={() => handleYearSelect(item)}
                                    style={styles.btnItem}>
                                    <Text style={{ color: 'black' }}>{item}</Text>
                                </Pressable>
                            ))}
                        </Box>
                    </ScrollView>
                </View>
            </Modal>
        </>
    )
}, (prevProps, nextProps) => {
    return prevProps.reset === nextProps.reset
})

const styles = StyleSheet.create({
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 5,
    },
    btnSelect: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        maxWidth: '35%',
    },
    textSelect: {
        color: Colors.black,
        marginRight: 5,
        flex: 1,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    scrollableModal: {
        height: deviceHeight * 0.8,
        backgroundColor: 'white',
    },
    btnClose: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1
    },
    btnItem: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        paddingVertical: 10
    }
})

// import {  Pressable, ScrollView, StyleSheet,  View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import Modal from 'react-native-modal';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Box, Text } from 'native-base';
// import { useSelector } from 'react-redux';
// import { useSearchStore } from '../../hooks/useSearchStore';
// import { deviceHeight } from '../../util/Dimentions';
// import Colors from '../../util/styles/colors'


// export const SelectCar = ({ reset = true }) => {

//     const { marcaValue, modeloValue, yearValue, marcas, modelos, years, carActive } = useSelector(state => state.user)
//     const { handleMarca, handleModel, handleYear, getModelo, resetCar } = useSearchStore();
//     const [marcasIsVisible, setMarcasIsVisible] = useState(false)
//     const [modelosIsVisible, setModelosIsVisible] = useState(false)
//     const [yearsIsVisible, setYearsIsVisible] = useState(false)
//     const [labelValue, setLabelValue] = useState({
//         marca: 'Marca',
//         modelo: 'Modelo',
//         year: 'Año'
//     })

//     const onOpen = (inputValue) => {


//         if (inputValue === 'marcas' && marcas.length > 0) {
//             setMarcasIsVisible(true)
//             return
//         }
//         if (inputValue === 'modelos' && modelos.length > 0) {
//             setModelosIsVisible(true)
//             return
//         }
//         if (inputValue === 'years' && years.length > 0) {
//             setYearsIsVisible(true)
//             return
//         }

//     };

//     const getPlaceholder = (input) => {
//         if (input === 'marca') {
//             if (marcaValue) {
//                 const find = marcas.find((item) => marcaValue === item._id)
//                 return find.name
//             } else {
//                 return 'Marca'
//             }
//         }

//         if (input === 'modelo') {
//             if (modeloValue) {
//                 const find = modelos.find((item) => modeloValue === item._id)
//                 return find?.name ?? ''
//             } else {
//                 return 'Modelo'
//             }
//         }

//         if (input === 'year') {
//             if (yearValue) {
//                 const find = years.find((item) => yearValue === item)
//                 return find
//             } else {
//                 return 'Año'
//             }
//         }


//     }



//     useEffect(() => {
//         if (marcaValue) {
//             getModelo(marcaValue)
//         }
//     }, [marcaValue])




//     return (
//         <>
//             <View style={styles.select}>
//                 <Pressable
//                     style={styles.btnSelect}
//                     onPress={() => onOpen('marcas')} >
//                     <Text   style={styles.textSelect}>{getPlaceholder('marca')}</Text>
//                     <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
//                 </Pressable>
//                 <Pressable
//                     style={styles.btnSelect}
//                     onPress={() => onOpen('modelos')} >
//                     <Text style={styles.textSelect}>
//                         {getPlaceholder('modelo')}
//                     </Text>
//                     <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
//                 </Pressable>
//                 <Pressable
//                     style={[styles.btnSelect, { maxWidth: '25%' }]}
//                     onPress={() => onOpen('years')} >
//                     <Text style={styles.textSelect}>{getPlaceholder('year')}</Text>
//                     <MaterialCommunityIcons name='arrow-down-drop-circle-outline' color={Colors.bgColor} size={15} />
//                 </Pressable>
//             </View>

//             {
//                 reset && (
//                     <Pressable
//                         style={{ alignItems: 'flex-end', marginHorizontal: 10, marginVertical: 4, padding: 4 }}
//                         onPress={resetCar}
//                     >
//                         <Text style={{ color: 'black', textDecorationLine: 'underline' }} >Limpiar filtro</Text>
//                     </Pressable>
//                 )
//             }



//             <Modal
//                 testID={'marcas'}
//                 isVisible={marcasIsVisible}
//                 onSwipeComplete={() => setMarcasIsVisible(false)}
//                 swipeDirection={['down']}

//                 scrollOffsetMax={400 - 300}
//                 propagateSwipe={true}
//                 style={styles.modal}>
//                 <View style={styles.scrollableModal}>
//                     <ScrollView


//                         scrollEventThrottle={16}>
//                         <Pressable onPress={() => setMarcasIsVisible(false)} style={styles.btnClose} >
//                             <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
//                         </Pressable>
//                         <Box mx={5} my={5} >
//                             {
//                                 marcas.map(item => (
//                                     <Pressable
//                                         key={item._id}
//                                         onPress={() => {
//                                             handleMarca(item._id)
//                                             setMarcasIsVisible(false)
//                                         }}
//                                         style={styles.btnItem}
//                                     >
//                                         <Text style={{ color: 'black' }} >{item.name}</Text>
//                                     </Pressable>
//                                 ))
//                             }
//                         </Box>


//                     </ScrollView>
//                 </View>
//             </Modal>

//             <Modal
//                 testID={'modelos'}
//                 isVisible={modelosIsVisible}
//                 onSwipeComplete={() => setModelosIsVisible(false)}
//                 swipeDirection={['down']}

//                 scrollOffsetMax={400 - 300}
//                 propagateSwipe={true}
//                 style={styles.modal}>
//                 <View style={styles.scrollableModal}>
//                     <ScrollView


//                         scrollEventThrottle={16}>
//                         <Pressable onPress={() => setModelosIsVisible(false)} style={styles.btnClose} >
//                             <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
//                         </Pressable>
//                         <Box mx={5} my={5} >
//                             {
//                                 modelos.map(item => (
//                                     <Pressable
//                                         key={item._id}
//                                         onPress={() => {
//                                             handleModel(item._id)
//                                             setModelosIsVisible(false)
//                                         }}
//                                         style={styles.btnItem}
//                                     >
//                                         <Text style={{ color: 'black' }} >{item.name}</Text>
//                                     </Pressable>
//                                 ))
//                             }
//                         </Box>


//                     </ScrollView>
//                 </View>
//             </Modal>


//             <Modal
//                 testID={'years'}
//                 isVisible={yearsIsVisible}
//                 onSwipeComplete={() => setYearsIsVisible(false)}
//                 swipeDirection={['down']}

//                 scrollOffsetMax={400 - 300}
//                 propagateSwipe={true}
//                 style={styles.modal}>
//                 <View style={styles.scrollableModal}>
//                     <ScrollView


//                         scrollEventThrottle={16}>
//                         <Pressable onPress={() => setYearsIsVisible(false)} style={styles.btnClose} >
//                             <MaterialCommunityIcons name='close' color={Colors.bgColor} size={25} />
//                         </Pressable>
//                         <Box mx={5} my={5} >
//                             {
//                                 years.map(item => (
//                                     <Pressable
//                                         key={item}
//                                         onPress={() => {
//                                             handleYear(item)
//                                             setYearsIsVisible(false)
//                                         }}
//                                         style={styles.btnItem}
//                                     >
//                                         <Text style={{ color: 'black' }} >{item}</Text>
//                                     </Pressable>
//                                 ))
//                             }
//                         </Box>


//                     </ScrollView>
//                 </View>
//             </Modal>
//         </>

//     )



// }



// const styles = StyleSheet.create({
//     select: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginHorizontal: 10,
//         marginTop: 5,
//     },
//     btnSelectBase: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//     },
//     // Marca y Modelo: más espacio (flex: 2)
//     btnSelectLarge: {
//         flex: 2,
//     },
//     // Año: menos espacio (flex: 1)
//     btnSelectSmall: {
//         flex: 1,
//     },
//     textSelect: {
//         color: Colors.black,
//         marginRight: 5,
//         flex: 1,
//     },
//     btnSelect: {
//         flex: 1, // <- Importante: permite que cada botón tome espacio proporcional
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 5, // Reducido un poco
//         paddingVertical: 5,
//         maxWidth: '35%',
//     },
//     textSelect: {
//         color: Colors.black,
//         marginRight: 5,
//         flex: 1, // <- Permite que el texto se ajuste
       
//     },
//     modal: {
//         justifyContent: 'flex-end',
//         margin: 0,
//     },
//     scrollableModal: {
//         height: deviceHeight * 0.8,
//         backgroundColor: 'white',
//         // padding:20
//     },
//     btnClose: {
//         position: 'absolute',
//         right: 10,
//         top: 10
//     },
//     btnItem: {
//         borderBottomWidth: 1,
//         borderColor: Colors.gray,
//         paddingVertical: 10
//     }


// })