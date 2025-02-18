

export class tangoBoard
{
    constructor(data)
    {
        /* structure of data
        {
            multiply: [[points]],
            equal: [points],
            setSquares: [points + value]
        }
        points = [x. y]
        points + value = [x, y, value either 1 or -1]
        */
        this.data = data;

        this.grid = [];
        // [x, y, 1/-1]
        this.fixedPoints = [];
        
    }

    resetBoard()
    {
        const dummyGrid = []
        const dummyRow = [];

        for (let i = 0; i < 6; i++)
        {
            dummyRow.push(0);
        };
        
        for (let j = 0; j < 6; j++)
        {
            dummyGrid.push([...dummyRow]);
        };

        this.grid = [...dummyGrid];

        const initialFilledSquares = this.data['setSquares']

        for (let k = 0; k < initialFilledSquares.length; k++)
        {
            const dummyCoordsPoints = initialFilledSquares[k]; // [x, y, 1/-1]
            this.grid[dummyCoordsPoints[1]][dummyCoordsPoints[0]] = dummyCoordsPoints[2];
            this.fixedPoints.push([dummyCoordsPoints[0], dummyCoordsPoints[1]]);
        }

    }

    _checkDirectionCount(dir, loc)
    {
        let counter = 0;
        const columnBool = (dir == 'column')
    
        for (let i = 0; i < 6; i++)
        {
            counter += Math.abs(this.grid[columnBool ? i : loc][!columnBool ? i : loc]);
        };
        return counter;
    }

    checkBoard()
    {
        const errorList = [];
        let filledSquaresCounter = 0;

        // checks if the rows, columns are filled and balanced
        for (let i = 0; i < 6; i++)
        {
            let verticalCounter = 0;
            let verticalBalanceCounter = 0;

            let horizontalCounter = 0;
            let horizontalBalanceCounter = 0;

            for (let j = 0; j < 6; j++)
            {
                verticalCounter += Math.abs(this.grid[j][i]);
                verticalBalanceCounter += this.grid[j][i];

                horizontalCounter += Math.abs(this.grid[i][j]);
                horizontalBalanceCounter += this.grid[i][j];
                // TODO ADD A NO MORE THAN 2 RULE
                if ( (j + 2 < 6) && (this.grid[i][j] == this.grid[i][j + 1]) && (this.grid[i][j + 1] == this.grid[i][j + 2]) && (this.grid[i][j] != 0) )
                {
                    errorList.push({"direction": "row", "location": i});
                };

                if ( (i + 2 < 6) && (this.grid[i][j] == this.grid[i + 1][j]) && (this.grid[i + 1][j] == this.grid[i + 2][j]) && (this.grid[i][j] != 0) )
                {
                    errorList.push({"direction": "column", "location": j});
                };
            };

            filledSquaresCounter += (horizontalCounter + verticalCounter);

            if (verticalCounter == 6 && verticalBalanceCounter != 0)
            {
                errorList.push({"direction": "column", "location": i});
            }
            if (horizontalCounter == 6 && horizontalBalanceCounter != 0)
            {
                errorList.push({"direction": "row", "location": i});
            }
        };

        // Checks for the multiplication 
        const multiplicationSquares = this.data['multiply']

        for (let m = 0; m < multiplicationSquares.length; m++)
        {
            const dummyCoords = multiplicationSquares[m] // [ [x1, y1], [x2, y2] ]

            if (this.grid[dummyCoords[0][1]][dummyCoords[0][0]] * this.grid[dummyCoords[1][1]][dummyCoords[1][0]] != -1)
            {
                if (dummyCoords[0][0] == dummyCoords[1][0] && (this._checkDirectionCount('column', dummyCoords[0][0]) == 6))
                {
                    errorList.push({"direction": "column", "location": dummyCoords[0][0]});
                }
                else if (this._checkDirectionCount('row', dummyCoords[0][1]) == 6)
                {
                    errorList.push({"direction": "row", "location": dummyCoords[0][1]});
                }
            }
        }

        // checks for equality
        const equalitySquares = this.data['equal']
        for (let m = 0; m < equalitySquares.length; m++)
        {
            const dummyCoords = equalitySquares[m]
            if (this.grid[dummyCoords[0][1]][dummyCoords[0][0]] != this.grid[dummyCoords[1][1]][dummyCoords[1][0]])
            {
                if (dummyCoords[0][0] == dummyCoords[1][0])
                {
                    errorList.push({"direction": "column", "location": dummyCoords[0][0]});
                }
                else
                {
                    errorList.push({"direction": "row", "location": dummyCoords[0][1]});
                }
            }
    
        }

        return {
            "won?": (filledSquaresCounter + errorList.length) == 72 ? true : false,
            "errors": errorList
        }
    }

    clickSquare(x, y)
    {
        for (let l = 0; l < this.fixedPoints.length; l++)
        {
            const point = this.fixedPoints[l]
            if (point[0] == x && point[1] == y)
            {
                return 404;
            };
        }
        if (this.grid[y][x] == -1)
        {
            this.grid[y][x] = 0;
        }
        else
        {
            this.grid[y][x] = (this.grid[y][x] == 0) ? 1 : this.grid[y][x]*-1;
        }
        
        return this.grid[y][x];
    }

}
