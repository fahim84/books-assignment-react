import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Books from './Books';

jest.mock('axios');

describe('Books component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, title: 'Book 1' },
            { id: 2, title: 'Book 2' },
          ],
          total: 2,
        },
      },
    });
  });

  test('renders the component', async () => {
    render(<Books />);
    
    // Verify that the "Add New Book" button is rendered
    const addButton = screen.getByRole('button', { name: /add new book/i });
    expect(addButton).toBeInTheDocument();

    // Verify that the search input is rendered
    const searchInput = screen.getByLabelText(/search/i);
    expect(searchInput).toBeInTheDocument();

    // Verify that the loading spinner is initially hidden
    const loadingSpinner = screen.queryByRole('progressbar');
    expect(loadingSpinner).not.toBeInTheDocument();

    // Verify that the book data is fetched and rendered
    const book1 = await screen.findByText(/book 1/i);
    const book2 = await screen.findByText(/book 2/i);
    expect(book1).toBeInTheDocument();
    expect(book2).toBeInTheDocument();
  });

  test('opens the modal when "Add New Book" button is clicked', () => {
    render(<Books />);
    
    // Click the "Add New Book" button
    const addButton = screen.getByRole('button', { name: /add new book/i });
    fireEvent.click(addButton);

    // Verify that the modal is opened
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('updates the search keyword when the search input value changes', () => {
    render(<Books />);
    
    // Type a search keyword in the search input
    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'keyword' } });

    // Verify that the search keyword is updated
    expect(searchInput.value).toBe('keyword');
  });
});