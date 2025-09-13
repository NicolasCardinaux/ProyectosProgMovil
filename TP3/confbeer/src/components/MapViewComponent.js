import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapViewComponent = ({ latitude, longitude }) => {
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#263c3f" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6b9a76" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#212a37" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca5b3" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#1f2835" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#f3d19c" }]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{ "color": "#2f3948" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#515c6d" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#17263c" }]
    }
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Ubicación de la conferencia"
          description="Concepción del Uruguay, Entre Ríos"
          pinColor="#BB86FC"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewComponent;