import { useEffect, useState } from "react";
import { PokemonClient } from "pokenode-ts";

const api = new PokemonClient();

export default function PokeCard({ name }) {
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});

  useEffect(() => {
    async function loadPokemon() {
      const newJson = localStorage.getItem("pokemon");
      const newPokemon = newJson ? JSON.parse(newJson)[name] : null;
      if (newPokemon) {
        setPokemon(newPokemon);
        setLoading(false);
      } else {
        try {
          // set loading to true before calling API
          setLoading(true);
          const newPokemon = await api.getPokemonByName(name);
          const usedPokemonValues = {
            name: newPokemon.name,
            sprites: newPokemon.sprites,
            types: newPokemon.types,

          }
          try {
            let pokemonJson = localStorage.getItem("pokemon");
            let pokemons = {};
            if (pokemonJson) {
              pokemons = JSON.parse(pokemonJson);
              pokemons[name] = usedPokemonValues;
            } else {
              pokemons[name] = usedPokemonValues;
            }
            localStorage.setItem("pokemon", JSON.stringify(pokemons));
          } catch (error) {
            console.log(error);
          }
          setPokemon(usedPokemonValues);
          // switch loading to false after fetch is complete
          setLoading(false);
        } catch (error) {
          // add error handling here
          setLoading(false);
          console.log(error);
        }
      }
    }
    loadPokemon();
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
    <div className="w-full bg-white rounded-lg p-12 flex flex-col justify-center items-center">
      <div className="mb-8">
        <img
          className="object-center object-cover rounded-full h-36 w-36"
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />
      </div>
      <div className="text-center">
        <p className="text-xl text-gray-700 font-bold mb-2">{pokemon.name}</p>
        <div className="text-base text-gray-600 font-normal">
          {pokemon.types.map((type) => {
            return (
              <div>
                <img
                  className="inline"
                  src={
                    "icons/" +
                    type.type.name[0].toUpperCase() +
                    type.type.name.slice(1) +
                    "IC_XY.png"
                  }
                  alt={type.type.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
