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
        let color = getColorAccordingToPenMode(e);
        if (color !== undefined) {
            e.target.style.backgroundColor = color;
        }
    });

    grid.addEventListener('mouseover', grid.fnMouseOverRelease = function (e) {
        e.preventDefault();
        if (sustainColoring === true) {
            let color = getColorAccordingToPenMode(e);
            if (color !== undefined) {
                e.target.style.backgroundColor = color;
            }
        }
    });
}

function setDrawModeToHover() {
    let grid = document.querySelector('div.grid');
    removeGridEventListeners(grid);

    // Add unique event listeners
    grid.addEventListener('mouseover', grid.fnMouseOverHover = function (e) {
        e.preventDefault();
        let color = getColorAccordingToPenMode(e);
        if (color !== undefined) {
            e.target.style.backgroundColor = color;
        }
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
            let color = getColorAccordingToPenMode(e);
            if (color !== undefined) {
                e.target.style.backgroundColor = color;
            }
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
            let color = getColorAccordingToPenMode(e);
            if (color !== undefined) {
                e.target.style.backgroundColor = color;
            }
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

function getColorAccordingToPenMode(e) {
    if (document.getElementById("colored-pen").checked) {
        let color = document.getElementById("penColorWell").value;
        e.target.classList.add('colored');
        return color;
    }
    else if (document.getElementById("randomized-pen").checked) {
        let color = getRandomizedColor();
        e.target.classList.add('colored');
        return color;
    }
    else if (document.getElementById("shader-pen").checked) {
        if (e.target.classList.contains('colored')) {
            let color = getDarkerColor(e.target.style.backgroundColor, 6);
            e.target.classList.add('colored');
            return color;
        }
    }
    else if (document.getElementById("lightener-pen").checked) {
        if (e.target.classList.contains('colored')) {
            let color = getDarkerColor(e.target.style.backgroundColor, -6);
            e.target.classList.add('colored');
            return color;
        }
    }
    else if (document.getElementById("eraser-pen").checked) {
        if (e.target.classList.contains('colored')) {
            let color = getGridBackgroundColor();
            e.target.classList.remove('colored');
            return color;
        }
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

    let gridLinesColorWell = document.getElementById('grid-lines-color-well');
    div.style.border = "1px solid " + gridLinesColorWell.value;
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
gridLinesColorWell.addEventListener('input', function (e) {
    // e.preventDefault();
    let gridDivs = document.querySelectorAll('.grid div');
    gridDivs.forEach(div => div.style.border = '1px solid ' + gridLinesColorWell.value);
});

let gridLinesToggle = document.getElementById('grid-lines-toggle');
let gridLinesPresent = true;

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
    // e.preventDefault();
    grid.style.backgroundColor = gridBackgroundColorWell.value;
});

/*#887272 for gridlines and #F0F0F0 for bg #ffe5e5 for background*/

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


