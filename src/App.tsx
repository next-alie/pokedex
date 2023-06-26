import { SetStateAction, useEffect, useState } from "react";
import "./App.css";
import PokeCard from "./PokeCard";
import { Pokemon, PokemonClient } from "pokenode-ts";
import LabelBar from "./LabelBar";

const api = new PokemonClient();

function App() {
  const [page, setPage] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    async function fetchPokemons() {
      try {
        // set loading to true before calling API
        setLoading(true);
        const newPokemonList = (await api.listPokemons(0, 9999)).results;
        setPokemonList(newPokemonList);
        // switch loading to false after fetch is complete
        setLoading(false);
      } catch (error) {
        // add error handling here
        setLoading(false);
        console.error(error);
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

  function nextPage() {
    const newPage = page + 20;
    setPage(newPage);
  }

  function prevPage() {
    const newPage = page > 20 ? page - 20 : page;
    setPage(newPage);
  }

  function handleClick(type: string) {
    let newSelected = selected.slice();
    if (newSelected.includes(type)) {
      newSelected = newSelected.filter((i) => i !== type);
    } else if (newSelected.length < 2) {
      newSelected.push(type);
    }
    setSelected(newSelected);
  }

  function getDrawnPokemons() {
    if (selected.length > 1) {
      const type1 = JSON.parse(localStorage.getItem("types"))[
        selected[0]
      ].pokemon.map((i) => i.pokemon);
      const type2 = JSON.parse(localStorage.getItem("types"))[
        selected[1]
      ].pokemon.map((i) => i.pokemon.name);
      const intersection = type1.filter((x) => type2.includes(x.name));
      return intersection;
    } else if (selected.length > 0) {
      const drawnList = JSON.parse(localStorage.getItem("types"))[
        selected[0]
      ].pokemon.map((i) => i.pokemon);
      return drawnList;
    } else {
      return pokemonList;
    }
  }

  return (
    <>
      <div className="mb-5">
        <LabelBar
          selected={selected}
          handleClick={handleClick}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center">
        {getDrawnPokemons()
          .slice(page, page + 20)
          .map((pokemon: Pokemon) => {
            return (
              <PokeCard
                key={pokemon.name}
                name={pokemon.name}
              />
            );
          })}
      </div>
      <button
        type="button"
        onClick={prevPage}>
        {"<-"}
      </button>
      {page / 20 + 1}
      <button
        type="button"
        onClick={nextPage}>
        {"->"}
      </button>
    </>
  );
}

export default App;
