import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios";

const UpdateProfile = ({ user }) => {
  const [image, setImage] = useState([]);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.username,
    phone: user.phone,
    image: user.image,
    adress: user.adress,
    username: user.username,
  };
  const handleFileChange = (e) => {
    setImage([...e.target.files]);
    setImageName(e.target.files[0].name);
    console.log(e.target.files);
  };
  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    if (image) {
      const formData = new FormData();
      formData.append("file", image[0][0]);
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/profile${values.firstName}_${imageName}`,
          image[0],
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        values.image = imageName;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("no image");
    }
    const send = await axios.put(
      `${process.env.REACT_APP_CRM_API_BACKEND}/user/update`,
      values
    );
    setLoading(false);
  };
  if (loading) {
    return <p>loading...</p>;
  }
  return (
    <Box m="20px">
      <Header title="Update My Profile" subtitle="" />

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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.adress}
                name="adress"
                error={!!touched.adress && !!errors.adress}
                helperText={touched.adress && errors.adress}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <p sx={{ gridColumn: "span 4" }}>Update Profile image</p>
            <input
              type="file"
              onChange={(e) => handleFileChange(e)}
              className="custom-file-input"
              style={{ marginTop: "0px" }}
            />
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
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

export default UpdateProfile;
