import React from "react";
import { FlatList } from "react-native";
import ToDoItem from "./ToDoItem"; 

// Componente responsable de renderizar la lista completa de tareas.
function ToDoList({ tasks, onToggle, onDelete }) {
  return (
    <FlatList
      data={tasks} 
      keyExtractor={(item) => item.id} 
      renderItem={({ item }) => (
        <ToDoItem
          task={item}
          onToggle={onToggle} 
          onDelete={onDelete}
        />
      )}
    />
  );
}


export default React.memo(ToDoList);