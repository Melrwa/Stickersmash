import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, Link } from 'expo-router'

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{title:'Oops! Not Found'}} />
      <View style={styles.container}>
         <Link href='/' style={styles.button}>Go back To Home Screen</Link>
      </View>
     
    </>
  )
}

export default NotFoundScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#25292e',
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        fontSize:20,
        textDecorationLine:'underline',
        color:'#fff'
    }
})