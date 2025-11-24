const convertButton = document.querySelector(".convert-button");
const fromSelect = document.querySelector(".from-select");
const toSelect = document.querySelector(".currency-select");
const inputField = document.querySelector(".input-currency");

async function getRates() {
    const url = "https://api.exchangerate-api.com/v4/latest/BRL";
    const response = await fetch(url);
    return await response.json();
}

async function convertValues() {
    let inputValue = inputField.value;

    // Corrige valores com vírgula
    inputValue = inputValue.replace(".", "").replace(",", ".");
    inputValue = Number(inputValue);

    if (!inputValue) {
        alert("Digite um valor válido!");
        return;
    }

    const data = await getRates();

    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
    const currencyValueConverted = document.querySelector(".currency-value");

    // Converte para BRL primeiro
    const valueInBRL = fromCurrency === "BRL" ? inputValue : inputValue / data.rates[fromCurrency];

    // Depois converte para moeda final
    const finalValue = valueInBRL * data.rates[toCurrency];

    currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: fromCurrency
    }).format(inputValue);

    currencyValueConverted.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: toCurrency
    }).format(finalValue);
}

function updateCurrencyBox(selectElement, isToBox = false) {
    const currencyName = isToBox ? document.getElementById("currency-name") : document.getElementById("from-name");
    const currencyImg = isToBox ? document.querySelector(".currency-img") : document.querySelector(".from-img");

    const map = {
        "USD": { name: "Dólar Americano", img: "./assets/dolar.png" },
        "EUR": { name: "Euro", img: "./assets/euro.png" },
        "GBP": { name: "Libra Esterlina", img: "./assets/libra.png" },
        "BRL": { name: "Real Brasileiro", img: "./assets/real.png" }
    };

    const selected = map[selectElement.value];

    if (selected) {
        currencyName.innerHTML = selected.name;
        currencyImg.src = selected.img;
    }
}

fromSelect.addEventListener("change", () => updateCurrencyBox(fromSelect, false));
toSelect.addEventListener("change", () => updateCurrencyBox(toSelect, true));

convertButton.addEventListener("click", convertValues);
