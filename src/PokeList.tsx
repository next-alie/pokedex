import { useEffect, useState } from "react";
import { NamedAPIResource, Pokemon, PokemonClient } from "pokenode-ts";
import PokeCard from "./PokeCard";

const api = new PokemonClient();

export default function PokeList({
  getDrawnPokemons,
  page,
}: {
  getDrawnPokemons: Function;
  page: number;
}) {
  const [pokemonList, setPokemonList] = useState<NamedAPIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const pagination = (page-1)*20;

  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    /**
     *  Fetch pokemon list from api or localStorage 
    */
    async function fetchPokemons() {
      // set loading to true before calling API
      setLoading(true);
      // Check if the pokemon is in local storage
      const newJson = localStorage.getItem("pokemon-list");
      if (newJson) {
        setPokemonList(JSON.parse(newJson));
        setLoading(false);
      } else {
        // Fetch pokemon list from api
        try {
          const newPokemonList = (await api.listPokemons(0, 9999)).results;
          // Try to save it!
          try {
            localStorage.setItem("pokemon-list", JSON.stringify(newPokemonList));
          } catch (error) {
            // add error handling here
            setLoading(false);
            console.error(error);
          }
          setPokemonList(newPokemonList);
          // switch loading to false after fetch is complete
          setLoading(false);
        } catch (error) {
          // add error handling here
          setLoading(false);
          console.error(error);
        }
        // We are ready to show the card
        // switch loading to false after fetch is complete
        setLoading(false);
      }
    }
    fetchPokemons();
  }, []);

  // return a Spinner when loading is true
  if (loading)
    return (
      <img
        src="icons/simple_pokeball.gif"
        alt="Loading"
      />
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center">
      {getDrawnPokemons(pokemonList)
        .slice(pagination, pagination + 20)
        .map((pokemon: Pokemon) => {
          return (
            <PokeCard
              key={pokemon.name}
              name={pokemon.name}
            />
          );
        })}
    </div>
  );
}
