import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Alert, // 1. Importar Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'; // 2. Importar uuid

import ToDoInput from "./components/ToDoInput";
import ToDoList from "./components/ToDoList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed

  // Cargar desde AsyncStorage (sin cambios)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("tasks");
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {
        console.log("Error al cargar", e);
      }
    })();
  }, []);

  // Guardar cada vez que cambia (sin cambios)
  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 3. Funciones envueltas en useCallback para optimización
  const addTask = useCallback((title) => {
    if (!title.trim()) return;
    const newTask = {
      id: uuid.v4(), // Usar uuid para un ID más robusto
      title,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    // 4. Lógica de confirmación con Alert
    Alert.alert(
      "Confirmar borrado",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
          },
          style: "destructive",
        },
      ]
    );
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>✨ To-Do App</Text>

      <ToDoInput onAdd={addTask} />

      <ToDoList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      {/* Contador + Filtros */}
      <View style={styles.footer}>
        <Text style={styles.counter}>
          Total: {tasks.length} | Completadas:{" "}
          {tasks.filter((t) => t.completed).length}
        </Text>

        <View style={styles.filters}>
          {["all", "active", "completed"].map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterActive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={styles.filterText}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Los estilos (styles) permanecen sin cambios
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#58a6ff",
    textAlign: "center",
    marginBottom: 20,
  },
  footer: { marginTop: 20 },
  counter: { color: "#c9d1d9", textAlign: "center", marginBottom: 10 },
  filters: { flexDirection: "row", justifyContent: "space-around" },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#21262d",
  },
  filterActive: {
    backgroundColor: "#238636",
  },
  filterText: { color: "#f0f6fc", fontWeight: "600", textTransform: "capitalize" },
});