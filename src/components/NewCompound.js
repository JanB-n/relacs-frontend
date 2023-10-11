import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form  from 'react-bootstrap/Form';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


const NewCompound_URL="/compounds/"

function NewCompound() {
  const [show, setShow] = useState(false);
  const [compoundName, setCompoundName] = useState();
  const [molarMass, setMolarMass] = useState();
  const { auth } = useAuth();
  const { axiosPrivate }  = useAxiosPrivate();
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try{
        //const response = await axios.post(NewCompound_URL, JSON.stringify({name: compoundName, molar_mass: molarMass}),
        const response = await axiosPrivate.post(NewCompound_URL, JSON.stringify({name: compoundName, molar_mass: molarMass}), 
        {
            headers: { 'Content-Type' : 'application/json'},
            //withCredentials: true
        }
        );
        console.log(JSON.stringify(response?.data));
        
        
    } catch(err){
        console.log(err);
    }
    
}

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create new compound
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new compound</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control type="text" placeholder="Compound name" onChange={(e) => setCompoundName(e.target.value)} required />
                <br />
                <Form.Control type="number" step="0.01" placeholder="Molar mass [g/mol]" onChange={(e) => setMolarMass(e.target.value)} required />
                <br />
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Create
                </Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewCompound;