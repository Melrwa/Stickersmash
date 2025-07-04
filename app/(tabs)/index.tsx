import { Text, View, StyleSheet, ImageSourcePropType, Platform } from 'react-native'
import Button from '../components/Button';
import ImageViewer from '../components/ImageViewer';
import * as ImagePicker from 'expo-image-picker'
import { useState, useRef } from 'react';
import CircleButton from '../components/CircleButton';
import IconButton from '../components/IconButton';
import EmojiPicker from '../components/EmojiPicker';
import EmojiList from '../components/EmojiList';
import EmojiSticker from '../components/EmojiSticker';
import {GestureHandlerRootView } from 'react-native-gesture-handler'
import * as MediaLibrary from 'expo-media-library'
import { captureRef } from 'react-native-view-shot'
import domtoimage from 'dom-to-image'

const placeholder=require('@/assets/images/background-image.png')



export default function Index(){
  const [selectedImage, setSelectedImage] =useState<string |undefined>(undefined);
  const [showAppOptions, setShowAppOptions]=useState<boolean>(false)
  const [isModalVisible, setIsModalVisible ]=useState<boolean>(false)
  const [ pickedEmoji, setPickedEmoji ] =useState<ImageSourcePropType | undefined>(undefined)
  const [ status, requestPermission ] = MediaLibrary.usePermissions()

  const imageRef=useRef<View>(null)


  if (status===null){
    requestPermission();
  }

  const pickImageAsync=async ()=>{
    let result =await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing:true,
      quality:1,
    });
    if (!result.canceled){
      setSelectedImage(result.assets[0].uri)
      setShowAppOptions(true)
    }else{
      alert('You did not select an image.')
    }
  };

  const onReset =()=>{
    setShowAppOptions(false)
  }

  const onModalClose=()=>{
    setIsModalVisible(false)
  }

  const onAddSticker=()=>{
    setIsModalVisible(true)

  }

  const onSaveImageAsync=async()=>{
    if(Platform.OS !=='web'){

  
    try{
      const localUri=await captureRef(imageRef,{
        height:440,
        quality:1,
      })
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri){
        alert('Saved!')
      }
    }catch(e){
      console.log(e)
    }
  }else{
    try {
      if (imageRef.current) {
        const dataUrl = await domtoimage.toJpeg(imageRef.current as unknown as Node, {
          quality: 0.95,
          width: 320,
          height: 440
        });
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } else {
        alert('Image reference is not available.');
      }
    } catch (e) {
      console.log(e)
    }
  }
}
 

 

  return(
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef}  collapsable={false}>
        <ImageViewer imgSource={placeholder} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
        </View>
      </View>
      {showAppOptions?(
        <View style={styles.optionContainer}>
           <View style={styles.optionRow}>
           <IconButton icon='refresh' label='Reset' onPress={onReset} />
           <CircleButton onPress={onAddSticker} />
           <IconButton icon='save-alt' label='save' onPress={onSaveImageAsync} />

           </View>
        </View>
        
      ):(
      
      <View  style={styles.footContainer}>
        <Button theme ='primary' label='Choose a photo' onPress={pickImageAsync} />
        <Button label='Use this photo' onPress={()=>setShowAppOptions(true)} />
      </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>
    </GestureHandlerRootView>
 
  );
}
const styles =StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#25292e',
    alignItems:'center',
    

  },
  imageContainer:{
    flex:1,
  },
  footContainer:{
    flex:1/3,
    alignItems:'center'
  },
  optionContainer:{
    position:'absolute',
    bottom:80,

  },
  optionRow:{
    alignItems:'center',
    flexDirection:'row'
  }


});