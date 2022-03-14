import React, { useEffect, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { DeleteOutline } from "@material-ui/icons";
import { createTheme, makeStyles, TextField } from "@material-ui/core";
import { DataGrid, GridSearchIcon } from "@mui/x-data-grid";

import { AlertDialog } from "../../components/alert/Alert";

import "./style.css";

import moment from 'moment';
import 'moment-timezone';

import { deleteById, findAll, findById } from "../../api/event";

import { NewEvent } from "../newEvent";

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: 15,
    },
  }),
  { defaultTheme }
);

function QuickSearchToolbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className="gridContainer">
        <div className="gridHead">
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={props.handleOpen}
          >
            Agregar Nuevo
          </Button>
        </div>
        <div className="gridSearch">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Escriba para filtrar"
            value={props.value}
            onChange={props.onChange}
            InputProps={{
              endAdornment: <GridSearchIcon fontSize="small" />,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const EventList = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [initialValues, setInitialValues] = useState({});

  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [severity, setSeverity] = useState("success");

  const [id, setId] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const [pageSize, setPageSize] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    loadObject();
  }, [page, pageSize]);

  useEffect(() => {
    loadObject();
    setLoading(false);
  }, [loading]);

  const loadObject = () => {
    findAll(page, pageSize)
      .then((items) => {
        setTotalElements(items.totalElements);
        setData(items.content);
      })
      .catch((err) => console.log("No se pudo cargar el listado"));
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInitialValues({});
  };

  const openDialogDelete = (id) => {
    setId(id);
    setOpenAlertDialog(true);
  };

  const handleEdit = (id) => {
    findById(id)
      .then((data) => {

        var currentTime = data.time.split(':');

        var date = moment().tz("America/Caracas").startOf("day");
        date.hour(currentTime[0]);
        date.minutes(currentTime[1]);

        setInitialValues({
          id: data.id,
          date: data.date,
          time: date.local().toDate(),
          description: data.description,
          location: data.location,
        });
        setOpen(true);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const columns = [
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
    },
    {
      field: "time",
      headerName: "Hora",
      width: 100,
    },
    {
      field: "description",
      headerName: "Descripción",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Ubicación",
      flex: 1,
    },
    {
      field: "action",
      headerName: "",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button
              className="userListEdit"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </button>
            <DeleteOutline
              className="userListDelete"
              onClick={() => openDialogDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  const requestSearch = (searchValue) => {
    if (searchValue.length > 0) {
      setSearchText(searchValue);
      findAll(page, pageSize, searchValue).then((data) => {
        setTotalElements(data.totalElements);
        setData(data.content);
      });
    } else {
      setSearchText("");
      loadObject();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    setId("");
  };

  const handleConfirmAlertDialog = () => {
    deleteById(id).then((item) => {
      loadObject();
      setId("");
      setOpenSnackbar(true);
      setOpenAlertDialog(false);
      setMessageSnackbar("OVA eliminador correctamente!");
    });
  };

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        disableColumnMenu
        disableSelectionOnClick
        paginationMode="server"
        rowCount={totalElements}
        onPageChange={handlePageChange}
        page={page}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: ({ target: { value } }) => requestSearch(value),
            handleOpen: () => handleOpen(),
          },
        }}
      />

      <NewEvent
        open={open}
        data={data}
        setData={setData}
        handleClose={handleClose}
        totalElements={totalElements}
        setOpenSnackbar={setOpenSnackbar}
        initialValues={initialValues}
        setMessageSnackbar={setMessageSnackbar}
        setLoading={setLoading}
        setSeverity={setSeverity}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity}>
          {messageSnackbar}
        </Alert>
      </Snackbar>

      <AlertDialog
        title="Eliminar"
        message="Estas seguro de eliminar el ova, una vez eliminado no se podrá recuperar la información."
        openAlertDialog={openAlertDialog}
        handleCloseAlertDialog={handleCloseAlertDialog}
        handleConfirmAlertDialog={handleConfirmAlertDialog}
      />
    </div>
  );
};
