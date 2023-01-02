import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { Divider,  Menu, Pressable } from 'native-base';
import { ProductContext } from '../../util/context/Product/ProductContext';

export const CarDefault = ({navigation}) => {
  const {
    activeCar,
    carDefault,
    cars
  } = useContext(ProductContext);
 
  
  return (
    <>
      <Menu 
        closeOnSelect={true} 
        w="190"  
        trigger={triggerProps => {
        return <Pressable {...triggerProps}>
                <Text>Mi auto: {carDefault && carDefault?.model.name} </Text>
              </Pressable>;
        }}
        
        >
        <Menu.OptionGroup defaultValue={carDefault && carDefault?._id} title="Mis Autos" type="radio">

          {
            cars.length > 0 ? (
              
                cars.map((c) => (
                  <Menu.ItemOption 
                  onPress={() => activeCar(c) }
                  key={c._id} 
                  value={c._id}
                  >
                    {c.model.name}
                  </Menu.ItemOption>
                ))
              
            ):(
              <Menu.ItemOption 
                  onPress={() => navigation.navigate('Garage') }
                  
                  value={'Vehiculo'}
                  >
                    Crea tu vehiculo
                </Menu.ItemOption>
            )
          }
          
       
          
          
        </Menu.OptionGroup>
       
      
      </Menu>
    </>
  )
}

