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

const CreateContract = ({ Opp, Customer }) => {
  const { user } = useContext(AuthContext);
  const [nbrFiles, setNbrFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [desc, setDesc] = useState("");
  useEffect(() => {
    console.log(files);
  }, [nbrFiles]);

  const handleNbrFiles = () => {
    setNbrFiles([...nbrFiles, "s"]);
  };

  const handleFileChange = (e) => {
    setFiles([...files, e.target.files]);
  };
  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values);

    values = {
      ...values,
      created_By: user.username,
      dateOfFullfillment: date,
    };
    const description = `This is a contract made between 2 parties , The first one is the host company with the name Progress Engineering and the second party is ${Customer.name} ,The important terms are that this contract obligates the company Progress Engineer to fullfill this project by the date ${date}, and the ${Customer.name} need to pay its bills with the amount of ${values.amount} in ${values.payXsteps} steps with a bill every ${values.payXmonths} you can share or discuss more details later.`;
    values = {
      ...values,
      description: description,
    };
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i][0]);
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN}/contract${values.name}_${files[i][0].name}`,
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
        `${process.env.REACT_APP_CRM_API_BACKEND}/contract/create/${Customer.id}/${Opp.id}`,
        values
      );
      toast.success("Contract added successfully!!");
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
          <Header
            title="Create a new contract"
            subtitle={`Create a new contract between your company and ${Customer.name}`}
          />

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
                      type="number"
                      label="Amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.amount}
                      name="amount"
                      error={!!touched.amount && !!errors.amount}
                      helperText={touched.amount && errors.amount}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Pay every X Months"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.payXmonths}
                      name="payXmonths"
                      error={!!touched.payXmonths && !!errors.payXmonths}
                      helperText={touched.payXmonths && errors.payXmonths}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Pay in X steps"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.payXsteps}
                      name="payXsteps"
                      error={!!touched.payXsteps && !!errors.payXsteps}
                      helperText={touched.payXsteps && errors.payXsteps}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <p>Date Of Fullfillment :</p>
                      <DatePicker
                        label="Date Of Fullfillment"
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
                      Create New Contract
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

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  amount: yup.number().required("required"),
  payXmonths: yup.number().required("required"),
  payXsteps: yup.number().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  file: "",
  payXmonths: 0,
  payXsteps: 0,
  amount: 0,
  dateOfFullfillment: Date.now(),
  created_By: "dzovi",
  created_at: Date.now(),
};

export default CreateContract;
