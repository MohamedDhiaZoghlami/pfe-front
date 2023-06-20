import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import CreateCustomer from "./CreateCustomer";
import axios from "axios";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.scss";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
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
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
  ];

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const fetchCustomers = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/customers/all?page=${page}`
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
      <Header title="Customers" subtitle="Manage your customers" />
      <Button
        onClick={() => setModal(!modal)}
        color="secondary"
        variant="contained"
      >
        {!modal ? "create customer" : "return"}
      </Button>
      {modal ? (
        <CreateCustomer setModal={setModal} />
      ) : (
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
            />
          </Box>
        </>
      )}
      {!modal && (
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
        />
      )}
    </Box>
  );
};

export default Team;
