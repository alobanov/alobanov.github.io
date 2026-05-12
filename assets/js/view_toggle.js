(function () {
  var toggle = document.querySelector('.view-toggle');
  if (!toggle) return;

  var storageKey = toggle.dataset.viewKey;

  window.setView = function (view) {
    var cardsEl = document.getElementById('view-cards');
    var listEl  = document.getElementById('view-list');
    if (!cardsEl || !listEl) return;
    cardsEl.style.display = view === 'cards' ? 'block' : 'none';
    listEl.style.display  = view === 'list'  ? 'block' : 'none';
    document.getElementById('btn-cards').classList.toggle('active', view === 'cards');
    document.getElementById('btn-list').classList.toggle('active',  view === 'list');
    if (storageKey) localStorage.setItem(storageKey, view);
  };

  setView(localStorage.getItem(storageKey) || 'list');

  document.querySelectorAll('.log-list-table .bm-row').forEach(function (row) {
    row.addEventListener('click', function () {
      this.closest('tbody').classList.toggle('expanded');
    });
  });
})();
