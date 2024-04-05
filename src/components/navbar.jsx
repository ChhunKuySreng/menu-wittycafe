import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Box, Button, Flex, Image, Input, ListItem, Menu, MenuButton, Spacer, Text, UnorderedList} from "@chakra-ui/react";
import {toAbsoluteUrl} from "../utils/helper";
import {menulist} from "../constants/variables";

export default function Navbar({setSearchQuery}) {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 220,
        behavior: "smooth",
      });
    }
  };
  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    setSearchQuery(query);
  };
  return (
    <Box pos="sticky" top="0px" zIndex="2">
      <Flex as="nav" py={4} px={4} bg="#633510" color="white" alignItems="center" boxShadow="lg" gap={4}>
        <NavLink to="/">
          <Menu>
            <MenuButton as={Button} pl={0} leftIcon={<Image src={toAbsoluteUrl("/assets/Logo.svg")} width={16} />} variant="none">
              <Text fontSize={26}>Witty Café</Text>
            </MenuButton>
          </Menu>
        </NavLink>
        <Spacer />
      </Flex>
      <UnorderedList as="nav" bg={"#633510"} py={6} m={0} listStyleType="none" textTransform="uppercase" whiteSpace="nowrap" overflowX="scroll" fontWeight="bold">
        <Flex gap={3} mx={4}>
          {menulist.map((menuList) => (
            <Box as="button" onClick={() => handleScrollTo(menuList.id)} cursor="pointer">
              <ListItem key={menuList.id} borderRadius={20} p={2} bg="white">
                {menuList.name}
              </ListItem>
            </Box>
          ))}
        </Flex>
      </UnorderedList>
      <Flex py={4} px={4} bg="#633510" color="white">
        <Input borderRadius={20} placeholder="Search menu..." value={searchInput} onChange={handleSearchInputChange} />
      </Flex>
    </Box>
  );
}
