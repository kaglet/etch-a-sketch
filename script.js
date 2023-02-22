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
        console.log(e.target);
        let color = getColorAccordingToPenMode();
        e.target.style.backgroundColor = color;
    });

    grid.addEventListener('mouseover', grid.fnMouseOverRelease = function (e) {
        e.preventDefault();
        if (sustainColoring === true) {
            let color = getColorAccordingToPenMode();
            e.target.style.backgroundColor = color;
        }
    });
}

function setDrawModeToHover() {
    let grid = document.querySelector('div.grid');
    removeGridEventListeners(grid);

    // Add unique event listeners
    grid.addEventListener('mouseover', grid.fnMouseOverHover = function (e) {
        e.preventDefault();
        let color = getColorAccordingToPenMode();
        e.target.style.backgroundColor = color;
    });
}

function setDrawModeToClickDragHold() {
    // Does not matter where these are declared, only where and when they are updated
    let isMouseDownTriggered = false;
    let isFirstInBoxSeries = true;

    let grid = document.querySelector('div.grid');

    removeGridEventListeners(grid);

    // Add unique event listeners
    grid.addEventListener('mousedown', grid.fnMouseDown = function (e) {
        e.preventDefault();

        if (isFirstInBoxSeries) {
            let color = getColorAccordingToPenMode();
            e.target.style.backgroundColor = color;
            isFirstInBoxSeries = false;
        }
        isMouseDownTriggered = true;
    });

    grid.addEventListener('mouseup', grid.fnMouseUp = function (e) {
        isMouseDownTriggered = false;
        isFirstInBoxSeries = true;
    });

    grid.addEventListener('mouseover', grid.fnMouseOverDrag = function (e) {
        e.preventDefault();
        if (isMouseDownTriggered === true) {
            let color = getColorAccordingToPenMode();
            e.target.style.backgroundColor = color;
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

function getLighterColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

function getColorAccordingToPenMode() {
    if (document.getElementById("colored-pen").checked) {
        let color = document.getElementById("penColorWell").value;
        return color;
    }
    else if (document.getElementById("randomized-pen").checked) {
        let color = getRandomizedColor();
        return color;
    }
    else if (document.getElementById("shader-pen").checked) {
        let color = getDarkerColor();
    }
    else if (document.getElementById("lightener-pen").checked) {
        let color = getLighterColor();
    }
    else if (document.getElementById("eraser-pen").checked) {
        let color = getGridBackgroundColor();
        return color;
    }
}

function setDrawMode(e) {
    if (e.target.value === "Click and Drag (Hold down version)") {
        setDrawModeToClickDragHold();
    } else if (e.target.value === "Click and Drag (Release up version)") {
        setDrawModeToClickDragRelease();
    }
    else if (e.target.value === "Hover Over") {
        setDrawModeToHover();
    }
}

function getNumberOfDivs() {
    let gridSizeInput = document.querySelector('input#grid-size');
    return gridSizeInput.value;
}

function getDesiredDivSize(numberOfDivs, gridDimensions) {
    return gridDimensions / numberOfDivs;
}

function addDiv(grid, calculatedSize) {
    let div = document.createElement('div');
    div.style.height = calculatedSize + "px";
    div.style.width = calculatedSize + "px";
    //div.style.backgroundColor = grid.style.backgroundColor;

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
    const gridDimensions = 900;

    for (let i = 0; i < numberOfDivs; i++) {
        for (let j = 0; j < numberOfDivs; j++) {
            let calculatedSize = getDesiredDivSize(numberOfDivs, gridDimensions);

            grid = addDiv(grid, calculatedSize);
        }
    }
}

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
let gridDivs = document.querySelectorAll('.grid div');
gridLinesColorWell.addEventListener('input', function (e) {
    // e.preventDefault();
    gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);
});

let gridLinesToggle = document.getElementById('grid-lines-toggle');
let gridLinesPresent = false;

gridLinesToggle.addEventListener('click', function () {
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
    // e.preventDefault();
    grid.style.backgroundColor = gridBackgroundColorWell.value;
});

/*#887272 for gridlines and #F0F0F0 for bg */

/* When shader pen is activated how does it colour in? It uses the target for which the color selection is invoked. */


/* WHY IT DOESN'T COLOR FIRST BLOCK
- mouseover event triggered, reads false as it isn't clicked on yet, once its clicked on isMouseDownTriggered becomes true.
The catch is that mouseover doesn't trigger again, only on the first hover. Identify the first in a click and hover sequence. First one
just needs click not click and hover as it is already hovered on.

Maybe use once. Bind to each div element not to the window.*/

/* WHY COLORING IS INCONSISTENT I.e. On mouseup it colors and on mousedown it stops coloring.

Without full release of mouse button it won't know which is triggered maybe. It may color it in, or even not color it in,
when... (well when does grab icon appear?)

I could say mouseup and mousedown switch roles in a way and get confused along the way when "something" happens*/

/* Unbind event listener from window. There's an issue that onMouseOver it reads as false until its clicked which is a good thing, of course it won't color
until both are satisfied but it will jump into the debugger each time which is really annoying until that condition is satisfied but I can't
satisfy it since debugger is irritating. On hover it immediately takes me there without giving me a chance to click. So only place the flag
within the inner part where the if statement is satisfied. */
/*We don't even need to unbind from window. That's not the problem. We can make sure the color in code executes only when the right div is selected too.*/
/* Do this by checking the targets properties. Not sure if it was covered, clicking a child element clicks both the child and the parent.
I believe that was covered. So it does affect the events. Not just the parent is clicked, but the child too. And if they both had the same
click event then that would be a problem. We don't have that here though.*/
/* We also never have a break on mouseover. It is constantly on mouseover. */

// let drawMode = getDrawModeOption();
/* Setup event listener on field for when text is entered, then enter into a different draw mode each time. 
This allows code to be implemented anytime regardless of the flow of the program. The flow needs to be dynamic not linear anyway. */


