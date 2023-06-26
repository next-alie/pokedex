export default function PokeCard({ pokemon }) {
  return (
    <div className="w-full bg-white rounded-lg p-12 flex flex-col justify-center items-center">
      <div className="mb-8">
        <img
          className="object-center object-cover rounded-full h-36 w-36"
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />
      </div>
      <div className="text-center">
        <p className="text-xl text-gray-700 font-bold mb-2">{pokemon.name}</p>
        <p className="text-base text-gray-600 font-normal">
          {pokemon.types.map((type) => {
            return <img src={"./icons/" + type.type.name} alt={type.type.name} /> 
          })}
        </p>
      </div>
    </div>
  );
}
