<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let storeName = '';
  let map;
  let marker;

  async function reverseGeocode(lat, lon) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'SvelteLeafletExample/1.0',
        'Referer': location.origin
      }
    });

    if (!res.ok) {
      console.error('Reverse geocoding failed');
      return '住所を取得できませんでした';
    }

    const data = await res.json();
    return data.display_name || '不明な場所';
  }

  onMount(() => {
    map = L.map('map').setView([35.681236, 139.767125], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      const name = await reverseGeocode(lat, lng);
      storeName = name;

      if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);
      } else {
        marker.setLatLng([lat, lng]);
      }

      marker.bindPopup(name).openPopup();
    });
  });
</script>

<style>
  #map {
    height: 500px;
    width: 100%;
    margin-top: 1rem;
  }

  label {
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
  }
</style>

<!-- 入力フォーム -->
<div>
  <label for="storeName">店舗名（住所）</label>
  <input id="storeName" type="text" bind:value={storeName} placeholder="地図をクリックして取得" />
</div>

<!-- 地図表示 -->
<div id="map"></div>
