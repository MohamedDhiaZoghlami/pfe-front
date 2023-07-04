import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.scss";
import { AiFillEye, AiOutlineSync } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import NewAdded from "./NewAdded";
import CreateOpportunity from "./CreateOpportunity";
import Calendar from "../calendar/calendar";

const Opportunities = () => {
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
      field: "stage",
      headerName: "stage",
      flex: 1,
    },
    {
      field: "value",
      headerName: "value",
      flex: 1,
    },
    {
      field: "created_By",
      headerName: "Created by",
      flex: 1,
    },
    {
      field: "last_updated_By",
      headerName: "last updated by",
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
            <Link to={`update/${opp.id}`}>
              <AiOutlineSync className="customer-btn update" />
            </Link>

            <RiDeleteBin6Fill
              className="customer-btn delete"
              onClick={() => deleteOpportunity(opp.id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAllOpportunities();
    fetchOpportunities(page);
  }, [page]);

  const fetchOpportunities = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/all?page=${page}`
      );
      console.log(response);
      setData(response.data.content);
      setNbrPages(response.data.totalPages);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchAllOpportunities = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/once`
      );
      console.log(response, "dzovi");
      let dzovi = response.data.map((e, i) => {
        let x = e.expected_close_date.split("T")[0];
        return {
          id: i,
          title: e.name,
          date: x,
        };
      });
      setOppos(dzovi);
      console.log(dzovi);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteOpportunity = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_CALL}/opportunity/delete/${id}`
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
      <Header title="Opportunities" subtitle="Manage your opportunities" />
      <Button
        onClick={() => setModal(!modal)}
        color="secondary"
        variant="contained"
      >
        {!modal ? "create opportunity" : "return"}
      </Button>
      {modal ? (
        <CreateOpportunity />
      ) : (
        <>
          <h2>Newly Added :</h2>
          <NewAdded />
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
      {oppos.length !== 0 && <Calendar opportunities={oppos} />}
    </Box>
  );
};

export default Opportunities;
