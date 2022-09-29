import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const convertNameList = (json: Array<any>) => {
  let retArray = [] as Array<string>;
  json.forEach((elem) => {
    retArray.push(elem._name);
  });
  return retArray;
};

const Visual = () => {
  const dbName = useParams<{ dbName: string }>()["dbName"] as string;
  const [tableNames, setTableNames] = useState([] as Array<string>);

  useEffect(() => {
    const getTableNames = async () => {
      await invoke("show_mysql_tables", { dbName })
        .then((ret) =>
          setTableNames(
            convertNameList(JSON.parse(ret as string) as Array<string>)
          )
        )
        .catch((err) => console.log(err));
    };
    getTableNames();
  }, []);

  console.log(tableNames);

  return <div className="Visual">Visual</div>;
};

export default Visual;
