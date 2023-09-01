import { async } from 'regenerator-runtime';
import { API_URL, RECIPE_PER_PAGE, API_KEY } from './config';
import { AJAX, deleteJson } from './helper';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    searchPerPage: RECIPE_PER_PAGE,
    currPage: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    img: recipe.image_url,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        img: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
  }
};

export const getSearchPerPage = function (page = state.search.currPage) {
  const start = (page - 1) * state.search.searchPerPage;
  const end = page * state.search.searchPerPage;
  state.search.currPage = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // ADD BOOK MARK
  state.bookmarks.push(recipe);
  // SET LOCAL STORAGE
  setLocalStorage();
  // MARK AS A BOOK MARK RECIPE
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;
};

export const removeBookmark = function (id) {
  // REMOVE BOOK MARK
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  // SET LOCAL STORAGE
  setLocalStorage();
  // MARK AS A BOOK MARK RECIPE
  if (id === state.recipe.id) state.recipe.bookmark = false;
};

export const addRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, Please use the correct format :)'
          );
        const [quantity, unit, description] = ing[1].split(',');
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipeData = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: newRecipe.cookingTime,
      ingredients: ingredients,
      servings: newRecipe.servings,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeData);
    state.recipe = createRecipeObject(data);
    // ADD BOOKMARK RECIPE
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const deleteRecipe = async function (recipeID) {
  try {
    const data = await deleteJson(`${API_URL}/${recipeID}?key=${API_KEY}`);
  } catch (err) {
    throw err;
  }
};

const setLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
