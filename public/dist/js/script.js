"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const countryForm = document.querySelector('#countryForm');
const resultContainer = document.querySelector('.result-container');
const sugCountries = document.querySelector('.sug-countries');
const input = document.querySelector('input');
const searchBtn = document.querySelector('.search');
const countryName = document.querySelector('[name="country"]');
const feedbackMsg = document.querySelector('.feedbackMsg');
function loadResult(country) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const body = {
            country
        };
        const request = yield fetch('/country', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        });
        const response = yield request.json();
        if ((response === null || response === void 0 ? void 0 : response.status) === false) {
            feedbackMsg.innerHTML = `<p style="color: red">${response === null || response === void 0 ? void 0 : response.message}</p>`;
        }
        else if (!((_a = response === null || response === void 0 ? void 0 : response.countries) === null || _a === void 0 ? void 0 : _a.length)) {
            feedbackMsg.innerHTML = `<p style="color: red">No Country found!</p> `;
        }
        else if ((_b = response === null || response === void 0 ? void 0 : response.countries) === null || _b === void 0 ? void 0 : _b.length) {
            resultContainer.innerHTML = `
        <span class="result"><b>County:</b> ${(_c = response === null || response === void 0 ? void 0 : response.countries[0]) === null || _c === void 0 ? void 0 : _c.country}</span>
        <span class="result"><b>Continent:</b> ${(_d = response === null || response === void 0 ? void 0 : response.countries[0]) === null || _d === void 0 ? void 0 : _d.location}</span>
        <span class="result"><b>Capital city:</b> ${(_e = response === null || response === void 0 ? void 0 : response.countries[0]) === null || _e === void 0 ? void 0 : _e.city}</span>
        <span class="result"><b>Independence year:</b> ${(_f = response === null || response === void 0 ? void 0 : response.countries[0]) === null || _f === void 0 ? void 0 : _f.independence}</span>
        `;
            const _history = localStorage.getItem('history') || "[]";
            const _histories = JSON.parse(_history);
            const isHistory = _histories.some((history) => history.country === country);
            if (!isHistory) {
                const histories = [...JSON.parse(_history), body];
                localStorage.setItem('history', JSON.stringify(histories));
            }
        }
    });
}
function historyLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        if (document.querySelectorAll('.suggests')) {
            const suggests = document.querySelectorAll('.suggests');
            suggests === null || suggests === void 0 ? void 0 : suggests.forEach((suggest) => {
                suggest === null || suggest === void 0 ? void 0 : suggest.addEventListener('click', function (e) {
                    return __awaiter(this, void 0, void 0, function* () {
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        yield loadResult(this === null || this === void 0 ? void 0 : this.getAttribute("data"));
                        countryName.value = (this === null || this === void 0 ? void 0 : this.getAttribute("data")) || '';
                        addHistory();
                    });
                });
            });
        }
    });
}
const addHistory = () => {
    if (localStorage.getItem('history')) {
        const _history = localStorage.getItem('history') || "[]";
        const histories = JSON.parse(_history);
        sugCountries.innerHTML = `Recently searched: ${histories.map((history) => {
            return `  <a class="suggests" data="${history === null || history === void 0 ? void 0 : history.country}" href="#!">${history === null || history === void 0 ? void 0 : history.country}</a>`;
        })}`;
    }
    else {
        sugCountries.innerHTML = '';
    }
};
countryForm === null || countryForm === void 0 ? void 0 : countryForm.addEventListener('submit', function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        yield loadResult(countryName.value);
        addHistory();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    addHistory();
    historyLoad();
});
window.addEventListener('mousemove', () => {
    historyLoad();
});
input === null || input === void 0 ? void 0 : input.addEventListener('input', (e) => {
    e.preventDefault();
    feedbackMsg.innerHTML = '';
    resultContainer.innerHTML = '';
});
//# sourceMappingURL=script.js.map