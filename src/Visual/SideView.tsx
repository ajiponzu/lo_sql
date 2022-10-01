import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  tableNamesState,
  dbNameState,
  tableNameState,
  columnNamesState,
  reloadFlagState,
} from "../RecoilStates";

const convertNameList = (json: Array<any>) => {
  let retArray = [] as Array<string>;
  json.forEach((elem) => {
    retArray.push(elem._name);
  });
  return retArray;
};

const TableNameTag = (props: { tableName: string }) => {
  const dbName = useRecoilValue(dbNameState);
  const setColumnNames = useSetRecoilState(columnNamesState);
  const setTableName = useSetRecoilState(tableNameState);
  const navigate = useNavigate();

  return (
    <div className="TableNameTag" id={props.tableName}>
      <button
        onClick={async () => {
          await invoke("show_mysql_columns", {
            dbName: dbName,
            tableName: props.tableName,
          })
            .then((ret) => {
              setColumnNames(
                convertNameList(JSON.parse(ret as string) as Array<string>)
              );
              setTableName(props.tableName);
              navigate(`table_inf/${props.tableName}`);
            })
            .catch((err) => {
              window.alert(err);
              navigate("/");
            });
        }}
      >
        {props.tableName}
      </button>
    </div>
  );
};

const SideView = () => {
  const dbName = useRecoilValue(dbNameState);
  const [tableNames, setTableNames] = useRecoilState(tableNamesState);
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

  let jsxTableTags: Array<JSX.Element> = [];
  tableNames.forEach((item) => {
    jsxTableTags.push(
      <div key={item}>
        <TableNameTag tableName={item} />
      </div>
    );
  });

  return <div className="SideView">{jsxTableTags}</div>;
};

export default SideView;
