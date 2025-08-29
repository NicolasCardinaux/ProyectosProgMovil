import React from "react";
import { StatusBar } from "expo-status-bar";
import Counter from "./components/Counter";

export default function App() {
  return (
    <>
      <Counter />
      <StatusBar style="auto" />
    </>
  );
}
