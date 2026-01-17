import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("Main.tsx loading...");

const root = document.getElementById("root");

if (root) {
  console.log("Root found, rendering app...");
  try {
    createRoot(root).render(<App />);
    console.log("App rendered");
  } catch (error) {
    console.error("Render error:", error);
    root.innerHTML = `<div style="padding: 20px; color: red;">Error: ${error}</div>`;
  }
} else {
  console.error("Root element not found");
}