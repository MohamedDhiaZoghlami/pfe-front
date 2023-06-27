import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import Select from "react-select";

const CreateUser = ({ setModal }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    getAllRoles();
  }, []);
  const getAllRoles = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_CALL}/user/allRoles`
    );

    const options = response.data.map((e) => {
      const index = e.name.indexOf("_");
      return {
        value: e.name,
        label: e.name.substring(index + 1, e.name.length),
      };
    });
    setRoles([...options]);
  };
  function handleSelectedChoix(e) {
    console.log(e);
    setRole(e.value);
    console.log(e.value);
    // handle other stuff like persisting to store etc
  }
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const send = await axios.post(
        `${process.env.REACT_APP_BACK_CALL}/user/create`,
        values
      );
      toast.success("User added successfully!!");
      console.log(role);
      const addRoleToUser = await axios.post(
        `${process.env.REACT_APP_BACK_CALL}/user/role/addToUser`,
        {
          username: values.username,
          roleName: role,
        }
      );
      console.log(send);
      setModal(false);
    } catch (e) {
      console.log(e);
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };

  return (
    <div className="customer_wrapper">
      <div className="customer_content">
        <Box m="20px">
          <Header title="Create a new user" subtitle="" />

          {loading ? (
            <p>loading...</p>
          ) : (
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={checkoutSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={!!touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={!!touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={!!touched.username && !!errors.username}
                      helperText={touched.username && errors.username}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      name="phone"
                      error={!!touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <div className="b">
                      <p
                        styles={{
                          marginRight: "-200px",
                        }}
                      >
                        Role :
                      </p>
                      <Select
                        options={roles}
                        sx={{ gridColumn: "span 2" }}
                        onChange={handleSelectedChoix}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            backgroundColor: "transparent",
                            color: "white",
                          }),
                          option: (
                            styles,
                            { data, isDisabled, isFocused, isSelected }
                          ) => {
                            return {
                              ...styles,
                              backgroundColor: "white",
                              color: "black",
                            };
                          },
                          input: (styles) => ({ ...styles, color: "grey" }),
                          placeholder: (styles) => ({
                            ...styles,
                            color: "grey",
                          }),
                          singleValue: (styles, { data }) => ({
                            ...styles,
                            color: "grey",
                          }),
                        }}
                      />
                    </div>
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Create New User
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          )}
        </Box>
      </div>
    </div>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().email("invalid email").required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  password: "1234",
};

export default CreateUser;
