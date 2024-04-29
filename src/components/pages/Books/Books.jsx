import React, { useState, useEffect } from "react";
import DataTable from "../../organisms/DataTable";
import { Button, TextField } from "@mui/material";
import BasicModal from "../../molecule/Modal";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { baseurl, config } from "../../../Utils/helper";

const Books = () => {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [postRefetch, setPostRefetch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalRecords, setTotalRecords] = useState(5);


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseurl}/books?page=${paginationModel.page + 1}&limit=5&keyword=${keyword}`,
          config
        );

        setBooks(response.data.data.data);
        setTotalRecords(response.data.data.total);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [postRefetch, keyword, isEdit, paginationModel.page]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearch = (val) => {
    setKeyword(val);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className="flex"
        >
          Add New Book
        </Button>
      </div>
      <div>
        <TextField
          fullWidth
          id="standard-basic"
          label="Search"
          variant="filled"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <BasicModal
        open={open}
        handleClose={handleClose}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        setPostRefetch={setPostRefetch}
        setIsLoading={setIsLoading}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        books && books.length > 0 ? (
          <DataTable
            data={books}
            setIsEdit={setIsEdit}
            setSelectedBook={setSelectedBook}
            handleOpen={handleOpen}
            total={totalRecords}
            page={paginationModel.page}
            setPaginationModel={setPaginationModel}
            setPostRefetch={setPostRefetch}
            setIsLoading={setIsLoading}
          />
        ) : (
          <p className="text-center">No data found</p>
        )
      )}
    </div>
  );
};

export default Books;
