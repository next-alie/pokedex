import { useEffect, useState } from "react";
import { NamedAPIResource, PokemonClient } from "pokenode-ts";
import TypeLabel from "./TypeLabel";

const api = new PokemonClient();

/**
 * Component comprised by pokemon type labels
 * Loads type listage data
 */
export default function LabelBar({
  selected,
  handleClick,
}: {
  selected: string[];
  handleClick: Function;
}) {
  const [types, setTypeList] = useState<NamedAPIResource[]>();
  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    /**
     *  Fetch type list from api or localStorage
     */
    async function fetchTypes() {
      // Check if the pokemon is in local storage
      const newJson = localStorage.getItem("type-list");
      console.log(
        "🚀 ~ file: LabelBar.tsx:23 ~ fetchTypes ~ newJson:",
        newJson
      );
      if (newJson) {
        setTypeList(JSON.parse(newJson));
      } else {
        // Fetch pokemon list from api
        try {
          const newTypesList: NamedAPIResource[] = (
            await api.listTypes(0, 9999)
          ).results;
          // Try to save it!
          try {
            localStorage.setItem("type-list", JSON.stringify(newTypesList));
          } catch (error) {
            // add error handling here
            console.error(error);
          }
          setTypeList(newTypesList);
        } catch (error) {
          console.error(error);
        }
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
