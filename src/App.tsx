import { useEffect, useState } from "react";
import ListView from "./ListView";
import DetailView from "./DetailView";
import "./App.css";

/**
 * Main react app component
 */
export default function App() {
  const [detailPokemon, setDetailPokemon] = useState("");
  const [reload, setReload] = useState(false);
  // If reload is true reload and set state to initial value
  useEffect(() => {
    setDetailPokemon("")
    setReload(false);
  }, [reload]);

  if (reload) {
    return "";
  }

  if (detailPokemon) {
    return (
      <DetailView
        setReload={setReload}
        setDetailPokemon={setDetailPokemon}
        name={detailPokemon}
      />
    );
  }

  return (
    <ListView
      setReload={setReload}
      setDetailPokemon={setDetailPokemon}
    />
  );
}
