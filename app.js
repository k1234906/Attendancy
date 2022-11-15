
import express from  'express';
import database from './database.js';

// Express app configuration------------------
const app = new express();

//Configure middleware------------------------

//Controllers--------------------------------
const modulesController = async (req, res) => 
{
    const table ='class';
    const fields = ['moduleName','classTypesNames','classRoomNumber','date','time'];
    const extendedTable = `${table} 
    LEFT JOIN attendanceTable ON class.attendanceTableId = attendanceTable.attendanceTableID
    LEFT JOIN modules ON class.modulesID = modules.modulesID 
    LEFT JOIN classRoom ON class.classRoomID = classRoom.classRoomID 
    LEFT JOIN classTypes ON class.classTypesID = classTypes.classTypesID 
    WHERE date='2022,09,28' 
    AND modules.modulesID=1`;
    const extendedFields = `${fields}`;
    const sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
    

    let isSuccess = false;
    let message = "";
    let result = null;
try {
    [result] = await database.query(sql);
    if (result.length === 0) message = 'No record(s) found';
        else
            {
            isSuccess = true;
            message = 'Record(s) successfully recovered';
            }
    }   
catch (error)
    {
        message = `Failed to execute query: ${error.message}`;
    }
    
    isSuccess
    ? res.status(200).json(result) : res.status(400).json({message});
};

//endpoints---------------------------------
app.get('/api/class', modulesController);

// Start server-----------------------------
const PORT = process.env.PORT || 5002;
app.listen(PORT,() => console.log(`Server started on port ${PORT}`)); 