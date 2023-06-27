// Search bar that dysplays the written value and gives its input to the parent

import { ChangeEventHandler } from "react";

export default function SearchBar({ query, handleChange }: { query: string, handleChange: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <div className="mb-5">
      <label>
        Search:{" "}
        <input
          value={query}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
