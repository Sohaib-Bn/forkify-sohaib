class Search {
  #parentEl = document.querySelector('.search');

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clearSearch();
    return query;
  }

  #clearSearch() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
}

export default new Search();
