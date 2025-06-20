import { writable } from 'svelte/store';

const saved = localStorage.getItem('reviews');
export const reviews = writable(saved ? JSON.parse(saved) : []);

reviews.subscribe(value => {
  localStorage.setItem('reviews', JSON.stringify(value));
});
