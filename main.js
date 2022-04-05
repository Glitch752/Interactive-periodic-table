window.onload = function() {
    loadPeriodicTable();
}

var clickToEnlargeShown = false;
var shownClickToEnlarge = false;

var colorSchemeCPK = false;

function loadPeriodicTable() {
    const periodicTableElement = document.getElementById("periodicTable");
    periodicTableElement.innerHTML = "";
    const documentElementStyle = getComputedStyle(document.documentElement);
    const gridSpacing = parseFloat(documentElementStyle.getPropertyValue("--element-size")) + parseFloat(documentElementStyle.getPropertyValue("--grid-gap"));
    const gridSpacingPixels = gridSpacing * 16;
    const overlay = document.getElementById("overlay");
    overlay.width = (gridSpacingPixels * 18) - (parseFloat(documentElementStyle.getPropertyValue("--grid-gap")) * 16);
    overlay.height = (gridSpacingPixels * 10) - (parseFloat(documentElementStyle.getPropertyValue("--grid-gap")) * 16);
    const overlayContext = overlay.getContext("2d");
    for(var i = 0; i < periodicTable.overlayPaths.length; i++) {
        const path = periodicTable.overlayPaths[i];
        overlayContext.strokeStyle = path.color;
        overlayContext.lineWidth = path.width;
        overlayContext.setLineDash(path.dash);
        overlayContext.beginPath();
        const startPixelX = (path.path[0].x - 1) * gridSpacingPixels;
        const startPixelY = (path.path[0].y - 1) * gridSpacingPixels;
        overlayContext.moveTo(startPixelX, startPixelY);
        for(var j = 1; j < path.path.length; j++) {
            const location = path.path[j];
            const pixelX = (location.x - 1) * gridSpacingPixels;
            const pixelY = (location.y - 1) * gridSpacingPixels;
            overlayContext.lineTo(pixelX, pixelY);
        }
        overlayContext.stroke();
    }
    let lowestRowPer = [];
    let lowestColumnPer = [];
    for(let i = 0; i < 18; i++) {
        lowestRowPer.push(20);
    }
    for(let i = 0; i < 7; i++) {
        lowestColumnPer.push(20);
    }
    for(let i = 0; i < periodicTable.elements.length; i++) {
        const periodicTableIndex = periodicTable.elements[i];
        periodicTableElement.innerHTML += `
            <div class="element notout" style="--background: #${colorSchemeCPK === false ? (periodicTable.categoryColors[periodicTableIndex.categoryKnown === false ? "none" : periodicTableIndex.category]) : "444444"}; grid-row: ${periodicTableIndex.ypos}; grid-column: ${periodicTableIndex.xpos};" onclick="toggleElement(this)" onmouseleave="mouseOutElement(this, '${periodicTableIndex.categoryKnown === false ? "none" : periodicTableIndex.category}')" onmouseover="mouseOverElement(this, '${periodicTableIndex.categoryKnown === false ? "none" : periodicTableIndex.category}')">
                <canvas class="element-diagram" id="elementDiagram${i}">Your browser needs to support the HTML5 canvas to see the diagram.</canvas>
                <span class="element-number" style="--color: #${colorSchemeCPK === false ? "000000" : "ffffff"}">${periodicTableIndex.number}</span>
                <span class="element-symbol" style="color: #${colorSchemeCPK === true ? periodicTableIndex["cpk-hex"] : "000000"};">${periodicTableIndex.symbol}</span>
                <span class="element-name" style="--cpk: #${periodicTableIndex["cpk-hex"]}; color: #${colorSchemeCPK === true ? periodicTableIndex["cpk-hex"] : "000000"};">${periodicTableIndex.name}</span>
                <span class="element-mass"style="--color: #${colorSchemeCPK === false ? "000000" : "ffffff"}">${Math.round(periodicTableIndex.atomic_mass * 100) / 100}</span>
                <div class="element-info">
                    <div class="element-info-icon">
                        <div class="element-info-icon-text">i</div>
                    </div>
                    <div class="element-info-display" style="--x: ${periodicTableIndex.xpos}">
                        ${periodicTableIndex.summary === null ? "unknown" : periodicTableIndex.summary}<br><br>
                        Atomic mass: ${periodicTableIndex.atomic_mass === null ? "unknown" : periodicTableIndex.atomic_mass}<br>
                        Density: ${periodicTableIndex.density === null ? "unknown" : periodicTableIndex.density}<br>
                        Melting point: ${periodicTableIndex.melt === null ? "unknown" : periodicTableIndex.melt} °C<br>
                        Boiling point: ${periodicTableIndex.boil === null ? "unknown" : periodicTableIndex.boil} °C<br>
                        Category: ${periodicTableIndex.category === null ? "unknown" : periodicTableIndex.category}<br>
                        Discovered by: ${periodicTableIndex.discovered_by === null ? "unknown" : periodicTableIndex.discovered_by}<br>
                        Phase: ${periodicTableIndex.phase === null ? "unknown" : periodicTableIndex.phase}<br>
                        Appearence: ${periodicTableIndex.appearance === null ? "unknown" : periodicTableIndex.appearance}
                        <div class="spacer"></div>
                        <div class="spacer2"></div>
                        <div class="spacer3"></div>
                    </div>
                </div>
            </div>
        `;
        if(lowestRowPer[periodicTableIndex.xpos - 1] > periodicTableIndex.ypos) {
            lowestRowPer[periodicTableIndex.xpos - 1] = periodicTableIndex.ypos;
        }
        if(lowestColumnPer[periodicTableIndex.ypos - 1] > periodicTableIndex.xpos) {
            lowestColumnPer[periodicTableIndex.ypos - 1] = periodicTableIndex.xpos;
        }
    }
    for(let i = 0; i < lowestRowPer.length; i++) {
        periodicTableElement.innerHTML += `
            <div class="element-group" style="grid-row: ${lowestRowPer[i]}; grid-column: ${i + 1};">
                ${i + 1}
            </div>
        `;
    }
    for(let i = 0; i < lowestColumnPer.length; i++) {
        periodicTableElement.innerHTML += `
            <div class="element-period" style="grid-row: ${i + 1}; grid-column: ${lowestColumnPer[i]};">
                ${i + 1}
            </div>
        `;
    }
    for(let i = 0; i < periodicTable.elements.length; i++) {
        const periodicTableIndex = periodicTable.elements[i];

        const canvasElement = document.getElementById(`elementDiagram${i}`);
        const canvasContext = canvasElement.getContext('2d');

        const elementShells = periodicTableIndex.shells;

        const baseWidth = 200;
        const baseHeight = 200;

        const width = baseWidth;
        const height = baseHeight;

        canvasElement.width = width;
        canvasElement.height = height;

        canvasContext.lineWidth = 2;
        
        for(var j = 0; j < elementShells.length; j++) {
            const radius = 20 + (j * 7);

            canvasContext.beginPath();
            canvasContext.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
            canvasContext.stroke();
            
            const totalShells = elementShells[j]; 
            for(var k = 0; k < totalShells; k++) {
                const angle = 1 / totalShells * k;

                x = radius * Math.sin(Math.PI * 2 * angle) + width / 2;
                y = radius * Math.cos(Math.PI * 2 * angle) + height / 2;

                if(j === elementShells.length - 1) {
                    canvasContext.fillStyle = "#ff9999";
                } else {
                    canvasContext.fillStyle = "#999999";
                }
                canvasContext.beginPath();
                canvasContext.arc(x, y, 3, 0, 2 * Math.PI);
                canvasContext.fill();
            }
        }
    }
    const key = document.getElementById("key");
    key.innerHTML = "";
    if(!colorSchemeCPK) {
        for(var i = 0; i < Object.keys(periodicTable.categoryColors).length; i++) {
            const categoryColorKey = Object.keys(periodicTable.categoryColors)[i];
            const categoryColor = periodicTable.categoryColors[categoryColorKey];
            key.innerHTML += `
                <div class="key-element" id="${categoryColorKey.replace(" ", "-")}">
                    <div class="key-color" style="background-color: #${categoryColor};"></div>
                    <div class="key-text">${categoryColorKey}</div>
                </div>
            `;
        }
    }
}

