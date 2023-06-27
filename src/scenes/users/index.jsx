import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import CreateUser from "./CreateUser";
import axios from "axios";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
// import "./pagination.scss";
import { AiFillEye, AiOutlineSync } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [nbrPages, setNbrPages] = useState(1);
  const [modal, setModal] = useState(false);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "firstName",
      headerName: "FIrst Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Email",
      flex: 1,
    },
    {
      headerName: "Actions",
      flex: 1,
      renderCell: (customer) => {
        return (
          <div className="customer-btns">
            <Link to={`${customer.id}`}>
              <AiFillEye className="customer-btn details" />
            </Link>

            <RiDeleteBin6Fill
              className="customer-btn delete"
              onClick={() => deleteCustomer(customer.id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/user/allUsers?page=${page}`
      );
      console.log(response);
      setData(response.data.content);
      setNbrPages(response.data.totalPages);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteCustomer = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_CALL}/customers/delete/${id}`
      );

      toast.success(response.data);
    } catch (e) {
      console.log(e);
      toast.error("customer may be already deleted!");
    }
  };
  const handlePageClick = (event) => {
    setPage(event.selected);
    console.log(event.selected, page);
  };
  return (
    <Box m="20px" pb="50px">
      <Header title="Users" subtitle="Manage your users" />
      <Button
        onClick={() => setModal(!modal)}
        color="secondary"
        variant="contained"
      >
        {!modal ? "create user" : "return"}
      </Button>
      {modal ? (
        <CreateUser setModal={setModal} /> // <CreateCustomer setModal={setModal} />
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
      )}
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

export default Users;
