import React, {useState} from "react";
import {Box} from "@chakra-ui/react";
import Navbar from "../components/navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./web/home";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const routeItems = [{path: "/", element: <Home setSearchQuery={setSearchQuery} searchQuery={searchQuery} />}];
  return (
    <Box maxW={"36rem"} minH="100vh" h={"100%"} m={"auto"} bg={"#CA9856"}>
      <Navbar setSearchQuery={setSearchQuery} />
      <Routes>
        {routeItems.map(({path, element}) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}
