import { useEffect, useState } from "react";
import { PokemonClient, TypePokemon } from "pokenode-ts";

const api = new PokemonClient();

interface UsedType {
  name: string;
  pokemon: TypePokemon[];
}

export default function TypeLabel({
  name,
  onClick,
  selected,
}: {
  name: string;
  onClick: Function;
  selected: boolean;
}) {
  const [type, setType] = useState<UsedType>({
    name: "",
    pokemon: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadType() {
      // Check if the type is in local storage
      const newJson = localStorage.getItem("types");
      const newType = newJson ? JSON.parse(newJson)[name] : null;
      if (newType) {
        setType(newType);
        setLoading(false);
      } else {
        try {
          // Call api to fetch type info
          const newType = await api.getTypeByName(name);
          // Only save used data
          const usedTypeValues: UsedType = {
            name: newType.name,
            pokemon: newType.pokemon,
          };
          // Try to save it!
          try {
            let pokemonJson = localStorage.getItem("types");
            let types: { [index: string]: any } = {};
            if (pokemonJson) {
              types = JSON.parse(pokemonJson);
              types[name] = usedTypeValues;
            } else {
              types[name] = usedTypeValues;
            }
            localStorage.setItem("types", JSON.stringify(types));
          } catch (error) {
            console.error(error);
          }
          // We are ready to show the label
          setType(usedTypeValues);
          setLoading(false);
        } catch (error) {
          // add error handling here
          console.error(error);
        }
      }
    }
    loadType();
  }, []);
  // Do not show unloaded types
  if (loading) {
    return "";
  }
  return (
    <div onClick={() => onClick()}>
      <img
        className={
          "inline " + (selected ? "border-solid border-white border-2" : "")
        }
        src={
          "icons/" +
          type.name[0].toUpperCase() +
          type.name.slice(1) +
          "IC_XY.png"
        }
        alt={type.name}
      />
    </div>
  );
}
