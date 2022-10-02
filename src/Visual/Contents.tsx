import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { columnNamesState, dbNameState } from "../RecoilStates";

const convertLineToJSON = (json: Array<any>) => {};

const convertTableJSX = (
  json: Array<any>,
  tableName: string,
  columnNames: Array<string>
) => {
  return (
    <div className="ContentsTable">
      <h2>Table: {tableName}</h2>
      <table>
        <thead>
          <tr className="ColumnNameRow">
            {Object.keys(columnNames).map((key, ii) => (
              <th key={`columnname_key: ${key}`}>{columnNames[ii]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(json).map((key, ii) => {
            const content_json = JSON.parse(json[ii]["_data"] as string);
            return (
              <tr key={key}>
                {Object.keys(content_json["_json"]).map((key2, ii2) => (
                  <td key={key2}>{content_json["_json"][columnNames[ii2]]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Contents = () => {
  const tableName = useParams<{ tableName: string }>()["tableName"] as string;
  const dbName = useRecoilValue(dbNameState);
  const columnNames = useRecoilValue(columnNamesState);
  const [tableJSX, setTableJSX] = useState((<></>) as JSX.Element);
  const navigate = useNavigate();

  useEffect(() => {
    const getTableNames = async () => {
      await invoke("show_mysql_table_data", {
        dbName: dbName,
        tableName: tableName,
        columnNames,
      })
        .then((ret) => {
          setTableJSX(
            convertTableJSX(
              JSON.parse(ret as string) as Array<string>,
              tableName,
              columnNames
            )
          );
        })
        .catch((err) => {
          window.alert(err);
          navigate("/");
        });
    };
    getTableNames();
  }, [tableName]);

  return <div className="Contents">{tableJSX}</div>;
};

export default Contents;
