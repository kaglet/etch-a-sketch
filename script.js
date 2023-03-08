let gridLinesPresent = false;

function removeGridEventListeners(grid) {
    // Remove all grid event listeners that might be active
    grid.removeEventListener('mousedown', grid.fnMouseDown);
    grid.removeEventListener('mouseup', grid.fnMouseUp);
    grid.removeEventListener('mouseover', grid.fnMouseOverDrag);
    grid.removeEventListener('mouseover', grid.fnMouseOverHover);
    grid.removeEventListener('click', grid.fnMouseDownRelease);
    grid.removeEventListener('mouseover', grid.fnMouseOverRelease);
}

function setDrawModeToClickDragRelease() {
    let grid = document.querySelector('div.grid');

    removeGridEventListeners(grid);

    // Does not matter where these are declared, only where and when they are updated
    let sustainColoring = false;

    // Add unique event listeners
    grid.addEventListener('mousedown', grid.fnMouseDownRelease = function (e) {
        e.preventDefault();
        if (sustainColoring === false) {
            sustainColoring = true;
        } else {
            sustainColoring = false;
        }
        colorAccordingToPenMode(e);
    });

    grid.addEventListener('mouseover', grid.fnMouseOverRelease = function (e) {
        e.preventDefault();
        if (sustainColoring === true) {
            colorAccordingToPenMode(e);
        }
    });
}

function setDrawModeToHover() {
    let grid = document.querySelector('div.grid');
    removeGridEventListeners(grid);

    // Add unique event listeners
    grid.addEventListener('mouseover', grid.fnMouseOverHover = function (e) {
        e.preventDefault();
        colorAccordingToPenMode(e);
    });
}

function setDrawModeToClickDragHold() {
    // Does not matter where these are declared, only where and when they are updated
    let isMouseDownTriggered = false;
    let isFirstInBoxSeries = true;

    let grid = document.querySelector('div.grid');
    let body = document.querySelector('body');

    removeGridEventListeners(grid);

    // Add unique event listeners
    grid.addEventListener('mousedown', grid.fnMouseDown = function (e) {
        e.preventDefault();

        if (isFirstInBoxSeries) {
            colorAccordingToPenMode(e);
            isFirstInBoxSeries = false;
        }
        isMouseDownTriggered = true;
    });

    body.addEventListener('mouseup', grid.fnMouseUp = function (e) {
        isMouseDownTriggered = false;
        isFirstInBoxSeries = true;
    });

    grid.addEventListener('mouseover', grid.fnMouseOverDrag = function (e) {
        e.preventDefault();
        if (isMouseDownTriggered === true) {
            colorAccordingToPenMode(e);
        }
    });
}

function getRandomizedColor() {
    // Math.pow is slow, use constant instead.
    let color = Math.floor(Math.random() * 16777216).toString(16);
    // Avoid loops.
    return '#000000'.slice(0, -color.length) + color;
}

