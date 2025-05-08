<template>
  <div class="center-container">
    <div class="info-container">
      <h2 class="info-title">Про нас</h2>
      <div class="info-content">
        <p>
          Ми — команда, що прагне зробити читання ближчим та зручнішим для
          кожного. Наша бібліотека — це не просто місце для книг, а простір
          натхнення, навчання і саморозвитку.
        </p>
        <p>
          Ми працюємо, щоб ви могли знайти свою наступну улюблену книгу,
          поділитися враженнями та долучитися до спільноти книжкових
          поціновувачів.
        </p>
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
  margin: 0 auto;
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
</style>
