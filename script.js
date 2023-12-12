// GLOBAL VARIABLES
let gridLinesPresent = false;
let gridWidth = 500;
let defaultGridLinesClr = "#92d6e1";
let defaultPenClr = "#6adcf0";

// FUNCTIONS
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

function getGridDimensionsFromInput() {
    let gridSizeInput = document.querySelector('input#grid-size');
    if (gridSizeInput.value > 100) {
        gridSizeInput.value = 100;
    }
    else if (gridSizeInput.value > 100){
        gridSizeInput.value = 0;
    }
    return gridSizeInput.value;
}

function getDividedDivSize(numberOfDivs, gridDimensions) {
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

function populateGridCells(grid) {
    clearGrid(grid);

    let numberOfDivs = getGridDimensionsFromInput();
    const gridDimensions = gridWidth;

    for (let i = 0; i < numberOfDivs; i++) {
        for (let j = 0; j < numberOfDivs; j++) {
            let calculatedSize = getDividedDivSize(numberOfDivs, gridDimensions);

            grid = addDiv(grid, calculatedSize);
        }
    }
}

function removeGridLines() {
    let gridDivs = document.querySelectorAll('.grid div');
    gridDivs.forEach(div => div.style.border = '0px');
    gridLinesPresent = false;
}

function addGridLines() {
    let gridLinesColorWell = document.getElementById('grid-lines-color-well');
    let gridDivs = document.querySelectorAll('.grid div');
    gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);
    gridLinesPresent = true;
}

function reset() {
    eraseGrid();
    removeGridLines();
    let gridLinesToggle = document.getElementById('grid-lines-toggle');
    gridLinesToggle.checked = false;
    let drawModeInput = document.getElementById('click-drag-hold-mode');
    drawModeInput.checked = true;
    setDrawModeToClickDragHold();
    let drawToolInput = document.getElementById('colored-pen');
    drawToolInput.checked = true;
    let penColorWell = document.getElementById('penColorWell');
    penColorWell.value = defaultPenClr;
    let gridLinesColorWell = document.getElementById('grid-lines-color-well');
    gridLinesColorWell.value = defaultGridLinesClr;

    let gridSizeInput = document.querySelector('input#grid-size');
    gridSizeInput.value = 25;
    populateGridCells(grid);
}

function eraseGrid() {
    let gridDivs = document.querySelectorAll('.grid div');
    gridDivs.forEach(div => {
        div.style.backgroundColor = "";
        div.classList.remove('colored');
    });   
}

// DECLARATIONS
let grid = document.querySelector('.grid');
let gridSizeButton = document.querySelector('button.grid-size');
let drawModeOptionsList = document.querySelectorAll('input[name="draw-mode"]');
let gridLinesColorWell = document.getElementById('grid-lines-color-well');
let gridLinesToggle = document.getElementById('grid-lines-toggle');
let eraseGridButton = document.getElementById('erase-grid');
let resetButton = document.getElementById('reset');
let radioButtons = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

// LOGIC
// Set default behavior before drawing can take place
populateGridCells(grid);
setDrawModeToClickDragHold();

// EVENT LISTENERS
gridLinesToggle.addEventListener('click', function () {
    if (gridLinesPresent) {
        removeGridLines();
    }
    else {
        addGridLines();
    }
});

eraseGridButton.addEventListener('click', eraseGrid);

resetButton.addEventListener('click', reset);

gridSizeButton.addEventListener('click', () => populateGridCells(grid));

drawModeOptionsList.forEach(drawModeOption => drawModeOption.addEventListener('click', setDrawMode));

gridLinesColorWell.addEventListener('input', function (e) {
    if (gridLinesToggle.checked === true) {
        let gridDivs = document.querySelectorAll('.grid div');
        gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);        
    }
});

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('onchange', (radioButton, e) => {
        if (radioButton.checked) {
            console.log(e);
        } else {

        }
    });
});