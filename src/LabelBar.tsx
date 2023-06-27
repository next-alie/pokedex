import { useEffect, useState } from "react";
import { NamedAPIResource, PokemonClient } from "pokenode-ts";
import TypeLabel from "./TypeLabel";

const api = new PokemonClient();

export default function LabelBar({ selected, handleClick }: {selected: string[], handleClick: Function}) {
  const [types, setTypes] = useState<NamedAPIResource[]>();
  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    async function fetchTypes() {
      try {
        const newTypesList: NamedAPIResource[] = (await api.listTypes(0, 9999))
          .results;
        setTypes(newTypesList);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTypes();
  }, []);

  return (
    <div className="mb-5 grid grid-cols-9 w-fit m-auto gap-x-1">
      {types?.slice(0, types?.length - 2).map((type) => {
        return (
          <TypeLabel
            key={type.name}
            name={type.name}
            onClick={() => handleClick(type.name)}
            selected={selected.includes(type.name)}
          />
        );
      })}
    </div>
  );
}
