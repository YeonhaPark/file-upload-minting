import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Contract, JsonRpcSigner, ethers } from "ethers";
import mintContractAbi from "../lib/mintContractAbi.json";
import axios from "axios";

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
  const uploadImage = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET,
          },
        }
      );
      return `https://brown-perfect-bird-907.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const imageUrl = uploadImage(formData);
      console.log(imageUrl);
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
        <>
          <Text>{signer.address}</Text>
          <input type="file" onChange={onChangeFile} />
        </>
      ) : (
        <Button onClick={onClickMetamask}>🦊 로그인</Button>
      )}
    </Flex>
  );
};

export default App;
