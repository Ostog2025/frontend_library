<template>
  <div class="admin-panel">
    <h2>Управління книгами</h2>

    <table>
      <thead>
        <tr>
          <th>Назва книги</th>
          <th>Автор</th>
          <th>Жанр</th>
          <th>Видавництво</th>
          <th>Рік публікації</th>
          <th>Опис</th>
          <th>Кількість доступних</th>
          <th>Кількість всього</th>
          <th>Фото</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.bookid">
          <td>{{ book.book_title }}</td>
          <td>{{ book.author_firstname }} {{ book.author_lastname }}</td>
          <td>{{ book.genre_name }}</td>
          <td>{{ book.publisher_name }}</td>
          <td>{{ book.year }}</td>
          <td>{{ book.book_description }}</td>
          <td>{{ book.copiesavailable }}</td>
          <td>{{ book.totalcopies }}</td>
          <td>
            <img
              v-if="book.book_photo"
              :src="`${book.book_photo}`"
              alt="book photo"
              width="50"
            />
          </td>
          <td>
            <button @click="editBook(book)">Редагувати</button>
            <button @click="deleteBook(book.bookid)">Видалити</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="addBook">Додати книгу</button>

    <div v-if="editingBook" class="popup-overlay" @click.self="cancelEdit">
      <div class="popup-form">
        <h3>{{ isEditing ? "Редагувати книгу" : "Додати нову книгу" }}</h3>
        <form @submit.prevent="saveBook">
          <label>Назва книги:</label>
          <input v-model="bookForm.title" required />

          <label>Автор:</label>
          <select v-model="bookForm.authorid" required>
            <option
              v-for="author in authors"
              :value="author.authorid"
              :key="author.authorid"
              :selected="bookForm.authorid === author.authorid"
            >
              {{ author.firstname }} {{ author.lastname }}
            </option>
          </select>

          <label>Жанр:</label>
          <select v-model="bookForm.genreid" required>
            <option
              v-for="genre in genres"
              :value="genre.genreid"
              :key="genre.genreid"
              :selected="bookForm.genreid === genre.genreid"
            >
              {{ genre.name }}
            </option>
          </select>

          <label>Дата публікації:</label>
          <input v-model="bookForm.year" required />

          <label>Опис:</label>
          <textarea v-model="bookForm.description" required></textarea>

          <label>Кількість доступних:</label>
          <input type="number" v-model="bookForm.available" required />

          <label>Кількість всього:</label>
          <input type="number" v-model="bookForm.total" required />

          <label>Поточне фото:</label>
          <img
            v-if="bookForm.photo"
            :src="`${bookForm.photo}`"
            alt="book photo"
            width="100"
          />

          <label>Нове фото (файл):</label>
          <input type="file" @change="handleFileUpload" />

          <button type="submit">
            {{ isEditing ? "Зберегти" : "Створити" }}
          </button>
          <button type="button" @click="cancelEdit">Скасувати</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      books: [],
      authors: [],
      genres: [],
      bookForm: {
        title: "",
        authorid: "",
        genreid: "",
        year: "",
        description: "",
        available: 0,
        total: 0,
        photo: "",
        photoFile: null,
      },
      originalBook: null,
      editingBook: false,
      isEditing: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.bookForm.photoFile = event.target.files[0];
    },
    async fetchBooks() {
      try {
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/books"
        );
        this.books = response.data;
        console.log(this.books);
      } catch (error) {
        console.error("Error fetching books:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося отримати список книг.",
        });
      }
    },
    async fetchAuthorsAndGenres() {
      try {
        const [authorsResponse, genresResponse] = await Promise.all([
          axios.get(
            "https://backend-library-0o7f.onrender.com/api/books/authors"
          ),
          axios.get(
            "https://backend-library-0o7f.onrender.com/api/books/genres"
          ),
        ]);
        this.authors = authorsResponse.data;
        this.genres = genresResponse.data;
      } catch (error) {
        console.error("Error fetching authors or genres:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося отримати список авторів або жанрів.",
        });
      }
    },
    async deleteBook(bookId) {
      try {
        const response = await axios.delete(
          `https://backend-library-0o7f.onrender.com/api/books/id/${bookId}`
        );
        Swal.fire({
          icon: "success",
          title: "Книгу видалено",
          text: response.data.message,
        });
        this.fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося видалити книгу.",
        });
      }
    },
    async saveBook() {
      if (this.isEditing) {
        await this.updateBook();
      } else {
        await this.addNewBook();
      }
    },
    async updateBook() {
      try {
        const formData = new FormData();
        formData.append("bookId", this.bookForm.bookId);
        formData.append("title", this.bookForm.title);
        formData.append("authorid", this.bookForm.authorid);
        formData.append("genreid", this.bookForm.genreid);
        formData.append("year", this.bookForm.year);
        formData.append("description", this.bookForm.description);
        formData.append("copiesavailable", this.bookForm.available);
        formData.append("totalcopies", this.bookForm.total);
        if (this.bookForm.photoFile) {
          formData.append("photo", this.bookForm.photoFile);
        }

        const response = await axios.put(
          `https://backend-library-0o7f.onrender.com/api/books/${this.bookForm.bookId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Книгу оновлено",
          text: response.data.message,
        });
        this.fetchBooks();
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating book:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося оновити книгу.",
        });
      }
    },
    async addNewBook() {
      try {
        const formData = new FormData();
        formData.append("title", this.bookForm.title);
        formData.append("authorid", this.bookForm.authorid);
        formData.append("genreid", this.bookForm.genreid);
        formData.append("publisherid", this.bookForm.publisherid);
        formData.append("year", this.bookForm.year);
        formData.append("description", this.bookForm.description);
        formData.append("copiesavailable", this.bookForm.available);
        formData.append("totalcopies", this.bookForm.total);
        if (this.bookForm.photoFile) {
          formData.append("photo", this.bookForm.photoFile);
        }

        const response = await axios.post(
          "https://backend-library-0o7f.onrender.com/api/books",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Книгу додано",
          text: response.data.message,
        });
        this.fetchBooks();
        this.cancelEdit();
      } catch (error) {
        console.error("Error adding book:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося додати книгу.",
        });
      }
    },
    cancelEdit() {
      this.bookForm = {
        title: "",
        authorid: "",
        genreid: "",
        year: "",
        description: "",
        available: 0,
        total: 0,
        photo: "",
        photoFile: null,
      };
      this.editingBook = false;
      this.isEditing = false;
    },
    editBook(book) {
      this.bookForm = {
        bookId: book.bookid,
        title: book.book_title,
        authorid: book.authorid,
        genreid: book.genreid,
        year: book.year,
        description: book.book_description,
        available: book.copiesavailable,
        total: book.totalcopies,
        photo: book.book_photo,
        photoFile: null,
      };
      this.editingBook = true;
      this.isEditing = true;
    },
    addBook() {
      this.cancelEdit();
      this.editingBook = true;
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchBooks();
    this.fetchAuthorsAndGenres();
  },
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: white;
  font-size: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  margin: 5px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 0;
}

button:hover {
  background-color: #ff7e5f;
  color: white;
}

button:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-form {
  background: #fff;
  padding: 20px;
  margin-top: 40px;
  border-radius: 8px;
  width: 400px;
  height: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  color: black;
  z-index: 10;
}

.popup-form h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.popup-form form {
  display: flex;
  flex-direction: column;
}

.popup-form label {
  margin: 10px 0 5px;
  font-size: 14px;
}

.popup-form select,
.popup-form textarea,
.popup-form input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.popup-form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.popup-form button[type="button"] {
  background-color: #ccc;
}

.popup-form button[type="submit"]:hover {
  background-color: #0056b3;
}

.popup-form button[type="button"]:hover {
  background-color: #999;
}
</style>