function getGridBackgroundColor() {
    let grid = document.getElementById('grid');
    return grid.style.backgroundColor;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getDarkerColor(col, amt) {
    let r = col.substring(4, col.indexOf(","));
    col = col.slice(col.indexOf(",") + 1);
    let g = col.substring(1, col.indexOf(","));
    col = col.slice(col.indexOf(",") + 1);
    let b = col.substring(1, col.indexOf(")"));
    col = rgbToHex(+r, +g, +b);

    let usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    let R = parseInt(col.substring(0, 2), 16);
    let G = parseInt(col.substring(2, 4), 16);
    let B = parseInt(col.substring(4, 6), 16);

    // to make the colour less bright than the input
    // change the following three "+" symbols to "-"
    R = R - amt;
    G = G - amt;
    B = B - amt;

    if (R > 255) R = 255;
    else if (R < 0) R = 0;

    if (G > 255) G = 255;
    else if (G < 0) G = 0;

    if (B > 255) B = 255;
    else if (B < 0) B = 0;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return (usePound ? "#" : "") + RR + GG + BB;
}

function colorAccordingToPenMode(e) {
    if (document.getElementById("colored-pen").checked) {
        let color = document.getElementById("penColorWell").value;
        e.target.style.backgroundColor = color;
        e.target.classList.add('colored');
    }
    else if (document.getElementById("randomized-pen").checked) {
        let color = getRandomizedColor();
        e.target.style.backgroundColor = color;
        e.target.classList.add('colored');
    }
    else if (document.getElementById("shader-pen").checked) {
        if (e.target.classList.contains('colored')) {
            let slider = document.getElementById('shader-pen-control');
            let color = getDarkerColor(e.target.style.backgroundColor, slider.value);
            e.target.style.backgroundColor = color;
            e.target.classList.add('colored');
        }
    }
    else if (document.getElementById("lightener-pen").checked) {
        if (e.target.classList.contains('colored')) {
            let slider = document.getElementById('lightener-pen-control');;
            let color = getDarkerColor(e.target.style.backgroundColor, -slider.value);
            e.target.style.backgroundColor = color;
            e.target.classList.add('colored');
        }
    }
    else if (document.getElementById("eraser-pen").checked) {
        if (e.target.classList.contains('colored')) {
            e.target.style.backgroundColor = "";
            e.target.classList.remove('colored');
        }
    }
}

function setDrawMode(e) {
    if (e.target.value === "click-drag-hold") {
        setDrawModeToClickDragHold();
    } else if (e.target.value === "click-drag-release") {
        setDrawModeToClickDragRelease();
    }
    else if (e.target.value === "hover-over") {
        setDrawModeToHover();
    }
}

function getNumberOfDivs() {
    let gridSizeInput = document.querySelector('input#grid-size');
    if (gridSizeInput.value > 100) {
        gridSizeInput.value = 100;
    }
    else if (gridSizeInput.value > 100){
        gridSizeInput.value = 0;
    }
    return gridSizeInput.value;
}

function getDesiredDivSize(numberOfDivs, gridDimensions) {
    return gridDimensions / numberOfDivs;
}

function addDiv(grid, calculatedSize) {
    let div = document.createElement('div');
    div.style.height = calculatedSize + "px";
    div.style.width = calculatedSize + "px";

    let gridLinesColorWell = document.getElementById('grid-lines-color-well');
    let gridLinesToggle = document.getElementById('grid-lines-toggle');
    if (gridLinesToggle.checked === true) {
        div.style.border = "1px solid " + gridLinesColorWell.value;
    }
    else {
        gridLinesToggle.checked = false;
        gridLinesPresent = false;
    }

    grid.appendChild(div);

    return grid;
}

function createGrid() {
    let grid = document.createElement('div');
    grid.classList.add('grid');
    grid.setAttribute('id', 'grid');

    let gridBackgroundColorWell = document.getElementById('bgColorWell');
    grid.style.backgroundColor = gridBackgroundColorWell.value;

    return grid;
}

function clearGrid(grid) {
    // if grid is empty, return, else remove all children until it is
    let childrenNodesList = document.querySelectorAll('div.grid div')
    if (childrenNodesList.length === 0) {
        return;
    }

    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

function populateGrid() {
    let grid = document.querySelector('div.grid');
    clearGrid(grid);

    let numberOfDivs = getNumberOfDivs();
    const gridDimensions = 700;

    for (let i = 0; i < numberOfDivs; i++) {
        for (let j = 0; j < numberOfDivs; j++) {
            let calculatedSize = getDesiredDivSize(numberOfDivs, gridDimensions);

            grid = addDiv(grid, calculatedSize);
        }
    }
}

function setupPage() {
    let grid = createGrid();
    const gridContainerDiv = document.querySelector('.grid-container');
    gridContainerDiv.appendChild(grid);
    populateGrid();
    
    let gridSizeButton = document.querySelector('button.grid-size');
    gridSizeButton.addEventListener('click', populateGrid);
    
    let drawModeOptionsList = document.querySelectorAll('input[name="draw-mode"]');
    drawModeOptionsList.forEach(drawModeOption => drawModeOption.addEventListener('click', setDrawMode));
    
    // Color in both cases separately
    let gridLinesColorWell = document.getElementById('grid-lines-color-well');
    gridLinesColorWell.addEventListener('input', function (e) {
        if (gridLinesToggle.checked === true) {
            let gridDivs = document.querySelectorAll('.grid div');
            gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);        
        }
    });
    
    let gridLinesToggle = document.getElementById('grid-lines-toggle');
    
    gridLinesToggle.addEventListener('click', function () {
        let gridDivs = document.querySelectorAll('.grid div');
        if (gridLinesPresent) {
            gridDivs.forEach(div => div.style.border = '0px');
            gridLinesPresent = false;
        }
        else {
            gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);
            gridLinesPresent = true;
        }
    });
    
    let gridBackgroundColorWell = document.getElementById('bgColorWell');
    gridBackgroundColorWell.addEventListener('input', function (e) {
            grid.style.backgroundColor = gridBackgroundColorWell.value;
    });

    setDrawModeToClickDragHold();

    let eraseGridButton = document.getElementById('erase-grid');
    eraseGridButton.addEventListener('click', eraseGrid);
}

function eraseGrid() {
    let gridDivs = document.querySelectorAll('.grid div');
    gridDivs.forEach(div => {
        div.style.backgroundColor = "";
        div.classList.remove('colored');
    });   
}

window.addEventListener('load', setupPage);


