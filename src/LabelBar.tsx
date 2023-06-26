import { useEffect, useState } from "react";
import { PokemonClient } from "pokenode-ts";
import TypeLabel from "./TypeLabel";

const api = new PokemonClient();

export default function LabelBar({ selected, handleClick }) {
  const [types, setTypes] = useState([]);
  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    async function fetchTypes() {
      try {
        const newTypesList = (await api.listTypes(0, 9999)).results;
        setTypes(newTypesList);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTypes();
  }, []);

  return (
    <div className="grid grid-cols-9 w-fit m-auto gap-x-1">
      {types.slice(0, types.length - 2).map((type) => {
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
