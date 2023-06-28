import Button from "./Button";

/**
 * Component that is a button that resets the app
 */
export default function ResetApp() {
  /**
   * Flushes the local storage and then reloads the app
   */
  function resetApp(): void {
    localStorage.clear();
    location.reload();
  }

  return (
    <Button
      label={"Clear Storage"}
      onClick={resetApp}
    />
  );
}
