import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import MapViewComponent from './MapViewComponent';
import Icon from '@expo/vector-icons/FontAwesome';

// Componente para mostrar la pantalla de detalle de una conferencia.
const ConferenceDetail = ({ route }) => {
  const { conference } = route.params;

  // Función para abrir la ubicación en la app de mapas.
  const openInMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${conference.location.latitude},${conference.location.longitude}`;
    const label = conference.location.address;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={conference.image} style={styles.image} />
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{conference.title}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="user-circle" size={16} color="#BB86FC" />
            <Text style={styles.speaker}> {conference.speaker}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock-o" size={16} color="#03DAC6" />
            <Text style={styles.time}> {conference.time}</Text>
          </View>
        </View>

        <Text style={styles.fullDescription}>{conference.fullDescription}</Text>

        {}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="list-alt" size={20} color="#BB86FC" />
            <Text style={styles.sectionTitle}> Temas a tratar</Text>
          </View>
          {conference.topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.topic}>{topic}</Text>
            </View>
          ))}
        </View>

        {}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={20} color="#BB86FC" />
            <Text style={styles.sectionTitle}> Ubicación</Text>
          </View>
          <Text style={styles.locationAddress}>{conference.location.address}</Text>
          <MapViewComponent
            latitude={conference.location.latitude}
            longitude={conference.location.longitude}
          />
          <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
            <Icon name="external-link" size={16} color="#121212" />
            <Text style={styles.openMapsButtonText}>Abrir en Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    padding: 25,
    marginTop: -30,
    backgroundColor: '#121212',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 25,
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  speaker: {
    fontSize: 16,
    color: '#BB86FC',
    fontWeight: '600',
  },
  time: {
    fontSize: 16,
    color: '#03DAC6',
    fontWeight: '600',
  },
  fullDescription: {
    fontSize: 16,
    color: '#D0D0D0',
    lineHeight: 26,
    marginBottom: 30,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#BB86FC',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginLeft: 5,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BB86FC',
    marginTop: 8,
    marginRight: 12,
  },
  topic: {
    fontSize: 16,
    color: '#D0D0D0',
    flex: 1,
    lineHeight: 24,
  },
  locationAddress: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  openMapsButton: {
    flexDirection: 'row',
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  openMapsButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});

export default ConferenceDetail;