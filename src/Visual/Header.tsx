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

  const viewLogin = useCallback(() => {
    navigate("/");
  }, []);
  const viewDetails = useCallback(() => {
    navigate(`details/${tableName}`);
  }, []);
  const viewsContents = useCallback(() => {
    navigate(`contents/${tableName}`);
  }, []);
  const reload = useCallback(() => {
    setReloadFlag(!reloadFlag);
  }, []);

  return (
    <div className="VisualHeader">
      <div className="buttons">
        <button onClick={viewLogin}>
          🗝️
          <br />
          Login
        </button>
        <button onClick={viewDetails}>
          📑
          <br />
          Details
        </button>
        <button onClick={viewsContents}>
          📖
          <br />
          Data
        </button>
        <button onClick={reload}>
          🔄
          <br />
          Reload
        </button>
      </div>
    </div>
  );
});

export default Header;
