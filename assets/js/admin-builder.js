(function () {
    var config = window.BUILDER_CONFIG;
    var GS = window.GridStyles;
    if (!config || !GS) {
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

    state.rows.forEach(function (row) {
        Object.assign(row, GS.normalizeRow(row));
        Object.keys(row.columns || {}).forEach(function (key) {
            Object.assign(row.columns[key], GS.normalizeColumn(row.columns[key]));
            if (row.columns[key].content_mode === undefined || row.columns[key].content_mode === null) {
                row.columns[key].content_mode = row.columns[key].foto ? 1 : 0;
            }
            row.columns[key].image_position = row.columns[key].image_position || 'top';
        });
    });

    function bindDeleteButtons() {
        rowsEl.querySelectorAll('.btn-delete-row').forEach(function (btn) {
            btn.onclick = function () {
                if (confirm('Deze kolomsectie verwijderen?')) {
                    deleteRow(parseInt(btn.dataset.rowId, 10));
                }
            };
        });
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function layoutLabel(type) {
        return { 1: '1 kolom', 2: '2 kolommen', 3: '2 kolommen (variant)', 4: '3 kolommen' }[type] || 'Layout';
    }

    function columnCount(type) {
        if (type === 2 || type === 3) return 2;
        if (type === 4) return 3;
        return 1;
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
        setTimeout(function () { toast.hidden = true; }, 3500);
    }

    function getColumn(row, colNum) {
        if (!row || !row.columns) return null;
        return row.columns[colNum] || row.columns[String(colNum)] || null;
    }

    function getRowById(rowId) {
        return state.rows.find(function (row) {
            return parseInt(row.id, 10) === parseInt(rowId, 10);
        });
    }

    function buildBorderFields(scope, rowId, colNum, item) {
        var colAttr = colNum ? ' data-col="' + colNum + '"' : '';
        return (
            '<div class="layout-block">' +
                '<p class="layout-block__label">Randen</p>' +
                '<div class="inputField inputField--checkbox border-sides">' +
                    '<label><input type="checkbox" data-scope="' + scope + '" data-field="border_top" data-row-id="' + rowId + '"' + colAttr + ' value="1"' + (parseInt(item.border_top, 10) === 1 ? ' checked' : '') + '> Boven</label>' +
                    '<label><input type="checkbox" data-scope="' + scope + '" data-field="border_right" data-row-id="' + rowId + '"' + colAttr + ' value="1"' + (parseInt(item.border_right, 10) === 1 ? ' checked' : '') + '> Rechts</label>' +
                    '<label><input type="checkbox" data-scope="' + scope + '" data-field="border_bottom" data-row-id="' + rowId + '"' + colAttr + ' value="1"' + (parseInt(item.border_bottom, 10) === 1 ? ' checked' : '') + '> Onder</label>' +
                    '<label><input type="checkbox" data-scope="' + scope + '" data-field="border_left" data-row-id="' + rowId + '"' + colAttr + ' value="1"' + (parseInt(item.border_left, 10) === 1 ? ' checked' : '') + '> Links</label>' +
                '</div>' +
                '<div class="color-grid">' +
                    '<div class="inputField"><label>Dikte (px)</label><input type="number" min="1" max="8" data-scope="' + scope + '" data-field="border_width" data-row-id="' + rowId + '"' + colAttr + ' value="' + (item.border_width || 1) + '"></div>' +
                    '<div class="inputField"><label>Kleur</label><input type="color" data-scope="' + scope + '" data-field="border_color" data-row-id="' + rowId + '"' + colAttr + ' value="' + escapeHtml(item.border_color || '#d1d5db') + '"></div>' +
                '</div>' +
            '</div>'
        );
    }

    function buildRowSettingsHtml(row) {
        var gapDisabled = parseInt(row.flush_columns, 10) === 1 ? ' disabled' : '';
        return (
            '<div class="admin-form builder-row-settings">' +
                '<h4>Kolomsectie instellingen</h4>' +
                '<div class="color-grid">' +
                    '<div class="inputField"><label>Breedte (%)</label><select data-scope="row" data-field="row_width_pct" data-row-id="' + row.id + '">' +
                        [100, 90, 75, 60, 50].map(function (v) {
                            return '<option value="' + v + '"' + (parseInt(row.row_width_pct, 10) === v ? ' selected' : '') + '>' + v + '%</option>';
                        }).join('') +
                    '</select></div>' +
                    '<div class="inputField"><label>Uitlijning sectie</label><select data-scope="row" data-field="row_align" data-row-id="' + row.id + '">' +
                        ['left', 'center', 'right'].map(function (v) {
                            return '<option value="' + v + '"' + (row.row_align === v ? ' selected' : '') + '>' + (v === 'left' ? 'Links' : (v === 'center' ? 'Midden' : 'Rechts')) + '</option>';
                        }).join('') +
                    '</select></div>' +
                    '<div class="inputField"><label>Ruimte tussen kolommen (px)</label><input type="number" min="0" max="64" data-scope="row" data-field="column_gap" data-row-id="' + row.id + '" value="' + (row.column_gap ?? 16) + '"' + gapDisabled + '></div>' +
                '</div>' +
                '<div class="inputField inputField--checkbox">' +
                    '<label><input type="checkbox" data-scope="row" data-field="flush_columns" data-row-id="' + row.id + '" value="1"' + (parseInt(row.flush_columns, 10) === 1 ? ' checked' : '') + '> Geen ruimte tussen kolommen (afbeeldingen flush)</label>' +
                '</div>' +
                buildBorderFields('row', row.id, 0, row) +
            '</div>'
        );
    }

    function buildColumnLayoutHtml(row, colNum, col) {
        var textOnlyHidden = parseInt(col.content_mode, 10) === 1 ? ' hidden' : '';
        return (
            '<div class="layout-section">' +
                '<h5>Layout &amp; randen</h5>' +
                '<div class="color-grid">' +
                    '<div class="inputField"><label>Kolombreedte</label><select data-scope="column" data-field="width_pct" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        [{ v: 0, l: 'Automatisch (gelijk)' }, { v: 25, l: '25%' }, { v: 33, l: '33%' }, { v: 50, l: '50%' }, { v: 66, l: '66%' }, { v: 75, l: '75%' }, { v: 100, l: '100%' }]
                            .map(function (o) {
                                return '<option value="' + o.v + '"' + (parseInt(col.width_pct, 10) === o.v ? ' selected' : '') + '>' + o.l + '</option>';
                            }).join('') +
                    '</select></div>' +
                    '<div class="inputField"><label>Tekstuitlijning</label><select data-scope="column" data-field="text_align" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        ['left', 'center', 'right'].map(function (v) {
                            return '<option value="' + v + '"' + (col.text_align === v ? ' selected' : '') + '>' + v + '</option>';
                        }).join('') +
                    '</select></div>' +
                    '<div class="inputField"><label>Afbeelding uitlijning</label><select data-scope="column" data-field="image_align" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        ['top', 'right', 'bottom', 'left'].map(function (v) {
                            return '<option value="' + v + '"' + (col.image_align === v ? ' selected' : '') + '>' + v + '</option>';
                        }).join('') +
                    '</select></div>' +
                    '<div class="inputField content-text-only"' + textOnlyHidden + '><label>Verticale uitlijning</label><select data-scope="column" data-field="vertical_align" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        ['top', 'center', 'bottom'].map(function (v) {
                            return '<option value="' + v + '"' + (col.vertical_align === v ? ' selected' : '') + '>' + v + '</option>';
                        }).join('') +
                    '</select></div>' +
                    '<div class="inputField content-text-only"' + textOnlyHidden + '><label>Padding (px)</label><input type="number" min="0" max="64" data-scope="column" data-field="padding_px" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + (col.padding_px ?? 16) + '"></div>' +
                '</div>' +
                buildBorderFields('column', row.id, colNum, col) +
            '</div>'
        );
    }

    function buildColumnHtml(row, colNum) {
        var col = getColumn(row, colNum);
        if (!col) return '';

        var mode = parseInt(col.content_mode, 10) || 0;
        var infoId = col.info_id;
        var imageUrl = col.previewUrl || (col.image_filename ? config.assetBase + 'img/fotos/' + encodeURIComponent(col.image_filename) : '');
        var hideText = mode === 1 ? ' hidden' : '';
        var hideImage = mode === 0 ? ' hidden' : '';
        var hideImagePosition = mode !== 2 ? ' hidden' : '';

        var positionLabels = { top: 'Boven', left: 'Links', right: 'Rechts', bottom: 'Onder' };
        var positionOptions = Object.keys(positionLabels).map(function (v) {
            return '<option value="' + v + '"' + (col.image_position === v ? ' selected' : '') + '>' + positionLabels[v] + '</option>';
        }).join('');

        return (
            '<div class="admin-form builder-column" data-col="' + colNum + '">' +
                '<h4>Kolom ' + colNum + '</h4>' +
                '<div class="inputField"><label>Type inhoud</label>' +
                    '<select data-scope="column" data-field="content_mode" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                        '<option value="0"' + (mode === 0 ? ' selected' : '') + '>Tekst</option>' +
                        '<option value="1"' + (mode === 1 ? ' selected' : '') + '>Afbeelding</option>' +
                        '<option value="2"' + (mode === 2 ? ' selected' : '') + '>Afbeelding + tekst</option>' +
                    '</select></div>' +
                '<div class="inputField content-text rich-text-field"' + hideText + '>' +
                    '<label>Tekst</label>' +
                    '<p class="admin-meta">Selecteer een stukje tekst en klik op <strong>Titel</strong> of <strong>Vet</strong>.</p>' +
                    '<div class="rich-toolbar">' +
                        '<button type="button" class="rt-btn" data-rt-cmd="bold" title="Vet">Vet</button>' +
                        '<button type="button" class="rt-btn rt-btn--title" data-rt-cmd="title" title="Maak selectie een titel">Titel</button>' +
                        '<button type="button" class="rt-btn" data-rt-cmd="clear" title="Opmaak wissen">Wis opmaak</button>' +
                    '</div>' +
                    '<div class="rich-text-editor" contenteditable="true" data-scope="column" data-field="informatie" data-row-id="' + row.id + '" data-col="' + colNum + '">' + (col.informatie || '') + '</div>' +
                '</div>' +
                '<div class="inputField content-image"' + hideImage + '>' +
                    (imageUrl ? '<img class="builder-thumb" src="' + imageUrl + '" alt="Preview">' : '') +
                    '<label>Upload afbeelding</label>' +
                    '<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" data-info-id="' + infoId + '" data-row-id="' + row.id + '" data-col="' + colNum + '">' +
                '</div>' +
                '<div class="inputField content-image-position"' + hideImagePosition + '>' +
                    '<label>Positie afbeelding t.o.v. tekst</label>' +
                    '<select data-scope="column" data-field="image_position" data-row-id="' + row.id + '" data-col="' + colNum + '">' + positionOptions + '</select>' +
                '</div>' +
                '<div class="color-grid">' +
                    '<div class="inputField"><label>Tekstkleur</label><input type="color" data-scope="column" data-field="kleur" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + escapeHtml(col.kleur || '#111827') + '"></div>' +
                    '<div class="inputField content-text-only"' + hideText + '><label>Achtergrondkleur</label><input type="color" data-scope="column" data-field="backgroundKleur" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + escapeHtml(col.backgroundKleur || '#f9fafb') + '"></div>' +
                '</div>' +
                '<div class="inputField content-text-only"' + hideText + '><label>Opacity (0–10)</label><input type="range" min="0" max="10" data-scope="column" data-field="opacity" data-row-id="' + row.id + '" data-col="' + colNum + '" value="' + (col.opacity || 10) + '"></div>' +
                '<div class="inputField inputField--checkbox content-text-only"' + hideText + '>' +
                    '<label><input type="checkbox" data-scope="column" data-field="bold" data-row-id="' + row.id + '" data-col="' + colNum + '" value="1"' + (parseInt(col.bold, 10) === 1 ? ' checked' : '') + '> Vet (hele blok)</label>' +
                    '<label><input type="checkbox" data-scope="column" data-field="italic" data-row-id="' + row.id + '" data-col="' + colNum + '" value="1"' + (parseInt(col.italic, 10) === 1 ? ' checked' : '') + '> Cursief</label>' +
                '</div>' +
                buildColumnLayoutHtml(row, colNum, col) +
            '</div>'
        );
    }

    function buildRowHtml(row, index) {
        var cols = columnCount(row.columnType);
        var columnsHtml = '';
        for (var i = 1; i <= cols; i++) columnsHtml += buildColumnHtml(row, i);

        return (
            '<article class="builder-row" draggable="true" data-row-id="' + row.id + '">' +
                '<div class="builder-row__header">' +
                    '<span class="builder-drag-handle" title="Sleep om te ordenen">⠿</span>' +
                    '<h3>Kolomsectie ' + (index + 1) + ' · ' + layoutLabel(row.columnType) + '</h3>' +
                    '<button type="button" class="btn-danger btn-small btn-delete-row" data-row-id="' + row.id + '">Verwijderen</button>' +
                '</div>' +
                buildRowSettingsHtml(row) +
                '<div class="builder-columns builder-columns--' + row.columnType + '">' + columnsHtml + '</div>' +
            '</article>'
        );
    }

    function updateRowFromInput(input) {
        var rowId = parseInt(input.dataset.rowId, 10);
        var field = input.dataset.field;
        var row = getRowById(rowId);
        if (!row) return;

        if (input.type === 'checkbox') {
            row[field] = input.checked ? 1 : 0;
            if (field === 'flush_columns') {
                if (input.checked) row.column_gap = 0;
            }
        } else {
            row[field] = input.type === 'number' || field === 'row_width_pct' ? parseInt(input.value, 10) : input.value;
        }

        markDirty();
        if (field === 'flush_columns') renderRows();
        else renderPreview();
    }

    function updateColumnFromInput(input) {
        var rowId = parseInt(input.dataset.rowId, 10);
        var colNum = parseInt(input.dataset.col, 10);
        var field = input.dataset.field;
        var row = getRowById(rowId);
        var col = getColumn(row, colNum);
        if (!row || !col) return;
        if (input.type === 'checkbox') col[field] = input.checked ? 1 : 0;
        else if (input.type === 'range' || input.type === 'number') col[field] = parseInt(input.value, 10);
        else if (field === 'content_mode') col[field] = parseInt(input.value, 10);
        else col[field] = input.value;

        markDirty();
        renderPreview();
    }

    function updateFromInput(input) {
        if ((input.dataset.scope || 'column') === 'row') updateRowFromInput(input);
        else updateColumnFromInput(input);
    }

    function bindFieldEvents(root) {
        root.querySelectorAll('[data-field]').forEach(function (input) {
            input.addEventListener('input', function () { updateFromInput(input); });
            input.addEventListener('change', function () {
                updateFromInput(input);
                if (input.dataset.field === 'content_mode') toggleColumnFields(input.closest('.builder-column'));
            });
        });

        root.querySelectorAll('input[type="file"]').forEach(function (input) {
            input.addEventListener('change', function () {
                if (!input.files || !input.files[0]) return;
                var infoId = parseInt(input.dataset.infoId, 10);
                state.pendingImages[infoId] = input.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var row = getRowById(parseInt(input.dataset.rowId, 10));
                    var col = getColumn(row, parseInt(input.dataset.col, 10));
                    if (!col) return;
                    col.previewUrl = e.target.result;
                    var currentMode = parseInt(col.content_mode, 10) || 0;
                    if (currentMode === 0) {
                        col.content_mode = 2; // had text -> keep it, add the image alongside
                    } else if (currentMode !== 2) {
                        col.content_mode = 1;
                    }
                    markDirty();
                    renderPreview();
                    renderRows();
                };
                reader.readAsDataURL(input.files[0]);
            });
        });

        bindRichTextToolbars(root);
    }

    function syncRichEditor(editor) {
        var rowId = parseInt(editor.dataset.rowId, 10);
        var colNum = parseInt(editor.dataset.col, 10);
        var row = getRowById(rowId);
        var col = getColumn(row, colNum);
        if (!col) return;
        col.informatie = editor.innerHTML;
        markDirty();
        renderPreview();
    }

    function wrapSelectionWithTitle(editor) {
        var sel = window.getSelection();
        if (!sel.rangeCount || sel.isCollapsed) {
            alert('Selecteer eerst een stukje tekst om er een titel van te maken.');
            return;
        }
        var range = sel.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) return;
        var span = document.createElement('span');
        span.className = 'grid-title';
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
    }

    function clearFormatting(editor) {
        var sel = window.getSelection();
        if (!sel.rangeCount || sel.isCollapsed) return;
        var range = sel.getRangeAt(0);
        document.execCommand('removeFormat');
        editor.querySelectorAll('span.grid-title').forEach(function (span) {
            if (!range.intersectsNode || range.intersectsNode(span)) {
                while (span.firstChild) span.parentNode.insertBefore(span.firstChild, span);
                span.parentNode.removeChild(span);
            }
        });
    }

    function bindRichTextToolbars(root) {
        root.querySelectorAll('.rich-text-field').forEach(function (field) {
            var editor = field.querySelector('.rich-text-editor');
            if (!editor || editor.dataset.rtBound === '1') return;
            editor.dataset.rtBound = '1';

            field.querySelectorAll('.rt-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    editor.focus();
                    var cmd = btn.dataset.rtCmd;
                    if (cmd === 'bold') {
                        document.execCommand('bold');
                    } else if (cmd === 'title') {
                        wrapSelectionWithTitle(editor);
                    } else if (cmd === 'clear') {
                        clearFormatting(editor);
                    }
                    syncRichEditor(editor);
                });
            });

            editor.addEventListener('input', function () { syncRichEditor(editor); });
            editor.addEventListener('paste', function (e) {
                e.preventDefault();
                var text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });
    }

    function toggleColumnFields(columnEl) {
        if (!columnEl) return;
        var select = columnEl.querySelector('[data-field="content_mode"]');
        var mode = select ? parseInt(select.value, 10) : 0;
        columnEl.querySelectorAll('.content-text, .content-text-only').forEach(function (el) {
            el.hidden = mode === 1;
        });
        columnEl.querySelectorAll('.content-image').forEach(function (el) {
            el.hidden = mode === 0;
        });
        columnEl.querySelectorAll('.content-image-position').forEach(function (el) {
            el.hidden = mode !== 2;
        });
    }

    function renderRows() {
        rowsEl.innerHTML = state.rows.map(function (row, index) { return buildRowHtml(row, index); }).join('');
        bindFieldEvents(rowsEl);
        bindDeleteButtons();
        initDragDrop();
    }

    function initBuilder() {
        bindFieldEvents(rowsEl);
        bindDeleteButtons();
        initDragDrop();
        renderPreview();
        markClean();
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
            var flush = GS.isFlushRow(row);
            var inner = '';
            for (var i = 1; i <= cols; i++) {
                var col = getColumn(row, i);
                if (!col) continue;
                var mode = parseInt(col.content_mode, 10) || 0;
                var opacity = Math.max(0, Math.min(1, (parseInt(col.opacity, 10) || 10) / 10));
                var isImageOnly = mode === 1;
                var cellStyle = GS.columnStyle(col, isImageOnly, flush);

                var imgSrc = col.previewUrl || (col.image_filename ? config.assetBase + 'img/fotos/' + encodeURIComponent(col.image_filename) : '');
                var imageHtml = imgSrc
                    ? '<div class="preview-image' + (flush && isImageOnly ? ' preview-image--flush' : '') + '"><img src="' + imgSrc + '" style="opacity:' + opacity + '" alt=""></div>'
                    : '<div class="preview-empty">Afbeelding ontbreekt</div>';

                var textClasses = 'preview-text';
                if (parseInt(col.bold, 10) === 1) textClasses += ' bold';
                if (parseInt(col.italic, 10) === 1) textClasses += ' italic';
                var textHtml = '<div class="preview-block" style="background:' + (col.backgroundKleur || '#f9fafb') + ';width:100%">' +
                    '<div class="' + textClasses + '" style="opacity:' + opacity + ';color:' + (col.kleur || '#111827') + '">' +
                    (col.informatie || '') + '</div></div>';

                var cellContent;
                if (mode === 0) {
                    cellContent = textHtml;
                } else if (mode === 1) {
                    cellContent = imageHtml;
                } else {
                    var position = col.image_position || 'top';
                    cellContent = '<div class="preview-both preview-both--' + position + '">' +
                        '<div class="preview-both__image">' + imageHtml + '</div>' +
                        '<div class="preview-both__text">' + textHtml + '</div>' +
                        '</div>';
                }

                inner += '<div class="preview-cell" style="' + cellStyle + '">' + cellContent + '</div>';
            }
            return '<div class="preview-row-wrap" style="' + GS.rowWrapperStyle(row) + '">' +
                '<div class="' + GS.rowGridClass(row.columnType, row) + '" style="' + GS.rowGridStyle(row, row.columns, cols) + '">' + inner + '</div></div>';
        }).join('');
    }

    function initDragDrop() {
        rowsEl.querySelectorAll('.builder-row').forEach(function (rowEl) {
            rowEl.addEventListener('dragstart', function (e) {
                draggedRowId = parseInt(rowEl.dataset.rowId, 10);
                rowEl.classList.add('builder-row--dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            rowEl.addEventListener('dragend', function () {
                rowEl.classList.remove('builder-row--dragging');
                draggedRowId = null;
                rowsEl.querySelectorAll('.builder-row--over').forEach(function (el) { el.classList.remove('builder-row--over'); });
            });
            rowEl.addEventListener('dragover', function (e) { e.preventDefault(); rowEl.classList.add('builder-row--over'); });
            rowEl.addEventListener('dragleave', function () { rowEl.classList.remove('builder-row--over'); });
            rowEl.addEventListener('drop', function (e) {
                e.preventDefault();
                rowEl.classList.remove('builder-row--over');
                var targetId = parseInt(rowEl.dataset.rowId, 10);
                if (!draggedRowId || draggedRowId === targetId) return;
                var fromIndex = state.rows.findIndex(function (r) { return r.id === draggedRowId; });
                var toIndex = state.rows.findIndex(function (r) { return r.id === targetId; });
                if (fromIndex < 0 || toIndex < 0) return;
                state.rows.splice(toIndex, 0, state.rows.splice(fromIndex, 1)[0]);
                markDirty();
                renderRows();
                renderPreview();
            });
        });
    }

    function apiRequest(formData) {
        formData.append('page_id', config.pageId);
        return fetch(config.apiUrl, { method: 'POST', body: formData, credentials: 'same-origin' }).then(function (r) {
            return r.text().then(function (text) {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    throw new Error(text.slice(0, 200) || 'Ongeldig antwoord van server.');
                }
            });
        });
    }

    function addRow() {
        var formData = new FormData();
        formData.append('action', 'add_row');
        formData.append('columnType', document.getElementById('new-column-type').value);
        apiRequest(formData).then(function (data) {
            if (!data.success) return showToast(data.message || 'Fout bij toevoegen.', true);
            state.rows = data.rows;
            state.rows.forEach(function (row) {
                Object.assign(row, GS.normalizeRow(row));
                Object.keys(row.columns || {}).forEach(function (k) {
                    Object.assign(row.columns[k], GS.normalizeColumn(row.columns[k]));
                    if (row.columns[k].content_mode === undefined || row.columns[k].content_mode === null) {
                        row.columns[k].content_mode = row.columns[k].foto ? 1 : 0;
                    }
                    row.columns[k].image_position = row.columns[k].image_position || 'top';
                });
            });
            markDirty();
            renderRows();
            renderPreview();
            showToast('Kolomsectie toegevoegd.');
        });
    }

    function deleteRow(rowId) {
        var formData = new FormData();
        formData.append('action', 'delete_row');
        formData.append('row_id', rowId);
        apiRequest(formData).then(function (data) {
            if (!data.success) return showToast(data.message || 'Fout bij verwijderen.', true);
            state.rows = data.rows;
            markDirty();
            renderRows();
            renderPreview();
            showToast('Kolomsectie verwijderd.');
        });
    }

    function collectPayload() {
        var columns = [];
        var rowsPayload = [];

        state.rows.forEach(function (row) {
            rowsPayload.push({
                row_id: row.id,
                row_width_pct: parseInt(row.row_width_pct, 10) || 100,
                row_align: row.row_align || 'left',
                column_gap: parseInt(row.column_gap, 10) || 0,
                flush_columns: parseInt(row.flush_columns, 10) === 1,
                border_top: parseInt(row.border_top, 10) === 1,
                border_right: parseInt(row.border_right, 10) === 1,
                border_bottom: parseInt(row.border_bottom, 10) === 1,
                border_left: parseInt(row.border_left, 10) === 1,
                border_width: parseInt(row.border_width, 10) || 1,
                border_color: row.border_color || '#d1d5db',
            });

            Object.keys(row.columns || {}).forEach(function (colKey) {
                var col = row.columns[colKey];
                columns.push({
                    info_id: col.info_id,
                    content_mode: parseInt(col.content_mode, 10) || 0,
                    image_position: col.image_position || 'top',
                    informatie: col.informatie || '',
                    kleur: col.kleur || '#111827',
                    backgroundKleur: col.backgroundKleur || '#f9fafb',
                    opacity: parseInt(col.opacity, 10) || 10,
                    bold: parseInt(col.bold, 10) === 1,
                    italic: parseInt(col.italic, 10) === 1,
                    text_align: col.text_align || 'left',
                    image_align: col.image_align || 'center',
                    vertical_align: col.vertical_align || 'top',
                    width_pct: parseInt(col.width_pct, 10) || 0,
                    padding_px: parseInt(col.padding_px, 10) || 16,
                    border_top: parseInt(col.border_top, 10) === 1,
                    border_right: parseInt(col.border_right, 10) === 1,
                    border_bottom: parseInt(col.border_bottom, 10) === 1,
                    border_left: parseInt(col.border_left, 10) === 1,
                    border_width: parseInt(col.border_width, 10) || 1,
                    border_color: col.border_color || '#d1d5db',
                });
            });
        });

        return { theme: state.theme, row_order: state.rows.map(function (r) { return r.id; }), rows: rowsPayload, columns: columns };
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
            if (!data.success) return showToast(data.message || 'Opslaan mislukt.', true);
            if (data.images) {
                Object.keys(data.images).forEach(function (infoId) {
                    state.rows.forEach(function (row) {
                        Object.keys(row.columns).forEach(function (key) {
                            if (String(row.columns[key].info_id) === String(infoId)) {
                                row.columns[key].image_filename = data.images[infoId];
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
        }).catch(function (err) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Pagina opslaan';
            showToast(err.message || 'Netwerkfout bij opslaan.', true);
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
        if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
    });


    setInterval(function () {
        if (state.dirty) {
            savePage();
        }
    }, 30000);

    initBuilder();
})();
