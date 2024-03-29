import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import ButtonComponent from '../../components/button/button.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    SCREEN_HORIZONTAL_MARGIN,
    showToaster,
    VENDOR_DETAILS_ROUTES,
} from '../../util/constants';
import { useRoute } from '@react-navigation/native';
import { api_statuses, base_url } from '../../util/api/api_essentials';
import axios from 'axios';
import { vendor_api_urls } from '../../util/api/api_essentials';
import LoaderComponent from '../../components/Loader/Loader.component';
import { getBusinessId, getUserId } from '../../util/local-storage/auth_service';
import { adjust, deviceHeight, deviceWidth } from '../../util/Dimentions';

import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { moneda } from '../../util/Moneda';
import { ProductImg } from '../../components/image-carousel/ProductImg';
import { DetailsProduct } from '../../components/Vendor/DetailsProduct';

const VendorProductDetailsScreen = ({ navigation, route }) => {
    const { width } = useWindowDimensions();
    const { params } = useRoute();
    const [product, setProduct] = useState(params.data);
    const [showLoader, setShowLoader] = useState(false);

    const goBack = () => {
        navigation.goBack();
    };

    const changeProductsStock = async () => {
        try {
            setShowLoader(true);
            const uri = product?.inStock
                ? vendor_api_urls.out_of_stock
                : vendor_api_urls.inStock;
            const apiCall = await axios.post(uri, {
                productId: product?._id,
            });
            setShowLoader(false);
            if (apiCall.status == api_statuses.success) {
                setProduct(apiCall.data.data);
                // console.log(apiCall.data);
                showToaster(
                    `Este producto fue marcado como ${product?.inStock ? 'sin' : 'con'
                    } stock.`,
                );
            } else {
                showToaster('Algo salió mal, inténtalo de nuevo más tarde. -1');
            }
        } catch (e) {
            // console.log(e);
            setShowLoader(false);
            showToaster('Algo salió mal, inténtalo de nuevo más tarde.');
        }
    };

    const deleteProduct = async () => {
        try {
            setShowLoader(true);
            const businessId = await getBusinessId();
            const userId = await getUserId();
            const apiCall = await axios.post(vendor_api_urls.delete_product, {
                productId: product?._id,
                userId: userId,
                businessId: businessId,
            });
            setShowLoader(false);
            if (apiCall.status == api_statuses.success) {
                setProduct(apiCall.data.data);
                // console.log(apiCall.data);
                showToaster('Este producto fue eliminado con éxito.');
                navigation.navigate(VENDOR_DETAILS_ROUTES.PRODUCT_LISTING);
            } else {
                showToaster('Algo salió mal, inténtalo de nuevo más tarde.');
                // console.log(apiCall.data);
            }
        } catch (e) {
            // console.log('Error', e.response.data);
            setShowLoader(false);
            showToaster('Algo salió mal, inténtalo de nuevo más tarde.');
        }
    };

    // console.log(product);
    return (
        <>
            <HeaderBackground />
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Ionicons size={20} color={Colors.white} name="arrow-back-outline" />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingLeft: deviceWidth * 0.03 }}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                            CommonStyles.fontFamily,
                            { color: Colors.white, fontSize: adjust(14), fontWeight: 'bold' },
                        ]}>
                        {product?.name}
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ backgroundColor: Colors.white }}
                showsVerticalScrollIndicator={false}>
                <View style={[styles.productDetailsScreen]}>
                    <LoaderComponent isVisible={showLoader} />

                    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        {product?.urlsImg ? (
                            product?.urlsImg?.length > 0 ? (
                                <ProductImg imgs={product?.urlsImg} />
                            ) : (
                                <Image
                                    source={{ uri: `${base_url}/${product?.productImg}` }}
                                    style={styles.productImg}
                                />
                            )
                        ) : (
                            <Image
                                source={{ uri: `${base_url}/${product?.productImg}` }}
                                style={styles.productImg}
                            />
                        )}
                    </View>

                    <View style={[styles.contentContainer]}>
                        {/* Detalles del producto */}
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: 4,
                                margin: deviceWidth * 0.03,
                                elevation: 1,
                                backgroundColor: Colors.white,
                            }}>
                            <View
                                style={[
                                    CommonStyles.flexDirectionRow,
                                    {
                                        width: width - SCREEN_HORIZONTAL_MARGIN * 2,
                                        marginTop: deviceHeight * 0.03,
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                    },
                                ]}>
                                <View>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={[CommonStyles.fontFamily, styles.productHeading]}>
                                        {product?.name}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={[CommonStyles.fontFamily, styles.price]}>
                                        {moneda(product?.price)} MXN
                                    </Text>
                                </View>
                            </View>

                            <View style={{ width: width - SCREEN_HORIZONTAL_MARGIN * 2 }}>
                                <Text
                                    style={[
                                        CommonStyles.fontFamily,
                                        styles.productDetails,
                                        { opacity: 0.5, textTransform: 'uppercase' },
                                    ]}>
                                    Detalles de producto
                                </Text>
                            

                                <DetailsProduct
                                    label="Descripcion: "
                                    value={` ${product?.description}`}
                                />

                                <DetailsProduct
                                    label="Tiempo de entrega: "
                                    value={` ${product?.estimatedDelivery}`}
                                />

                                <DetailsProduct
                                    label="Modelo: "
                                    value={` ${product?.model?.name}`}
                                />

                                <DetailsProduct
                                    label="Marca: "
                                    value={` ${product?.maker?.name}`}
                                />

                                {product?.aplicacion && (
                                    <DetailsProduct
                                        label="Año"
                                        value={` ${product?.aplicacion?.de} al ${product?.aplicacion?.al}`}
                                    />
                                )}

                                <Text style={[CommonStyles.fontFamily, { marginBottom: 10 }]}>
                                    <Text
                                        style={{
                                            color: product?.inStock ? '#0bda51' : 'red',
                                            fontSize: adjust(13),
                                        }}>
                                        Stock:{' '}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: adjust(13),
                                            color: product?.inStock ? '#0bda51' : 'red',
                                        }}>
                                        {product?.inStock ? 'Disponible' : 'Agotado.'}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        {/*Fin Detalles del producto */}

                        {/* Botones inferiores */}
                        <View style={{ marginBottom: Platform.OS == 'ios' ? 15 : 30 }}>
                            <ButtonComponent
                                marginTop={10}
                                width={width}
                                height={deviceWidth * 0.15}
                                colorB={
                                    product?.inStock ? Colors.primarySolid : Colors.primarySolid
                                }
                                buttonText={
                                    product?.inStock
                                        ? 'Agotado'
                                        : 'Marque esto como producto en stock ahora'
                                }
                                handlePress={() => {
                                    Alert.alert(
                                        product?.inStock
                                            ? '¿Está realmente agotado este producto?'
                                            : '¿Está el producto nuevamente en stock?',
                                        product?.inStock
                                            ? 'Después de marcar este producto como agotado, los clientes no podrán pedir este producto.'
                                            : 'Después de marcar este producto en stock, los clientes podrán pedir este producto.',
                                        [
                                            {
                                                text: 'No',
                                            },
                                            {
                                                text: 'Si',
                                                onPress: changeProductsStock,
                                            },
                                        ],
                                    );
                                }}
                                padding={15}
                                borderRadius={0}
                            />
                            <ButtonComponent
                                marginTop={5}
                                width={width}
                                height={deviceWidth * 0.15}
                                colorB={Colors.terciarySolid}
                                buttonText="Editar Producto"
                                handlePress={() => {
                                    navigation.navigate(VENDOR_DETAILS_ROUTES.CREATE_PRODUCT, {
                                        isEdit: true,
                                        product: product,
                                    });
                                }}
                                padding={15}
                                borderRadius={0}
                            />
                            <ButtonComponent
                                marginTop={5}
                                width={width}
                                height={deviceWidth * 0.15}
                                colorB={Colors.red}
                                buttonText="Eliminar Producto"
                                handlePress={() => {
                                    Alert.alert(
                                        '¿Realmente desea eliminar este producto?',
                                        'Después de eliminar este producto, no podrá restaurarlo y los clientes no podrán volver a pedir este producto.',
                                        [
                                            {
                                                text: 'No',
                                            },
                                            {
                                                text: 'Si',
                                                onPress: deleteProduct,
                                            },
                                        ],
                                    );
                                }}
                                padding={15}
                                borderRadius={0}
                            />
                        </View>
                        {/* Fin Botones inferiores */}
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,
        paddingLeft: 10,
    },
    productDetailsScreen: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    backButton: {
        zIndex: 2,
        position: 'absolute',
        top: 20,
        left: 20,
    },
    contentContainer: {
        justifyContent: 'space-between',
        flex: 1,
        elevation: 1,
    },
    productHeading: {
        fontSize: 20,
        flex: 3,
    },
    price: {
        fontSize: 18,
        opacity: 0.5,
    },
    productDetails: {
        marginVertical: deviceHeight * 0.02,
    },
    productImg: {
        width: '100%',
        height: deviceWidth * 0.53,
        resizeMode: 'stretch',
    },
});

export default VendorProductDetailsScreen;
