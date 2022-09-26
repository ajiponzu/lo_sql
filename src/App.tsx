import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [dbName, setDbName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { dbName }));
  }

  async function test() {
    setGreetMsg(await invoke("show_mysql_tables", { dbName }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>
        Click on the Tauri, Vite, and React logos to learn more about each
        framework.
      </p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setDbName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>
      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setDbName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => test()}>
            Test
          </button>
        </div>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
