import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Dataframe from "dataframe-js"
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
const MEASUREMENTS_URL = "/measurements/"
const MEASUREMENT_URL = "/measurement/"

export default function Measurements({id}) {

  const columns = [
    {
      field: "id",
      headerName: "Name",
      width: 500,
      renderCell: (params) => {
       //return  (<a href="${params.getValue('id')}">${params.getValue("id")}</a>);
       return  (
        <>
        <Link to={`/compounds/` + id +'/' + params.id?.replaceAll(':', '__').replaceAll('.', '-')}>
            <Button>{params.id}</Button>
        </Link>
        </>
       );
      }
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [df, setDf] = useState()
  const { axiosPrivate } = useAxiosPrivate();
  const [measurements, setMeasurements] = useState();

  // const deleteMeasurements = (e) => {
  //   try{
  //     const response = axiosPrivate.delete(MEASUREMENTS_URL,  { params: { id: id }}).then(res => {
  //       getMeasurements();

  //     });
      
  //   } catch(err){
  //       console.log(err);
  //   }
  // }
  const handleDelete = (e) => {
    try{
      for(var measurement_name of selectedRows)
      {
        const response = axiosPrivate.delete(MEASUREMENT_URL, { params: { measurement_name: measurement_name, comp_id: id }}).then(res => {
          getMeasurements();
        });
      }
      
    } catch(err){
        console.log(err);
    }
  }

  const getMeasurements = (e) => {
    try{
        const response = axiosPrivate.get(MEASUREMENTS_URL, { params: { id: id }} ).then(res => {
          
          setMeasurements(res.data);
          var names = []
          // console.log(parsed_data);
          // JSON.parse(res.data).forEach((entry) => {
          //   const [key, value] = entry;
          //   console.log(`${key}: ${value}`);
          // })
          for (var measurement of res.data)
          {
            names.push({id: measurement.name});
          }
          setRows(names);
        });
        
    } catch(err){
        console.log(err);
    }
  }

  useEffect(() => {
    getMeasurements();
  }, [])

  const handleChecked = (ids) => {
    setSelectedRows(ids);
  }
  

  return (
    <>
    <Button onClick={handleDelete}> Delete selected measurement groups </Button>
    <Button onClick={getMeasurements}> Refresh </Button>
    <Box sx={{ height: 700, width: '100%' }}>
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
        onRowSelectionModelChange={handleChecked}
      />
    </Box>
    {/* <div>{measurements}</div> */}
    
      
    </>
  );
}