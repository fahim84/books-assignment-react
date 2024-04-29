import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { baseurl, config } from "../../Utils/helper";

export default function DataTable({
  data,
  setIsEdit,
  setSelectedBook,
  handleOpen,
  total = 15,
  page = 1,
  setPaginationModel,
  setPostRefetch,
  setIsLoading,
}) {
    // paginationModel is to be moved here
    // useEffect to listen to changes in paginationModel
    // pass the dummy function inside this component
    // call the dummy function inside useEffect

  
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "author", headerName: "Author", width: 130 },
    {
      field: "publication_year",
      headerName: "Publication Year",
      width: 130,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      // description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <span>
          <strong>
            <button
              className="text-green-500"
              onClick={() => handleEditClick(params.row)}
            >
              Edit
            </button>
          </strong>
          <strong>
            <button
              className="text-red-500 ml-2"
              onClick={() => handleDeteteClick(params.row.id)}
            >
              Delete
            </button>
          </strong>
        </span>
      ),
    },
  ];

  const handleEditClick = (row) => {
    setIsEdit(true);
    setSelectedBook(row);
    handleOpen();
  };

  const handleDeteteClick = async (id) => {
    try {
      await axios.delete(`${baseurl}/books/${id}`, config);
      setIsLoading(true);
      setPostRefetch((prev) => !prev);
    } catch (error) {
      console.log("error while deleting ", error);
    }
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: page, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
        rowCount={total}
        paginationMode="server"
        checkboxSelection
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}
