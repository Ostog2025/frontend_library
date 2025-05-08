<template>
  <div>
    <h1>Управління позиками</h1>
    <LoanList />
    <AddReservation />
    <LoanHistory />
  </div>
</template>

<script>
import LoanHistory from "./loans/LoanHistory.vue";
import LoanList from "./loans/LoanList.vue";
import AddReservation from "./loans/AddReservation.vue";

export default {
  components: {
    LoanList,
    LoanHistory,
    AddReservation,
  },
};
</script>
