import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SpinKit from 'react-native-spinkit';
import Colors from '../../util/styles/colors'
import { SearchInput } from '../customer-components/SearchInput';


export const SearchComponent = ({loading,setSearchText}) => {
  return (
    <>
    <View style={styles.top}>
        <SearchInput onDebounce={value => setSearchText(value)} />

        {loading ? (
        <SpinKit
        type="ThreeBounce"
        isVisible={loading}
        color={Colors.primarySolid}
        size={30}
        />
        ) : null}
    </View>
    </>
  )
}



const styles = StyleSheet.create({
    top: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        // borderColor: 'black',
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        paddingLeft: 10,
        color: 'grey',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
       
        
    },
})