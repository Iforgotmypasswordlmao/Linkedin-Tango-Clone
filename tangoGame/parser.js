


export function parseStringToTango(stringData)
{
    /*
    string data -> 01x00;02=12;01m;23b;
    */
    const tangoBoardData = {
        'multiply': [],
        'equal': [],
        'setSquares': []
    };
    const validDigits = ['0', '1', '2', '3', '4', '5', 'x', '=', 'b', 'm'];
    const boardDataLocation = stringData.split(";");
    for (let i = 0; i < boardDataLocation.length; i++)
    {
        const point = boardDataLocation[i];
        for (let letter = 0; letter < point.length; letter++)
        {
            if (!validDigits.includes(point[letter]))
            {
                throw new Error(`String contains invalid digit ${point[letter]}`)
            }
        }
        if (point.length == 3)
        {
            tangoBoardData['setSquares'].push([
                Number(point[0]), Number(point[1]), (point[2] == 'b') ? 1 : -1
            ])
        }
        else if (point.length == 5)
        {
            const firstPoint = [Number(point[0]), Number(point[1])]
            const secondPoint = [Number(point[3]), Number(point[4])]
            const differenceOfX = Math.abs(firstPoint[0] - secondPoint[0])
            const differenceOfY = Math.abs(firstPoint[1] - secondPoint[1])
            if(!(differenceOfX != 0 || differenceOfX != 1) && !(differenceOfY != 0 || differenceOfY != 1))
            {
                throw new Error(`Points must be adjacent to each other: ${point}`)
            }
            tangoBoardData[(point[2] == 'x') ? 'multiply' : 'equal'].push([firstPoint, secondPoint])
        }
        else
        {
            throw new Error(`String must be 3 or 5 letters long: ${point}`)
        }


    };
    return tangoBoardData;
}

