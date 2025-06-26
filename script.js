const rarities = ['ice', 'poison', 'blood', 'moon', 'death', 'cosmic'];
let selectedChest = null;
let extraCount = 0;

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
    };
    chestContainer.appendChild(btn);
    if (rarity === "ice") btn.click();
});

[0, 1, 2, 3, 4,].forEach(i => {
    const btn = document.createElement('button');
    btn.textContent = `+${i}`;
    btn.onclick = () => {
    extraCount = i;
    [...openCountContainer.children].forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    openCountContainer.classList.remove('error');
    };
    openCountContainer.appendChild(btn);
    if (i === 0) btn.click();
});

simulateChest();

function simulateChest() {
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

    let output = '';
    for (const rarity of dropRarities) {
        const rawLv1 = pileCounts[rarity].lv1;
        const rawLv2 = pileCounts[rarity].lv2;
        const rawRuneValue = rawLv1 * 2 + rawLv2 * 5;

        const mergedLv2 = Math.floor(rawLv1 / 2);
        const remainingLv1 = rawLv1 % 2;
        const totalLv2 = rawLv2 + mergedLv2;

        const mergedLv3 = Math.floor(totalLv2 / 2);
        const remainingLv2 = totalLv2 % 2;

        const mergedRuneValue =
            remainingLv1 * 2 + remainingLv2 * 5 + mergedLv3 * 12;

        output += `
            <div class="result-block">
                <img src="runes/${rarity}.png" alt="${rarity}">
                <div class="result-details">
                    <strong>${rarity.toUpperCase()}</strong><br><br>
                    
                    <u>Raw Drops</u><br>
                    - avg lv1 piles: ${rawLv1.toFixed(2)}<br>
                    - avg lv2 piles: ${rawLv2.toFixed(2)}<br>

                    <u>After Merging</u><br>
                    - lv1 piles: ${remainingLv1.toFixed(2)}<br>
                    - lv2 piles: ${remainingLv2.toFixed(2)}<br>
                    - lv3 piles: ${mergedLv3.toFixed(2)}<br>
                    → Rune value (merged): ${mergedRuneValue.toFixed(2)}
                </div>
            </div>
        `;
    }

    resultDiv.innerHTML = output;
    resultDiv.classList.remove('hidden');
    document.getElementById('container').classList.add('show-result');
}

openChestBtn.addEventListener('click', simulateChest);