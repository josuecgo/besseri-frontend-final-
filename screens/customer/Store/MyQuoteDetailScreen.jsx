import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { customer_api_urls } from '../../../util/api/api_essentials';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { InfoQuote } from '../../../components/Customer/InfoQuotation';
import { moneda } from '../../../util/Moneda';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import Colors from '../../../util/styles/colors';
import { Button, HStack } from 'native-base';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import { useCart } from '../../../hooks/useCart';

export const MyQuoteDetailScreen = ({ route,navigation }) => {
    const { quoteId } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [quotation, setQuotation] = useState(null);
    const [offers, setOffers] = useState([]);
    const {comision} = useContext(ProductContext);
    const { addItemToCart } = useCart()

    const getQuotationDetail = async (quotationId) => {
        if (!quotationId) {
            console.log("No se proporcionó un ID de cotización.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const result = await axios.get(`${customer_api_urls.detail_quote}/${quotationId}`);

        if (result.data?.data) {
            setQuotation(result.data?.data);
        }

        setIsLoading(false);
    };


    const getQuotes = async (id) => {

        try {

            const apiCall = await axios.get(`${customer_api_urls.quote_recived}/${id}`);


            setOffers(apiCall.data.data)

        } catch (error) {
            console.log(error);
        }


    }

    const incrementPriece = (price, discount) => {
        let increase = (price * discount) / 100;
        // Sumar el 10% al precio original
        let newPrice = price + increase;

        return moneda(newPrice);
    }

    const accepteOffer = (offer) => {
        Alert.alert("Aceptar oferta", `¿Estas seguro de aceptar este producto? una vez aceptado el producto finalizara la cotizacion.`,
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Aceptar", onPress: () => createProductQuote(offer) }
            ]

        );
    };

    const createProductQuote = async (product) => {
        try {

            const apiCall = await axios.post(`${customer_api_urls.create_product_quote}`, product);

            
            const productCreate = apiCall.data.data;
            let resp = await addItemToCart(productCreate)

            if (resp) {
              navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK);
            }

        } catch (error) {
            console.log(error,'createProductQuote');

        }
    }


    useEffect(() => {
        if (quoteId) {
            getQuotationDetail(quoteId);
        }
    }, [quoteId])

    useEffect(() => {
        if (quoteId) {
            getQuotes(quoteId);
        }
    }, [quoteId])



    if (isLoading) return <LoaderComponent isVisible={true} />;


    if (!quotation) return (
        <View style={styles.container}>
            <Text style={styles.errorText}>No se pudo cargar la información de la cotización.</Text>
        </View>
    );



    
    return (
        <View style={styles.container} >
            <ScrollView>

                <InfoQuote quotation={quotation} />

                {
                    offers.length > 0 ? (
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Ofertas Recibidas</Text>
                            {
                                offers.map((offer) => (
                                    <View key={offer._id}
                                        style={styles.card}
                                    >
                                        <Text style={styles.storeName}>Refaccionaria {offer.vendorId.storeName}</Text>
                                        <Text style={styles.price}>Marca: {offer?.brandId?.name}</Text>
                                        <Text style={styles.price}>Producto: {offer?.name}</Text>

                                        <Text style={styles.price}>Precio Ofrecido:  {incrementPriece((Number(offer?.price) + Number(comision * offer?.price / 100)), 0)} MXN</Text>

                                        <HStack justifyContent={'center'} >
                                           {
                                            quotation.status === 'completado' ? (
                                                <Text style={styles.finish}>Cotizacion finalizada</Text>
                                            ) : (
                                                <>
                                                <Button
                                                    onPress={() => accepteOffer(offer)}
                                                    variant={'outline'}
                                                    borderColor={Colors.seguimiento}
                                                    flex={1}
                                                    _text={{ color: Colors.seguimiento }}
                                                >
                                                    Aceptar cotizacion
                                                </Button>

                                                </>
                                            )
                                           }

                                           
                                        </HStack>

                                    </View>
                                ))
                            }
                        </View>
                    ) : (
                        <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>No hay ofertas recibidas para esta cotización.</Text>
                    )
                }

                <View style={{ height: 50 }}></View>

            </ScrollView>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.white
    },
    card: {
        borderWidth: 1,
        // borderColor:'#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    },
    storeName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#000' },
    price: { fontSize: 14, color: '#000' },
    finish: {
        fontSize: 14,
        color: Colors.succes,
        fontWeight: 'bold',
        // textAlign: 'center'
    },
})