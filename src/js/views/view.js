import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    this._clearMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrMessage();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clearMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // UPDATE TEXT CAHNGED
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }
      // UPDATE ATTRIBUTE CAHNGED
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(att => {
          currEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  renderErrMessage(message = this._errMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
            <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
            <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clearMarkup() {
    this._parentEl.innerHTML = '';
  }
}

new View();
