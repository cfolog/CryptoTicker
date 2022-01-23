// Variables of my HTML elements
const tickerPrice = document.querySelector('.price');
const tickerVolume = document.querySelector('.volume');
const ticekrHigh = document.querySelector('.high');
const ticekrLow = document.querySelector('.low');
const ticekrTransactions = document.querySelector('.trades');
const tickerPercentage = document.querySelector('.percentage');
const tickerTItle = document.querySelector('.ticker-name');
const submitButton = document.querySelector('.submit-button');

let userInput = '';


// listens for submit button then runs runTicker function
submitButton.addEventListener('click', () =>{
    userInput = document.querySelector('.input-form').value;  // updates ticker based on user input // if ticker doesnt work but is correct, Kraken may not have it available
    runTicker();
})


// requests, formats, and returns data from API. Returns false if error is thrown
const fetchData = async () =>{
    const response = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${userInput.toUpperCase()}USD`);
    const data = await response.json();

    if(typeof(data.result) === 'object'){
        return data;
    }
    else{
        return false;
    }
};


const updateData = async () =>{
    //calls fetchData function to retrieve new set of info each time it runs
    const data = await fetchData();

    // if API returns valid data, execute. Otherwise dont
    if(data){
            //changes ticker title to users current selected crypto
        tickerTItle.textContent = `${userInput.toUpperCase()}/USD`

        // saves the cryptos identifier from the API's response as a variable, so the user doesnt have to change anything but the tickerSymbol EX: 'XXRPZUSD'
        const tickerSelector = String(Object.keys(data.result));

        // saves relevent data in variables & formats number to only show 3 decimal places. Uses tickerSelector to dynamically select whichever crypto info is sent back
        let price = Number(data.result[tickerSelector].a[0]).toFixed(2);
        let high = Number(data.result[tickerSelector].h[1]).toFixed(2);
        let low = Number(data.result[tickerSelector].l[1]).toFixed(2);
        const openPrice = data.result[tickerSelector].o;
        let percentage = String((((price - openPrice) / openPrice) * 100).toFixed(3));
        const trades = data.result[tickerSelector].t[1];
        const volume = data.result[tickerSelector].v[0].split('.');

        // if price is over $10,000, ticker no longer shows cents
        if (price > 10000){
            price = Number(data.result[tickerSelector].a[0]).toFixed(0);
            high = Number(data.result[tickerSelector].h[1]).toFixed(0);
            low = Number(data.result[tickerSelector].l[1]).toFixed(0);
        }

        // if price is under $1, use 3 decimal places to show price
        if (price < 1){
            price = Number(data.result[tickerSelector].a[0]).toFixed(3);
            high = Number(data.result[tickerSelector].h[1]).toFixed(3);
            low = Number(data.result[tickerSelector].l[1]).toFixed(3);
        }

        // changes the UI according to the current percentage.  '+' = Green UI , '-' = Red UI
        if(percentage >= 0){
            tickerPercentage.classList.add('green');
            tickerPercentage.classList.remove('red');
            document.body.classList.add('up');
            document.body.classList.remove('down');
        }else{
            tickerPercentage.classList.add('red');
            tickerPercentage.classList.remove('green');
            document.body.classList.remove('up');
            document.body.classList.add('down');
        }


        // Updates html elements with data fetched from API
        tickerPrice.textContent = `$${price}`;
        ticekrHigh.textContent = `24hr High: $${high}`;
        ticekrLow.textContent = `24hr Low: $${low}`;
        tickerPercentage.textContent = `${percentage}%`;
        tickerVolume.textContent = `24hr Volume: $${volume[0]}`;
        ticekrTransactions.textContent = `24hr Transactions: ${trades} Trades`;
        
    }
    // update UI to show that input was invalid and return false so it wont loop
    else{
        tickerTItle.textContent = 'Invalid Input'
        tickerPrice.textContent = `$`;
        ticekrHigh.textContent = `24hr High: $`;
        ticekrLow.textContent = `24hr Low: $`;
        tickerPercentage.textContent = `%`;
        tickerVolume.textContent = `24hr Volume: $`;
        ticekrTransactions.textContent = `24hr Transactions:   Trades`;

        tickerPercentage.classList.remove('green');
        tickerPercentage.classList.remove('red');
        document.body.classList.remove('up');
        document.body.classList.remove('down');

        return false;
    }

    
};


// loops ticker functions
function runTicker(){

    // Loads ticker on start rather than waiting 2.5 seconds for interval function to start
    updateData();


    // if fetchData function returns valid info, updateData will be true. if this is the case, info must be valid & updateData is looped/ if not, do nothing
    if(updateData()){
        // updates ticker every 2.5 seconds
        setInterval(() =>{
            updateData()
        }, 2500);
    }

    // resets user input form to be blank, once all functions have stored its value
    document.querySelector('.input-form').value = '';
};