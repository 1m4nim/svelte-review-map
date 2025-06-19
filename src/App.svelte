<script>
  import Map from './components/Map.svelte';
  import ReviewModal from './components/ReviewModal.svelte';
  import { writable } from 'svelte/store';

  const selectedPlace = writable(null);

  function closeModal() {
    selectedPlace.set(null);
  }
</script>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  header {
    padding: 0.5rem;
    background: #0288d1;
    color: white;
    font-weight: bold;
    text-align: center;
  }
  section {
    flex: 1;
  }
</style>

<main>
  <header>店舗レビュー地図</header>
  <section>
    <Map {selectedPlace} />
  </section>

  {#if $selectedPlace}
    <ReviewModal {selectedPlace} on:close={closeModal} />
  {/if}
</main>
