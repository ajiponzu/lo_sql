import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const ErrorField = (props: { msg: string }) => {
  const errorMsg = props.msg === "" ? "" : `Error: ${props.msg}`;
  return <h2 className="errorMsg">{errorMsg}</h2>;
};

type Input = {
  userName: string;
  password: string;
  port: string;
  dbName: string;
};

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const onSubmit = async (data: Input) => {
    const userName = data.userName;
    const password = data.password;
    const port = data.port;
    const dbName = data.dbName;

    await invoke("login", { userName, password, port, dbName })
      .then(() => navigate(`/visual/${dbName}`))
      .catch((ret) => setErrorMsg(ret));
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
          <input type="submit" />
        </form>
      </div>
      <div className="row">
        <ErrorField msg={errorMsg} />
      </div>
    </div>
  );
};

export default Login;
