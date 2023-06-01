const API_KEY = 'AIzaSyDe3IdIU1SyDXLBCtocMHJVo2ytdRd04Rc';
const SPREADSHEET_ID = '1YnfrcmOgEfbcRZe5OZUENYq5kMWxjT13xSosvq-Zbe8';
const range = 'Words!A3:C1000';
const url = new URL('https://sheets.googleapis.com');
url.pathname = `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
url.searchParams.set('key', API_KEY);
export function getData() {
    return fetch(url.href)
        .then((response) => response.json())
        .then((data) => data.values);
}
export default { getData };
