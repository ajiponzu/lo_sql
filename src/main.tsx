import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import "./style.css";
import "./Visual/Visual.css";
import Visual from "./Visual";
import { RecoilRoot } from "recoil";
import Details from "./Visual/Details";
import Contents from "./Visual/Contents";
import TableInf from "./Visual/TableInf";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/visual" element={<Visual />}>
            <Route path="details/:tableName" element={<Details />} />
            <Route path="contents/:tableName" element={<Contents />} />
            <Route path="table_inf/:tableName" element={<TableInf />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
