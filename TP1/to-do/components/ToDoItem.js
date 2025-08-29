import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

function ToDoItem({ task, onToggle, onDelete }) {
  console.log("Renderizando item:", task.title);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        task.completed && styles.completed,
        pressed && { opacity: 0.6 },
      ]}
      onPress={() => onToggle(task.id)}
      onLongPress={() => onDelete(task.id)}
    >
      <Text
        style={[
          styles.text,
          task.completed && styles.textCompleted,
        ]}
      >
        {task.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 14,
    backgroundColor: "#21262d",
    borderRadius: 12,
    marginBottom: 8,
  },
  completed: { backgroundColor: "#2ea043" },
  text: { color: "#f0f6fc", fontSize: 16 },
  textCompleted: {
    textDecorationLine: "line-through",
    color: "#c9d1d9",
  },
});

export default React.memo(ToDoItem);