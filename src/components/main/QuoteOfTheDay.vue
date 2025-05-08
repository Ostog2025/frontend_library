<template>
  <div class="quote-container">
    <div class="quote-section">
      <h2 class="title">Цитата дня</h2>
      <transition name="quote-fade">
        <div class="quote" v-if="quotes[currentQuoteIndex]">
          <p>{{ quotes[currentQuoteIndex] }}</p>
          <div class="dots">
            <span
              v-for="(quote, index) in quotes"
              :key="index"
              class="dot"
              :class="{ active: index === currentQuoteIndex }"
              @click="setQuote(index)"
            ></span>
          </div>
        </div>
      </transition>
    </div>
    <div class="right-section">
      <div class="update-label">Оновлення</div>
      <div class="books-container">
        <transition-group name="book-slide" tag="div" class="books-container">
          <div v-for="book in books" :key="book.bookid" class="book-item">
            <router-link :to="'/book/' + book.bookid" class="book-link">
              <div class="book-card">
                <div class="book-front">
                  <img
                    :src="book.book_photo"
                    alt="Фото книги"
                    v-if="book.book_photo"
                  />
                </div>
                <div class="book-back">
                  <img
                    :src="book.book_photo"
                    alt="Фото книги"
                    v-if="book.book_photo"
                  />
                  <div class="overlay">
                    <div class="padd">
                      <h3>{{ book.book_title }}</h3>
                      <p>
                        Автор: {{ book.author_firstname }}
                        {{ book.author_lastname }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api.js";

export default {
  data() {
    return {
      quotes: [
        "Мудрість – це не кількість знань, а вміння ними користуватися.",
        "Не той розумний, хто знає багато, а той, хто знає потрібне.",
        "Знання – це сила, але мудрість – це вміння застосовувати цю силу.",
        "Кожна помилка – це ще один крок до успіху.",
      ],
      currentQuoteIndex: 0,
      autoSwitchInterval: null,
      books: [],
    };
  },
  mounted() {
    this.startAutoSwitch();
    this.fetchBooks();
  },
  beforeUnmount() {
    clearInterval(this.autoSwitchInterval);
  },
  methods: {
    startAutoSwitch() {
      this.autoSwitchInterval = setInterval(() => {
        this.currentQuoteIndex =
          (this.currentQuoteIndex + 1) % this.quotes.length;
      }, 3000);
    },
    setQuote(index) {
      this.currentQuoteIndex = index;
      clearInterval(this.autoSwitchInterval);
      this.startAutoSwitch();
    },
    async fetchBooks() {
      const selectedIds = [1, 2, 3, 4];
      try {
        const responses = await Promise.all(
          selectedIds.map((id) => api.get(`/books/id/${id}`))
        );
        this.books = responses.map((response) => response.data);
      } catch (err) {
        console.error("Помилка завантаження книг:", err);
      }
    },
  },
};
</script>

<style scoped>
.quote-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  font-family: "Arial", sans-serif;
  color: white;
}

.quote-section {
  flex: 1 1 45%;
  padding: 20px;
  background: linear-gradient(45deg, #ff9966, #ff5e62);
  border-radius: 10px;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.quote {
  font-size: 1.5rem;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.dots {
  margin-top: 20px;
}

.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.dot.active {
  background-color: white;
  transform: scale(1.2);
}

.right-section {
  flex: 1 1 45%;
  padding: 20px;
  background: linear-gradient(45deg, #ff9966, #ff5e62);
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-y: auto;
  gap: 50px;
}

.update-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
}

.books-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.book-item {
  perspective: 1000px;
}

.book-card {
  position: relative;
  width: 100%;
  height: 190px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.book-card:hover {
  transform: rotateY(180deg);
}

.book-card h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
}

.book-card p {
  margin: 5px 0;
}

.book-front,
.book-back {
  position: absolute;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-front {
  background-color: #fff;
}

.book-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-back {
  background-color: #333;
  color: #fff;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.book-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.book-back .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-back .overlay {
  opacity: 1;
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}
.overlay {
  text-align: center;
}

.overlay h3 {
  font-size: 0.9rem;
  margin: 0;
}

.overlay p {
  font-size: 0.8rem;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .quote-container {
    flex-direction: column;
  }

  .right-section {
    flex-direction: column;
    gap: 20px;
  }

  .quote-section,
  .right-section {
    flex: 1 1 100%;
  }

  .books-container {
    gap: 10px;
  }

  .book-card {
    width: 100px;
  }
  .update-label {
    writing-mode: horizontal-tb;
    transform: rotate(360deg);
  }
}
</style>
