import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import BasePage from "./views";
import Home from "./views/web/home";
import Menu from "./views/web/menu";

export default function routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BasePage />}>
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Route>
        <Route path="/*" element={<Navigate to="/home" />}/>
      </Routes>
    </Router>
  );
}
