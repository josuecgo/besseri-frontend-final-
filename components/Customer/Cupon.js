import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Input } from 'native-base';
import axios from 'axios';
import { vendor_api_urls } from '../../util/api/api_essentials';
import { getUserId } from '../../util/local-storage/auth_service';
import { showToaster } from '../../util/constants';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';

export const Cupon = ({ setCoupon, serviceId }) => {
    const [txtCupon, setTxtCupon] = useState('');
    const [aplicado, setAplicado] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const aplicarPromotion = async (value) => {
        try {
            setIsLoading(true);
            const id = await getUserId();
            if (!id) {
                showToaster('Necesitas estar registrado');
                setIsLoading(false);
                return;
            }

            if (!value) {
                showToaster('Código incompleto');
                setIsLoading(false);
                return;
            }

            const data = {
                code: value.toUpperCase(),
                serviceId: serviceId
            };

            const apiCall = await axios.post(`${vendor_api_urls.search_promotion_besser}/${id}`, data);

            if (apiCall?.data?.data?.success) {
                setAplicado(apiCall.data.data.coupon);
                setCoupon(apiCall.data.data.coupon);
                showToaster('Cupón aplicado correctamente');
            } else {
                showToaster(apiCall?.data?.data.message);
            }

            setTxtCupon(''); // Resetear el campo de texto después de aplicar el cupón
        } catch (error) {
            console.log(error, 'aplicar promotion');
            showToaster('Error al aplicar el cupón');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <View style={styles.body}>
                <Input 
                    placeholder="Cupón" 
                    size="xs" 
                    w="55%" 
                    maxWidth="300px" 
                    onChangeText={setTxtCupon} 
                    value={txtCupon.toUpperCase()}
                />

                <Button
                    size="xs"
                    onPress={() => aplicarPromotion(txtCupon)}
                    variant="outline"
                    _text={{
                        fontWeight: '700',
                        fontSize: '14px',
                        color: Colors.white,
                        fontStyle: 'normal'
                    }}
                    isLoading={isLoading}
                >
                    Aplicar
                </Button>
            </View>

            <View style={styles.aplicado}>
                <Text style={styles.cupon}>{aplicado?.code}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    body: {
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    aplicado: {
        marginHorizontal: 11,
        marginVertical: 5
    },
    cupon: {
        fontSize: adjust(10),
        color: Colors.white
    }
});
