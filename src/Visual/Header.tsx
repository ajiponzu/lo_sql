import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dbNameState, reloadFlagState, tableNameState } from "../RecoilStates";

const Header = memo(() => {
  const [tableName, _] = useRecoilState(tableNameState);
  const dbName = useRecoilValue(dbNameState);
  const reloadFlag = useRecoilValue(reloadFlagState);
  const setReloadFlag = useSetRecoilState(reloadFlagState);
  const navigate = useNavigate();

  console.log(tableName);

  return (
    <div className="VisualHeader">
      <div className="buttons">
        <button onClick={() => navigate("/")}>
          🗝️
          <br />
          Login
        </button>
        <button
          onClick={() => {
            if (tableName) navigate(`details/${tableName}`);
          }}
        >
          📑
          <br />
          Details
        </button>
        <button
          onClick={() => {
            if (tableName) navigate(`contents/${tableName}`);
          }}
        >
          📖
          <br />
          Data
        </button>
        <button onClick={() => setReloadFlag(!reloadFlag)}>
          🔄
          <br />
          Reload
        </button>
      </div>
    </div>
  );
});

export default Header;
