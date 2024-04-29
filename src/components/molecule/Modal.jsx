import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseurl, config } from "../../Utils/helper";

// Move into styles file
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "100%",
  bgcolor: "background.paper",
  border: "3px solid #FFF",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

// Move into helper file
const bookSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Book Title is Required"),
  author: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Author Name is Required"),
  publication_year: Yup.number()
    .required("Book Publication year is Required")
    .min(1950, "Year should be greater than 1950")
    .max(2024, "Year should be less than 2025"),
  isbn: Yup.string().required("ISBN is Required"),
});

export default function BasicModal({
  open,
  handleClose,
  isEdit,
  setIsEdit,
  selectedBook,
  setSelectedBook,
  setPostRefetch,
  setIsLoading,
}) {
  const modalTitle = isEdit ? "Edit Book" : "Add a New Book";
  const initialValues = isEdit
    ? selectedBook
    : { title: "", author: "", publication_year: null, isbn: "" };

  

  const onSubmit = async (values) => {
    try {
      if (!isEdit) {
        await axios.post(`${baseurl}/books`, values, config);
      } else {
        const book = {
          id: selectedBook.id,
          ...values,
        };
        await axios.put(`${baseurl}/books/${selectedBook.id}`, book, config);
        setIsEdit(false);
        setSelectedBook({});
      }
      handleClose();
      setIsLoading(true);
      setPostRefetch((prev) => !prev);
    } catch (error) {
      // Add Toast to display error message
      console.log("Error ", error);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          {/* Move Formik into book form component */}
          <div>
            <Formik
              onSubmit={onSubmit}
              validationSchema={bookSchema}
              initialValues={initialValues}
            >
              {({ errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mt-2 p-2">
                    <TextField
                      fullWidth
                      name="title"
                      onChange={handleChange}
                      placeholder="Enter Title of the Book"
                      label="Title"
                      defaultValue={initialValues.title}
                    />
                    {errors.title && touched.title ? (
                      <div className="text-xs text-red-700 mt-1">
                        {errors.title}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2 p-2">
                    <TextField
                      fullWidth
                      name="author"
                      onChange={handleChange}
                      placeholder="Enter Author Name"
                      label="Author"
                      defaultValue={initialValues.author}
                    />
                    {errors.author && touched.author ? (
                      <div className="text-xs text-red-700 mt-1">
                        {errors.author}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2 p-2">
                    <TextField
                      fullWidth
                      name="publication_year"
                      onChange={handleChange}
                      placeholder="Enter Publication Year"
                      label="Publication Year"
                      type="number"
                      defaultValue={initialValues.publication_year}
                    />
                    {errors.publication_year && touched.publication_year ? (
                      <div className="text-xs text-red-700 mt-1">
                        {errors.publication_year}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2 p-2">
                    <TextField
                      fullWidth
                      name="isbn"
                      onChange={handleChange}
                      placeholder="Enter ISBN"
                      label="ISBN"
                      defaultValue={initialValues.isbn}
                    />
                    {errors.isbn && touched.isbn ? (
                      <div className="text-xs text-red-700 mt-1">
                        {errors.isbn}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <span className="mr-2">
                      <Button
                        variant="contained"
                        onClick={handleClose}
                        color="inherit"
                      >
                        Cancel
                      </Button>
                    </span>
                    <span>
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </span>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
