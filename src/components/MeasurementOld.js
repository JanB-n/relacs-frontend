import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DataFrame, { Row } from 'dataframe-js';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const MEASUREMENT_URL = '/measurement/'



export default function Measurement() {
    const [rows, setRows ] = useState([]);
    const [dataChiPrime, setDataChiPrime ] = useState([]);
    const [dataChiBis, setDataChiBis ] = useState([]);
    const [dataColeCole, setDataColeCole] = useState([]);
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
              var new_rows = []
              for(var key in m['Temperature'])
              {
                
                var r = {id: key, temperature: m['Temperature'][key], magneticfield: m['MagneticField'][key], chiprime: m['ChiPrime'][key], 
                        chibis: m['ChiBis'][key], frequency: m['Frequency'][key], chiprimemol: m['ChiPrimeMol'][key], 
                        chibismol: m['ChiBisMol'][key], omega: m['Omega'][key], omegalog: m['OmegaLog'][key], frequencylog: m['FrequencyLog'][key]} 
                new_rows.push(r);
              }
              setRows(new_rows);
              Charts(df_json);
            }
            
          });
          
      } catch(err){
          console.log(err);
      }
    }

    const Charts = (data) => {
      if(Object.keys(data).length !== 0)
            {
              const m = data;
              var new_rows = []
              for(var key in m['ChiPrime'])
              {
                var r = {id: key, frequencylog: m['FrequencyLog'][key], chiprimemol: m['ChiPrimeMol'][key]}
                new_rows.push(r);
              }
              setDataChiPrime(new_rows);

              var new_rows = []
              for(var key in m['ChiBis'])
              {
                var r = {id: key, frequencylog: m['FrequencyLog'][key], chibismol: m['ChiBisMol'][key]}
                new_rows.push(r);
              }
              setDataChiBis(new_rows);

              var new_rows = []
              for(var key in m['ChiPrime'])
              {
                var r = {id: key, chiprimemol: m['ChiPrimeMol'][key], chibismol: m['ChiBisMol'][key]}
                new_rows.push(r);
              }
              setDataColeCole(new_rows);
            }
    }
  
    useEffect(() => {
      getMeasurement();
    }, [])

    return (
    <>
      <h1>{measurement?.name}</h1>
      <ResponsiveContainer width="33%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="frequencylog" name="stature"/>
          <YAxis type="number" dataKey="chiprimemol" name="weight" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={dataChiPrime} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="33%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="frequencylog" name="stature"/>
          <YAxis type="number" dataKey="chibismol" name="weight"  />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={dataChiBis} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="33%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="chiprimemol" name="stature"/>
          <YAxis type="number" dataKey="chibismol" name="weight" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={dataColeCole} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
      <Box sx={{ height: 400, width: '70%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          
          initialState={{
            pagination: {
              // paginationModel: {
              //   pageSize: 10,
              // },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
    </Box>
    <Button>Delete selected measurements</Button>
    
    </>
    );
}