function toggleElement(element) {
    element.classList.toggle("in");
    if(element.classList.contains("in")) {
        clickToEnlargeShown = false;
        updateClickToEnlarge();
    }
    if(element.classList.contains("notout")) {
        element.classList.remove("notout");
    } else {
        element.classList.toggle("out");
    }
}

function mouseOutElement(element, elementCategory) {
    element.classList.remove("in");
    if(!element.classList.contains("notout")) {
        element.classList.add("out");
    }

    if(!colorSchemeCPK) {
        elementCategory = elementCategory.replace(" ", "-");
        const elementElem = document.getElementById(elementCategory);

        elementElem.classList.remove("active-key");
    }
}

function updateClickToEnlarge() {
    const clickToEnlargeElement = document.getElementById("clickToEnlarge");
    clickToEnlargeElement.classList.toggle("shown", clickToEnlargeShown);
}

function mouseOverElement(element, elementCategory) {
    if(!shownClickToEnlarge) {
        shownClickToEnlarge=true;
        clickToEnlargeShown=true;
        
        updateClickToEnlarge();
    }

    if(!colorSchemeCPK) {
        elementCategory = elementCategory.replace(" ", "-");
        const elementElem = document.getElementById(elementCategory);

        elementElem.classList.add("active-key");
    }
}

function updateColors() {
    var CPKColors = document.getElementById("CPKColors");
    colorSchemeCPK = CPKColors.checked;
    loadPeriodicTable();
}