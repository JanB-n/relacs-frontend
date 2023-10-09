import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DataFrame, { Row } from 'dataframe-js';
import { ResponsiveScatterPlot} from '@nivo/scatterplot'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const MEASUREMENT_URL = '/measurement/';
const multiplier = 1e5;


export default function Measurement() {
    const [rows, setRows ] = useState([]);
    const [dataChiPrime, setDataChiPrime ] = useState([{id:1, data:[{}]}]);
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
      { field: "frequencylog", headerName: "FrequencyLog",  editable: false },
      
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
                        chibis: m['ChiBis'][key], frequency: m['Frequency'][key], chiprimemol: m['ChiPrimeMol'][key], chibismol: m['ChiBisMol'][key], 
                        omega: m['Omega'][key], omegalog: m['OmegaLog'][key], frequencylog: m['FrequencyLog'][key], hidden: m['Hidden'][key]} 
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

    const Charts = (json_data) => {
      if(Object.keys(json_data).length !== 0)
            {
              const m = json_data;
              var new_data = [{id: 1, data: []}]
              for(var key in m['ChiPrime'])
              {
                var r = {x: m['FrequencyLog'][key], y: m['ChiPrimeMol'][key] * multiplier}
                console.log(new_data[0]['data']);
                new_data[0]['data'].push(r);
              }
              setDataChiPrime(new_data);

              new_data = [{id: 7, data: []}]
              for(key in m['ChiBis'])
              {
                r = {x: m['FrequencyLog'][key], y: m['ChiBisMol'][key] * multiplier}
                new_data[0]['data'].push(r);
              }
              setDataChiBis(new_data);

              new_data = [{id: 10, data: []}]
              for(key in m['ChiPrime'])
              {
                r = {x: m['ChiPrimeMol'][key] * multiplier, y: m['ChiBisMol'][key] * multiplier}
                new_data[0]['data'].push(r);
              }
              setDataColeCole(new_data);
            }
    }
    const handleClick = (point) => {
        console.log(point);
    }
    useEffect(() => {
      getMeasurement();
    }, [])

    return (
    <>
      <h1>{measurement?.name}</h1>
      <ResponsiveContainer width="33%" height={400}>
        <ResponsiveScatterPlot
            data={dataChiPrime}
            borderColor="#000000"
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            xFormat=">-.2f"
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yFormat=">-.2f"
            blendMode="normal"
            colors={{ scheme: 'category10' }}
            useMesh={false}
            // nodeId={}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'weight',
                legendPosition: 'middle',
                legendOffset: 46
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'size',
                legendPosition: 'middle',
                legendOffset: -60
            }}
            onClick={handleClick}
        />
      </ResponsiveContainer>
      <ResponsiveContainer width="33%" height={400}>
        <ResponsiveScatterPlot
                data={dataChiBis}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                xScale={{ type: 'linear', min: 0, max: 'auto' }}
                xFormat=">-.2f"
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                yFormat=">-.2f"
                blendMode="normal"
                colors={{ scheme: 'category10' }}
                useMesh={false}
                // nodeId={}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'weight',
                    legendPosition: 'middle',
                    legendOffset: 46
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'size',
                    legendPosition: 'middle',
                    legendOffset: -60
                }}
                // legends={[
                //     {
                //         anchor: 'bottom-right',
                //         direction: 'column',
                //         justify: false,
                //         translateX: 130,
                //         translateY: 0,
                //         itemWidth: 100,
                //         itemHeight: 12,
                //         itemsSpacing: 5,
                //         itemDirection: 'left-to-right',
                //         symbolSize: 12,
                //         symbolShape: 'circle',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemOpacity: 1
                //                 }
                //             },
                //         ]
                //     }
                
                // ]}
                onClick={handleClick}
            />
      </ResponsiveContainer>
      <ResponsiveContainer width="33%" height={400}>
        <ResponsiveScatterPlot
                data={dataColeCole}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                xScale={{ type: 'linear', min: 0, max: 'auto' }}
                xFormat=">-.2f"
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                yFormat=">-.2f"
                blendMode="normal"
                colors={{ scheme: 'category10' }}
                useMesh={false}
                // nodeId={}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'weight',
                    legendPosition: 'middle',
                    legendOffset: 46
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'size',
                    legendPosition: 'middle',
                    legendOffset: -60
                }}
                // legends={[
                //     {
                //         anchor: 'bottom-right',
                //         direction: 'column',
                //         justify: false,
                //         translateX: 130,
                //         translateY: 0,
                //         itemWidth: 100,
                //         itemHeight: 12,
                //         itemsSpacing: 5,
                //         itemDirection: 'left-to-right',
                //         symbolSize: 12,
                //         symbolShape: 'circle',
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemOpacity: 1
                //                 }
                //             },
                //         ]
                //     }
                
                // ]}
                onClick={handleClick}
            />
      </ResponsiveContainer>
      <Box sx={{ height: 400, width: '80%' }}>
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
