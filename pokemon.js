import { updateChart } from './main.js';

const rateSelect = document.getElementById('pokemon-select');
const pInput = document.getElementById('pInput');
let shinyRateLabel = document.getElementById('shinyRateLabel');

const shinyRates = {
    "baseRateGen6": {
        "name": "Base Rate (Gen 6+)",
        "probability": "1/4096"
    },
    "baseRateGen2": {
        "name": "Base Rate (Gen 2-5)",
        "probability": "1/8192"
    },
    "masudaMethodGen6": {
        "name": "Masuda Method (Gen 6+)",
        "probability": "6/4096"
    },
    "masudaMethodGen5": {
        "name": "Masuda Method (Gen 5)",
        "probability": "6/8192"
    },
    "masudaMethodGen4": {
        "name": "Masuda Method (Gen 4)",
        "probability": "5/8192"
    },
    "shinyCharmGen6": {
        "name": "Shiny Charm (Gen 6)",
        "probability": "3/4096"
    },
    "shinyCharmGen5": {
        "name": "Shiny Charm (Gen 5)",
        "probability": "3/8192"
    },
    "masudaCharmGen6": {
        "name": "Masuda Method w/ Shiny Charm (Gen 6+)",
        "probability": "8/4096"
    },
    "masudaCharmGen5": {
        "name": "Masuda Method w/ Shiny Charm (Gen 5)",
        "probability": "8/8192"
    },
    "dynamaxAdventure": {
        "name": "Dynamx Adventures",
        "probability": "1/300"
    },
    "dynamaxAdventureCharm": {
        "name": "Dynamx Adventures w/ Shiny Charm",
        "probability": "1/100"
    }
}

// Returns a well-formatted percent string based on a given probability
function getPercentStr(prob) {
  if (prob < 0 || prob > 1) {
    throw new Error("Probability must be between 0 and 1");
  }
  const percent = prob * 100;
  let decimals;
  if (percent < 1) {
    decimals = 2;   // e.g., 0.56%
  } else if (percent < 10) {
    decimals = 1;   // e.g., 5.3%
  } else {
    decimals = 0;   // e.g., 75%
  }

  return percent.toFixed(decimals) + "%";
}

// Updates parameters and chart
export function updateParameters() {
    console.log('updateParametersPokemon()');
    // Get shiny rate
    let rateStr = shinyRates[rateSelect.value].probability;
    // Update p for chart
    let rate = math.evaluate(rateStr);
    pInput.value = rate;
    // Update label
    let percentStr = ` (${getPercentStr(rate)})`;
    shinyRateLabel.textContent = rateStr + percentStr;

    updateChart();
}

rateSelect.addEventListener('input', updateParameters)