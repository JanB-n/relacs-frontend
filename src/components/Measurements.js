import { useEffect, useState } from 'react'
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Dataframe from "dataframe-js"
import Box from '@mui/material/Box';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddMeasurements from './AddMeasurements';
import {useNavigate} from 'react-router-dom';

const MEASUREMENTS_URL = "/measurements/"
const MEASUREMENT_URL = "/measurement/"

export default function Measurements({ id, compoundName = '   ' }) {

  const VISIBLE_FIELDS = ['name'];
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

  // const newcolumns = React.useMemo(
  //   () => columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
  //   [columns],
  // );
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [df, setDf] = useState()
  const { axiosPrivate } = useAxiosPrivate();
  const [measurements, setMeasurements] = useState();
  const [editedMeasurements, setEditedMeasurements] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const handleRowClick = (params) => {
    navigate(`/compounds/` + id + '/' + params.row.name?.replaceAll(':', '__').replaceAll('.', '--'));
  }

  const handleDelete = (e) => {
    try {
      for (var selected_id of selectedRows) {
          for(var row of rows){
            if(selected_id == row.id){
              const response = axiosPrivate.delete(MEASUREMENT_URL, { params: { measurement_name: row.name, comp_id: id } }).then(res => {
                getMeasurements();
              });
            }
          }
        
      }

    } catch (err) {
      console.log(err);
    }
  }

  const getMeasurements = (e) => {
    try {
      const response = axiosPrivate.get(MEASUREMENTS_URL, { params: { id: id } }).then(res => {

        setMeasurements(res.data.measurements);
        setCurrentUser(res.data.currentUser);
        setIsUserAdmin(res.data.isUserAdmin);
        var names = []
        var i = 1;
        var edited = []
        for (var measurement of res.data.measurements) {
          names.push({ id: i, name: measurement.name });
          if(measurement?.edited == true){
            edited.push(i);
          }
          i += 1;
        }
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
      {isUserAdmin ? <div className="row">
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <AddMeasurements id={id} />
        </div>
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button style={{backgroundColor: '#663300', borderColor: '#663300'}} onClick={handleDelete}> Delete selected measurement groups </Button>
        </div>
        <div className="column" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button style={{backgroundColor: '#663300', borderColor: '#663300'}} onClick={getMeasurements}> Refresh </Button>
        </div>
      </div> : null}
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
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterValues: [''],
                  },
                },
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

            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            
            slots={{ toolbar: GridToolbar }}
            slotProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            showQuickFilter: true,
            },
        }}
          />
        </Box>
      </div>


    </>
  );
}