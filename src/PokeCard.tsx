import { useEffect, useState } from "react";
import { PokemonClient, PokemonType } from "pokenode-ts";

const api = new PokemonClient();

interface UsedPokemonValues {
  name: string,
  sprite: string,
  types: PokemonType[],
};

export default function PokeCard({ name }: {name: string}) {
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState<UsedPokemonValues>({
    name: "",
    sprite: "",
    types: [],
  });

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
          const usedPokemonValues: UsedPokemonValues = {
            name: newPokemon.name,
            sprite: newPokemon.sprites.front_default!,
            types: newPokemon.types,
          };
          try {
            let pokemonJson = localStorage.getItem("pokemon");
            let pokemons: { [index: string]: any } = {};
            if (pokemonJson) {
              pokemons = JSON.parse(pokemonJson);
              pokemons[name] = usedPokemonValues;
            } else {
              pokemons[name] = usedPokemonValues;
            }
            localStorage.setItem("pokemon", JSON.stringify(pokemons));
          } catch (error) {
            console.error(error);
          }
          setPokemon(usedPokemonValues);
          // switch loading to false after fetch is complete
          setLoading(false);
        } catch (error) {
          // add error handling here
          setLoading(false);
          console.error(error);
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
    <div className="w-full bg-gray-600 text-white rounded-lg p-12 flex flex-col justify-center items-center">
      <div className="">
        <img
          className="object-center object-cover h-36 w-36"
          src={pokemon.sprite}
          alt={pokemon.name}
        />
      </div>
      <div className="text-center">
        <p className="text-xl font-bold">{pokemon.name.toUpperCase()}</p>
        <div className="flex justify-center text-base font-normal">
          {pokemon.types.map((type) => {
            return (
              <div key={name + "-" + type.type.name}>
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
