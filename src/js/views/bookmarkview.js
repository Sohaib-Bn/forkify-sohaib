import View from './view';
import preview from './previewview';

class Bookmark extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data.map(bookmark => preview.render(bookmark, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }
}

export default new Bookmark();
