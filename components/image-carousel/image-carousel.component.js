import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import Colors from '../../util/styles/colors';

const images = [personMockImage, personMockImage, personMockImage];

const ImageCarouselComponent = ({imagesArray = images}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {width} = useWindowDimensions();
  const height = width * 0.6;

  const onChange = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== activeImageIndex) {
      setActiveImageIndex(slide);
    }
  };

  return (
    <View>
      <ScrollView
        onScroll={onChange}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{width: width, height: height}}>
        {imagesArray.map((image, index) => {
          return (
            <Image
              key={index}
              style={{width: width, height: 300, resizeMode: 'cover'}}
              source={image}
            />
          );
        })}
      </ScrollView>
      <View style={styles.paginationDots}>
        {imagesArray.map((_, index) => {
          return (
            <Text
              key={index}
              style={[
                styles.dotStyles,
                {
                  color:
                    activeImageIndex === index ? Colors.white : Colors.dark,
                },
              ]}>
              ⬤
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 5,
  },
  dotStyles: {
    fontSize: 10,
    marginRight: 5,
  },
});

export default ImageCarouselComponent;
