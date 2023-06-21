import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import "./CreateCustomer.scss";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const UpdateCustomer = () => {
  let { id } = useParams();
  const { user } = useContext(AuthContext);
  const [initial, setInitial] = useState({});
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  console.log(user.username);

  useEffect(() => {
    getCustomer(id);
  }, []);
  const getCustomer = async (userId) => {
    setLoading(true);
    try {
      const customer = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/customers/${userId}`
      );
      console.log(customer);
      setInitial({
        ...customer.data,
      });
    } catch (e) {
      console.log(e);
      toast.error("Something Went wrong, try again.");
    }
    setLoading(false);
  };
  const handleFormSubmit = async (values) => {
    setLoading(true);
    values = {
      ...values,
      last_updated_at: Date.now(),
      last_updated_By: user.username,
    };
    try {
      const send = await axios.put(
        `${process.env.REACT_APP_BACK_CALL}/customers/update/${id}`,
        values
      );
      toast.success("Customer updated successfully!!");
      console.log(send);
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
          <Header title="Create a new customer" subtitle="" />

          {loading ? (
            <p>loading...</p>
          ) : (
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initial}
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
                      label="Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Adress"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.adress}
                      name="adress"
                      error={!!touched.adress && !!errors.adress}
                      helperText={touched.adress && errors.adress}
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
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Update Customer
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
  name: yup.string().required("required"),
  adress: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
});

export default UpdateCustomer;
