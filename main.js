window.onload = function() {
    loadPeriodicTable();
}

var clickToEnlargeShown = false;
var shownClickToEnlarge = false;

function loadPeriodicTable() {
    const periodicTableElement = document.getElementById("periodicTable");
    for(let i = 0; i < periodicTable.elements.length; i++) {
        const periodicTableIndex = periodicTable.elements[i];
        periodicTableElement.innerHTML += `
            <div class="element notout" style="grid-row: ${periodicTableIndex.ypos}; grid-column: ${periodicTableIndex.xpos};" onclick="toggleElement(this)" onmouseleave="mouseOutElement(this)" onmouseover="showClickToEnlarge()">
                <canvas class="element-diagram" id="elementDiagram${i}">Your browser needs to support the HTML5 canvas to see the diagram.</canvas>
                <span class="element-number">${periodicTableIndex.number}</span>
                <span class="element-symbol" style="color: ${periodicTableIndex["cpk-hex"]};">${periodicTableIndex.symbol}</span>
                <span class="element-name" style="color: ${periodicTableIndex["cpk-hex"]};">${periodicTableIndex.name}</span>
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

function mouseOutElement(element) {
    element.classList.remove("in");
    if(!element.classList.contains("notout")) {
        element.classList.add("out");
    }
}

function updateClickToEnlarge() {
    const clickToEnlargeElement = document.getElementById("clickToEnlarge");
    clickToEnlargeElement.classList.toggle("shown", clickToEnlargeShown);
}

function showClickToEnlarge() {
    if(shownClickToEnlarge) return;
    
    shownClickToEnlarge=true;
    clickToEnlargeShown=true;
    
    updateClickToEnlarge();
}