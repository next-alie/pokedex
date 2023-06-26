import { useEffect, useState } from "react";
import "./App.css";
import PokeCard from "./PokeCard";
import { PokemonClient } from "pokenode-ts";
import { buildWebStorage } from "axios-cache-interceptor";

const api = new PokemonClient({
  cacheOptions: { storage: buildWebStorage(localStorage, "axios-cache:") },
});

// Initial fetch of pokemons
async function fetchBatch(page: number): Promise<Object[]> {
  let pokemons = [];
  for (let i = page; i < page + 20; i++) {
    const pokemon = await api.getPokemonById(i);
    pokemons.push(pokemon);
  }
  return pokemons;
}

function App() {
  async function fetchPokemons(page) {
    try {
      // set loading to true before calling API
      setLoading(true);
      const newPokemonList = await fetchBatch(page);
      setPokemonList(newPokemonList);
      // switch loading to false after fetch is complete
      setLoading(false);
    } catch (error) {
      // add error handling here
      setLoading(false);
      console.log(error);
    }
  }

  const [page, setPage] = useState(1);
  const [pokemonList, setPokemonList] = useState({});
  const [loading, setLoading] = useState(true);

  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
    fetchPokemons(page);
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
    fetchPokemons(newPage);
  }

  function prevPage() {
    const newPage = page > 20 ? page - 20 : page;
    setPage(newPage);
    fetchPokemons(newPage);
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pokemonList.map((pokemon) => {
          return <PokeCard pokemon={pokemon} />;
        })}
      </div>
      <button
        type="button"
        onClick={prevPage}>
        {"<-"}
      </button>
      <button
        type="button"
        onClick={nextPage}>
        {"->"}
      </button>
    </>
  );
}

export default App;
