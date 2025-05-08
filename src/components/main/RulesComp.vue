<template>
  <div class="center-container">
    <div class="info-container">
      <h2 class="info-title">Правила користування</h2>
      <div class="info-content">
        <ul>
          <li>
            📚 Дбайливо ставтеся до книг — не пошкоджуйте обкладинки та
            сторінки.
          </li>
          <li>
            ⏰ Повертайте книги вчасно, щоб інші також мали можливість читати.
          </li>
          <li>🙋 З повагою ставтесь до інших користувачів платформи.</li>
          <li>💬 Залишайте відгуки — допоможіть іншим знайти цікаве читво.</li>
          <li>🚫 Не завантажуйте заборонений або образливий контент.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
}
.info-container {
  padding: 30px;
  border-radius: 10px;
  background: linear-gradient(45deg, #ff9966, #ff5e62);
  color: white;
  font-family: "Arial", sans-serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 900px;
  margin: auto;
}

.info-title {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.info-content {
  font-size: 1.2rem;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 12px;
}
</style>
