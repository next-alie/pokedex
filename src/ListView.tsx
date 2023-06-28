import { SetStateAction, useEffect, useState } from "react";
import { NamedAPIResource, PokemonClient } from "pokenode-ts";
import LabelBar from "./LabelBar";
import SearchBar from "./SearchBar";
import PokeList from "./PokeList";
import Button from "./Button";
import ResetApp from "./ResetApp";

const api = new PokemonClient();

/**
 * Component thayt lists pokemon, has a search bar and a label picker
 */
export default function ListView({
  setDetailPokemon,
  setReload,
}: {
  setDetailPokemon: Function;
  setReload: Function;
}) {
  const [maxPage, setMaxPage] = useState(Infinity);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [pokemonList, setPokemonList] = useState<NamedAPIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawnPokemon, setDrawnPokemon] = useState<NamedAPIResource[]>([]);

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
        const newPokemonList = JSON.parse(newJson)
        setPokemonList(newPokemonList);
        setLoading(false);
      } else {
        // Fetch pokemon list from api
        try {
          const newPokemonList = (await api.listPokemons(0, 9999)).results;
          // Try to save it!
          try {
            localStorage.setItem(
              "pokemon-list",
              JSON.stringify(newPokemonList)
            );
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

  useEffect(() => {
    setDrawnPokemon(getDrawnPokemons(pokemonList));
  }, [selected, query, pokemonList]);

  /**
   * Handles change in inputs and sets their value to such
   */
  function handleChange(e: {
    target: { value: SetStateAction<string> };
  }): void {
    setQuery(e.target.value);
  }

  /**
   * Sets page to page + 1
   */
  function nextPage(): void {
    const newPage = page < maxPage ? page + 1 : page;
    setPage(newPage);
  }

  /**
   * Sets page to page - 1
   */
  function prevPage(): void {
    const newPage = page > 1 ? page - 1 : page;
    setPage(newPage);
  }

  /**
   * Sellects or unselects the label that has been clicked to a max of 2 types
   * @param type The name of the pokemon type clicked
   */
  function handleClick(type: string): void {
    let newSelected = selected.slice();
    if (newSelected.includes(type)) {
      newSelected = newSelected.filter((i) => i !== type);
      setPage(1);
    } else if (newSelected.length < 2) {
      newSelected.push(type);
      setPage(1);
    }
    setSelected(newSelected);
  }

  /**
   * Filters by selected types via "and" and filters by name searched
   * @param drawnList gets the full list of pokemons
   * @returns a list of Pokemon
   */
  function getDrawnPokemons(drawnList: NamedAPIResource[]): NamedAPIResource[] {
    if (selected.length > 1) {
      const type1 = JSON.parse(localStorage.getItem("types")!)[
        selected[0]
      ].pokemon.map((i: { pokemon: any }) => i.pokemon);
      const type2 = JSON.parse(localStorage.getItem("types")!)[
        selected[1]
      ].pokemon.map((i: { pokemon: { name: any } }) => i.pokemon.name);
      drawnList = type1.filter((x: { name: any }) => type2.includes(x.name));
    } else if (selected.length > 0) {
      drawnList = JSON.parse(localStorage.getItem("types")!)[
        selected[0]
      ].pokemon.map((i: { pokemon: any }) => i.pokemon);
    }
    drawnList = filterItems(drawnList, query);
    setMaxPage(drawnList.length / 20);
    return drawnList;
  }

  /**
   * Filters by text querry the input and returns it
   * @param items A list of Pokemon
   * @param query A string that determines the filter
   * @returns A filtered by text query Pokemon list
   */
  function filterItems(
    items: NamedAPIResource[],
    query: string
  ): NamedAPIResource[] {
    query = query.toLowerCase();
    return items.filter((item: { name: string }) =>
      item.name
        .split(" ")
        .some((word: string) => word.toLowerCase().startsWith(query))
    );
  }

  // return a Spinner when loading is true
  if (loading)
    return (
      <img
        className="inline"
        src="icons/simple_pokeball.gif"
        alt="Loading"
      />
    );

  return (
    <>
      <div className="mb-5 flex justify-around items-center">
        <SearchBar
          query={query}
          handleChange={handleChange}
        />
        <ResetApp setReload={setReload} />
      </div>
      <LabelBar
        selected={selected}
        handleClick={handleClick}
      />
      <PokeList
        page={page}
        drawnPokemons={drawnPokemon}
        setDetailPokemon={setDetailPokemon}
      />
      <div className="flex justify-center">
        <Button
          label={"<-"}
          onClick={prevPage}
        />
        <div className="flex flex-col justify-center">
          <p>{page}</p>
        </div>
        <Button
          label={"->"}
          onClick={nextPage}
        />
      </div>
    </>
  );
}
