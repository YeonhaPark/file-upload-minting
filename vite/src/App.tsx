import { Button, Flex, Text } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FC, useEffect, useState } from "react";
import mintContractAbi from "../lib/mintContractAbi.json";

const App: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const onClickMetamask = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      setSigner(await provider.getSigner());
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => console.log({ contract }), [contract]);
  useEffect(() => {
    if (!signer) return;

    setContract(
      new Contract(
        "0x9c264a420688f8234810359691841d062ddc5bbf",
        mintContractAbi,
        signer
      )
    );
  }, [signer]);
  return (
    <Flex
      bgColor={"red.100"}
      w={"100%"}
      minH={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
    >
      {signer ? (
        <Text>{signer.address}</Text>
      ) : (
        <Button onClick={onClickMetamask}>🦊 로그인</Button>
      )}
    </Flex>
  );
};

export default App;
