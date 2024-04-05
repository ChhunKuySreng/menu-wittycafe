import React, {useEffect, useState} from "react";
import {Box, Button, Flex, Image, Input, ListItem, Menu, MenuButton, Spacer, Text, UnorderedList} from "@chakra-ui/react";
import {toAbsoluteUrl} from "../utils/helper";
import {menulist} from "../constants/variables";

export default function Navbar({setSearchQuery}) {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 230;
      const active = menulist.find((menu) => {
        const section = document.getElementById(menu.id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          return scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight;
        }
        return false;
      });

      if (active && activeSection !== active.id) {
        setActiveSection(active.id);
      } else if (!active && activeSection !== "") {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);
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
  const [setShowLogo] = useState(false);
  useEffect(
    () => {
      const handleScroll = () => {
        const romduolBanner = document.getElementById("wittycafelogo");
        if (romduolBanner) {
          const {top} = romduolBanner.getBoundingClientRect();
          setShowLogo(top < 0);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    },
    //eslint-disable-next-line
    [],
  );
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Box pos="sticky" top="0px" zIndex="2" boxShadow="dark-lg">
      <Flex as="nav" py={4} px={4} bg="#633510" color="white" alignItems="center" boxShadow="lg" gap={4}>
        <Menu>
          <MenuButton onClick={scrollToTop} id="wittycafelogo" as={Button} pl={0} leftIcon={<Image src={toAbsoluteUrl("/assets/Logo.svg")} width={16} />} variant="none">
            <Text fontSize={26}>Witty Café</Text>
          </MenuButton>
        </Menu>
        <Spacer />
      </Flex>
      <UnorderedList as="nav" bg={"#633510"} py={6} m={0} listStyleType="none" textTransform="uppercase" whiteSpace="nowrap" overflowX="scroll" fontWeight="bold">
        <Flex gap={3} mx={4}>
          {menulist.map((menuList) => (
            <Box as="button" onClick={() => handleScrollTo(menuList.id)} cursor="pointer">
              <ListItem key={menuList.id} borderRadius={20} p={2} color={menuList.id === activeSection ? "#633510" : "Black"} bg={menuList.id === activeSection ? "#F4B223" : "white"}>
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
