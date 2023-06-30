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
  const [force, setForce] = useState(false);

  // If reload is true reload and set state to initial value
  useEffect(() => {
    setDetailPokemon("")
    setReload(false);
  }, [reload]);

  // Force state change to reload
  useEffect(() => {
    setForce(false);
  }, [force]);

  useEffect(() => {
    setForce(true)
  }, [detailPokemon]);
  
  if (reload || force) {
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
