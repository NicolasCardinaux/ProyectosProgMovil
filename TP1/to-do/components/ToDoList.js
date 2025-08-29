import React from "react";
import { FlatList } from "react-native";
import ToDoItem from "./ToDoItem";

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

// Exportar la versión memoizada del componente
export default React.memo(ToDoList);