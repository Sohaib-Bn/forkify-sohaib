import icons from 'url:../../img/icons.svg';
import View from './view';
import preview from './previewview';

class Result extends View {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No recipe found for your query. Please try again';

  _generateMarkup() {
    return this._data.map(result => preview.render(result, false)).join('');
  }
}

export default new Result();
