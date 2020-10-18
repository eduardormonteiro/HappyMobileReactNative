import React, { useEffect, useState} from 'react'
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import mapMarker from '../images/map-marker.png';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';
import api from '../services/api';
import * as Location from 'expo-location';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface LocationProps {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function OrphanagesMap(){
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const navigation = useNavigation();
    const [location, setLocation] = useState<Location.LocationObject>();

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

    useFocusEffect(() => {
      api.get('orphanages').then( response => {
        setOrphanages(response.data);
      });
    });
    // if (userPosition.latitude === 0){
    //   return <View/>;
    // }
    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id })
    }
    function handleNavigateToCreateOrphanage() {
      if (location) {
        navigation.navigate("SelectMapPosition", { location });
      }
      return;
    }
    

    return (
        <View style={styles.container}>
        <MapView 
          provider = {PROVIDER_GOOGLE} 
          style={styles.map} 
          initialRegion={{
            latitude: location ? location.coords.latitude : -23.507147,
            longitude: location ? location.coords.longitude : -46.6305992,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
  
          }} 
        >
          {orphanages.map(orphanage => {
            return (
              <Marker 
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor= {{
                x : 2.7,
                y : 0.8,
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
             >
               <Callout tooltip={true} onPress={ () => handleNavigateToOrphanageDetails(orphanage.id)} >
                 <View style= {styles.calloutContainer} >
                    <Text style= {styles.calloutText}> {orphanage.name}</Text>
                 </View>
               </Callout>
            </Marker>
            )
          })}
        </MapView>
        <View style={styles.footer}>
          <Text style={styles.footerText}> {orphanages.length} orphanages found </Text>
          <RectButton style={styles.createOrphanageButton} onPress={ handleNavigateToCreateOrphanage}>
            <Feather name="plus" size={20} color="#FFF" ></Feather>
          </RectButton>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
  
    },
    map : {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
  
    calloutText: {
      color: '#0089a5',
      fontSize: 14,
    },
    footer: {
      position : 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: "#FFF",
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3,
    },
    footerText: {
      color : '#bfa7b3',
      fontFamily: 'Nunito_700Bold',
  
  
    },
    createOrphanageButton: { 
      width : 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });