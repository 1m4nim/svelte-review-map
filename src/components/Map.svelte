<script>
  import { onMount, tick } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let map;
  let markers = [];
  let keyword = '';       // 検索キーワード
  let storeName = '';     // クリックしたマーカーの店舗名を保持

  // レビュー用フォームデータ
  let name = '';
  let rating = 3;
  let review = '';

  // 既存マーカーを地図から削除
  function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  // 検索してマーカー表示＆クリックでstoreName更新
  async function loadPlaces() {
    clearMarkers();

    if (!keyword.trim()) return;

    const query = `
      [out:json];
      node
        ["name"~"${keyword}", i]
        (35.675,139.75,35.685,139.77);
      out;
    `;
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Overpass API Error: ${res.status}`);
      }

      const json = await res.json();

      json.elements.forEach(el => {
        if (el.lat && el.lon) {
          const nameTag = el.tags?.name || "無名の施設";
          const m = L.marker([el.lat, el.lon])
            .addTo(map)
            .bindPopup(`<b>${nameTag}</b>`);

          // クリック時に店舗名をセット
          m.on('click', async () => {
            storeName = nameTag;
            name = nameTag;    // レビュー投稿用フォームの店舗名も連動
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

  // レビュー投稿時の処理（ダミー）
  function submitReview() {
    alert(`${name} の評価は ${rating} 点です\nコメント: ${review}`);

    // フォームクリア
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
  #map {
    height: 500px;
    width: 100%;
    margin-top: 1rem;
  }

  form {
    margin-bottom: 1rem;
  }

  input, textarea {
    padding: 0.5rem;
    width: 60%;
    font-size: 1rem;
    margin-bottom: 0.8rem;
    box-sizing: border-box;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    margin-left: 0.5rem;
    cursor: pointer;
  }
</style>

<!-- 検索フォーム -->
<form on:submit|preventDefault={loadPlaces}>
  <input
    type="text"
    bind:value={keyword}
    placeholder="検索キーワード（例: スターバックス、セブンイレブン）"
  />
  <button type="submit">検索</button>
</form>

<!-- 店舗名表示（読み取り専用） -->
<form>
  <label>店舗名:</label>
  <input
    type="text"
    bind:value={storeName}
    placeholder="マーカーをクリックするとここに表示されます"
    readonly
  />
</form>

<!-- レビュー投稿フォーム -->
<form on:submit|preventDefault={submitReview}>
  
  <h2>新しいレビューを投稿</h2>
  <br/>
  <label>
    評価（1〜5）:
    <input type="number" min="1" max="5" bind:value={rating} required />
  </label>
  <br/>
  <label>
    コメント:
    <textarea bind:value={review} rows="4" />
  </label>
  <br/>
  <button type="submit">投稿する</button>
</form>

<!-- 地図表示 -->
<div id="map"></div>
