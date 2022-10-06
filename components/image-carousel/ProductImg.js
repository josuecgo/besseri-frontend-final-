import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { base_url } from '../../util/api/api_essentials'
import { deviceWidth } from '../../util/Dimentions'
import { Image } from 'native-base'
import { useState } from 'react'
import Carousel from 'react-native-snap-carousel'
import { useMemo } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'

export const ProductImg = ({imgs}) => {
    
    const [isOpen, setIsOpen] = useState(false)


   
    const renderImg = (img) => {
        let images = [];

        for(let i = 0; i <= (imgs.length - 1) ; i++){
            
            images.push({
                url: `${base_url}/${imgs[i]?.path}`,
                width: deviceWidth,
                // height: 240,
               
            })
        }

        return images
    }
    
  
    const renderItem = ({ item }) => {
        
        return (
        <>    
  

            <TouchableOpacity
            onPress={()=> setIsOpen(true) }
            >
                <Image
                source={{uri: `${base_url}/${item?.path}`}}
                style={styles.productImg}
                alt="Alternate Text"
                resizeMode="contain"
                /> 
            </TouchableOpacity>
        </>
        )

    }; 
  
    const memorizedValue = useMemo(() => renderItem, [imgs]);




    return (
        <>
            <Carousel 
            data={ imgs }
            renderItem={memorizedValue}
            sliderWidth={ deviceWidth }
            itemWidth={ deviceWidth }
            inactiveSlideOpacity={0.9}
            loop
            />
            <Modal 
                visible={isOpen} 
                transparent={true}
                onRequestClose={() => setIsOpen(false)}
                >
                <ImageViewer 
                imageUrls={renderImg(imgs)}
                onDoubleClick={()=>setIsOpen(false)}
                
                />
            </Modal>  
        
        </>
    );
}



const styles = StyleSheet.create({

    productImg: {
        width: deviceWidth,
        height: deviceWidth * 0.53,
        
    },
    slide: {
        width: deviceWidth,
        height: deviceWidth * 0.53,
        // justifyContent: 'center',
        // alignItems: 'center',
        // height: deviceWidth * 0.53,
    },
    slide3: {
        width: deviceWidth,
        height: deviceWidth * 0.53,
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white'
    },

    text: {
    //   color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
     
    }
})