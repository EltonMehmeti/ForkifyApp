import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { API_URL } from './config.js';
const recipeContainer = document.querySelector('.recipe');
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// api key:d6122128-308a-4915-adda-befee8bc3286

if (module.hot) {
  module.hot.accept();
}
const controllRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    console.log(id);

    // 0)update results view to mark selected search result\
    resultsView.update(model.getSearchResultsPage());
    // 1) Loading the recipe
    await model.loadRecipe(id);

    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);
    controlServings(2);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) aload seach results
    await model.loadSearchResults(query);
    // 3) render results
    console.log(model.getSearchResultsPage());
    resultsView.render(model.getSearchResultsPage(1));
    // 4) render pagination  buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 3) render results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 4) render pagination  buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the rcipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controllRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
