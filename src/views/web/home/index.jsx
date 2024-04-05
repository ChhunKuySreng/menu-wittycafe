import React from "react";
import {Box, Divider, Flex, Image, Spacer, Text} from "@chakra-ui/react";
import SliderCarousel from "../../../components/sliderCarousel";
import {toAbsoluteUrl} from "../../../utils/helper";
import {menulist} from "../../../constants/variables";
import Footer from "../../../components/footer";

export default function Home({searchQuery}) {
  const slides = [
    <Box key="slide1" w="100%" h="100%">
      <Image src={toAbsoluteUrl("/assets/1.jpg")} pos="absolute" top={{base: "-40px", md: "-130px"}} />
    </Box>,
    <Box key="slide2" w="100%" h="100%" bg="green" />,
    <Box key="slide3" w="100%" h="100%" bg="blue" />,
  ];

  // Filter menu items based on search query
  const filteredMenuItems = menulist.reduce((acc, menuList) => {
    const filteredItems = menuList.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filteredItems.length > 0) {
      acc.push({...menuList, items: filteredItems});
    }
    return acc;
  }, []);

  return (
    <>
      <Box px={4} py={6} color={"white"}>
        {/* Conditionally render SliderCarousel based on presence of searchQuery */}
        {searchQuery === "" && (
          <Box w="100%" h="300px" overflow="hidden" rounded={20} boxShadow="dark-lg">
            <SliderCarousel slides={slides} />
          </Box>
        )}
        {/* Render filtered menu items or 'can't find item' text */}
        {filteredMenuItems.length === 0 ? (
          // Render 'can't find item' text when no items are found
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Can't find item
          </Text>
        ) : (
          // Render filtered menu items
          filteredMenuItems.map((menuList) => (
            <Box key={menuList.id} id={menuList.id}>
              <Text fontSize="2xl" fontWeight="bold" pt={10}>
                {menuList.name}
              </Text>
              <Divider borderBottomWidth={4} borderColor="red" />
              {menuList.items.map((item) => (
                <>
                  <Flex my={5} key={item.id}>
                    <Text fontSize="xl">
                      {item.id}. {item.name}
                    </Text>
                    <Spacer />
                    <Text fontSize="xl" fontWeight="bold">
                      $ {item.price}
                    </Text>
                  </Flex>
                  <Divider borderBottomWidth={2} />
                </>
              ))}
            </Box>
          ))
        )}
      </Box>
      <Footer />
    </>
  );
}
