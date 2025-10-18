import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";

// Define paletas de colores para los temas claro (botones azules) y oscuro (botones rojos).
const themes = {
  light: {
    containerBg: "#F0F2F5",
    cardBg: "#FFFFFF",
    textColor: "#1C1C1E",
    buttonColor: "#007AFF", 
    buttonText: "#FFFFFF",
    shadowColor: "#000000",
  },
  dark: {
    containerBg: "#000000",
    cardBg: "#1C1C1E",
    textColor: "#FFFFFF",
    buttonColor: "#FF3B30", 
    buttonText: "#FFFFFF",
    shadowColor: "#FFFFFF",
  },
};


export default function Counter() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);


  const theme = themes[darkMode ? "dark" : "light"];

  const isMax = count >= 10;
  const isMin = count <= 0;

  return (

    <View style={[styles.container, { backgroundColor: theme.containerBg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />

      {}
      <View style={[styles.card, { backgroundColor: theme.cardBg, shadowColor: theme.shadowColor }]}>
        <Text style={[styles.counterText, { color: theme.textColor }]}>{count}</Text>

        {}
        {isMax && <Text style={styles.warningText}>⚠ Máximo alcanzado</Text>}
        {isMin && <Text style={[styles.warningText, { color: '#007AFF' }]}>⚠ Mínimo alcanzado</Text>}
      </View>

      {}
      <View style={styles.controlsContainer}>
        {}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.buttonColor, shadowColor: theme.shadowColor },
            isMin && styles.buttonDisabled, 
            pressed && !isMin && styles.buttonPressed, 
          ]}
          onPress={() => setCount((prev) => prev - 1)}
          disabled={isMin} 
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>-1</Text>
        </Pressable>

        {}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.buttonColor, shadowColor: theme.shadowColor },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setCount(0)}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Reset</Text>
        </Pressable>

        {}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.buttonColor, shadowColor: theme.shadowColor },
            isMax && styles.buttonDisabled,
            pressed && !isMax && styles.buttonPressed,
          ]}
          onPress={() => setCount((prev) => prev + 1)}
          disabled={isMax}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>+1</Text>
        </Pressable>
      </View>

      {}
      <Pressable
        style={({ pressed }) => [
          styles.themeToggleButton,
          { backgroundColor: theme.buttonColor, shadowColor: theme.shadowColor },
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setDarkMode((prev) => !prev)}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          {darkMode ? "☀️ Tema Claro" : "🌙 Tema Oscuro"}
        </Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 50,
    minHeight: 220,
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  counterText: {
    fontSize: 120,
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF9500",
    marginTop: 10,
    position: 'absolute',
    bottom: 15,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#8E8E93",
    opacity: 0.7,
    elevation: 0,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  themeToggleButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});