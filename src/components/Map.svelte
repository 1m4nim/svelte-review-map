<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export let selectedPlace;

  let map;

  const places = [
    {
      id: 1,
      name: 'カフェ 花鳥風月',
      lat: 35.681236,
      lng: 139.767125,
      reviews: []
    },
    {
      id: 2,
      name: '寿司 まる太',
      lat: 35.689634,
      lng: 139.692101,
      reviews: []
    },
    {
      id: 3,
      name: 'ラーメン 一番星',
      lat: 35.69384,
      lng: 139.703549,
      reviews: []
    }
  ];

  onMount(() => {
    map = L.map('map').setView([35.68, 139.76], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    places.forEach(place => {
      const marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.on('click', () => {
        selectedPlace.set(place);
      });
    });
  });
</script>

<style>
  #map {
    height: 100%;
    width: 100%;
  }
</style>

<div id="map"></div>
