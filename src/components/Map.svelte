<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let map;
  let markers = [];
  let keyword ='' ; // 初期値はrestaurant（飲食店）

  // マーカーを地図から一括削除
  function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  async function loadPlaces() {
    clearMarkers();

    // キーワードが空なら処理しない
    if (!keyword.trim()) {
      return;
    }

    // Overpass QL クエリ作成
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
      const json = await res.json();

      json.elements.forEach(el => {
        if (el.lat && el.lon) {
          const name = el.tags?.name || "無名の施設";
          const m = L.marker([el.lat, el.lon])
            .addTo(map)
            .bindPopup(`<b>${name}</b>`);
          markers.push(m);
        }
      });
    } catch (e) {
      alert('検索エラーが発生しました');
      console.error(e);
    }
  }

  onMount(() => {
    map = L.map('map').setView([35.68, 139.76], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadPlaces();
  });
</script>

<style>
  #map {
    height: 500px;
  }
  form {
    margin-bottom: 0.5rem;
  }
</style>

<form on:submit|preventDefault={loadPlaces}>
  <input type="text" bind:value={keyword} placeholder="検索キーワード（例: スターバックス）" />
  <button type="submit">検索</button>
</form>

<div id="map"></div>
