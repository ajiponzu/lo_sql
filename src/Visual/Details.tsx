import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { dbNameState } from "../RecoilStates";

const Details = () => {
  const tableName = useParams<{ tableName: string }>()["tableName"] as string;
  const dbName = useRecoilValue(dbNameState);

  return (
    <div className="Details">
      <h1>Details: {tableName}</h1>
    </div>
  );
};

export default Details;
