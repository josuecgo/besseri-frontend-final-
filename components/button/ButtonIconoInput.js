import { TouchableOpacity} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ButtonIconoInput = ({name, color, size, onPress}) => {
    
    return (
      <TouchableOpacity onPress={onPress} style={{ width:25,height:30,alignItems:'center',justifyContent:'center' }} >
        <FontAwesome color={color} size={size} name={name} />
      </TouchableOpacity>
    );
};



