import React from "react";
import {Box, Divider, Flex, Spacer, Text} from "@chakra-ui/react";
import SliderCarousel from "../../../components/sliderCarousel";
import {menulist} from "../../../constants/variables";
import Footer from "../../../components/footer";

export default function Home({searchQuery}) {
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
        {searchQuery === "" && (
          <Box w="100%" h="300px" overflow="hidden" rounded={20} boxShadow="dark-lg">
            <SliderCarousel />
          </Box>
        )}
        {filteredMenuItems.length === 0 ? (
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Can't find item
          </Text>
        ) : (
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
