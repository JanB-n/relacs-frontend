import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Dataframe from "dataframe-js"
import Box from '@mui/material/Box';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddMeasurements from './AddMeasurements';
import {useNavigate} from 'react-router-dom';

const MEASUREMENTS_URL = "/measurements/"
const MEASUREMENT_URL = "/measurement/"

export default function Measurements({ id, compoundName = '   ' }) {

  const columns = [
    { 
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      headerClassName: 'headerRowCheck',
      
    },
    {
      field: "name",
      headerName: "Clustered measurements (" + compoundName + ")",
      headerClassName: 'headerRow',
      flex: 1,
    },
  ];
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [df, setDf] = useState()
  const { axiosPrivate } = useAxiosPrivate();
  const [measurements, setMeasurements] = useState();
  const [editedMeasurements, setEditedMeasurements] = useState();

  const handleRowClick = (params) => {
    navigate(`/compounds/` + id + '/' + params.row.name?.replaceAll(':', '__').replaceAll('.', '--'));
  }

  const handleDelete = (e) => {
    try {
      for (var measurement_name of selectedRows) {
        const response = axiosPrivate.delete(MEASUREMENT_URL, { params: { measurement_name: measurement_name, comp_id: id } }).then(res => {
          getMeasurements();
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  const getMeasurements = (e) => {
    try {
      const response = axiosPrivate.get(MEASUREMENTS_URL, { params: { id: id } }).then(res => {

        setMeasurements(res.data);
        var names = []
        var i = 1;
        var edited = []
        for (var measurement of res.data) {
          names.push({ id: i, name: measurement.name });
          if(measurement?.edited == true){
            edited.push(i);
          }
          i += 1;
        }
        console.log(edited);
        setEditedMeasurements(edited);
        setRows(names);
      });

    } catch (err) {
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
      <div className="row">
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <AddMeasurements id={id} />
        </div>
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button style={{backgroundColor: '#663300', borderColor: '#663300'}} onClick={handleDelete}> Delete selected measurement groups </Button>
        </div>
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button style={{backgroundColor: '#663300', borderColor: '#663300'}} onClick={getMeasurements}> Refresh </Button>
        </div>
      </div>
      <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <Box sx={{ height: 700, width: '100%', marginTop: '10px' }}>
          <DataGrid
            sx={{'& .MuiDataGrid-columnHeaderTitleContainerContent': {overflow: 'initial'}, 
            '& .MuiDataGrid-columnHeaderTitle': {'fontWeight': 'bold'},
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }}}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            localeText={{ noRowsLabel: "" }}
            getRowClassName={(params) => {
              const ids = editedMeasurements;
              if(ids.includes(parseInt(params.id))){
                return `measurementsEdited`
              }
              else
                return ``
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleChecked}
            onRowClick={handleRowClick}
          />
        </Box>
      </div>


    </>
  );
}