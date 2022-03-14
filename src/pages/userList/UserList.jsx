import React, { useEffect, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { DeleteOutline } from "@material-ui/icons";
import {
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { DataGrid, GridSearchIcon } from "@mui/x-data-grid";

import "./userList.css";
import { NewUser } from "../newUser/NewUser";
import {
  deleteStudentById,
  findStudentById,
  findAll,
} from "../../api/students";
import { AlertDialog } from "../../components/alert/Alert";
import { BootstrapInput } from "../../components/bootstrapInput";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

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
          <Select
            value={props.filterSearch}
            onChange={props.onChangeFilter}
            variant="outlined"
            input={<BootstrapInput />}
          >
            <MenuItem value="firstName">Nombre</MenuItem>
            <MenuItem value="lastName">Apellido</MenuItem>
            <MenuItem value="identityDocument">Cédula</MenuItem>
            <MenuItem value="phone">Teléfono</MenuItem>
          </Select>
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

export const UserList = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterSearch, setFilterSearch] = useState("firstName");
  const [open, setOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [initialValues, setInitialValues] = useState({});

  const [studentId, setStudentId] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const [pageSize, setPageSize] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    loadhandleStudent();
  }, [page, pageSize]);

  useEffect(() => {
    loadhandleStudent();
    setLoading(false);
  }, [loading]);

  const loadhandleStudent = () => {
    findAll(page, pageSize)
      .then((students) => {
        setTotalElements(students.totalElements);
        setData(students.content);
      })
      .catch((err) => console.log("error no se pudo cargar los estudiantes"));
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
    setStudentId(id);
    setOpenAlertDialog(true);
  };

  const handleEditStudent = (idStudent) => {
    findStudentById(idStudent).then((data) => {
      setInitialValues(data);
      setOpen(true);
    });
  };

  const columns = [
    {
      field: "identityDocument",
      headerName: "Cedula",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Apellido",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Teléfono",
      sortable: false,
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
              onClick={() => handleEditStudent(params.row.id)}
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
    setSearchText(searchValue);
    findAll(page, pageSize, filterSearch, searchValue).then((data) => {
      setTotalElements(data.totalElements);
      setData(data.content);
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    setStudentId("");
  };

  const handleConfirmAlertDialog = () => {
    deleteStudentById(studentId).then((item) => {
      loadhandleStudent();
      setStudentId("");
      setOpenSnackbar(true);
      setOpenAlertDialog(false);
      setMessageSnackbar("Estudiante eliminador correctamente!");
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
            filterSearch: filterSearch,
            onChange: ({ target: { value } }) => requestSearch(value),
            handleOpen: () => handleOpen(),
            onChangeFilter: ({ target: { value } }) => setFilterSearch(value),
          },
        }}
      />

      <NewUser
        open={open}
        data={data}
        setData={setData}
        setOpenSnackbar={setOpenSnackbar}
        setMessageSnackbar={setMessageSnackbar}
        setLoading={setLoading}
        initialValues={initialValues}
        handleClose={handleClose}
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
        <Alert onClose={handleSnackbarClose} severity="success">
          {messageSnackbar}
        </Alert>
      </Snackbar>

      <AlertDialog
        title="Eliminar Estudiante"
        message="Estas seguro de eliminar al estudiante, una vez eliminado no se podrá recuperar la información."
        openAlertDialog={openAlertDialog}
        handleCloseAlertDialog={handleCloseAlertDialog}
        handleConfirmAlertDialog={handleConfirmAlertDialog}
      />
    </div>
  );
};
