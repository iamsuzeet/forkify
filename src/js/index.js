import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

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
    renderLoader(elements.searchRes);

    // 4) Search for recipes
    await state.search.getResults();

    // 5) render result on UI
    clearLoader();
    searchView.renderResults(state.search.result);
     
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

