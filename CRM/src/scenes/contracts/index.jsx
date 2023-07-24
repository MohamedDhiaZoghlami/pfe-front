import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.scss";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Contracts = () => {
  const { roles } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [oppos, setOppos] = useState([]);
  const [page, setPage] = useState(0);
  const [nbrPages, setNbrPages] = useState(1);
  const [modal, setModal] = useState(false);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "aze",
      headerName: "Customer",
      flex: 1,
      renderCell: (opp) => {
        console.log("dddd", opp);
        return <div>{opp.row.customer.name}</div>;
      },
    },
    {
      field: "azes",
      headerName: "Opportunity",
      flex: 1,
      renderCell: (opp) => {
        console.log("dddd", opp);
        return <div>{opp.row.opportunity.name}</div>;
      },
    },
    {
      field: "dateOfFullfillment",
      headerName: "Date of Fullfilment",
      flex: 1,
      renderCell: (e) => {
        let resultSplit = e.row.dateOfFullfillment.split("T")[0];
        console.log(resultSplit);
        return <p>{resultSplit}</p>;
      },
    },
    {
      field: "payXmonths",
      headerName: "Pay Every X Months",
      flex: 1,
    },
    {
      field: "payXsteps",
      headerName: "Pay In X Steps",
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
    fetchContracts(page);
  }, [page]);

  const fetchContracts = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CRM_API_BACKEND}/contract/all?page=${page}`
      );
      console.log(response);
      setData(response.data.content);
      setNbrPages(response.data.totalPages);
    } catch (e) {
      console.log(e);
    }
  };
  const handlePageClick = (event) => {
    setPage(event.selected);
    console.log(event.selected, page);
  };
  return (
    <Box m="20px" pb="50px">
      <Header title="Contracts" subtitle="Manage your contracts" />

      <>
        <Box
          m="40px 0 0 0"
          // height="75vh"
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
          <DataGrid
            rows={data}
            columns={columns}
            paginationMode="server"
            paginationModel={{
              page: page + 1,
              pageSize: nbrPages,
            }}
            rowCount={data.length}
            autoHeight={true}
            hideFooter={true}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </>
      {!modal &&
        (nbrPages !== 1 ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={nbrPages}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName="cont_page"
            pageLinkClassName="pageElement pageNbr"
            nextLinkClassName="pageElement"
            previousLinkClassName="pageElement"
            activeLinkClassName="activePage"
            disabledClassName="disableBtn"
          />
        ) : null)}
    </Box>
  );
};

export default Contracts;
