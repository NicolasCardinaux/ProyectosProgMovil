import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';

import Header from './src/components/Header';
import ConferenceGrid from './src/components/ConferenceGrid';
import ConferenceDetail from './src/components/ConferenceDetail';

const Stack = createStackNavigator(); 

// Componente para la pantalla principal (Home).
function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Header searchText={searchText} setSearchText={setSearchText} />
      <ConferenceGrid navigation={navigation} searchText={searchText} />
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{ 
          headerStyle: {
            backgroundColor: '#1E1E1E',
            shadowColor: '#000',
            elevation: 4,
          },
          headerTintColor: '#BB86FC',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
          },
          cardStyle: {
            backgroundColor: '#121212',
          },
          headerTitleAlign: 'center',
          headerBackTitleVisible: false, 
        }}
      >
        {}
        <Stack.Screen
          name="Conferencias"
          component={HomeScreen}
          options={{
            title: '🍻 Conferencias Cerveceras', 
          }}
        />
        {}
        <Stack.Screen
          name="Detalle"
          component={ConferenceDetail}
          options={({ route }) => ({ 
            headerTitle: () => (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  color: '#BB86FC',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginHorizontal: 40, 
                }}
              >
                {route.params.conference.title}
              </Text>
            ),
            headerTitleAlign: 'center',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});