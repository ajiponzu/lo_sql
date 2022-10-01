import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { columnNamesState, dbNameState } from "../RecoilStates";

const Contents = () => {
  const tableName = useParams<{ tableName: string }>()["tableName"] as string;
  const dbName = useRecoilValue(dbNameState);
  const columnNames = useRecoilValue(columnNamesState);

  return (
    <div className="Contents">
      <h1>Contents: {tableName}</h1>
    </div>
  );
};

export default Contents;
