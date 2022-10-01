import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { reloadFlagState, tableNameState } from "../RecoilStates";

const Header = () => {
  const [tableName, _] = useRecoilState(tableNameState);
  const reloadFlag = useRecoilValue(reloadFlagState);
  const setReloadFlag = useSetRecoilState(reloadFlagState);
  const navigate = useNavigate();

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
};

export default Header;
