import { Outlet } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tableNamesState, dbNameState, reloadFlagState } from "./RecoilStates";
import Header from "./Visual/Header";

const convertNameList = (json: Array<any>) => {
  let retArray = [] as Array<string>;
  json.forEach((elem) => {
    retArray.push(elem._name);
  });
  return retArray;
};

const MainView = () => {
  const dbName = useRecoilValue(dbNameState);
  const setTableNames = useSetRecoilState(tableNamesState);
  const reloadFlag = useRecoilValue(reloadFlagState);
  const navigate = useNavigate();

  useEffect(() => {
    const getTableNames = async () => {
      await invoke("show_mysql_tables", { dbName: dbName })
        .then((ret) =>
          setTableNames(
            convertNameList(JSON.parse(ret as string) as Array<string>)
          )
        )
        .catch((err) => {
          window.alert(err);
          navigate("/");
        });
    };
    getTableNames();
  }, [reloadFlag]);

  return (
    <div className="MainView">
      <Outlet />
    </div>
  );
};

const Visual = () => {
  return (
    <div className="Visual">
      <Header />
      <MainView />
    </div>
  );
};

export default Visual;
