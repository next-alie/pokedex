import { SetStateAction, useState } from "react";
import { Pokemon } from "pokenode-ts";
import LabelBar from "./LabelBar";
import SearchBar from "./SearchBar";
import PokeList from "./PokeList";
import Button from "./Button";
import ResetApp from "./ResetApp";

/**
 * Component thayt lists pokemon, has a search bar and a label picker
 */
export default function ListView({
  setDetailPokemon,
}: {
  setDetailPokemon: Function;
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

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
    const newPage = page + 1;
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
  function getDrawnPokemons(drawnList: Pokemon[]): Pokemon[] {
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
    return drawnList;
  }

  /**
   * Filters by text querry the input and returns it
   * @param items A list of Pokemon
   * @param query A string that determines the filter
   * @returns A filtered by text query Pokemon list
   */
  function filterItems(items: Pokemon[], query: string): Pokemon[] {
    query = query.toLowerCase();
    return items.filter((item: { name: string }) =>
      item.name
        .split(" ")
        .some((word: string) => word.toLowerCase().startsWith(query))
    );
  }

  return (
    <>
      <div className="mb-5 flex justify-around items-center">
        <SearchBar
          query={query}
          handleChange={handleChange}
        />
        <ResetApp />
      </div>
      <LabelBar
        selected={selected}
        handleClick={handleClick}
      />
      <PokeList
        page={page}
        getDrawnPokemons={getDrawnPokemons}
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
