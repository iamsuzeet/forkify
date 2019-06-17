import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/**  GLOBAL STATE OF THE APP
  * - Search object
  * - Current recipe object
  * - shopping list object
  * - liked recipes
*/

const state = {};

/*
  **
  search controller
  **  
*/
const controlSearch = async () => {
  // 1) get query from the view model
  const query = searchView.getInput(); 

  if(query){
    // 2) New serach object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for result
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try{
      // 4) Search for recipes
      await state.search.getResults();

      // 5) render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      } catch(err) {
        alert('Something wrong with the Search...');
        clearLoader();
    }
     
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
      const goToPage = parseInt(btn.dataset.goto, 10);
      console.log(goToPage);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
    }
})

/**
 * recipe controller
 */
const controlRecipe = async () => {
  //get the id from the url
  const id = window.location.hash.replace('#','');
  // console.log(id);

  if(id){
    //prepare UI for changes

    //create new recipe object
    state.recipe = new Recipe(id);

    try{
      //get recipe data
      await state.recipe.getRecipe();

     //calc tme and servings
     state.recipe.calcTime();
      state.recipe.calcServings();

      //render the recipe
      console.log(state.recipe);
    } catch(err){
      alert('Error processing recipe');
    }
    
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));