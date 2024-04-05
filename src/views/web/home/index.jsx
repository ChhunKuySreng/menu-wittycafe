import {Box, Text} from "@chakra-ui/react";
import React from "react";
import SliderCarousel from "../../../components/sliderCarousel";

export default function Home() {
  const slides = [<Box w="100%" h="100%" bg="red" />, <Box w="100%" h="100%" bg="green" />, <Box w="100%" h="100%" bg="blue" />];
  return (
    <Box textAlign={"center"} p={4}>
      <Box w="100%" h="250px" overflow="hidden" rounded={20}>
        <SliderCarousel slides={slides} />
      </Box>
      <Text fontSize={30} fontWeight={"bold"}>
        Home Witty Café
      </Text>
    </Box>
  );
}
