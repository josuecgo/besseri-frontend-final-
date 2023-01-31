import { TouchableOpacity} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { deviceWidth } from '../../util/Dimentions';


export const ButtonIconoInput = ({name, color, size, onPress,sending}) => {
    
    return (
      <TouchableOpacity 
      onPress={onPress} 
      style={{height:30,alignItems:'center',justifyContent:'center' }} 
      disabled={sending}
      >
        <MaterialIcons  size={size} name={name}  color={sending ? color : color}  />
      </TouchableOpacity>
    );
};





