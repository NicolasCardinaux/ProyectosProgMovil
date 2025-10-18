import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

// Componente para ingresar nuevas tareas (un campo de texto y un botón de agregar).
export default function ToDoInput({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    onAdd(text);
    setText(""); 
  };

  return (
    <View style={styles.container}>
      {}
      <TextInput
        style={styles.input}
        placeholder="Nueva tarea..."
        placeholderTextColor="#8b949e"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd} 
      />
      {}
      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#30363d",
    backgroundColor: "#161b22",
    color: "#f0f6fc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  buttonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
});