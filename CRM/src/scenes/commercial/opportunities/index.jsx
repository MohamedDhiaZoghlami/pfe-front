import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AiFillEye } from "react-icons/ai";

import { Link } from "react-router-dom";

import AuthContext from "../../../context/AuthContext";

const AgentOpportunities = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const { username } = useContext(AuthContext);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "expected_close_date",
      headerName: "expected close date",
      flex: 1,
      renderCell: (e) => {
        let resultSplit = e.value.split("T")[0];
        console.log(resultSplit);
        return <p>{resultSplit}</p>;
      },
    },
    {
      field: "value",
      headerName: "value",
      flex: 1,
    },
    {
      field: "stage",
      headerName: "stage",
      flex: 1,
    },
    {
      headerName: "Actions",
      flex: 1,
      renderCell: (opp) => {
        return (
          <div className="customer-btns">
            <Link to={`${opp.id}`}>
              <AiFillEye className="customer-btn details" />
            </Link>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/opportunity/agent/${username}`
      );
      console.log(response);
      setData([...response.data]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box m="20px" pb="50px">
      <Header title="Opportunities" subtitle="All you're assigned to" />
      <>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid rows={data} columns={columns} />
        </Box>
      </>
    </Box>
  );
};

export default AgentOpportunities;
