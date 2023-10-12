import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form  from 'react-bootstrap/Form';
import Papa from 'papaparse'

const Compound_URL="/compound/"

export default function AddMeasurements({id}) {

    const [show, setShow] = useState(false);
    const {axiosPrivate} = useAxiosPrivate();
    const [measurements, setMeasurements] = useState({});
    const [probeMass, setProbeMass] = useState({});
    const [file, setFile] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    const handleFileChange = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            setFile(e.target.files[0]);
            reader.onload = (e) => {
                const text = e.target.result;
                const text_data = text.split('[Data]').pop();
                setMeasurements(text_data);
                
                // Papa.parse(text_data, {
                //     header: true,
                //     skipEmptyLines: true,
                //     dynamicTyping: true,
                //     complete: function (results) {
                //         setMeasurements(results.data);
                //     },
                // });
            };
            reader.readAsText(e.target.files[0]);
        }
    };

    const addMeasurements = (e) => {
        try{
            console.clear();
            console.log(id);
            console.log("przed wyslaniem", axiosPrivate.name);
            const response = axiosPrivate.post(Compound_URL, JSON.stringify({measurements: measurements, comp_id: id, probe_mass: probeMass, file_name: file?.name}), 
            {
                headers: { 'Content-Type' : 'application/json' }
                
                //withCredentials: true
            } ).then(res => {
                console.log("resresres", res);
            })
            console.log("response", response);
      } catch(err){
          console.log(err);
      }
      }
      
     

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Upload measurements
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Upload measurements</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <input type="file" accept='.csv,.dat' onChange={handleFileChange} required />
                        <br />
                        <br />
                        <Form.Control type="number" step="0.01" placeholder="Probe mass [g]" onChange={(e) => setProbeMass(e.target.value)} required />
                        <br />
                        {/* <div>{file && `${file.name} - ${file.type}`}</div> */}
                        {/* <div>{file && `${file.name}`}</div> */}
                        <br/>
                        <Button variant="primary" type="submit" onClick={addMeasurements}>
                            Upload
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

        </>
  );
}