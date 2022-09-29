import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate, useParams } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="Header">
      <div className="row">
        <h1>Header</h1>
      </div>
      <div className="row">
        <button type="button" onClick={() => navigate("/")}>
          login
        </button>
      </div>
    </div>
  );
};

const Visual = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [tableName, setTableName] = useState("");
  const navigate = useNavigate();
  const columnNames: string[] = ["id", "pairing_id", "player_id", "goal_time"];
  const dbName = useParams<{ dbName: string }>()["dbName"] as string;

  console.log(dbName);

  const test = async () => {
    // @ts-ignore : in tauri, this code is correct.
    await invoke("show_mysql_table_data", {
      dbName,
      tableName,
      columnNames,
    })
      // @ts-ignore
      .then((ret) => setGreetMsg(ret))
      .catch((ret) => console.log(ret));
  };

  return (
    <div className="Visual">
      <Header />
      <div className="row">
        <input
          id="greet-input"
          onChange={(e) => setTableName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="button" onClick={() => test()}>
          Test
        </button>
      </div>
      <div className="row">
        <button type="button" onClick={() => navigate("/")}>
          login
        </button>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
};

export default Visual;
