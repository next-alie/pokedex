import { NamedAPIResource } from "pokenode-ts";
import PokeCard from "./PokeCard";

/**
 * Component that loads pokemons paginated 20 by 20
 * Loads pokemon listage data
 */
export default function PokeList({
  setDetailPokemon,
  drawnPokemons,
  page,
}: {
  setDetailPokemon: Function;
  drawnPokemons: NamedAPIResource[];
  page: number;
}) {
  const pagination = (page - 1) * 20;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center">
      {drawnPokemons
        .slice(pagination, pagination + 20)
        .map((pokemon: NamedAPIResource) => {
          return (
            <PokeCard
              key={pokemon.name}
              name={pokemon.name}
              onClick={() => setDetailPokemon(pokemon.name)}
            />
          );
        })}
    </div>
  );
}
