<script>
  import Map from './components/Map.svelte';
  import ReviewForm from './components/ReviewForm.svelte';
</script>

<main>
  <h1>📍 レビュー地図アプリ</h1>
  <ReviewForm />
  <Map />
</main>

<style>
  main {
    padding: 1rem;
    font-family: sans-serif;
  }

  h1 {
    text-align: center;
  }
</style>
