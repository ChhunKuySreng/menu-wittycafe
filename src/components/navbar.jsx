import React from "react";
import {NavLink, useLocation} from "react-router-dom";
import {Button, Flex, Image, Menu, MenuButton, Spacer, Text} from "@chakra-ui/react";
import {toAbsoluteUrl} from "../utils/helper";

export default function Navbar() {
  const location = useLocation();
  return (
    <Flex as="nav" py={4} px={4} position="sticky" bg="#633510" color="white" alignItems="center" boxShadow="lg" gap={4}>
      <NavLink to="/home">
        <Menu>
          <MenuButton as={Button} pl={0} leftIcon={<Image src={toAbsoluteUrl("/assets/wittycafe-logo.svg")} width={16} />} variant="none">
            <Text fontSize={26}>Witty Café</Text>
          </MenuButton>
        </Menu>
      </NavLink>
      <Spacer />
      <NavLink to="/menu">
        <Button isActive={location.pathname === "/menu" ? "true" : ""} variant={"outline"} color={location.pathname === "/menu" ? "#633510" : "white"}>Menu</Button>
      </NavLink>
    </Flex>
  );
}
