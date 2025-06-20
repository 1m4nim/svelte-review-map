<script>
  let name = '';
  let review = '';
  let rating = 3;
</script>

<form on:submit|preventDefault={() => {
  alert(`${name} の評価は ${rating} 点です\nコメント: ${review}`);
}}>
  <h2>新しいレビューを投稿</h2>
  <label>
    店舗名:
    <input bind:value={name} required />
  </label>
  <label>
    評価（1〜5）:
    <input type="number" min="1" max="5" bind:value={rating} required />
  </label>
  <label>
    コメント:
    <textarea bind:value={review}></textarea>
  </label>
  <button type="submit">投稿する</button>
</form>

<style>
  form {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.4rem;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
  }
</style>
