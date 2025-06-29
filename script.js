const rarities = ['Ice', 'Poison', 'Blood', 'Moon', 'Death', 'Cosmic', 'Galactic'];
let selectedChest = null;
let extraCount = 0;
let lastSelectedTab = 'merged'; // tracks the last selected tab

selectedChest = 'Ice';

const chestContainer = document.getElementById('chestTypeButtons');
const openCountContainer = document.getElementById('openCountButtons');
const openChestBtn = document.getElementById('openChestBtn');
const resultDiv = document.getElementById('result');
const chestAmountInput = document.getElementById('chestAmount');

function clearErrors() {
    chestContainer.classList.remove('error');
    openCountContainer.classList.remove('error');
}

function markError(element) {
    element.classList.add('error');
}

rarities.forEach(rarity => {
    const btn = document.createElement('button');
    btn.innerHTML = `<img src="chests/${rarity}.png" alt="${rarity}">`;
    btn.onclick = () => {
        selectedChest = rarity;
        [...chestContainer.children].forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        chestContainer.classList.remove('error');
        openChest();
    };
    chestContainer.appendChild(btn);
});

[0, 1, 2, 3, 4].forEach(i => {
    const btn = document.createElement('button');
    btn.textContent = `+${i}`;
    btn.onclick = () => {
        extraCount = i;
        [...openCountContainer.children].forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        openCountContainer.classList.remove('error');
        openChest();
    };
    openCountContainer.appendChild(btn);
});

function openChest() {
    clearErrors();
    let hasError = false;

    if (!selectedChest) {
        markError(chestContainer);
        hasError = true;
    }
    if (extraCount < 0 || extraCount > 4) {
        markError(openCountContainer);
        hasError = true;
    }

    if (hasError) {
        resultDiv.innerHTML = '';
        return;
    }

    const chestType = selectedChest;

    let chestAmount = parseInt(chestAmountInput.value);
    if (isNaN(chestAmount) || chestAmount < 1) chestAmount = 1;

    const openCount = (4 + extraCount) * chestAmount;
    const pileCounts = {};

    const chestIndex = rarities.indexOf(chestType);
    const dropRarities = (chestType === 'death' || chestType === 'cosmic')
        ? [chestType]
        : [chestType, rarities[chestIndex + 1]];

    for (const rarity of dropRarities) {
        pileCounts[rarity] = { lv1: 0, lv2: 0 };
    }

    if (chestType === 'death' || chestType === 'cosmic') {
        pileCounts[chestType].lv1 = openCount * 0.8;
        pileCounts[chestType].lv2 = openCount * 0.2;
    } else {
        pileCounts[chestType].lv1 = openCount * 0.6;
        pileCounts[chestType].lv2 = openCount * 0.2;
        pileCounts[rarities[chestIndex + 1]].lv1 = openCount * 0.2;
    }

    resultDiv.innerHTML = '';

    for (const rarity of dropRarities) {
        const rawLv1 = pileCounts[rarity].lv1;
        const rawLv2 = pileCounts[rarity].lv2;
        // not useful
        const rawRuneValue = rawLv1 * 2 + rawLv2 * 5;

        const mergedLv2 = Math.floor(rawLv1 / 2);
        const remainingLv1 = rawLv1 % 2;
        const totalLv2 = rawLv2 + mergedLv2;

        const mergedLv3 = Math.floor(totalLv2 / 2);
        const remainingLv2 = totalLv2 % 2;

        const mergedRuneValue =
            remainingLv1 * 2 + remainingLv2 * 5 + mergedLv3 * 12;

        const template = document.getElementById('result-template');
        const clone = template.content.cloneNode(true);

        const mergedId = `${rarity}-merged`;
        const rawId = `${rarity}-raw`;

        const tabContents = clone.querySelectorAll('.tab-pane');

        tabContents[0].id = mergedId;
        tabContents[1].id = rawId;

        // apply previously selected tab
        const isMerged = lastSelectedTab === 'merged';
        tabContents[0].classList.toggle('show', isMerged);
        tabContents[0].classList.toggle('active', isMerged);
        tabContents[1].classList.toggle('show', !isMerged);
        tabContents[1].classList.toggle('active', !isMerged);

        clone.querySelector('.result-img').src = `runes/${rarity}.png`;
        clone.querySelector('.result-img').alt = rarity;

        clone.querySelector('.raw-lv1').textContent = rawLv1.toFixed(2);
        clone.querySelector('.raw-lv2').textContent = rawLv2.toFixed(2);

        clone.querySelector('.after-lv1').textContent = remainingLv1.toFixed(2);
        clone.querySelector('.after-lv2').textContent = remainingLv2.toFixed(2);
        clone.querySelector('.after-lv3').textContent = mergedLv3.toFixed(2);
        clone.querySelector('.rune-value').textContent = mergedRuneValue.toFixed(2);

        clone.querySelectorAll('.rarity-title').forEach(el => {
            el.textContent = rarity.toUpperCase();
        });

        resultDiv.appendChild(clone);
    }

    resultDiv.classList.remove('hidden');
    document.getElementById('container').classList.add('show-result');
}

// sync tabs across all result blocks and track selection
document.addEventListener('click', (e) => {
    if (!e.target.matches('button[data-bs-toggle="pill"]')) return;

    const tabLabel = e.target.textContent.trim().toLowerCase();
    const isMerged = tabLabel === 'merged';
    lastSelectedTab = isMerged ? 'merged' : 'raw';

    document.querySelectorAll('.result-block').forEach(block => {
        const tabContents = block.querySelectorAll('.tab-pane');

        tabContents[0].classList.toggle('show', isMerged);
        tabContents[0].classList.toggle('active', isMerged);
        tabContents[1].classList.toggle('show', !isMerged);
        tabContents[1].classList.toggle('active', !isMerged);
    });
});

openChest()