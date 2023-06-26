import { useEffect, useState } from "react";
import "./App.css";
import PokeCard from "./PokeCard";
import { PokemonClient } from "pokenode-ts";

const api = new PokemonClient();

function App() {
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
      console.log(error);
    }
  }

  const [page, setPage] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect with an empty dependency array works the same way as componentDidMount
  useEffect(() => {
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
    fetchPokemons();
  }

  function prevPage() {
    const newPage = page > 20 ? page - 20 : page;
    setPage(newPage);
    fetchPokemons();
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pokemonList.slice(page, page + 20).map((pokemon) => {
          return <PokeCard key={pokemon.name} name={pokemon.name} />;
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
