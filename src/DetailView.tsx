import Button from "./Button";
import ResetApp from "./ResetApp";
import { UsedPokemonValues } from "./PokeCard";
import { useEffect, useState } from "react";
import { PokemonClient } from "pokenode-ts";

const api = new PokemonClient();

/**
 * Component that lists detailPokemon, has a search bar and a label picker
 */
export default function DetailView({
  setReload,
  setDetailPokemon,
  name,
}: {
  setReload: Function;
  setDetailPokemon: Function;
  name: string;
}) {
  const [loading, setLoading] = useState(true);
  const [detailPokemon, setPokemon] = useState<UsedPokemonValues>({
    name: "",
    sprite: "",
    types: [],
    stats: [],
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    /**
     * Fetches all the specific pokemon data used by the app
     */
    async function loadPokemon() {
      // Check if the pokemon is in local storage
      const newJson = localStorage.getItem("pokemon");
      const newPokemon = newJson ? JSON.parse(newJson)[name] : null;
      if (newPokemon) {
        setPokemon(newPokemon);
        setLoading(false);
      } else {
        try {
          // set loading to true before calling API
          setLoading(true);
          // Call api to fetch type info
          const newPokemon = await api.getPokemonByName(name);
          // Only save used data
          const usedPokemonValues: UsedPokemonValues = {
            name: newPokemon.name,
            sprite: newPokemon.sprites.front_default!,
            types: newPokemon.types,
            stats: newPokemon.stats,
            height: newPokemon.height / 10,
            weight: newPokemon.weight / 10,
          };
          // Try to save it!
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
          // We are ready to show the card
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
        src="simple_pokeball.gif"
        alt="Loading"
      />
    );


  return (
    <div className="w-full">
      <div className="mb-5 flex justify-around items-center">
        <Button
          label={"Back"}
          onClick={() => setDetailPokemon("")}
        />
        <ResetApp setReload={setReload} />
      </div>
      <div className="w-full bg-gray-600 text-white rounded-lg p-12 flex flex-col justify-center items-center md:flex-row md:justify-around">
        <div>
          <img
            className="inline object-center object-cover h-36 w-36"
            src={detailPokemon.sprite}
            alt={detailPokemon.name}
          />
          <div className="text-center">
            <p className="text-xl font-bold">
              {detailPokemon.name.toUpperCase()}
            </p>
            <div className="flex justify-center text-base font-normal">
              {detailPokemon.types.map((type) => {
                return (
                  <div key={detailPokemon.name + "-" + type.type.name}>
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
            <p className="text-lg pt-2">
              {"Height: " + detailPokemon.height + "m"}
            </p>
            <p className="text-lg pb-2">{"Weight: " + detailPokemon.weight + "kg"}</p>
          </div>
        </div>
        <div>
          <table className="border">
            <tr>
              <th>Stat</th>
              <th className="pr-3">Value</th>
            </tr>
            {detailPokemon.stats.map((stat) => {
              return (
                <tr className="border">
                  <td className="text-right pr-2">
                    {stat.stat.name.toUpperCase()}
                  </td>
                  <td>{stat.base_stat}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
