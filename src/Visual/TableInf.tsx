import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { dbNameState } from "../RecoilStates";

const convertTableJSX = (json: Array<any>, tableName: string) => {
  return (
    <div className="TableInfTable">
      <h2>Table: {tableName}</h2>
      <table>
        <thead>
          <tr className="ColumnNameRow">
            <th>engine</th>
            <th>rows</th>
            <th>size(MB)</th>
            <th>created</th>
            <th>updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{json[0]["_engine"]}</td>
            <td>{json[0]["_rows"]}</td>
            <td>{json[0]["_size"] / 1000}</td>
            <td>{json[0]["_created_time"]}</td>
            <td>{json[0]["_updated_time"]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const TableInf = () => {
  const tableName = useParams<{ tableName: string }>()["tableName"] as string;
  const dbName = useRecoilValue(dbNameState);
  const [tableJSX, setTableJSX] = useState((<></>) as JSX.Element);
  const navigate = useNavigate();

  useEffect(() => {
    const getTableNames = async () => {
      await invoke("show_mysql_table_details", {
        dbName: dbName,
        tableName: tableName,
      })
        .then((ret) =>
          setTableJSX(
            convertTableJSX(
              JSON.parse(ret as string) as Array<string>,
              tableName
            )
          )
        )
        .catch((err) => {
          window.alert(err);
          navigate("/");
        });
    };
    getTableNames();
  }, [tableName]);

  return <div className="TableDetails">{tableJSX}</div>;
};

export default TableInf;
