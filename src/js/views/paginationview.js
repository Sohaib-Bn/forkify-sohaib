import icons from 'url:../../img/icons.svg';
import View from './view';

class Pagination extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPage(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btnClicked = e.target.closest('.btn--inline');
      if (!btnClicked) return;
      handler(btnClicked.dataset.togo);
    });
  }

  _generateMarkup() {
    const currPage = +this._data.currPage;
    const numPages = Math.ceil(
      this._data.results.length / this._data.searchPerPage
    );

    // PAGE 1 , AND THERE IS ANOTHER PAGES
    if (currPage === 1 && numPages > 1)
      return `
    <button data-togo=${currPage + 1} class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
      `;
    // LAST PAGE
    if (currPage === numPages && numPages > 1)
      return `
    <button data-togo=${currPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
    </button>
      `;
    // ANOTHER PAGE
    if (currPage < numPages && numPages > 1)
      return `
     <button data-togo=${
       currPage + 1
     } class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    <button data-togo=${currPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span  >
    </button>
      `;
    // PAGE 1 ONLY
    return '';
  }
}

export default new Pagination();
