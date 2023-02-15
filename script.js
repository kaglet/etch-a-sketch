function getNumberOfDivs() {

}

function colorBlockIn(color="black", block) {
    block.style.color = color;
}

function getDesiredDivSize(numberOfDivs, gridDimensions) {
    return gridDimensions/numberOfDivs;
}

function addDiv(grid, calculatedSize){
    let div = document.createElement('div');
    div.style.height = calculatedSize + "px";
    div.style.width = calculatedSize + "px";


    
    grid.appendChild(div);

    return grid;
}

function populateGrid(numberOfDivs) {
    const gridDimensions = 960;

    let grid = document.createElement('div');
    grid.classList.add('grid');

    const body = document.querySelector('body');

    for (let i = 0; i < numberOfDivs; i++) {
        for (let j = 0; j < numberOfDivs; j++) {
            let calculatedSize = getDesiredDivSize(numberOfDivs, gridDimensions);
            
            grid = addDiv(grid, calculatedSize);
        }
    }

    body.appendChild(grid);
}

function getDrawModeOption(){

}

// let numberOfDivs = getNumberOfDivs();
let numberOfDivs = 16;
populateGrid(numberOfDivs);

let isMouseDownTriggered = false;

// Code for if hover and drag mode is selected
window.addEventListener('mousedown', function(){
    isMouseDownTriggered = true;
});

window.addEventListener('mouseup', function(){
    isMouseDownTriggered = false;
});

window.addEventListener('mouseover', function (e) {
    console.log(e.target);
    if (isMouseDownTriggered === true) {
        e.target.style.backgroundColor = "white";
    }
});

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


