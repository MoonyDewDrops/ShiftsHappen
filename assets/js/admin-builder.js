(function () {
    var config = window.BUILDER_CONFIG;
    if (!config) {
        return;
    }

    var state = {
        theme: Object.assign({}, config.theme),
        rows: JSON.parse(JSON.stringify(config.rows || [])),
        dirty: false,
        pendingImages: {},
    };

    var rowsEl = document.getElementById('builder-rows');
    var previewContent = document.getElementById('preview-content');
    var previewCanvas = document.getElementById('builder-preview');
    var saveStatus = document.getElementById('save-status');
    var saveBtn = document.getElementById('save-page-btn');
    var toast = document.getElementById('builder-toast');
    var draggedRowId = null;

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function layoutLabel(type) {
        var labels = {
            1: 'Enkele kolom (hero)',
            2: 'Twee kolommen',
            3: 'Twee kolommen (variant)',
            4: 'Drie kolommen',
        };
        return labels[type] || 'Layout';
    }

    function columnCount(type) {
        if (type === 2 || type === 3) return 2;
        if (type === 4) return 3;
        return 1;
    }

    function rowClass(type) {
        if (type === 1) return 'top-content';
        if (type === 2 || type === 3) return 'middle-content';
        return 'row' + type;
    }

    function markDirty() {
        state.dirty = true;
        saveStatus.textContent = 'Niet-opgeslagen wijzigingen';
        saveStatus.classList.add('save-status--dirty');
    }

    function markClean() {
        state.dirty = false;
        saveStatus.textContent = 'Opgeslagen';
        saveStatus.classList.remove('save-status--dirty');
    }

    function showToast(message, isError) {
        toast.textContent = message;
        toast.className = 'builder-toast ' + (isError ? 'builder-toast--error' : 'builder-toast--success');
        toast.hidden = false;
        setTimeout(function () {
            toast.hidden = true;
        }, 3500);
    }

    function getRowById(rowId) {
        return state.rows.find(function (row) {
            return row.id === rowId;
        });
    }

    function getColumnData(rowId, colNum) {
        var row = getRowById(rowId);
        if (!row || !row.columns || !row.columns[colNum]) {
            return null;
        }
        return row.columns[colNum];
    }

    function updateColumnFromInput(input) {
        var rowId = parseInt(input.dataset.rowId, 10);
        var colNum = parseInt(input.dataset.col, 10);
        var field = input.dataset.field;
        var row = getRowById(rowId);
        if (!row || !row.columns[colNum]) {
            return;
        }

        var col = row.columns[colNum];
        if (input.type === 'checkbox') {
            col[field] = input.checked ? 1 : 0;
        } else if (input.type === 'range') {
            col[field] = parseInt(input.value, 10);
        } else {
            col[field] = input.value;
        }

        if (field === 'foto') {
            col.foto = parseInt(input.value, 10);
        }

        markDirty();
        renderPreview();
    }

    function bindColumnEvents(columnEl) {
        columnEl.querySelectorAll('[data-field]').forEach(function (input) {
            input.addEventListener('input', function () {
                updateColumnFromInput(input);
            });
            input.addEventListener('change', function () {
                updateColumnFromInput(input);
                if (input.dataset.field === 'foto') {
                    toggleColumnFields(columnEl);
                }
                if (input.type === 'file' && input.files && input.files[0]) {
                    var infoId = parseInt(input.dataset.infoId, 10);
                    state.pendingImages[infoId] = input.files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var col = getColumnData(parseInt(input.dataset.rowId, 10), parseInt(input.dataset.col, 10));
                        if (col) {
                            col.previewUrl = e.target.result;
                            col.foto = 1;
                            markDirty();
                            renderPreview();
                            renderRows();
                        }
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        });
    }

    function toggleColumnFields(columnEl) {
        var select = columnEl.querySelector('[data-field="foto"]');
        var isImage = select && select.value === '1';
        columnEl.querySelectorAll('.content-text').forEach(function (el) {
            el.hidden = isImage;
        });
        columnEl.querySelectorAll('.content-image').forEach(function (el) {
            el.hidden = !isImage;
        });
        columnEl.querySelectorAll('.content-text-only').forEach(function (el) {
            el.hidden = isImage;
        });
    }

    function buildColumnHtml(row, colNum) {
        var col = row.columns[colNum];
        if (!col) {
            return '';
        }

        var isImage = parseInt(col.foto, 10) === 1;
        var infoId = col.info_id;
        var imageUrl = col.previewUrl || (col.informatie ? config.assetBase + 'img/fotos/' + encodeURIComponent(col.informatie) : '');

        return (
            '<div class="admin-form builder-column" data-col="' + colNum + '">' +
                '<h4>Kolom ' + colNum + '</h4>' +
                '<div class="inputField">' +
                    '<label>Type inhoud</label>' +
                    '<select data-field="foto" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        '<option value="0"' + (!isImage ? ' selected' : '') + '>Tekst</option>' +
                        '<option value="1"' + (isImage ? ' selected' : '') + '>Afbeelding</option>' +
                    '</select>' +
                '</div>' +
                '<div class="inputField content-text"' + (isImage ? ' hidden' : '') + '>' +
                    '<label>Tekst</label>' +
                    '<textarea data-field="informatie" data-row-id="' + row.id + '" data-col="' + colNum + '" rows="4">' + escapeHtml(col.informatie || '') + '</textarea>' +
                '</div>' +
                '<div class="inputField content-image"' + (!isImage ? ' hidden' : '') + '>' +
                    (imageUrl ? '<img class="builder-thumb" src="' + imageUrl + '" alt="Preview">' : '') +
                    '<label>Upload afbeelding</label>' +
                    '<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" data-info-id="' + infoId + '" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                '</div>' +
                '<div class="color-grid">' +
                    '<div class="inputField">' +
                        '<label>Tekstkleur</label>' +
                        '<input type="color" data-field="kleur" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + escapeHtml(col.kleur || '#111827') + '">' +
                    '</div>' +
                    '<div class="inputField content-text-only"' + (isImage ? ' hidden' : '') + '>' +
                        '<label>Achtergrondkleur</label>' +
                        '<input type="color" data-field="backgroundKleur" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + escapeHtml(col.backgroundKleur || '#f9fafb') + '">' +
                    '</div>' +
                '</div>' +
                '<div class="inputField content-text-only"' + (isImage ? ' hidden' : '') + '>' +
                    '<label>Opacity (0–10)</label>' +
                    '<input type="range" min="0" max="10" data-field="opacity" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + (col.opacity || 10) + '">' +
                '</div>' +
                '<div class="inputField inputField--checkbox content-text-only"' + (isImage ? ' hidden' : '') + '>' +
                    '<label><input type="checkbox" data-field="bold" data-row-id="' + row.id + '" data-col="' + colNum + '" value="1"' + (parseInt(col.bold, 10) === 1 ? ' checked' : '') + '> Vet</label>' +
                    '<label><input type="checkbox" data-field="italic" data-row-id="' + row.id + '" data-col="' + colNum + '" value="1"' + (parseInt(col.italic, 10) === 1 ? ' checked' : '') + '> Cursief</label>' +
                '</div>' +
            '</div>'
        );
    }

    function buildRowHtml(row, index) {
        var cols = columnCount(row.columnType);
        var columnsHtml = '';
        for (var i = 1; i <= cols; i++) {
            columnsHtml += buildColumnHtml(row, i);
        }

        return (
            '<article class="builder-row" draggable="true" data-row-id="' + row.id + '">' +
                '<div class="builder-row__header">' +
                    '<span class="builder-drag-handle" title="Sleep om te ordenen">⠿</span>' +
                    '<h3>Rij ' + (index + 1) + ' · ' + layoutLabel(row.columnType) + '</h3>' +
                    '<button type="button" class="btn-danger btn-small btn-delete-row" data-row-id="' + row.id + '">Verwijderen</button>' +
                '</div>' +
                '<div class="builder-columns builder-columns--' + row.columnType + '">' + columnsHtml + '</div>' +
            '</article>'
        );
    }

    function renderRows() {
        rowsEl.innerHTML = state.rows.map(function (row, index) {
            return buildRowHtml(row, index);
        }).join('');

        rowsEl.querySelectorAll('.builder-column').forEach(bindColumnEvents);

        rowsEl.querySelectorAll('.btn-delete-row').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (!confirm('Deze rij verwijderen?')) return;
                deleteRow(parseInt(btn.dataset.rowId, 10));
            });
        });

        initDragDrop();
    }

    function renderPreview() {
        var body = previewCanvas.querySelector('.preview-body');
        var page = previewCanvas.querySelector('.preview-page');
        var footer = previewCanvas.querySelector('.preview-footer');
        var title = previewCanvas.querySelector('.preview-title');

        body.style.background = state.theme.body_bg;
        page.style.background = state.theme.page_bg;
        title.style.color = state.theme.page_text_color;
        footer.style.background = state.theme.footer_bg;
        footer.style.color = state.theme.footer_text;

        previewContent.innerHTML = state.rows.map(function (row) {
            var cols = columnCount(row.columnType);
            var inner = '';
            for (var i = 1; i <= cols; i++) {
                var col = row.columns[i];
                if (!col) continue;
                var opacity = Math.max(0, Math.min(1, (parseInt(col.opacity, 10) || 10) / 10));
                var isImage = parseInt(col.foto, 10) === 1;
                if (isImage) {
                    var src = col.previewUrl || (col.informatie ? config.assetBase + 'img/fotos/' + encodeURIComponent(col.informatie) : '');
                    inner += src
                        ? '<div class="preview-image"><img src="' + src + '" style="opacity:' + opacity + '" alt=""></div>'
                        : '<div class="preview-empty">Afbeelding ontbreekt</div>';
                } else {
                    var classes = 'preview-text';
                    if (parseInt(col.bold, 10) === 1) classes += ' bold';
                    if (parseInt(col.italic, 10) === 1) classes += ' italic';
                    inner += '<div class="preview-block" style="background:' + (col.backgroundKleur || '#f9fafb') + '">' +
                        '<p class="' + classes + '" style="opacity:' + opacity + ';color:' + (col.kleur || '#111827') + '">' +
                        escapeHtml(col.informatie || '').replace(/\n/g, '<br>') +
                        '</p></div>';
                }
            }
            return '<div class="preview-row ' + rowClass(row.columnType) + '">' + inner + '</div>';
        }).join('');
    }

    function initDragDrop() {
        var rowElements = rowsEl.querySelectorAll('.builder-row');

        rowElements.forEach(function (rowEl) {
            rowEl.addEventListener('dragstart', function (e) {
                draggedRowId = parseInt(rowEl.dataset.rowId, 10);
                rowEl.classList.add('builder-row--dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            rowEl.addEventListener('dragend', function () {
                rowEl.classList.remove('builder-row--dragging');
                draggedRowId = null;
                rowsEl.querySelectorAll('.builder-row--over').forEach(function (el) {
                    el.classList.remove('builder-row--over');
                });
            });

            rowEl.addEventListener('dragover', function (e) {
                e.preventDefault();
                rowEl.classList.add('builder-row--over');
            });

            rowEl.addEventListener('dragleave', function () {
                rowEl.classList.remove('builder-row--over');
            });

            rowEl.addEventListener('drop', function (e) {
                e.preventDefault();
                rowEl.classList.remove('builder-row--over');
                var targetId = parseInt(rowEl.dataset.rowId, 10);
                if (!draggedRowId || draggedRowId === targetId) return;

                var fromIndex = state.rows.findIndex(function (r) { return r.id === draggedRowId; });
                var toIndex = state.rows.findIndex(function (r) { return r.id === targetId; });
                if (fromIndex < 0 || toIndex < 0) return;

                var moved = state.rows.splice(fromIndex, 1)[0];
                state.rows.splice(toIndex, 0, moved);
                markDirty();
                renderRows();
                renderPreview();
            });
        });
    }

    function apiRequest(formData) {
        formData.append('page_id', config.pageId);
        return fetch(config.apiUrl, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        }).then(function (res) {
            return res.json();
        });
    }

    function addRow() {
        var select = document.getElementById('new-column-type');
        var formData = new FormData();
        formData.append('action', 'add_row');
        formData.append('columnType', select.value);

        apiRequest(formData).then(function (data) {
            if (!data.success) {
                showToast(data.message || 'Fout bij toevoegen.', true);
                return;
            }
            state.rows = data.rows;
            markDirty();
            renderRows();
            renderPreview();
            showToast('Rij toegevoegd.');
        });
    }

    function deleteRow(rowId) {
        var formData = new FormData();
        formData.append('action', 'delete_row');
        formData.append('row_id', rowId);

        apiRequest(formData).then(function (data) {
            if (!data.success) {
                showToast(data.message || 'Fout bij verwijderen.', true);
                return;
            }
            state.rows = data.rows;
            markDirty();
            renderRows();
            renderPreview();
            showToast('Rij verwijderd.');
        });
    }

    function collectPayload() {
        var columns = [];
        state.rows.forEach(function (row) {
            Object.keys(row.columns || {}).forEach(function (colKey) {
                var col = row.columns[colKey];
                columns.push({
                    info_id: col.info_id,
                    foto: parseInt(col.foto, 10) || 0,
                    informatie: col.informatie || '',
                    kleur: col.kleur || '#111827',
                    backgroundKleur: col.backgroundKleur || '#f9fafb',
                    opacity: parseInt(col.opacity, 10) || 10,
                    bold: parseInt(col.bold, 10) === 1,
                    italic: parseInt(col.italic, 10) === 1,
                });
            });
        });

        return {
            theme: state.theme,
            row_order: state.rows.map(function (row) { return row.id; }),
            columns: columns,
        };
    }

    function savePage() {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Opslaan...';

        var formData = new FormData();
        formData.append('action', 'save_page');
        formData.append('payload', JSON.stringify(collectPayload()));

        Object.keys(state.pendingImages).forEach(function (infoId) {
            formData.append('image_' + infoId, state.pendingImages[infoId]);
        });

        apiRequest(formData).then(function (data) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Pagina opslaan';

            if (!data.success) {
                showToast(data.message || 'Opslaan mislukt.', true);
                return;
            }

            if (data.images) {
                Object.keys(data.images).forEach(function (infoId) {
                    var filename = data.images[infoId];
                    state.rows.forEach(function (row) {
                        Object.keys(row.columns).forEach(function (key) {
                            if (String(row.columns[key].info_id) === String(infoId)) {
                                row.columns[key].informatie = filename;
                                delete row.columns[key].previewUrl;
                            }
                        });
                    });
                });
            }

            state.pendingImages = {};
            markClean();
            renderRows();
            renderPreview();
            showToast('Pagina opgeslagen!');
        }).catch(function () {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Pagina opslaan';
            showToast('Netwerkfout bij opslaan.', true);
        });
    }

    document.querySelectorAll('[data-theme]').forEach(function (input) {
        input.addEventListener('input', function () {
            state.theme[input.dataset.theme] = input.value;
            markDirty();
            renderPreview();
        });
    });

    document.getElementById('add-row-btn').addEventListener('click', addRow);
    saveBtn.addEventListener('click', savePage);

    window.addEventListener('beforeunload', function (e) {
        if (state.dirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    renderRows();
    renderPreview();
    markClean();
})();
