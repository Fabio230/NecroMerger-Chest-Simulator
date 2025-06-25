const rarities = ['ice', 'poison', 'blood', 'moon', 'death', 'cosmic'];
let selectedChest = null;
let extraCount = 0;

const chestContainer = document.getElementById('chestTypeButtons');
const openCountContainer = document.getElementById('openCountButtons');
const openChestBtn = document.getElementById('openChestBtn');
const resultDiv = document.getElementById('result');

function clearErrors() {
    chestContainer.classList.remove('error');
    openCountContainer.classList.remove('error');
}

function markError(element) {
    element.classList.add('error');
}

rarities.forEach(rarity => {
    const btn = document.createElement('button');
    btn.innerHTML = `<img src="chests/${rarity}.jpg" alt="${rarity}">`;
    btn.onclick = () => {
    selectedChest = rarity;
    [...chestContainer.children].forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    chestContainer.classList.remove('error');
    };
    chestContainer.appendChild(btn);
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
});

function simulateChest() {
    clearErrors();
    let hasError = false;

    if (!selectedChest) {
        markError(chestContainer);
        hasError = true;
    }
    console.log(extraCount);
    if (extraCount < 0 && extraCount > 4) {
        markError(openCountContainer);
        hasError = true;
    }

    if (hasError) {
        resultDiv.innerHTML = '';
        return;
    }

    const chestType = selectedChest;
    const openCount = 4 + extraCount;
    const pileCounts = {};
    const chestIndex = rarities.indexOf(chestType);
    const dropRarities =
    chestType === 'death' || chestType === 'cosmic'
        ? [chestType]
        : [chestType, rarities[chestIndex + 1]];

    for (const rarity of dropRarities) {
        pileCounts[rarity] = { lv1: 0, lv2: 0 };
    }

    for (let i = 0; i < openCount; i++) {
        const roll = Math.random();
        let targetRarity = chestType;
        let level = 1;

        if (chestType === 'death' || chestType === 'cosmic') {
            level = roll < 0.8 ? 1 : 2;
        } else {
            if (roll < 0.6) {
            level = 1;
            } else if (roll < 0.8) {
            level = 2;
            } else {
            level = 1;
            targetRarity = rarities[chestIndex + 1];
            }
        }

        if (!pileCounts[targetRarity]) {
            pileCounts[targetRarity] = { lv1: 0, lv2: 0 };
        }

        if (level === 1) {
            pileCounts[targetRarity].lv1 += 1;
        } else {
            pileCounts[targetRarity].lv2 += 1;
        }
    }

    let output = "";
    for (const rarity of dropRarities) {
    let { lv1, lv2 } = pileCounts[rarity];
    let mergedLv2 = Math.floor(lv1 / 2);
    lv1 = lv1 % 2;
    lv2 += mergedLv2;
    let lv3 = Math.floor(lv2 / 2);
    lv2 = lv2 % 2;
    const runes = lv1 * 2 + lv2 * 5 + lv3 * 12;

    output += `
        <div class="result-block">
        <img src="runes/${rarity}.png" alt="${rarity}">
        <div class="result-details">
            <strong>${rarity.toUpperCase()}</strong><br>
            - lv1 pile: ${lv1}<br>
            - lv2 pile: ${lv2}<br>
            - lv3 pile: ${lv3}<br>
            → Runes: ${runes}
        </div>
        </div>
    `;
    }
    resultDiv.innerHTML = output;
    resultDiv.classList.remove('hidden');
    document.getElementById('container').classList.add('show-result');
    console.log(output);
}

openChestBtn.addEventListener('click', simulateChest);