import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export const SemaforoChecks = ({ value }) => {
    const [redOn, setRedOn] = useState(value === 'malo');
    const [yellowOn, setYellowOn] = useState(value === 'regular');
    const [greenOn, setGreenOn] = useState(value === 'bueno');

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.light,
                    {
                        backgroundColor: redOn ? '#FF3366' : '#FF3366'
                    },
                ]}
            />
            <View
                style={[
                    styles.light,
                    {
                        backgroundColor: yellowOn ? '#FFFF33' : '#FFFF33'
                    },
                ]}
            />
            <View
                style={[
                    styles.light,
                    { backgroundColor: greenOn ? '#33FF33' : '#33FF33' },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // Ajusta según sea necesario
    },
    light: {
        width: 30,
        height: 30,
        margin: 5,
        borderRadius: 25,
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.8,
    },

});
