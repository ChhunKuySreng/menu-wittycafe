import React, {useEffect, useState} from "react";
import {Box, Flex, IconButton, Image, Modal, ModalContent, ModalOverlay, ModalCloseButton, ModalBody, ModalFooter, ModalHeader, useDisclosure} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {slide} from "../constants/variables";
import {toAbsoluteUrl} from "../utils/helper";

export default function SliderCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {isOpen, onOpen, onClose} = useDisclosure();

  useEffect(() => {
    const interval = !isOpen && setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, isOpen]);

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex === slide.length - 1 ? 0 : prevIndex + 1));
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? slide.length - 1 : prevIndex - 1));
  const openModal = () => onOpen();
  const closeModal = () => onClose();

  return (
    <Flex justify="center" align="center" w="100%" h="100%" position="relative">
      <IconButton icon={<ChevronLeftIcon />} color="#F4B223" variant="outline" onClick={prevSlide} position="absolute" left="1rem" zIndex="1" />
      {slide.map((slides, index) => (
        <Box key={index} w="100%" h="100%" opacity={index === currentIndex ? 1 : 0} transition="opacity 0.5s ease" position="absolute" left={0} top={0} onClick={openModal}>
          <Image src={toAbsoluteUrl(`/assets/${slides.src}`)} pos="absolute" top={{base: "-40px", md: "-130px"}} alt={slides.src} />
        </Box>
      ))}
      <IconButton icon={<ChevronRightIcon />} color="#F4B223" variant="outline" onClick={nextSlide} position="absolute" right="1rem" zIndex="1" />
      <Modal isCentered isOpen={isOpen} onClose={closeModal} size="xl" motionPreset="slideInBottom">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="#633510" color="white">
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <a href={toAbsoluteUrl(`/assets/${slide[currentIndex].src}`)} target="_blank" rel="noopener noreferrer">
              <Image src={toAbsoluteUrl(`/assets/${slide[currentIndex].src}`)} alt={slide[currentIndex].src} />
            </a>
          </ModalBody>
          <ModalFooter>
            <IconButton icon={<ChevronLeftIcon />} color="#F4B223" variant="outline" onClick={prevSlide} mr={3} />
            <IconButton icon={<ChevronRightIcon />} color="#F4B223" variant="outline" onClick={nextSlide} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
