"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Eye,
  Save,
  ArrowUp,
  ArrowDown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Types
interface Book {
  id_book: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  age_rec_id: number;
}

interface AgeRecommendation {
  id: number;
  name: string;
}

// Mock data for age recommendations
const ageRecommendations: AgeRecommendation[] = [
  { id: 1, name: "3-7 years" },
  { id: 2, name: "8-12 years" },
  { id: 3, name: "13-17 years" },
  { id: 4, name: "18+ years" },
];

// Mock data for books
const initialBooks: Book[] = [
  {
    id_book: 1,
    title: "The Great Adventure",
    author: "John Smith",
    price: 19.99,
    stock: 45,
    description:
      "A thrilling adventure story that takes readers on a journey through exotic lands and dangerous territories.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 3,
  },
  {
    id_book: 2,
    title: "Mystery at Midnight",
    author: "Emily Johnson",
    price: 15.99,
    stock: 32,
    description:
      "A captivating mystery novel that will keep you guessing until the very last page.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 4,
  },
  {
    id_book: 3,
    title: "The Science of Everything",
    author: "Robert Williams",
    price: 24.99,
    stock: 18,
    description:
      "An educational book that explains complex scientific concepts in simple, understandable terms.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 5,
  },
  {
    id_book: 4,
    title: "Bedtime Stories",
    author: "Sarah Miller",
    price: 12.99,
    stock: 50,
    description:
      "A collection of heartwarming stories perfect for reading to young children before bed.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 1,
  },
  {
    id_book: 5,
    title: "Fantasy World",
    author: "Michael Brown",
    price: 18.99,
    stock: 27,
    description:
      "A magical fantasy novel set in a world of dragons, wizards, and ancient prophecies.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 3,
  },
  {
    id_book: 6,
    title: "The History of Art",
    author: "Jennifer Davis",
    price: 29.99,
    stock: 15,
    description:
      "A comprehensive guide to art history from ancient civilizations to modern movements.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 5,
  },
  {
    id_book: 7,
    title: "Cooking Masterclass",
    author: "Chef Antonio",
    price: 22.99,
    stock: 20,
    description:
      "Learn to cook like a professional with this step-by-step guide to culinary excellence.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 5,
  },
  {
    id_book: 8,
    title: "First Words",
    author: "Educational Press",
    price: 9.99,
    stock: 60,
    description:
      "Help your toddler learn their first words with this colorful, interactive book.",
    image_url: "/placeholder.svg?height=150&width=100",
    age_rec_id: 1,
  },
];

