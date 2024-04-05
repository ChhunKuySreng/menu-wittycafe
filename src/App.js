import {ChakraProvider} from "@chakra-ui/react";
import "./App.css";
import Routes from "./routes";

function App() {
  return (
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  );
}

export default App;
