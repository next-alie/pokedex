import { ChangeEventHandler } from "react";

/**
 *Search bar that displays the written value and gives its input to the parent
 */
export default function SearchBar({
  query,
  handleChange,
}: {
  query: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="">
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
