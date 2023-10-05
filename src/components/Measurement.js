import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DataFrame, { Row } from 'dataframe-js';

const MEASUREMENT_URL = '/measurement/'



export default function Measurement() {
    const [rows, setRows ] = useState([]);
    const [measurement, setMeasurement] = useState();
    const { c_id, m_id } = useParams();
    const { axiosPrivate } = useAxiosPrivate();

    const columns = [
      { field: "temperature", headerName: "Temperature", editable: false },
      { field: "magneticfield", headerName: "MagneticField", editable: false },
      { field: "chiprime", headerName: "ChiPrime",  editable: false },
      { field: "chibis", headerName: "ChiBis",  editable: false },
      { field: "frequency", headerName: "Frequency",  editable: false },
      { field: "chiprimemol", headerName: "ChiPrimeMol",  editable: false },
      { field: "chibismol", headerName: "ChiBisMol",  editable: false },
      { field: "omega", headerName: "Omega",  editable: false },
      { field: "omegalog", headerName: "OmegaLog",  editable: false },
      { field: "frequencylog", headerName: "FrequencyLog", width: 200,  editable: false },
    ]

    const getMeasurement = (e) => {
      try{
          const response = axiosPrivate.get(MEASUREMENT_URL, { params: { c_id: c_id, m_id: m_id }} ).then(res => {
            setMeasurement(res.data);
            const df_json = JSON.parse(res.data.df);
            if(Object.keys(df_json).length !== 0)
            {
              const m = df_json;
              console.log(typeof(m));
              var new_rows = []
              for(var key in m['Temperature'])
              {
                
                var r = {id: key, temperature: m['Temperature'][key], magneticfield: m['Temperature'][key], chiprime: m['Temperature'][key], 
                        chibis: m['Temperature'][key], frequency: m['Temperature'][key], chiprimemol: m['Temperature'][key], 
                        chibismol: m['Temperature'][key], omega: m['Temperature'][key], omegalog: m['Temperature'][key], frequencylog: m['Temperature'][key]}
                console.log(r);
                new_rows.push(r);
              }
              console.log(new_rows);
              setRows(new_rows);
            }
            
          });
          
      } catch(err){
          console.log(err);
      }
    }
  
    useEffect(() => {
      getMeasurement();
    }, [])

    return (
    <>
      <h1>{measurement?.name}</h1>
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </>
    );
}
