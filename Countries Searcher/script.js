(function() { // IIFE

    $(function() { // shorthand for (document).ready() - fires when the document is ready;


        // ------------------------------------------- Global variables and event listeners ------------------------------------------- //

        // defining the constant DOMAIN of the server
        const DOMAIN = "https://restcountries.eu";

        // defining the constant url for all the countries, with the default values
        const allCountriesURL = DOMAIN + "/rest/v2?fields=name;currencies;capital;flag;topLevelDomain";

        
        let countryNameInputField = $("#countryNameInputField");
        // an event listener for when the input field's value is changed - check whether the search button should be disabled
        countryNameInputField.on("input", validateInputFieldState);


        const getAllCountriesButton = $("#getAllCountriesBtn");
        // when the user clicks on the 'get all countries' button
        getAllCountriesButton.click(() => {
            getCountriesFromModal(allCountriesURL);
        });


        const getSearchedCountriesBtn = $("#getSearchedCountriesBtn");
        // when the user clicks on the 'search by name' button, in order to find countries by name
        getSearchedCountriesBtn.click(() => {

            // retrieving the new url, based on the user's input
            let url = getUpdatedURL();
            getCountriesFromModal(url);
        });


        const clearUIbutton = $("#clearUI");
        clearUIbutton.click(() => {
            clearUI();
            clearInputField();
            clearErrorInUI();
        });


        // validate whether the search button should be disabled
        validateInputFieldState();

        const countriesContainerInUI = $("#resultsSection");




        // ------------------------------------------- Functions ------------------------------------------- //


        // --------------------------------- Model --------------------------------- //

        function getCountriesFromModal(url) {

            /*
                making an AJAX request, with the url based on the button clicked by the user
            */
           
            // this scope occurs when the request is successful
            $.get(url).then( countries => {

                clearUI();
                clearInputField();
                clearErrorInUI();

                // for each country (object) received from the server, displaying it in the UI
                for (let country of countries) {
                    displayCountriesInUI(country);
                }
            })

            // this scope occurs if the request failed
            // catching the error, and handling it
            .catch( error => {

                // displaying the input field as red
                displayErrorInUI();

                // alerting the error status
                alert(`Countries Not Found: ${error.status}`);
            });
            
        }



        // --------------------------------- View --------------------------------- //

        function displayCountriesInUI(country) {
            createNewCountryCard(country);
        }

        function createNewCountryCard(country) {

            // creating the data elements for the specific country
            let countryFlagImage = createNewCountryFlag(country);
            let countryNameParagraph = createNewCountryName(country);
            let countryTopLevelDomainParagraph = createNewCountryTopLevelDomain(country);
            let countryCapitalParagraph = createNewCountryCapital(country);
            let countryCurrenciesLists = createCurrencyLists(country.currencies);

            let currenciesHeader = getCurrenciesHeader();

            // creating the flag container div
            let countryFlagContainer = $("<div>");
            countryFlagContainer.addClass("countryFlagContainer");
            countryFlagContainer.append(countryFlagImage);

            // appending the data of the country to the data section inside the country card container
            let countryDataSection = $("<div>");
            countryDataSection.addClass("countryData");
            countryDataSection.append(countryNameParagraph);
            countryDataSection.append(countryTopLevelDomainParagraph);
            countryDataSection.append(countryCapitalParagraph);
            countryDataSection.append(currenciesHeader);
            countryDataSection.append(countryCurrenciesLists);

            // creating the container div of the country
            let countryContainer = $("<div>");
            countryContainer.addClass("countryContainer");
            countryContainer.append(countryFlagContainer);
            countryContainer.append(countryDataSection);

            // appending the newly created country card container to the UI
            countriesContainerInUI.append(countryContainer);
        }

        function createNewCountryFlag(country) {
            // creating an image with the flag of the country, and returning that image

            let countryFlagImage = $("<img>");
            countryFlagImage.attr("src", country.flag);
            countryFlagImage.addClass("countryFlag");

            return countryFlagImage;
        }

        function createNewCountryName(country) {
            // creating a paragraph with the country's name, and returning that paragraph

            let countryName = $("<p>");
            countryName.text(country.name);
            countryName.addClass("countryName");

            return countryName;
        }

        function createNewCountryTopLevelDomain(country) {
            // creating a paragraph with the country's top level name, and returning that paragraph

            let countryTopLevelDomain = $("<p>");
            countryTopLevelDomain.text(`Top Level Domain: ${country.topLevelDomain}`);
            countryTopLevelDomain.addClass("countryTopLevelDomain");

            return countryTopLevelDomain;
        }

        function createNewCountryCapital(country) {
            // creating a paragraph with the country's capital, and returning that paragraph

            let countryCapital = $("<p>");
            countryCapital.text(`Capital: ${country.capital}`);
            countryCapital.addClass("countryCapital");

            return countryCapital;
        }

        function createCurrencyLists(currencies) {

            // defining a new array to store all the currencies of the country
            let allCurrenciesList = new Array();

            // for each curreny object of the country, create a new list, and append that list to the array
            for (let currency of currencies) {
                let newCurrencyList = createNewCurrencyList(currency);
                allCurrenciesList.push(newCurrencyList);
            }

            return allCurrenciesList;
        }

        function createNewCurrencyList(currency) {

            // creating the elements for the new currency list

            let curreciesListDiv = $("<div>");
            let currencyList = $("<ul>");


            // appending the currency data to list items
            let currencyCodeListeItem = $("<li>");
            currencyCodeListeItem.text(`Code: ${currency.code}`);

            let currencyNameListItem = $("<li>");
            currencyNameListItem.text(`Name: ${currency.name}`);

            let currencySymbol = $("<li>");
            currencySymbol.text(`Symbol: ${currency.symbol}`);


            // appending the list items to the 'ul' (list) element
            currencyList.append(currencyCodeListeItem);
            currencyList.append(currencyNameListItem);
            currencyList.append(currencySymbol);


            // appending the newly created list with the data, to the returned div
            curreciesListDiv.append(currencyList);

            return curreciesListDiv;
        }

        function getCurrenciesHeader() {

            // creating a paragraph with the text 'Currencies:', and returning it
            let currenciesHeader = $("<p>");
            currenciesHeader.text("Currencies:");

            return currenciesHeader;
        }

        function clearUI() {
            // clearing the UI
            countriesContainerInUI.empty();
        }

        function clearInputField() {
            countryNameInputField.val("");
            validateInputFieldState();
        }

        function displayErrorInUI() {
            countryNameInputField.css("background-color", "red");
        }

        function clearErrorInUI() {
            countryNameInputField.css("background-color", "white");
        }



        // --------------------------------- Controller --------------------------------- //

        function getUpdatedURL() {

            // getting the user's trimmed input from the input field
            let trimmedCountryNameInputFieldValue = countryNameInputField.val().trim();

            // defining the new url, based on the trimmed input by the user
            let url = DOMAIN + `/rest/v2/name/${trimmedCountryNameInputFieldValue}?fields=name;currencies;capital;flag;topLevelDomain`;

            // returning the new url, in order to make an AJAX request based on the user's input
            return url;
        }

        function validateInputFieldState() {

            /*
                This function occurs whenever the input field's value is changed
            */

            // getting the user's trimmed input value
            let trimmedCountryNameInputFieldValue = countryNameInputField.val().trim();

            // if the user's trimmed input value is empty
            if (trimmedCountryNameInputFieldValue === "") {

                // disabling the button and adding 'disabledBtn' class to it
                getSearchedCountriesBtn.attr("disabled", true);
                getSearchedCountriesBtn.addClass("disabledBtn");
            }

            // if the user's trimmed input value is not empty
            else {
                
                // enabling the button and removing 'disabledBtn' class to it
                getSearchedCountriesBtn.attr("disabled", false);
                getSearchedCountriesBtn.removeClass("disabledBtn");
            }
        }

    });

})();