export default function AdminCrud() {
  // State for books data
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgeId, setFilterAgeId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Book | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | "delete"
  >("add");
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Apply filters and search
  useEffect(() => {
    let result = [...books];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.description.toLowerCase().includes(term)
      );
    }

    // Apply age filter
    if (filterAgeId !== null) {
      result = result.filter((book) => book.age_rec_id === filterAgeId);
    }

    // Apply sorting
    if (sortField) {
      result = result.sort((a, b) => {
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredBooks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [books, searchTerm, filterAgeId, sortField, sortDirection]);

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open modal for add/edit/view/delete
  const openModal = (mode: "add" | "edit" | "view" | "delete", book?: Book) => {
    setModalMode(mode);
    if (book && (mode === "edit" || mode === "view" || mode === "delete")) {
      setCurrentBook(book);
      setFormData({ ...book });
    } else {
      setCurrentBook(null);
      setFormData({
        title: "",
        author: "",
        price: 0,
        stock: 0,
        description: "",
        image_url: "/placeholder.svg?height=150&width=100",
        age_rec_id: 1,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
    setFormData({});
    setFormErrors({});
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Parse numeric values
    if (name === "price" || name === "stock") {
      parsedValue =
        name === "price"
          ? Number.parseFloat(value)
          : Number.parseInt(value, 10);
    }

    if (name === "age_rec_id") {
      parsedValue = Number.parseInt(value, 10);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.author?.trim()) {
      errors.author = "Author is required";
    }

    if (formData.price === undefined || formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (formData.stock === undefined || formData.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.image_url?.trim()) {
      errors.image_url = "Image URL is required";
    }

    if (!formData.age_rec_id) {
      errors.age_rec_id = "Age recommendation is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (modalMode === "add") {
      // Add new book
      const newBook: Book = {
        id_book: Math.max(...books.map((book) => book.id_book), 0) + 1,
        title: formData.title!,
        author: formData.author!,
        price: formData.price!,
        stock: formData.stock!,
        description: formData.description!,
        image_url: formData.image_url!,
        age_rec_id: formData.age_rec_id!,
      };
      setBooks([...books, newBook]);
    } else if (modalMode === "edit" && currentBook) {
      // Update existing book
      const updatedBooks = books.map((book) =>
        book.id_book === currentBook.id_book
          ? {
              ...book,
              title: formData.title!,
              author: formData.author!,
              price: formData.price!,
              stock: formData.stock!,
              description: formData.description!,
              image_url: formData.image_url!,
              age_rec_id: formData.age_rec_id!,
            }
          : book
      );
      setBooks(updatedBooks);
    }

    closeModal();
  };

  // Handle delete
  const handleDelete = () => {
    if (currentBook) {
      const updatedBooks = books.filter(
        (book) => book.id_book !== currentBook.id_book
      );
      setBooks(updatedBooks);
      closeModal();
    }
  };

  // Get age recommendation name by id
  const getAgeRecommendationName = (id: number) => {
    const age = ageRecommendations.find((age) => age.id === id);
    return age ? age.name : "Unknown";
  };

  return (
    <div className="min-h-screen bg-marfil-suave">
      {/* Admin header */}
      <header className="bg-azul-noche text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-dorado-elegante mr-3" />
            <h1 className="text-2xl font-bold">Book Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="text-sm bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
            >
              Payment Acceptance Requests
            </Link>
            <Link
              href="/auth/login"
              className="text-sm bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
            >
              Log Out
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Page header with actions */}
          <div className="p-6 border-b border-gris-medio/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gris-oscuro">Manage Books</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gris-medio hover:text-gris-oscuro"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Age filter */}
              <div className="relative">
                <select
                  value={filterAgeId === null ? "" : filterAgeId}
                  onChange={(e) =>
                    setFilterAgeId(
                      e.target.value
                        ? Number.parseInt(e.target.value, 10)
                        : null
                    )
                  }
                  className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante appearance-none w-full md:w-48"
                >
                  <option value="">All Ages</option>
                  {ageRecommendations.map((age) => (
                    <option key={age.id} value={age.id}>
                      {age.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
              </div>

              {/* Add book button */}
              <button
                onClick={() => openModal("add")}
                className="inline-flex items-center bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Book
              </button>
            </div>
          </div>

          {/* Books table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-marfil-suave">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center focus:outline-none"
                    >
                      Title
                      {sortField === "title" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("author")}
                      className="flex items-center focus:outline-none"
                    >
                      Author
                      {sortField === "author" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center focus:outline-none"
                    >
                      Price
                      {sortField === "price" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("stock")}
                      className="flex items-center focus:outline-none"
                    >
                      Stock
                      {sortField === "stock" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    Age Recommendation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gris-medio/20">
                {currentBooks.length > 0 ? (
                  currentBooks.map((book) => (
                    <tr key={book.id_book} className="hover:bg-marfil-suave/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 object-cover rounded-md"
                              src={book.image_url || "/placeholder.svg"}
                              alt={book.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gris-oscuro">
                              {book.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                        ${book.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.stock > 20
                              ? "bg-green-100 text-green-800"
                              : book.stock > 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                        {getAgeRecommendationName(book.age_rec_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal("view", book)}
                          className="text-azul-noche hover:text-dorado-elegante mr-3"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal("edit", book)}
                          className="text-dorado-elegante hover:text-oro-claro mr-3"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal("delete", book)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gris-medio"
                    >
                      No books found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredBooks.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gris-medio/20 flex items-center justify-between">
              <div className="text-sm text-gris-medio">
                Showing{" "}
                <span className="font-medium">{indexOfFirstBook + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastBook, filteredBooks.length)}
                </span>{" "}
                of <span className="font-medium">{filteredBooks.length}</span>{" "}
                books
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gris-medio/30 text-gris-medio hover:text-gris-oscuro disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number
                          ? "bg-dorado-elegante text-gris-oscuro"
                          : "text-gris-medio hover:bg-marfil-suave"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gris-medio/30 text-gris-medio hover:text-gris-oscuro disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal for add/edit/view/delete */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gris-oscuro/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gris-medio/20 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gris-oscuro">
                {modalMode === "add"
                  ? "Add New Book"
                  : modalMode === "edit"
                  ? "Edit Book"
                  : modalMode === "view"
                  ? "Book Details"
                  : "Delete Book"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gris-medio hover:text-gris-oscuro"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="px-6 py-4">
              {modalMode === "delete" ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gris-oscuro mb-2">
                    Delete Book
                  </h3>
                  <p className="text-sm text-gris-medio mb-6">
                    Are you sure you want to delete &quot;{currentBook?.title}
                    &quot;? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gris-medio/30 rounded-md text-gris-oscuro hover:bg-marfil-suave"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.title
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.title && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.title}
                          </p>
                        )}
                      </div>

                      {/* Author */}
                      <div>
                        <label
                          htmlFor="author"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          value={formData.author || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.author
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.author && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.author}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price || 0}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 border ${
                            formErrors.price
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.price && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.price}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div>
                        <label
                          htmlFor="stock"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock || 0}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          min="0"
                          className={`w-full px-3 py-2 border ${
                            formErrors.stock
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.stock && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.stock}
                          </p>
                        )}
                      </div>

                      {/* Age recommendation */}
                      <div>
                        <label
                          htmlFor="age_rec_id"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Age Recommendation
                        </label>
                        <select
                          id="age_rec_id"
                          name="age_rec_id"
                          value={formData.age_rec_id || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.age_rec_id
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        >
                          <option value="">Select age recommendation</option>
                          {ageRecommendations.map((age) => (
                            <option key={age.id} value={age.id}>
                              {age.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.age_rec_id && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.age_rec_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                      {/* Image URL */}
                      <div>
                        <label
                          htmlFor="image_url"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Image URL
                        </label>
                        <input
                          type="text"
                          id="image_url"
                          name="image_url"
                          value={formData.image_url || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.image_url
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.image_url && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.image_url}
                          </p>
                        )}
                      </div>

                      {/* Image preview */}
                      <div>
                        <p className="block text-sm font-medium text-gris-oscuro mb-1">
                          Image Preview
                        </p>
                        <div className="border border-gris-medio/30 rounded-md p-2 flex items-center justify-center">
                          <img
                            src={
                              formData.image_url ||
                              "/placeholder.svg?height=150&width=100"
                            }
                            alt="Book cover preview"
                            className="h-32 object-contain"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          rows={5}
                          className={`w-full px-3 py-2 border ${
                            formErrors.description
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.description && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form actions */}
                  {modalMode !== "view" && (
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-gris-medio/30 rounded-md text-gris-oscuro hover:bg-marfil-suave"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md flex items-center"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        {modalMode === "add" ? "Add Book" : "Save Changes"}
                      </button>
                    </div>
                  )}

                  {modalMode === "view" && (
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
