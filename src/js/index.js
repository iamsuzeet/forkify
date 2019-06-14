import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/**  GLOBAL STATE OF THE APP
  * - Search object
  * - Current recipe object
  * - shopping list object
  * - liked recipes
*/

const state = {};

const controlSearch = async () => {
  // 1) get query from the view model
  const query = searchView.getInput(); 

  if(query){
    // 2) New serach object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for result
    searchView.clearInput();
    searchView.clearResults();

    // 4) Search for recipes
    await state.search.getResults();

    // 5) render result on UI
    searchView.renderResults(state.search.result);

     
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})

