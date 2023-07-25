import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { toast } from "react-hot-toast";
import AuthContext from "../../../context/AuthContext";
import Select from "react-select";

const CreateOffer = () => {
  const { user } = useContext(AuthContext);
  const [nbrFiles, setNbrFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opportunityId, setOpportunityId] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [date, setDate] = useState("");
  const [files, setFiles] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    getAllOpps();
  }, []);
  useEffect(() => {
    console.log(files);
  }, [nbrFiles]);

  const handleNbrFiles = () => {
    setNbrFiles([...nbrFiles, "s"]);
  };

  const handleFileChange = (e) => {
    setFiles([...files, e.target.files]);
  };
  const getAllOpps = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/agent/${user.username}`
    );
    console.log(response.data);
    const options = response.data.map((e) => {
      return {
        value: e,
        label: e.name,
      };
    });
    setOpportunities([...options]);
  };
  function handleSelectedChoix(e) {
    setOpportunityId(e.value.id);
    console.log(e.value.id);
    // handle other stuff like persisting to store etc
  }
  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    values = {
      ...values,
      created_By: user.username,
      last_updated_By: user.username,
    };
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i][0]);
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/offer${values.name}_${files[i][0].name}`,
            files[i][0],
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          setFileNames([...fileNames, `${files[i][0].name}`]);
          values.files += `*${files[i][0].name}`;
        } catch (e) {
          console.log(e);
        }
      }
      const send = await axios.post(
        `${process.env.REACT_APP_CRM_API_BACKEND}/offer/create/${opportunityId}`,
        values
      );
      toast.success("Offer added successfully!!");
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
          <Header title="Create a new Offer" subtitle="" />

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
                    <div className="b" sx={{ gridColumn: "span 4" }}>
                      <p
                        styles={{
                          marginRight: "-200px",
                        }}
                      >
                        Please Select The opportunity Your making an offer for :
                      </p>
                      <Select
                        options={opportunities}
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
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
                      error={!!touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                  <Box className="files-upp">
                    {nbrFiles?.map((e, index) => (
                      <input
                        type="file"
                        key={index}
                        onChange={(e) => handleFileChange(e)}
                        className="custom-file-input"
                      />
                    ))}
                  </Box>
                  <Box>
                    <div onClick={() => handleNbrFiles()} className="btnFile">
                      add file
                    </div>
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Create New Offer
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
  description: yup.string().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  files: "",
  status: "On_going",
  created_By: "dzovi",
  last_updated_By: "dzovi",
  created_at: Date.now(),
  last_updated_at: Date.now(),
};

export default CreateOffer;
