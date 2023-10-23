import { useEffect, useState } from 'react'
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Compound from './Compound';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridToolbar } from '@mui/x-data-grid';
import NewCompound from './NewCompound';
import {useNavigate} from 'react-router-dom';

const Compounds_URL = "/compounds/";
const SharedCompounds_URL = "/sharedcompounds/";

export default function Compounds() {

  const navigate = useNavigate();
  const { axiosPrivate } = useAxiosPrivate();
  const [compounds, setCompounds] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [compoundsJson, setCompoundsJson] = useState({});
  const [sharedCompounds, setSharedCompounds] = useState([]);

  const VISIBLE_FIELDS = ['name'];
  const columns = [
    { 
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      headerClassName: 'headerRowCheck',
      
    },
    {
      field: "name",
      headerName: "Compound name",
      headerClassName: 'headerRow',
      flex: 1,
      // renderCell: (params) => {
      //   return (
      //     <>
      //       <Link to={`/compounds/` + params.id}>
      //         <Button>{params.value}</Button>
      //       </Link>
      //     </>
      //   );
      // }
    },
  ];

  const getData = (e) => {
    try {
      const response = axiosPrivate.get(Compounds_URL).then(res => {
        var data = res.data;
        setCompounds(data);
        var new_rows = [];
        var shared = [];
        for (var compound of data) {
          new_rows.push({ id: compound['_id']['$oid'], name: compound.name });
          if(compound?.shared == 1){
            shared.push(compound['_id']['$oid']);
          }
        }
        setRows(new_rows);
        setSharedCompounds(shared);
      });

    } catch (err) {
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
    var jsonFile = { "version": 2.1, "compounds": [] }
    for (var id of ids) {
      for (var compound of compounds) {
        if (compound['_id']['$oid'] == id) {
          compound["f1_fits"] = [];
          compound["f2_fits"] = [];
          compound["tau_fits"] = [];
          for (var measurement of compound['measurements']) {
            measurement['tmp'] = measurement['temp'];
          }
          jsonFile["compounds"].push(compound);
        }
      }
    }
    setCompoundsJson(jsonFile);

  }

  const handleRowClick = (params) => {
    navigate(`/compounds/` + params.id);
  }

  const handleDelete = (e) => {
    try {
      for (var id of selectedRows) {
        const response = axiosPrivate.delete(Compounds_URL, { params: { id: id } }).then(res => {
          getData();
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  const shareCompounds = () => {
    try {
      for (var id of selectedRows) {
        
        const response = axiosPrivate.put(SharedCompounds_URL, { id: id } ).then(res => {
          getData();
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="row">
        <div className="column" style={{width: '25%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <NewCompound />
        </div>
        <div className="column" style={{width: '25%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button onClick={shareCompounds}>Share/Unshare selected compounds</Button>
        </div>
        <div className="column" style={{width: '25%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(compoundsJson)
            )}`}
            download="relacs_measurements.json"
          >
            {`Download selected compounds as JSON`}
          </Button>
        </div>
        <div className="column" style={{width: '25%', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
          <Button onClick={handleDelete}>Delete selected compounds</Button>
        </div>
      </div>
      <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
        <Box sx={{ height: 700, width: '100%', marginTop: '10px'}}>
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
            getRowClassName={(params) => {
              const ids = sharedCompounds;
              if(ids.includes(params.id)){
                return `compoundsShared`
              }
              else
                return ``
            }}
            localeText={{ noRowsLabel: "" }}
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
            }
          }}
          />
        </Box>
      </div>
    </>
  );
}

