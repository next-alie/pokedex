export default function SearchBar({ query, handleChange }: { query: string, handleChange: Function }) {
  return (
    <div className="mb-5">
      <label>
        Search:{" "}
        <input
          value={query}
          onChange={() => handleChange()}
        />
      </label>
    </div>
  );
}
