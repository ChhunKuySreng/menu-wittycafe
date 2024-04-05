import {Link, Text, VStack} from "@chakra-ui/react";
import React from "react";
import copy from "copy-to-clipboard";

export default function Footer() {
  const year = new Date().getFullYear();
  const phoneNumber = "010472020";
  const copyToClipboard = () => {
    copy(phoneNumber);
    alert(`Copied "${phoneNumber}"`);
  };
  return (
    <VStack mt="50px" textAlign="center" bg="#633510" h={120} color="white" justifyContent="center" alignItems="center">
      <Text>Witty Café © {year}</Text>
      <Text>
        Contact Us : <Link onClick={copyToClipboard}>010472020</Link>
      </Text>
      <Text>
        Facebook: <Link href="https://www.facebook.com/profile.php?id=100063678424712">Witty Café Cambodia</Link>
      </Text>
    </VStack>
  );
}
