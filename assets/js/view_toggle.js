(function () {
  var toggle = document.querySelector('.view-toggle');

  if (toggle) {
    var storageKey = toggle.dataset.viewKey;

    window.setView = function (view) {
      var cardsEl = document.getElementById('view-cards');
      var listEl  = document.getElementById('view-list');
      if (!cardsEl || !listEl) return;
      // Empty string restores each element's own display — the list is a table
      cardsEl.style.display = view === 'cards' ? '' : 'none';
      listEl.style.display  = view === 'list'  ? '' : 'none';
      document.getElementById('btn-cards').classList.toggle('active', view === 'cards');
      document.getElementById('btn-list').classList.toggle('active',  view === 'list');
      if (storageKey) localStorage.setItem(storageKey, view);
    };

    setView(localStorage.getItem(storageKey) || 'list');
  }

  // Expandable log entries. The row toggles its note; the links and covers inside it —
  // the entry number, the source link, the cover — must not, so they stop the click.
  document.querySelectorAll('.log-entry-group').forEach(function (group) {
    var row = group.querySelector('.log-row');
    var inner = group.querySelector('.log-detail-inner');
    if (!row || !inner) return;

    function toggleNote() {
      var expanded = group.classList.toggle('expanded');
      row.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      inner.inert = !expanded;
    }

    row.addEventListener('click', toggleNote);

    row.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggleNote();
      }
    });

    // Клик по ссылке или по обложке, которая открывается во весь экран, не должен
    // заодно раскрывать строку: у них своё действие, и всплытие здесь лишнее.
    row.querySelectorAll('a, img[data-modal-src]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    });
  });
})();
