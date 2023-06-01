var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = 'AIzaSyDe3IdIU1SyDXLBCtocMHJVo2ytdRd04Rc';
const SPREADSHEET_ID = '1YnfrcmOgEfbcRZe5OZUENYq5kMWxjT13xSosvq-Zbe8';
const range = 'Words!A3:C1000';
const url = new URL('https://sheets.googleapis.com');
url.pathname = `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
url.searchParams.set('key', API_KEY);
export function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url.href).then((response) => {
            return response.json();
        });
        return response.values;
    });
}
export default { getData };
//# sourceMappingURL=google-sheets.js.map