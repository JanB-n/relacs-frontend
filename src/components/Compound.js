import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import AddMeasurements from './AddMeasurements';
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
          console.log(res.data);
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
      <AddMeasurements id={id}/>
      <Button>Make fits from selected measurements</Button>
      <Measurements id={id}/>
    </>
  );
}
    // const [showCompound, setShowCompound] = useState(false);
    
    
    // const { id } = useParams();
    

    // useEffect(() => {
    //     const state = localStorage.getItem("compound" + compData?.compData?.pk);
    //     if (state === 'true')
    //     {
    //         setShowCompound(true);  
    //     }
    //     else
    //     {
    //         setShowCompound(false);  
    //     }
    //     console.log(compData)
    // }, [])
    
    // const handleClickCompound = () => {
    //     localStorage.setItem("compound" + compData?.compData?.pk, !showCompound)
    //   setShowCompound(!showCompound); 
    // };
    // const handleSpanClick = () => {

    // }

    // return (
    //   <>
    //     <div onClick={handleClickCompound} style={{ marginBottom: "10px" }}>
    //       <span>{compData?.compData?.name}</span>
    //     </div>
    //     <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" } }>
    //       {
    //       showCompound && (
    //         <div>
    //           <span onClick={handleSpanClick}>Mesurements</span>
    //           <button>Load</button>
    //           <button>Delete</button>
    //           <br/>
    //           <span>Frequency Fits Single</span>
    //           <br/>
    //           <span>Frequency Fits Double</span>
    //           <br/>
    //         </div>
    //       ) 
    //       }
    //     </ul>
    //   </>
    // );
