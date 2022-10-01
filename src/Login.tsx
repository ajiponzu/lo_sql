import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { dbNameState } from "./RecoilStates";

type Input = {
  userName: string;
  password: string;
  port: string;
  dbName: string;
};

const Login = () => {
  const setDBName = useSetRecoilState(dbNameState);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const onSubmit = async (data: Input) => {
    await invoke("login", {
      userName: data.userName,
      password: data.password,
      port: data.port,
      dbName: data.dbName,
    })
      .then(() => {
        setDBName(data.dbName);
        navigate("/visual");
      })
      .catch((err) => {
        window.alert(err);
        navigate("/");
      });
  };

  return (
    <div className="Login">
      <div className="row">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>UserName </label>
          <br />
          <input
            {...register("userName", {
              required: "",
              minLength: { value: 1, message: "this must not be empty" },
            })}
          />
          <p>{errors.userName?.message}</p>
          <label>Password </label>
          <br />
          <input
            {...register("password", {
              required: "",
              minLength: { value: 1, message: "this must not be empty" },
            })}
          />
          <p>{errors.password?.message}</p>
          <label>Port </label>
          <br />
          <input
            {...register("port", {
              required: "",
              minLength: { value: 1, message: "this must not be empty" },
            })}
          />
          <p>{errors.port?.message}</p>
          <label>DB Name </label>
          <br />
          <input
            {...register("dbName", {
              required: "",
              minLength: { value: 1, message: "this must not be empty" },
            })}
          />
          <p>{errors.dbName?.message}</p>
          <input type="submit" id="submit-button" />
        </form>
      </div>
    </div>
  );
};

export default Login;
