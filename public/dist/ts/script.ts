const countryForm: HTMLFormElement | null = document.querySelector('#countryForm');
const resultContainer: HTMLDivElement | null = document.querySelector('.result-container');
const sugCountries: HTMLDivElement | null = document.querySelector('.sug-countries');
const input: HTMLInputElement | null = document.querySelector('input');
const searchBtn: HTMLButtonElement | null = document.querySelector('.search');

const countryName: HTMLInputElement | null = document.querySelector('[name="country"]');
const feedbackMsg: HTMLDivElement | null = document.querySelector('.feedbackMsg');

type Data = {
    status?: boolean,
    message?: string,
    countries?: [{
        city: string | null,
        country: string,
        independence: string | null,
        location: string | null
    }]
}

type Histories = {
    country: string
}[];

type HistoryCountry = {
    country: string
};

type InputBody = {
    country: string | null
}

async function loadResult (country: string | null){
    const body: InputBody = {
        country
    }
    const request: Response = await fetch('/country', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    });

    const response: Data = await request.json();
    if(response?.status === false){
        feedbackMsg!.innerHTML = `<p style="color: red">${response?.message}</p>`;
    }else if(!response?.countries?.length){
        feedbackMsg!.innerHTML = `<p style="color: red">No Country found!</p> `;
    }else if(response?.countries?.length){
        resultContainer!.innerHTML = `
        <span class="result"><b>County:</b> ${response?.countries[0]?.country}</span>
        <span class="result"><b>Continent:</b> ${response?.countries[0]?.location}</span>
        <span class="result"><b>Capital city:</b> ${response?.countries[0]?.city}</span>
        <span class="result"><b>Independence year:</b> ${response?.countries[0]?.independence}</span>
        `;

        const _history: string = localStorage.getItem('history') || "[]";
        const _histories: Histories = JSON.parse(_history);
        const isHistory: boolean = _histories.some((history) => history.country === country);
        if(!isHistory){
            const histories = [...JSON.parse(_history), body];
            localStorage.setItem('history', JSON.stringify(histories));
        }    
    } 
}

async function historyLoad() {
    if(document.querySelectorAll('.suggests')){
        const suggests: NodeListOf<HTMLAnchorElement> | null = document.querySelectorAll('.suggests');
        suggests?.forEach((suggest: HTMLAnchorElement) => {
            suggest?.addEventListener('click', async function (e: Event){
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                
                await loadResult(this?.getAttribute("data"));
                countryName!.value = this?.getAttribute("data") || '';
                addHistory();
            });
        })
    }
}

const addHistory = (): void => {
    if(localStorage.getItem('history')){
        const _history: string = localStorage.getItem('history') || "[]";
        const histories: Histories = JSON.parse(_history);
        sugCountries!.innerHTML = `Recently searched: ${histories.map((history: HistoryCountry) => {
        
            return `  <a class="suggests" data="${history?.country}" href="#!">${history?.country}</a>`
        })}`;
    }else{
        sugCountries!.innerHTML = '';
    }
}

countryForm?.addEventListener('submit', async function(e: Event): Promise<void> {
    e.preventDefault();
    await loadResult(countryName!.value);
    addHistory();
    
});


document.addEventListener('DOMContentLoaded', () => {
    addHistory();
    historyLoad();
});

window.addEventListener('mousemove', () => {
    historyLoad();
});

input?.addEventListener('input', (e: Event) => {
    e.preventDefault();
    feedbackMsg!.innerHTML = '';
    resultContainer!.innerHTML = '';
});