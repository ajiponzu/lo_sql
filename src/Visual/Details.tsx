import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { dbNameState } from "../RecoilStates";

const convertTableJSX = (json: Array<any>, tableName: string) => {
  return (
    <div className="ColumnDetailTable">
      <h2>Table: {tableName}</h2>
      <table>
        <thead>
          <tr className="ColumnNameRow">
            <th>column</th>
            <th>nullable</th>
            <th>char_size</th>
            <th>num_precision</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(json).map((key, ii) => (
            <tr key={key}>
              <td>{json[ii]["_name"]}</td>
              <td>{json[ii]["_nullable"]}</td>
              <td>{json[ii]["_char_max_len"]}</td>
              <td>{json[ii]["_num_precision"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Details = () => {
  const tableName = useParams<{ tableName: string }>()["tableName"] as string;
  const dbName = useRecoilValue(dbNameState);
  const [tableJSX, setTableJSX] = useState((<></>) as JSX.Element);
  const navigate = useNavigate();

  useEffect(() => {
    const getTableNames = async () => {
      await invoke("show_mysql_column_details", {
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

  return <div className="Details">{tableJSX}</div>;
};

export default Details;
