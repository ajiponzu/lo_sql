import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [dbName, setDbName] = useState("");
  const navigate = useNavigate();

  const greet = async () => {
    // @ts-ignore
    await invoke("login", { dbName })
      .then(() => navigate(`/visual/${dbName}`))
      .catch((ret) => setGreetMsg(ret));
  };

  return (
    <div className="Login">
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
      <p>{greetMsg}</p>
    </div>
  );
};

export default Login;
