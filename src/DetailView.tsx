import Button from "./Button";
import ResetApp from "./ResetApp";
import { UsedPokemonValues } from "./PokeCard";

/**
 * Component thayt lists detailPokemon, has a search bar and a label picker
 */
export default function ListView({
  setDetailPokemon,
  detailPokemon,
}: {
  setDetailPokemon: Function;
  detailPokemon: UsedPokemonValues;
}) {
  return (
    <div className="w-full">
      <div className="mb-5 flex justify-between items-center">
        <Button
          label={"Back"}
          onClick={() => setDetailPokemon("")}
        />
        <ResetApp />
      </div>
      <div className="w-full bg-gray-600 text-white rounded-lg p-12 flex flex-col justify-center items-center md:flex-row md:justify-around">
        <div>
          <img
            className="inline object-center object-cover h-36 w-36"
            src={detailPokemon.sprite}
            alt={detailPokemon.name}
          />
          <div className="text-center">
            <p className="text-xl font-bold">
              {detailPokemon.name.toUpperCase()}
            </p>
            <div className="flex justify-center text-base font-normal">
              {detailPokemon.types.map((type) => {
                return (
                  <div key={detailPokemon.name + "-" + type.type.name}>
                    <img
                      className="inline"
                      src={
                        "icons/" +
                        type.type.name[0].toUpperCase() +
                        type.type.name.slice(1) +
                        "IC_XY.png"
                      }
                      alt={type.type.name}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-lg pb-2">
              {detailPokemon.height + "m " + detailPokemon.weight + "kg"}
            </p>
          </div>
        </div>
        <div>
          <table className="border">
            <tr>
              <th>Stat</th>
              <th className="pr-3">Value</th>
            </tr>
            {detailPokemon.stats.map((stat) => {
              return (
                <tr className="border">
                  <td className="text-right pr-2">
                    {stat.stat.name.toUpperCase()}
                  </td>
                  <td>{stat.base_stat}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
