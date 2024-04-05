import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {Box, Flex, IconButton} from "@chakra-ui/react";
import React, {useState} from "react";

export default function SliderCarousel({slides}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };
  return (
    <Flex justify="center" align="center" w="100%" h="100%" position="relative">
      <IconButton icon={<ChevronLeftIcon />} color={"white"} variant={"outline"} onClick={prevSlide} position="absolute" left="1rem" zIndex="1" />
      {slides.map((slide, index) => (
        <Box key={index} w="100%" h="100%" opacity={index === currentIndex ? 1 : 0} transition="opacity 0.5s ease" position="absolute" left={0} top={0}>
          {slide}
        </Box>
      ))}
      <IconButton icon={<ChevronRightIcon />} color={"white"} variant={"outline"} onClick={nextSlide} position="absolute" right="1rem" zIndex="1" />
    </Flex>
  );
}
