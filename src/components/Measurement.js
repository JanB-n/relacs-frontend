import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DataFrame, { Row } from 'dataframe-js';
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Latex from 'react-latex';


const MEASUREMENT_URL = '/measurement/';
const multiplier = 1e5;


export default function Measurement() {
  const [rows, setRows] = useState([]);
  const [dataChiPrime, setDataChiPrime] = useState([{ id: 1, data: [{}] }]);
  const [dataChiBis, setDataChiBis] = useState([]);
  const [dataColeCole, setDataColeCole] = useState([]);
  const [measurement, setMeasurement] = useState();
  const { c_id, m_id } = useParams();
  const { axiosPrivate } = useAxiosPrivate();

  const columns = [
    { field: "temperature", headerName: "Temperature", width: 120, editable: false },
    { field: "magneticfield", headerName: "MagneticField", width: 120, editable: false },
    { field: "chiprime", headerName: "ChiPrime", width: 120, editable: false },
    { field: "chibis", headerName: "ChiBis", width: 120, editable: false },
    { field: "frequency", headerName: "Frequency", width: 120, editable: false },
    { field: "chiprimemol", headerName: "ChiPrimeMol", width: 120, editable: false },
    { field: "chibismol", headerName: "ChiBisMol", width: 120, editable: false },
    { field: "omega", headerName: "Omega", width: 120, editable: false },
    { field: "omegalog", headerName: "OmegaLog", width: 120, editable: false },
    { field: "frequencylog", headerName: "FrequencyLog", width: 120, editable: false },
    // { field: "hidden", headerName: "isHidden?",  editable: false },

  ]

  const getMeasurement = (e) => {
    try {
      const response = axiosPrivate.get(MEASUREMENT_URL, { params: { c_id: c_id, m_id: m_id } }).then(res => {
        setMeasurement(res.data);
        const df_json = JSON.parse(res.data.df);
        if (Object.keys(df_json).length !== 0) {
          const m = df_json;
          var new_rows = []
          for (var key in m['Temperature']) {

            var r = {
              id: key, temperature: m['Temperature'][key], magneticfield: m['MagneticField'][key], chiprime: m['ChiPrime'][key],
              chibis: m['ChiBis'][key], frequency: m['Frequency'][key], chiprimemol: m['ChiPrimeMol'][key], chibismol: m['ChiBisMol'][key],
              omega: m['Omega'][key], omegalog: m['OmegaLog'][key], frequencylog: m['FrequencyLog'][key], hidden: m['Hidden'][key]
            }
            new_rows.push(r);
          }
          setRows(new_rows);
          Charts(df_json);
        }

      });

    } catch (err) {
      console.log(err);
    }
  }

  const Charts = (json_data) => {
    if (Object.keys(json_data).length !== 0) {
      const m = json_data;
      var new_data = [{ id: 1, data: [] }, { id: 4, data: [] }]
      for (var key in m['ChiPrime']) {
        var r = { x: m['FrequencyLog'][key], y: m['ChiPrimeMol'][key] * multiplier }
        new_data[0]['data'].push(r);
      }
      setDataChiPrime(new_data);

      new_data = [{ id: 2, data: [] }, { id: 5, data: [] }]
      for (key in m['ChiBis']) {
        r = { x: m['FrequencyLog'][key], y: m['ChiBisMol'][key] * multiplier }
        new_data[0]['data'].push(r);
      }
      setDataChiBis(new_data);

      new_data = [{ id: 3, data: [] }, { id: 6, data: [] }]
      for (key in m['ChiPrime']) {
        r = { x: m['ChiPrimeMol'][key] * multiplier, y: m['ChiBisMol'][key] * multiplier }
        new_data[0]['data'].push(r);
      }
      setDataColeCole(new_data);
    }
  }

  const findIndexOfElement = (element, array) => {
    for (var i = 0; i < array.length; ++i) {
      if (array[i]['x'] == element) {
        return i;
      }
    }
    return -1;
  }

  const deleteMeasurements = (e) => {
    var newChiPrime = [...dataChiPrime];
    const dataToDitch = newChiPrime[1]['data'];
    var newDf = JSON.parse(measurement.df);
    var indexesToRemove = []
    for (var dmeas of dataToDitch) {
      for (const [key, value] of Object.entries(newDf['Frequency'])) {
        if (dmeas['x'] == newDf['FrequencyLog'][key]) {

          indexesToRemove.push(key);
        }
      }
    }
    for (var index of indexesToRemove) {
      delete newDf['Temperature'][index];
      delete newDf['MagneticField'][index];
      delete newDf['ChiPrime'][index];
      delete newDf['ChiBis'][index];
      delete newDf['Frequency'][index];
      delete newDf['ChiPrimeMol'][index];
      delete newDf['ChiBisMol'][index];
      delete newDf['Omega'][index];
      delete newDf['OmegaLog'][index];
      delete newDf['FrequencyLog'][index];
      delete newDf['Hidden'][index];
    }
    newDf = JSON.stringify(newDf);
    try {
      const response = axiosPrivate.put(MEASUREMENT_URL, { c_id: c_id, m_id: measurement?.name, newDf: newDf },
        {
          headers: { 'Content-Type': 'application/json' }

          //withCredentials: true
        }).then(res => {
          getMeasurement();

        });
    } catch (err) {

    }
  }

  const handleChartClick = (point) => {
    var newChiPrime = [...dataChiPrime];
    var newChiBis = [...dataChiBis];
    var newColeCole = [...dataColeCole];
    var arr_rm;
    var arr_add;
    if (point['serieId'] <= 3) {
      arr_rm = 0;
      arr_add = 1;
    }
    else {
      arr_rm = 1;
      arr_add = 0;
    }
    var frequency;
    var chiPrime;
    var chiBis;
    if (point['serieId'] == 1 || point['serieId'] == 4) {
      frequency = point['xValue'];
      chiPrime = point['yValue'];
      for (var i of newChiBis[arr_rm]['data']) {
        if (i['x'] == frequency) {
          chiBis = i['y'];
        }
      }

    }
    if (point['serieId'] == 2 || point['serieId'] == 5) {
      frequency = point['xValue'];
      chiBis = point['yValue'];
      for (var i of newChiPrime[arr_rm]['data']) {
        if (i['x'] == frequency) {
          chiPrime = i['y'];
        }
      }
    }
    if (point['serieId'] == 3 || point['serieId'] == 6) {
      chiPrime = point['xValue'];
      chiBis = point['yValue'];
      for (var i of newChiPrime[arr_rm]['data']) {
        if (i['y'] == chiPrime) {
          frequency = i['x'];
        }
      }
    }
    newChiPrime[arr_add]['data'].push({ x: frequency, y: chiPrime });
    newChiBis[arr_add]['data'].push({ x: frequency, y: chiBis });
    newColeCole[arr_add]['data'].push({ x: chiPrime, y: chiBis })
    const index_chiPrime = findIndexOfElement(frequency, newChiBis[arr_rm]['data']);
    const index_chiBis = findIndexOfElement(frequency, newChiBis[arr_rm]['data']);
    const index_coleCole = findIndexOfElement(frequency, newChiBis[arr_rm]['data']);
    if (index_chiPrime > -1) {
      newChiPrime[arr_rm]['data'].splice(index_chiPrime, 1);
    }
    if (index_chiBis > -1) {
      newChiBis[arr_rm]['data'].splice(index_chiPrime, 1);
    }
    if (index_coleCole > -1) {
      newColeCole[arr_rm]['data'].splice(index_chiPrime, 1);
    }
    setDataChiPrime(newChiPrime);
    setDataChiBis(newChiBis);
    setDataColeCole(newColeCole);
  }
  useEffect(() => {
    getMeasurement();
  }, [])

  useEffect(() => {
    // getMeasurement();
  }, [dataChiPrime])
  const test = "$\chi^{\prime \prime}$";

  return (
    <>
      <section style={{ 'marginTop': '10px', 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center' }}>
        <h1 style={{ 'marginTop': '10px' }}> {measurement?.name} </h1>
      </section>

      <div className="row">
        <div className="column">
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>$\chi^\prime$</Latex>
          </div>
          <div style={{ 'alignItems': 'center', display: 'flex', 'justifyContent': 'center' }}>
            <div style={{ float: 'left', width: '10%', marginLeft: '5%' }}>
              <div style={{ transform: "rotate(-0.25turn)" }}>
                <Latex>$\chi^&#123;\prime&#125; /cm^3*mol^&#123;-1&#125;$</Latex>
              </div>
            </div>
            <div style={{ width: '90%', float: 'left' }}>
              <ResponsiveContainer height={400}>
                <ResponsiveScatterPlot
                  theme={{ axis: { legend: { text: { fontSize: 16 } } } }}
                  data={dataChiPrime}
                  animate={false}
                  borderColor="#000000"
                  margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
                  xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  xFormat=">-.2f"
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  yFormat=">-.2f"
                  blendMode="normal"
                  colors={{ scheme: 'category10' }}
                  useMesh={false}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'end',
                    legendOffset: 40
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '1e–5',
                    legendPosition: 'end',
                    legendOffset: -45,
                  }}
                  onClick={handleChartClick}
                />
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>$\log &#123;\frac&#123;v&#125;&#123;Hz&#125;&#125;$</Latex>
          </div>
        </div>

        <div className="column">
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>$\chi^&#123;\prime\prime&#125;$</Latex>
          </div>
          <div style={{ 'alignItems': 'center', display: 'flex', 'justifyContent': 'center' }}>
            <div style={{ float: 'left', width: '10%', marginLeft: '5%' }}>
              <div style={{ transform: "rotate(-0.25turn)" }}>
                <Latex>$\chi^&#123;\prime\prime&#125; /cm^3*mol^&#123;-1&#125;$</Latex>
              </div>
            </div>
            <div style={{ width: '90%', float: 'left' }}>
              <ResponsiveContainer height={400}>
                <ResponsiveScatterPlot
                  theme={{ axis: { legend: { text: { fontSize: 16 } } } }}
                  data={dataChiBis}
                  animate={false}
                  margin={{ top: 10, right: 10, bottom: 50, left:  50 }}
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
                    legend: '',
                    legendPosition: 'end',
                    legendOffset: 40
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '1e–5',
                    legendPosition: 'end',
                    legendOffset: -45
                  }}
                  onClick={handleChartClick}
                />
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>$\log &#123;\frac&#123;v&#125;&#123;Hz&#125;&#125;$</Latex>
          </div>
        </div>

        <div className="column">
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>Cole-Cole</Latex>
          </div>
          <div style={{ 'alignItems': 'center', display: 'flex', 'justifyContent': 'center' }}>
            <div style={{ float: 'left', width: '10%', marginLeft: '5%' }}>
              <div style={{ transform: "rotate(-0.25turn)" }}>
                <Latex>$\chi^&#123;\prime\prime&#125; /cm^3*mol^&#123;-1&#125;$</Latex>
              </div>
            </div>
            <div style={{ width: '90%', float: 'left' }}>
              <ResponsiveContainer height={400}>
                <ResponsiveScatterPlot
                  theme={{ axis: { legend: { text: { fontSize: 16 } } } }}
                  data={dataColeCole}
                  animate={false}
                  margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
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
                    legend: '1e–5',
                    legendPosition: 'end',
                    legendOffset: 40
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '1e–5',
                    legendPosition: 'end',
                    legendOffset: -45
                  }}
                  onClick={handleChartClick}
                />
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center', marginLeft: '15%' }}>
            <Latex>$\chi^&#123;\prime&#125; /cm^3*mol^&#123;-1&#125;$</Latex>
          </div>
        </div>
      </div>
      <Box sx={{ height: 400, width: '78%', marginLeft: '3%', marginTop: 2 }}>
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
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </Box>

      {/* <Button onClick={deleteMeasurements}>Delete selected points</Button> */}

    </>
  );
}
