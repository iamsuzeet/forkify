import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
 * Recipe controller
 */
const controlRecipe = async () => {
  //get the id from the url
  const id = window.location.hash.replace('#','');
  // console.log(id);

  if(id){
    //clear recipe
    recipeView.clearRecipe();
    //prepare UI for changes
    renderLoader(elements.recipe);

    //highlight selected search item
    if(state.search)searchView.highLightSelected(id);

    //create new recipe object
    state.recipe = new Recipe(id);
    
   
    
    try{
      //get recipe data and parse ingredient
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

     //calc time and servings
     state.recipe.calcTime();
     state.recipe.calcServings();

      //render the recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch(err){
      alert('Error processing recipe');
    }
    
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease , .btn-decrease *')){
    // decrease button is clicked
    if(state.recipe.servings > 1){
    state.recipe.updateServings('dec');
    recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(e.target.matches('.btn-increase , .btn-increase *')){
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);

});

window.l = new List();