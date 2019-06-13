import axios from 'axios';

async function getResults(query){
  try{
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '153f3e4c1af106c7faad783be7c02376';
    const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes
    console.log(recipes);
  } catch(error){
    alert(error);
;  }

}

getResults('chicken wings');

// https://food2fork.com/api/search
