export async function fetchTheme() {
  const res = await fetch("https://api.natly.com/config/theme");
  return await res.json();
}
