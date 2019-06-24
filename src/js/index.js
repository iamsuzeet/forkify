import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';


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
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );
    } catch(err){
      // console.log(err);
      alert('Error processing recipe');
    }
    
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List controller
 */
const controlList = () => {
  //create a new list if there is none yet
  if(!state.list) state.list = new List();

  //add each ingredient to the list and user interface
  state.recipe.ingredients.forEach(el => {
    state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(el);
  });
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  
  const id = e.target.closest('.shopping__item').dataset.itemid;
  

  //handle delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //delete from state
    state.list.delItem(id);

    //delete from ui
    listView.delItem(id);
    
    //handle update

  } else if(e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value,10);
    if(val < 0){
      val = parseFloat(1);
    }
    state.list.updateCount(id, val);
  }
});

/**
 * Like controller
 */
//testing
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not liked yet current recipe
    if(!state.likes.isLiked(currentID)){
      //add like to the state
      const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
      );


      //toggle the like button
        likesView.toggleLikeBtn(true);

      //add like to the ui list
      likesView.renderLike(newLike);
      // console.log(state.likes);

    //user has liked the current recipe
    } else {
      //remove like to the state
      state.likes.deleteLike(currentID);

      //toggle the like button
      likesView.toggleLikeBtn(false);

      //remove like to the ui list
      // console.log(state.likes);
      likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
 };

 //restore liked recpet on page load
 window.addEventListener('load', () => {
  state.likes = new Likes();

  //restore likes
  state.likes.readStorage();

  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
 
  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

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
  } else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
    //add ingredient to shopping list
    controlList();
  } else if(e.target.matches('.recipe__love, .recipe__love *')){
    //like controller
    controlLike();
  }
  // console.log(state.recipe);

});

window.l = new List();