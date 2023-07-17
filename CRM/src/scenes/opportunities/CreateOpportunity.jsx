import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Input } from "@mui/material";
import Select from "react-select";

const CreateOpportunity = ({ setModal }) => {
  const { user } = useContext(AuthContext);
  const [nbrFiles, setNbrFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [date, setDate] = useState("");
  const [files, setFiles] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    getAllCustomers();
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
  const getAllCustomers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_CRM_API_BACKEND}/customers/Once`
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
    console.log(values);
    values = {
      ...values,
      created_By: user.username,
      last_updated_By: user.username,
      expected_close_date: date,
    };
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i][0]);
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/opp${values.name}_${files[i][0].name}`,
            files[i][0],
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          setFileNames([...fileNames, `${files[i][0].name}`]);
          values.file += `*${files[i][0].name}`;
        } catch (e) {
          console.log(e);
        }
      }
      const send = await axios.post(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/create/${customerId}`,
        values
      );
      toast.success("Opportunity addes successfully!!");
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
          <Header title="Create a new opportunity" subtitle="" />

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
                      label="from where"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      name="fromWhere"
                      error={!!touched.fromWhere && !!errors.fromWhere}
                      helperText={touched.fromWhere && errors.fromWhere}
                      sx={{ gridColumn: "span 2" }}
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
                            zIndex: "10000000",
                          }),
                          option: (
                            styles,
                            { data, isDisabled, isFocused, isSelected }
                          ) => {
                            return {
                              ...styles,
                              backgroundColor: "white",
                              color: "black",
                              zIndex: "10000000",
                            };
                          },
                          input: (styles) => ({ ...styles, color: "grey" }),
                          placeholder: (styles) => ({
                            ...styles,
                            color: "grey",
                            zIndex: "10000000",
                          }),
                          singleValue: (styles, { data }) => ({
                            ...styles,
                            color: "grey",
                            zIndex: "10000000",
                          }),
                        }}
                      />
                    </div>
                  </Box>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <p>Expcted Close Date :</p>
                      <DatePicker
                        label="Expected close date"
                        //   value={value}
                        onChange={(newValue) => setDate(newValue)}
                      />
                    </LocalizationProvider>
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
                      Create New Opportunity
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
  fromWhere: yup.string().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  file: "",
  stage: "New",
  expected_close_date: "",
  fromWhere: "internal",
  value: "Not_assigned_yet",
  decision: "Not_assigned_yet",
  agent: "",
  created_By: "dzovi",
  last_updated_By: "dzovi",
  created_at: Date.now(),
  last_updated_at: Date.now(),
};

export default CreateOpportunity;
