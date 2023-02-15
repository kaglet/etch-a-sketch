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

// let numberOfDivs = getNumberOfDivs();
let numberOfDivs = 16;
populateGrid(numberOfDivs);