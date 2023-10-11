import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Compound from './Compound';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import NewCompound from './NewCompound';

const Compounds_URL="/compounds/"

export default function Compounds() {    

    const { axiosPrivate } = useAxiosPrivate();
    const [compounds, setCompounds] = useState([]);
    const [rows, setRows ] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [compoundsJson, setCompoundsJson] = useState({});

    const columns = [
      {
        field: "name",
        headerName: "Name",
        width: 500,
        renderCell: (params) => {
         return  (
          <>
          <Link to={`/compounds/` + params.id}>
              <Button>{params.value}</Button>
          </Link>
          </>
         );
        }
      },
    ];

    const getData = (e) => {
      try{
          const response = axiosPrivate.get(Compounds_URL).then(res => {
            var data = res.data;
            console.log(data);
            setCompounds(data);
            var new_rows = [];
            for(var compound of data)
            {
              new_rows.push({id: compound['_id']['$oid'], name: compound.name});
            }
            setRows(new_rows);

          });
          
      } catch(err){
          console.log(err);
      }
    }
    
    useEffect(() => {
     getData();
    }, [])

    const handleChecked = (ids) => {
      setSelectedRows(ids);
      prepareJson(ids);
    }

    const prepareJson = (ids) => {
      var jsonFile = {"version": 2.1, "compounds": [] }
      for(var id of ids)
      {
        for(var compound of compounds)
        {
          if(compound['_id']['$oid'] == id)
          {
            compound["f1_fits"] = [];
            compound["f2_fits"] = [];
            compound["tau_fits"] = [];
            for(var measurement of compound['measurements'])
            {
              measurement['tmp'] = measurement['temp'];
            }
            console.log(compound);
            jsonFile["compounds"].push(compound);
          }
        }
      }
      console.log(jsonFile);
      setCompoundsJson(jsonFile);

    }

    const handleDelete = (e) => {
      try{
        for(var id of selectedRows)
        {
          const response = axiosPrivate.delete(Compounds_URL, { params: { id: id }}).then(res => {
            getData();
          });
        }
        
    } catch(err){
        console.log(err);
    }
    }

    return (
    <>
      <NewCompound />
      <Button onClick={handleDelete}>Delete selected compounds</Button>
      <Button
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(compoundsJson)
            )}`}
            download="relacs_measurements.json"
          >
            {`Download selected compounds as JSON`}
          </Button>
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
    </> 
    );
  }

