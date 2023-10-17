import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import Measurements from './Measurements';



const Compound_URL="/compound"

export default function Compound() {

  const { axiosPrivate } = useAxiosPrivate();
  const { id } = useParams();
  const [compound, setCompound] = useState([]);

  const getCompound = (e) => {
    try{
        const response = axiosPrivate.get(Compound_URL, { params: { id: id }} ).then(res => {
          // var compound = res.data;
          setCompound(res.data);
          

        });
        
    } catch(err){
        console.log(err);
    }
  }

  useEffect(() => {
    getCompound();
 }, [])
  

  return (
    <>
      <Measurements id={id}/>
    </>
  );
}
    
