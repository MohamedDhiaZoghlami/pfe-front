import { useContext, useState } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import Select from "react-select";
import { useEffect } from "react";

const CreateContact = ({ setModal }) => {
  const { user } = useContext(AuthContext);
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    getAllCustomers();
  }, []);
  const getAllCustomers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_CALL}/customers/Once`
    );

    const options = response.data.map((e) => {
      return {
        value: e,
        label: e.name,
      };
    });
    setCustomers([...options]);
  };
  function handleSelectedChoix(e) {
    setCustomerId(e.value.id);
    console.log(e.value.id);
    // handle other stuff like persisting to store etc
  }
  const handleFormSubmit = async (values) => {
    setLoading(true);
    values = {
      ...values,
      created_By: user.username,
      last_updated_By: user.username,
    };
    console.log(values);
    try {
      const send = await axios.post(
        `${process.env.REACT_APP_BACK_CALL}/contacts/create/${customerId}`,
        values
      );
      toast.success("Contact added successfully!!");
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
          <Header title="Create a new contact" subtitle="" />

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
                      label="last Name"
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
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
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
                        Customer
                      </p>
                      <Select
                        options={customers}
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
                      Create New Contact
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
  email: yup.string().email("invalid email").required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  created_By: "dzovi",
  last_updated_By: "dzovi",
  created_at: Date.now(),
  last_updated_at: Date.now(),
};

export default CreateContact;
