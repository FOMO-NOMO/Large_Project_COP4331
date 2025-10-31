import React, { useState } from 'react';
import { buildPath } from '../Path';
import { retrieveToken, storeToken } from '../tokenStorage';

<<<<<<< HEAD
function CardUI() {
    const [message, setMessage] = useState('');
    const [searchResults, setResults] = useState('');
    const [cardList, setCardList] = useState('');
    const [search, setSearchValue] = React.useState('');
    const [card, setCardNameValue] = React.useState('');
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(String(_ud));
    var userId = ud.id;
    // var firstName = ud.firstName;
    // var lastName = ud.lastName;
    async function addCard(e: any): Promise<void> {
=======
function CardUI()
{
    function handleSearchTextChange( e: any ) : void
    {
        setSearchValue( e.target.value );
    }

    function handleCardTextChange( e: any ) : void
    {
        setCardNameValue( e.target.value );
    }

    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : string = ud.id;
    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [cardList,setCardList] = useState('');
    const [search,setSearchValue] = React.useState('');
    const [card,setCardNameValue] = React.useState('');

    async function addCard(e:any) : Promise<void>
    {
>>>>>>> 294629c6e2c92cc3ea407a75375a0427dae413c3
        e.preventDefault();
        var obj = { userId: userId, card: card, jwtToken: retrieveToken() };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch(buildPath('api/addcard'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            let txt = await response.text();
            let res = JSON.parse(txt);
            if (res.error.length > 0) {
                setMessage("API Error:" + res.error);
            }
            else {
                setMessage('Card has been added');
                storeToken(res.jwtToken);
            }
        }
        catch (error: any) {
            setMessage(error.toString());
        }
    };
    async function searchCard(e: any): Promise<void> {
        e.preventDefault();
<<<<<<< HEAD
        var obj = { userId: userId, search: search, jwtToken: retrieveToken() };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch(buildPath('api/searchcards'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
=======

        let obj = {userId:userId,search:search};
        let js = JSON.stringify(obj);

        try
        {
            const response = await fetch('http://localhost:5000/api/searchcards',
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

>>>>>>> 294629c6e2c92cc3ea407a75375a0427dae413c3
            let txt = await response.text();
            let res = JSON.parse(txt);
            let _results = res.results;
            let resultText = '';
            for (let i = 0; i < _results.length; i++) {
                resultText += _results[i];
                if (i < _results.length - 1) {
                    resultText += ', ';
                }
            }
            setResults('Card(s) have been retrieved');
            storeToken(res.jwtToken);
            setCardList(resultText);
        }
        catch (error: any) {
            alert(error.toString());
            setResults(error.toString());
        }
    };
<<<<<<< HEAD
    function handleSearchTextChange(e: any): void {
        setSearchValue(e.target.value);
    }
    function handleCardTextChange(e: any): void {
        setCardNameValue(e.target.value);
    }
    return (
        <div id="cardUIDiv">
            <br />
            Search: <input type="text" id="searchText" placeholder="Card To Search For"
                onChange={handleSearchTextChange} />
            <button type="button" id="searchCardButton" className="buttons"
                onClick={searchCard}> Search Card</button><br />
            <span id="cardSearchResult">{searchResults}</span>
            <p id="cardList">{cardList}</p><br /><br />
            Add: <input type="text" id="cardText" placeholder="Card To Add"
                onChange={handleCardTextChange} />
            <button type="button" id="addCardButton" className="buttons"
                onClick={addCard}> Add Card </button><br />
            <span id="cardAddResult">{message}</span>
        </div>
=======



    return(
    <div id="cardUIDiv">
        <br />
        Search: <input type="text" id="searchText" placeholder="Card To Search For"
            onChange={handleSearchTextChange} />
        <button type="button" id="searchCardButton" className="buttons"
            onClick={searchCard}> Search Card</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{cardList}</p><br /><br />
        Add: <input type="text" id="cardText" placeholder="Card To Add"
            onChange={handleCardTextChange} />
        <button type="button" id="addCardButton" className="buttons"
            onClick={addCard}> Add Card </button><br />
        <span id="cardAddResult">{message}</span>
    </div>

>>>>>>> 294629c6e2c92cc3ea407a75375a0427dae413c3
    );
}
export default CardUI;
