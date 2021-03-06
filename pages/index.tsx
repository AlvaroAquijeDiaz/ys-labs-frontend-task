/*
 *
 * ------- Developer note -----------------------------------------------------------
 * I personally don't prefer Chakra UI for styling, by no other reason
 * that I rather have more control over the styling, what I mean by this
 * is that a blank canvas is best (at least for me), I actually use TailwindCSS
 * or just SASS on my personal projects because it let me have a wider design range
 * to think on and is easier to create mobile-first UI layouts
 *
 */

import {
  Heading,
  Text,
  Box,
  Grid,
  Spinner,
  Center,
  Button,
  useToast,
  Tag,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { PokeCard } from "../components/PokeCard";
import { SearchForPoke } from "../components/SearchForPoke";
import { UserDefinedPoke } from "../components/UserDefinedPoke";
import { YourPocket } from "../components/YourPocket";
import { getSpecificPoke } from "../utils/getPokemon";
import { useLocalStorage } from "../utils/useLocalStorage";

export default function Home() {
  // TODO CLEANUP A BIT HUH
  const BASE_URL = "https://pokeapi.co/api/v2";
  const [userPokes, setUserPokes] = useState([]);
  const [pokemonData, setPokemonData] = useState(null);
  const [waiting, setWating] = useState(false);
  const [userPokeData, setUserPokeData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [storedUserTeam, setStoredUserTeam] = useLocalStorage(
    "userPokemons",
    []
  );

  const addToUserPocket = (pokemon) => {
    let newPoke = pokemon;
    let err2 = 0;
    let errToAdd = 0;
    pokemon === null || (pokemon === undefined && err2++);
    storedUserTeam.length === 6 && errToAdd++;

    storedUserTeam.forEach((e) => {
      e.id === newPoke.id ? err2++ : console.log("alright");
    });

    // err2 === 0 && setUserPokes((prev) => [...prev, newPoke]);
    err2 === 0 &&
      errToAdd === 0 &&
      setStoredUserTeam([...storedUserTeam, newPoke]);
    err2 === 0 &&
      errToAdd === 0 &&
      toast({
        title: "Pokemon added to your team!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    err2 > 0 &&
      err2 < 2 &&
      toast({
        title: "You already have this Pokemon",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    if (errToAdd > 0) {
      toast({
        title: "Limit Reached ",
        status: "warning",
        duration: 1500,
      });
      return;
    }
  };

  /*
   * Get random poke
   */
  const generateRandomPoke = (s, f) => {
    const number = Math.floor(Math.random() * (f - s)) + s;
    try {
      setWating(true);
      fetch(`${BASE_URL}/pokemon/${number}`)
        .then((res) => res.json())
        .then((res) => {
          setWating(false);
          setPokemonData(res);
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };
  // -------------------------------------------------

  const fetchThePoke = async (query: string) => {
    try {
      if (query.length === 0 || query === undefined || query === null) {
        alert("please enter a search param");
        return;
      }
      (query === "" || undefined) && alert("Please enter your search");
      setLoading(true);
      const userPokeData = await getSpecificPoke(query);
      setUserPokeData(userPokeData);
      console.log(userPokeData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("This pokemon does not exist");
    }
  };

  // -------------------------------------------------
  useEffect(() => {
    generateRandomPoke(1, 898);
  }, []);

  return (
    <>
      <Head>
        <title>PokeYS App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box bgColor="#2a3050">
        <Grid placeItems="center" gap={5} px={["2", "35"]} pt={10}>
          <Box>
            <Text color="white" fontSize="xl" fontWeight="bold">
              Welcome to
            </Text>
            <Heading fontSize="5xl" fontWeight="extrabold" color="yellow.400">
              The PokeDex
            </Heading>
          </Box>

          <SearchForPoke
            getPoKemonName={fetchThePoke}
            pokemonData={userPokeData}
            addToUserTeam={addToUserPocket}
            setterFn={() => {
              setUserPokeData([]);
            }}
          />
          {/* User Poke Card showing */}
          {loading && <Spinner color="yellow.200" size="xl" />}
          {userPokeData && <UserDefinedPoke poke={userPokeData} />}

          {/* User Team Component */}
          <YourPocket
            fnSetPokes={setStoredUserTeam}
            dataUserPokes={storedUserTeam}
          />
          <Button
            colorScheme="yellow"
            onClick={() => {
              generateRandomPoke(1, 898);
            }}
          >
            Generate new random Pokemon!
          </Button>

          <Tag colorScheme="gray" fontSize="xs" fontWeight="bold">
            Or just reload and don&apos;t worry, your current team will be
            saved!!
          </Tag>

          {/* Waiting spinner */}
          {waiting && (
            <Center mt={20}>
              <Spinner size="xl" color="yellow.200" />
            </Center>
          )}
          {/* Showing the Card */}
          {pokemonData && (
            <PokeCard
              addToTeam={addToUserPocket}
              setFn={setStoredUserTeam}
              userPokes={storedUserTeam}
              pokemonData={pokemonData}
            />
          )}
        </Grid>
        <Box textAlign="center" bg="#2a3050" color="white" pb={5}>
          Developed by &rarr;{" "}
          <a
            rel="noreferrer"
            style={{ fontWeight: "bolder", textDecoration: "underline" }}
            href="https://github.com/AlvaroAquijeDiaz"
            target="_blank"
          >
            Alvaro Aquije
          </a>
        </Box>
      </Box>
    </>
  );
}
