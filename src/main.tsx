import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import "./style.css";
import "./Visual.css";
import Visual from "./Visual";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/visual/:dbName" element={<Visual />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
