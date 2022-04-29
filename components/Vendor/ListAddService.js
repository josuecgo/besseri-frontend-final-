import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';
import ListCard from './ListCard';

export const ListAddService = ({
    data,
    credencial,
    selectedMakers,
    setSelectedMakers,
    isChooseMaker,
    inputValues,
    isChooseModel,
    isChooseCategory,
    selectedMakersIds,
    setSelectedMakersIds,
    setInputValues,
}) => {
   
    
    return (
        <>
            {data.map((item, index) => (
                <View key={index} >
                    <ListCard
                        index={index}
                        name={item.name}
                        selected={inputValues[credencial]?._id == item._id}
                        onPress={() => {
                            if (isChooseMaker)
                                setInputValues({
                                    ...inputValues,
                                    [credencial]: item,
                                });
                            if (isChooseModel)
                                setInputValues({
                                    ...inputValues,
                                    [credencial]: item,
                                });
                            if (isChooseCategory) {
                                setInputValues({
                                    ...inputValues,
                                    [credencial]: item,
                                });
                            }
                        }}
                />
                </View>
      ))}
        </>
    );
};

const styles = StyleSheet.create({});
