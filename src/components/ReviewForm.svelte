<script>
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';

  export let selectedPlace;
  const dispatch = createEventDispatcher();

  let newRating = 5;
  let newComment = '';

  function close() {
    dispatch('close');
  }

  function submitReview() {
    get(selectedPlace).reviews.push({
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleString()
    });
    newRating = 5;
    newComment = '';
  }
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1rem;
  }

  button.close {
    float: right;
    background: none;
    border: none;
    font-size: 1.5rem;
  }

  label {
    display: block;
    margin-top: 0.5rem;
  }

  textarea, select {
    width: 100%;
    margin-top: 0.25rem;
  }

  .review {
    border-top: 1px solid #ccc;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
</style>

<div class="modal-backdrop" on:click|self={close}>
  <div class="modal">
    <button class="close" on:click={close}>×</button>
    <h2>{$selectedPlace.name} のレビュー</h2>

    {#if $selectedPlace.reviews.length === 0}
      <p>まだレビューがありません。</p>
    {/if}

    {#each $selectedPlace.reviews as review}
      <div class="review">
        ⭐️ {review.rating}<br />
        {review.comment}<br />
        <small>{review.date}</small>
      </div>
    {/each}

    <hr />

    <form on:submit|preventDefault={submitReview}>
      <label>
        評価（1〜5）:
        <select bind:value={newRating}>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </label>
      <label>
        コメント:
        <textarea rows="3" bind:value={newComment} placeholder="コメントを入力"></textarea>
      </label>
      <button type="submit" disabled={newComment.trim() === ''}>投稿</button>
    </form>
  </div>
</div>
