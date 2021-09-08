import {
  Heading,
  Spacer,
  Text,
  Stack,
  Box,
  Grid,
  GridItem,
  Spinner,
  Center,
  Flex,
  Input,
  Tag,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  CloseButton,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

export default function Home() {
  // TODO CLEANUP A BIT HUH
  const BASE_URL = "https://pokeapi.co/api/v2";
  const [userPokes, setUserPokes] = useState([]);
  const [pokemonData, setPokemonData] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [waiting, setWating] = useState<boolean>(true);
  const [handledName, setHandledName] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelRef = useRef();
  /*
   * Get poke
   */
  const generateRandomPoke = (s, f) => {
    const number = Math.floor(Math.random() * (f - s)) + s;
    fetch(`${BASE_URL}/pokemon/${number}`)
      .then((res) => res.json())
      .then((res) => {
        setWating(false);
        setPokemonData(res);
        console.log(res);
      });
  };
  // -------------------------------------------------

  const [search, setSearch] = useState("");

  const addToUserPocket = (pokemon) => {
    let newPoke = pokemon;
    let err = 0;
    console.log(pokemon);
    console.log(userPokes);
    if (userPokes.length === 0) {
      console.log("nothing needed to be done");
    } else {
      userPokes.forEach((e) => {
        e.id === newPoke.id ? err++ : console.log("you added this");

        console.log(e.id);
      });
    }
    err === 0 && setUserPokes((prev) => [...prev, newPoke]);
    err > 0 && alert("you already have this!!!");
    userPokes.length >= 5 && setOpen(true);
  };

  useEffect(() => {
    generateRandomPoke(1, 898);
    pokemonData &&
      fetch(`${BASE_URL}/pokemon-species/${pokemonData?.id}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setExtraData(res);
          console.log("this is extra\n");
          console.log(extraData);
        });
  }, []);
  type Props = {
    title: string;
    desc: string;
  };
  const StackItem: FC<Props> = ({ title, desc }) => {
    return (
      <Box
        cursor="pointer"
        p={5}
        shadow={"lg"}
        border={"1px"}
        borderColor="gray.200"
        rounded="lg"
        bg="orange.100"
      >
        <Heading fontSize={"lg"}>{title}</Heading>
        <Text mt={2}>{desc}</Text>
      </Box>
    );
  };

  return (
    <div>
      <Head>
        <title>PokeYS App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box m={5}>
        <Box rounded="lg" bg="white" shadow="2xl" p={5}>
          <Heading
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            fontSize="6xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Welcome to the Poke App
          </Heading>
          <Input onChange={(e) => setSearch(e.target.value)} />
          <Flex direction="row" mt={10}>
            <Box width="50%" bg="gray.100" p="5" mr="5" rounded="lg">
              <Heading fontSize="2xl" color="indigo">
                Your Pocket
              </Heading>
              <Text>
                Add up to <span style={{ fontWeight: "bolder" }}>6</span>{" "}
                pokemons to your list
              </Text>
              <Button
                colorScheme="red"
                onClick={() => {
                  setUserPokes([]);
                }}
              >
                Delete All
              </Button>
            </Box>
            <Grid
              templateColumns="repeat(3,1fr)"
              width="50%"
              p="5"
              bg="cyan.100"
              rounded="lg"
              placeItems="center"
            >
              {userPokes.length === 6 && (
                <AlertDialog
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  leastDestructiveRef={cancelRef}
                >
                  <AlertDialogOverlay>
                    <AlertDialogHeader>
                      Sorry!! but you can't add more Pokemons to your pocket 😭
                      <Button onClick={() => setOpen(false)}>Okay</Button>
                    </AlertDialogHeader>
                  </AlertDialogOverlay>
                </AlertDialog>
              )}

              {userPokes.map((p) => (
                <Box key={p.id}>
                  <CloseButton
                    onClick={() =>
                      setUserPokes(userPokes.filter((u2) => u2.id !== p.id))
                    }
                  />
                  <Text>{p.name}</Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Box>
        <Button
          colorScheme="telegram"
          onClick={() => generateRandomPoke(1, 898)}
        >
          Generate New poke without refreshing the page!
        </Button>
        {waiting && (
          <Center mt={20}>
            <Spinner size="xl" />
          </Center>
        )}
        {!waiting && pokemonData && (
          <Center>
            <Box
              p="10"
              m="20"
              border="1px solid orange"
              rounded="lg"
              shadow="lg"
              maxW="xl"
              alignItems="center"
              justifyContent="center"
            >
              {userPokes.length === 6 && (
                <Button disabled={true} colorScheme="orange">
                  Please remove any of your pokes to continue
                </Button>
              )}
              <Heading textAlign="center" textTransform="uppercase">
                {pokemonData.name}
              </Heading>
              <Box rounded="lg">
                <Image
                  src={pokemonData.sprites.front_default}
                  height={100}
                  width={100}
                />
                {pokemonData.sprites.back_default && (
                  <Image
                    src={pokemonData.sprites.back_default}
                    height={100}
                    width={100}
                  />
                )}
              </Box>
              <Center>
                <Flex>
                  {pokemonData.abilities.map((a) => (
                    <Tag key={a.slot}>{a.ability.name}</Tag>
                  ))}
                </Flex>
              </Center>
              <Center mt="10">
                <Button
                  colorScheme="green"
                  onClick={() => addToUserPocket(pokemonData)}
                  disabled={userPokes.length === 6 ? true : false}
                >
                  Add to Pocket!
                </Button>
              </Center>
            </Box>
          </Center>
        )}
      </Box>
    </div>
  );
}
