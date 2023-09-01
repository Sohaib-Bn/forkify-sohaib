import * as model from './model';
import recipeview from './views/recipeview';
import searchview from './views/searchview';
import resultsview from './views/resultsview';
import paginationview from './views/paginationview';
import bookmarkview from './views/bookmarkview';
import addrecipeview from './views/addnewrecipe';

import { CLOSE_MODEL_SEC } from './config';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const constrolRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 01 RENDER BOOKMARKS FROM LOCAL STORAGE
    bookmarkview.update(model.state.bookmarks);
    // 02 UPDATING RESULTS TO MARK SEARCH RESULT
    resultsview.update(model.getSearchPerPage());
    // 03 LOADING RECIPE
    recipeview.renderSpinner();
    await model.loadRecipe(id);
    // 04 RENDERING RECIPE
    recipeview.render(model.state.recipe);
  } catch (err) {
    recipeview.renderErrMessage();
    console.error(err);
  }
};

const constrolSearch = async function () {
  try {
    resultsview.renderSpinner();
    // 01 GET QUERY
    const query = searchview.getQuery();
    if (!query) return;
    // 02 LOAD QUERY RECIPE
    await model.loadSearchRecipe(query);
    // 03 RENDER INITIAL QUERY RECIPES
    // resultsview.render(model.state.search.results);
    resultsview.render(model.getSearchPerPage());
    // 04 RENDER INITIAL PAGINATION
    paginationview.render(model.state.search);
    // 05 INITIAL CURR PAGE
    model.state.search.currPage = 1;
  } catch (err) {
    console.error(err);
  }
};

const controlePagination = function (currPage) {
  // 01 RENDER NEW QUERY RECIPES
  resultsview.render(model.getSearchPerPage(currPage));
  // 02 RENDER NEW PAGINATION
  paginationview.render(model.state.search);
};

const controleUpdateServings = function (newServings) {
  // 01 UPDATE SERVINGS DATA
  model.updateServings(newServings);
  // 02 UPDATE SERVINGS VIEW
  recipeview.update(model.state.recipe);
};

const controlBookmarks = function () {
  // 01 UPDATE BOOKMARK
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // 02 UPDATE BOOKMARK VIEW
  recipeview.update(model.state.recipe);
  // 03 RENDER BOOKMAR LIST
  bookmarkview.render(model.state.bookmarks);
};

const controlBookmarksStorage = function () {
  bookmarkview.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // ADD SPINNNER
    addrecipeview.renderSpinner();
    // ADD NEW RECIPE
    await model.addRecipe(newRecipe);
    // CHANGE THE HASH
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // RENDER BOOKMARS VIEW
    bookmarkview.render(model.state.bookmarks);
    // SHOW SUCCESS MESSAGE
    addrecipeview.renderMessage();
    // RENDER RECIPE
    recipeview.render(model.state.recipe);
    // CLOSE MODEL
    setTimeout(() => {
      addrecipeview.hideWinodw();
    }, CLOSE_MODEL_SEC * 1000);
  } catch (err) {
    addrecipeview.renderErrMessage(err);
  }
};

const deleteRecipe = async function () {
  // WE HAVE A BUG HERE BUT IT'S WORKING
  // FIXME
  try {
    await model.deleteRecipe(model.state.recipe.id);
  } catch (err) {
    window.history.pushState(null, '', `/`);
    document.querySelector('.results').innerHTML = '';
    model.removeBookmark(model.state.recipe.id);
    bookmarkview.render(model.state.bookmarks);
    recipeview.renderErrMessage('Recipe was successfully deleted :)');
    console.error(err);
  }
};

const init = function () {
  bookmarkview.addHandlerRender(controlBookmarksStorage);
  recipeview.addHandlerRander(constrolRecipes);
  recipeview.addHanlderUpdateServing(controleUpdateServings);
  recipeview.addHandlerBookmark(controlBookmarks);
  recipeview.addHandlerDeleteRecipe(deleteRecipe);
  searchview.addHandlerSearch(constrolSearch);
  paginationview.addHandlerPage(controlePagination);
  addrecipeview.addHandlerUpload(controlAddRecipe);
};
init();
