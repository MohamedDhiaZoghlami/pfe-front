import axios from "axios";
import "./SignIn.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logopro.jpg";

const isValidEmail = (email) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export default function SignIn() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    username: "",
    password: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { isLoggedIn, setIsLoggedIn, roles } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      if (roles[0] === "ROLE_ADMIN") {
        navigate("/");
      } else if (roles[0] === "ROLE_COMMERCIAL") {
        navigate("/commercial");
      } else if (roles[0] === "ROLE_SECRETARY") {
        navigate("/secretary");
      }
    }
  }, [isLoggedIn, roles]);
  const handleChange = (e) => {
    e.preventDefault();
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);
    return isValid;
  };

  const sendIt = async (data) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_CALL}/login`,
        params
      );
      console.log(response.data);
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      localStorage.setItem("access_token", JSON.stringify(access_token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
      setIsLoggedIn(true);
      setLoading(false);
    } catch (e) {
      console.log("dzovi got errors :(");
      setErrorMsg("Please Verify your credentials");
      setLoading(false);
    }
  };
  return (
    <div className="signIn_wrapper">
      <form className="myForm" onSubmit={handleSubmit(sendIt)}>
        <img src={Logo} alt="logo" />
        <div className="formLine">
          <div className="input-icons">
            <input
              type="email"
              name="username"
              placeholder="Email"
              className={
                errors.username ? "errorInput input-field" : "input-field"
              }
              {...register("username", {
                required: true,
                validate: handleEmailValidation,
              })}
            />
          </div>
        </div>
        {errors.username?.type === "validate" && (
          <p className="paraErr">Enter a Valid Email.</p>
        )}
        <div className="formLine">
          <div className="input-icons">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={
                errors.password ? "errorInput input-field" : "input-field"
              }
              {...register("password", { required: true })}
            />
          </div>
        </div>
        {errorMsg && <p className="paraErr">*{errorMsg}</p>}
        <div className="formLine">
          {loading ? (
            <div id="loading"></div>
          ) : (
            <button type="submit" className="formBtn">
              Login
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
