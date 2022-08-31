export const fetchAPI = async () => {
  const endpoint = 'https://economia.awesomeapi.com.br/json/all';
  const request = await fetch(endpoint);
  const data = await request.json();
  const coins = Object.values(data)
    .filter((coin) => coin.codein !== 'BRLT')
    .map(((e) => e.code));
  return coins;
};

export const fetchAskApi = async () => {
  const endpoint = 'https://economia.awesomeapi.com.br/json/all';
  const request = await fetch(endpoint);
  const data = await request.json();
  return data;
};
