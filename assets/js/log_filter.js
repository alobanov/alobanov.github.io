(function () {
  var table = document.querySelector('.log-table');
  var search = document.querySelector('.log-search');
  if (!table || !search) return;

  var input = search.querySelector('.log-search-input');
  var count = search.querySelector('.log-search-count');
  var empty = search.querySelector('.log-search-empty');

  // Годы и записи лежат в таблице соседними tbody, а не вложенно, поэтому связь
  // между ними восстанавливается одним проходом по порядку: заголовок года
  // собирает всё, что идёт за ним до следующего заголовка.
  var entries = [];
  var years = [];
  var current = null;

  Array.prototype.forEach.call(table.children, function (node) {
    var yearRow = node.querySelector('.log-year-row');

    if (yearRow) {
      current = { tbody: node, entries: [], stats: {} };
      yearRow.querySelectorAll('.log-year-stat').forEach(function (stat) {
        current.stats[stat.dataset.category] = stat;
      });
      years.push(current);
      return;
    }

    if (!node.classList.contains('log-entry-group')) return;

    // Строка ищется по тому, что в ней видно свёрнутой: название, жанр, тег,
    // вердикт. Собирается один раз — на каждое нажатие клавиши остаётся только
    // сравнение строк, без повторного обхода DOM.
    var parts = [];
    node.querySelectorAll('.log-title, .log-sub-genre, .log-sub-tag, .log-sub-verdict')
      .forEach(function (el) { parts.push(el.textContent); });

    var entry = {
      group: node,
      category: node.dataset.category || '',
      haystack: parts.join(' ').toLowerCase(),
      visible: true
    };
    entries.push(entry);
    if (current) current.entries.push(entry);
  });

  if (entries.length === 0) return;

  var toc = document.querySelector('.toc');
  var total = entries.length;
  var noun = total === 1 ? ' entry' : ' entries';

  function apply(query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;

    entries.forEach(function (entry) {
      entry.visible = terms.every(function (term) {
        return entry.haystack.indexOf(term) !== -1;
      });
      entry.group.classList.toggle('is-filtered-out', !entry.visible);
      if (entry.visible) shown++;
    });

    // Цифры года считаются заново по тому, что осталось на экране: заголовок,
    // обещающий 12 фильмов над двумя строками, врал бы прямо в глаза.
    years.forEach(function (year) {
      var counts = {};
      var left = 0;

      year.entries.forEach(function (entry) {
        if (!entry.visible) return;
        left++;
        counts[entry.category] = (counts[entry.category] || 0) + 1;
      });

      year.tbody.classList.toggle('is-filtered-out', left === 0);

      Object.keys(year.stats).forEach(function (category) {
        var stat = year.stats[category];
        var n = counts[category] || 0;
        stat.hidden = n === 0;
        stat.querySelector('.log-year-count').textContent = n;
      });
    });

    // Оглавление по годам не переживает фильтр: хвост в нём склеен в диапазон,
    // и пересчитать его честно нельзя. Оно и не нужно — по короткому списку не
    // навигируют. Возвращается, как только поле пустеет.
    if (toc) toc.hidden = terms.length > 0;

    empty.hidden = shown > 0;
    count.textContent = terms.length === 0
      ? total + noun
      : shown + ' of ' + total;
  }

  search.hidden = false;
  apply('');
  input.addEventListener('input', function () { apply(input.value); });

  // Escape очищает поле, не выбрасывая из него фокус: следующий запрос обычно
  // набирают сразу же.
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && input.value !== '') {
      event.preventDefault();
      input.value = '';
      apply('');
    }
  });
})();
