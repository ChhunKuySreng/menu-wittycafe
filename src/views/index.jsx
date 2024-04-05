import React from "react";
import {Box} from "@chakra-ui/react";
import Navbar from "../components/navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./web/home";
import Menu from "./web/menu";

export default function Index() {
  const routeItems = [
    {path: "/", element: <Home />},
    {path: "/menu", element: <Menu />},
  ];
  return (
    <Box maxW={"36rem"} h={"100vh"} m={"auto"} bg={"#CA9856"}>
      <Navbar />
      <Routes>
        {routeItems.map(({path, element}) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}
