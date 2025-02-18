import { tangoBoard } from "./tangoGame/board.js"
import { levels } from "./tangoGame/levelsData.js";
import { parseStringToTango } from "./tangoGame/parser.js"

export class canvasBoard
{
    constructor(data)
    {
        this.context = {
            "background": document.getElementById("background").getContext("2d"),
            "errorBackground": document.getElementById("errorBackground").getContext("2d"),
            "board": document.getElementById("board").getContext("2d"),
            "grid": document.getElementById("grid").getContext("2d")
        };

        this.moon = new Image();
        this.moon.src = "./assets/moon.png";

        this.banana = new Image();
        this.banana.src = "./assets/banana.png";

        this.errorImg = new Image();
        this.errorImg.src = "./assets/error.png";

        this.tangoBoard = new tangoBoard(data);
        this.tangoBoard.resetBoard();

        this.squareSize = 75;

        this.winScreen = document.getElementById('win');
        
    }

    drawSquare(x, y, value)
    {
        this.context['board'].clearRect(
            x*this.squareSize, 
            y*this.squareSize, 
            this.squareSize, 
            this.squareSize
        );

        if (value != 0)
        {
            this.context['board'].drawImage(
                value == 1 ? this.banana : this.moon, 
                x*this.squareSize, 
                y*this.squareSize, 
                this.squareSize, 
                this.squareSize
            );
        }
    }

    clickOnBoard(x, y)
    {
        const error = this.tangoBoard.clickSquare(x, y);
        if (error == 404)
        {
            return;
        }
        this.drawSquare(x, y, error);
        const winCon = this.tangoBoard.checkBoard();
        if (winCon['won?'])
        {
            this.drawErrors(winCon['errors']);
            this.winScreen.style.display = 'block'
            return;
        }
        else
        {
            this.drawErrors(winCon['errors']);
        }



    }

    drawGridLines()
    {
        const grid = this.context['grid'];
        grid.clearRect(0, 0, this.squareSize*6, this.squareSize*6)
        for (let i = 1; i < 6; i++)
        {
            grid.moveTo(i*this.squareSize, 0);
            grid.lineTo(i*this.squareSize, this.squareSize*6);

            grid.moveTo(0, this.squareSize*i);
            grid.lineTo(this.squareSize*6, i*this.squareSize);

            grid.stroke();
        }

        const multiplication = this.tangoBoard.data['multiply'];
        for (let f = 0; f < multiplication.length; f++)
        {
            const multiplySquares = multiplication[f];

            const columnBool = (multiplySquares[0][0] == multiplySquares[1][0]);
            const maxValue = columnBool ? Math.max(multiplySquares[0][1], multiplySquares[1][1]) : Math.max(multiplySquares[0][0], multiplySquares[1][0]);
            const xPos = columnBool ? this.squareSize*(multiplySquares[0][0] + 0.5) : maxValue*this.squareSize;
            const yPos = columnBool ? maxValue*this.squareSize : this.squareSize*(multiplySquares[0][1] + 0.5);
            grid.clearRect(xPos - 10, yPos - 10, 20, 20);
            grid.font = "20px Arial";
            grid.fillText("x", xPos - 5, yPos + 5);
        }

        const equality = this.tangoBoard.data['equal'];
        for (let f = 0; f < equality.length; f++)
        {
            const equalSquares = equality[f];

            const columnBool = (equalSquares[0][0] == equalSquares[1][0]);
            const maxValue = columnBool ? Math.max(equalSquares[0][1], equalSquares[1][1]) : Math.max(equalSquares[0][0], equalSquares[1][0]);
            const xPos = columnBool ? this.squareSize*(equalSquares[0][0] + 0.5) : maxValue*this.squareSize;
            const yPos = columnBool ? maxValue*this.squareSize : this.squareSize*(equalSquares[0][1] + 0.5);
            grid.clearRect(xPos - 10, yPos - 10, 20, 20);
            grid.font = "20px Arial";
            grid.fillText("=", xPos - 6, yPos + 7);
        }
    }

    initBoard()
    {

        this.context['board'].clearRect(0, 0, this.squareSize*6, this.squareSize*6);
        this.context['background'].clearRect(0, 0, this.squareSize*6, this.squareSize*6);
        this.tangoBoard.resetBoard();
        const filledInitSquares = this.tangoBoard.data['setSquares'];
        for (let t = 0; t < filledInitSquares.length; t++)
        {
                const dummyPoints = filledInitSquares[t];
                this.drawSquare(dummyPoints[0], dummyPoints[1], dummyPoints[2]);
                this.context['background'].fillStyle = '#e1e1e1';
                this.context['background'].fillRect(
                    dummyPoints[0]*this.squareSize, 
                    dummyPoints[1]*this.squareSize, 
                    this.squareSize, 
                    this.squareSize);
        };
    }

    drawErrors(errorList)
    {
        this.context['errorBackground'].clearRect(0, 0, this.squareSize*6, this.squareSize*6);
        /* data structure of errors
        [{
            direction: column/row
            location: number
        }]
        */
        for (let p = 0; p < errorList.length; p++)
        {
            const error = errorList[p];
            const columnBool = (error['direction'] == 'column');
            for (let q = 0; q < 6; q++)
            {
                this.context['errorBackground'].drawImage(
                    this.errorImg,
                    columnBool ? error['location']*this.squareSize : q*this.squareSize,
                    !columnBool ? error['location']*this.squareSize : q*this.squareSize,
                    this.squareSize,
                    this.squareSize
                );
            };
        };
    }

}

function randomLevel()
{
    return parseStringToTango(levels[Math.floor(Math.random()*levels.length)])
}

function main()
{
    let tangoGame = new canvasBoard(randomLevel());
    tangoGame.banana.onload = () => {
        tangoGame.initBoard();
        tangoGame.drawGridLines();
    }

    document.getElementById("grid").addEventListener('click', (event) => {
        const xCoords = Math.floor(event.offsetX / tangoGame.squareSize);
        const yCoords = Math.floor(event.offsetY / tangoGame.squareSize);
        tangoGame.clickOnBoard(xCoords, yCoords)
    });
    
    document.getElementById("close").addEventListener('click', (event) => {
        tangoGame.winScreen.style.display = 'none';
    });

    document.getElementById("clear").addEventListener('click', (event) => {
        tangoGame.initBoard();
        tangoGame.context['errorBackground'].clearRect(0, 0, tangoGame.squareSize*6, tangoGame.squareSize*6);
    });

    document.getElementById("newGame").addEventListener('click', (event) => {
        tangoGame.context['errorBackground'].clearRect(0, 0, tangoGame.squareSize*6, tangoGame.squareSize*6);
        tangoGame = new canvasBoard(randomLevel())
        tangoGame.initBoard();
        tangoGame.drawGridLines();
    });
    
}

window.onload = () => {
    main()
}