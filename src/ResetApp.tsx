import Button from "./Button";

/**
 * Component that is a button that resets the app
 */
export default function ResetApp(
  {setReload}: {setReload: Function}) {
  /**
   * Flushes the local storage and then reloads the app
   */
  function resetApp(): void {
    localStorage.clear();
    setReload(true);
  }

  return (
    <Button
      label={"Clear Storage"}
      onClick={resetApp}
    />
  );
}
