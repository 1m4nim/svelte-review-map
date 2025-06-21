<script>
  import { onMount, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let map;
  let markers = [];
  let keyword = '';
  let storeName = '';

  let name = '';
  let rating = 3;
  let review = '';

  function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  async function loadPlaces() {
    clearMarkers();

    if (!keyword.trim()) return;

    const query = `
      [out:json];
      node["name"~"${keyword}", i](35.675,139.75,35.685,139.77);
      out;
    `;
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Overpass API Error: ${res.status}`);
      const json = await res.json();

      json.elements.forEach(el => {
        if (el.lat && el.lon) {
          const nameTag = el.tags?.name || "無名の施設";
          const m = L.marker([el.lat, el.lon])
            .addTo(map)
            .bindPopup(`<b>${nameTag}</b>`);

          m.on('click', async () => {
            storeName = nameTag;
            name = nameTag;
            await tick();
          });

          markers.push(m);
        }
      });

      if (json.elements.length === 0) {
        alert('該当する施設が見つかりませんでした。');
      }

    } catch (e) {
      alert('検索エラーが発生しました');
      console.error(e);
    }
  }

  function submitReview() {
    alert(`${name} の評価は ${rating} 点です\nコメント: ${review}`);
    storeName = '';
    name = '';
    rating = 3;
    review = '';
  }

  onMount(() => {
    map = L.map('map').setView([35.681236, 139.767125], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  });
</script>

<style>
  html, body {
    height: 100%;
    width:100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
  width: 100%;       
  max-width: 800px;  
  padding: 1rem;
  margin: 2rem 0; 
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}


  form {
    width: 100%;
    margin-bottom: 2rem;
  }

  form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input, textarea {
    padding: 0.5rem;
    width: 100%;
    font-size: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
    display: block;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }

  h2 {
    margin-top: 2rem;
  }

  #map {
    height: 500px;
    width: 100%;
    margin-top: 1rem;
  }
</style>

<!-- 全体を囲む中央寄せコンテナ -->
<div class="container">

  <!-- 検索フォーム -->
  <form on:submit|preventDefault={loadPlaces}>
    <label for="keyword">検索キーワード</label>
    <input
      id="keyword"
      type="text"
      bind:value={keyword}
      placeholder="例: スターバックス、セブンイレブン"
    />
    <button type="submit">検索</button>
  </form>

  <!-- 店舗名表示 -->
  <form>
    <label for="storeName">店舗名</label>
    <input
      id="storeName"
      type="text"
      bind:value={storeName}
      placeholder="マーカーをクリックするとここに表示されます"
      readonly
    />
  </form>

  <!-- レビュー投稿フォーム -->
  <form on:submit|preventDefault={submitReview}>
    <h2>新しいレビューを投稿</h2>

    <label for="rating">評価（1〜5）</label>
    <input
      id="rating"
      type="number"
      min="1"
      max="5"
      bind:value={rating}
      required
    />

    <label for="review">コメント</label>
    <textarea
      id="review"
      bind:value={review}
      rows="4"
      placeholder="レビューを記入してください"
    ></textarea>

    <button type="submit">投稿する</button>
  </form>

  <!-- 地図 -->
  <div id="map"></div>
</div>
