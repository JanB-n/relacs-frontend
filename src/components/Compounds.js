import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Compound from './Compound';

const Compounds_URL="/compound/"

export default function Compounds() {    

    const { axiosPrivate } = useAxiosPrivate();
    const [compounds, setCompounds] = useState([]);

    const getData = (e) => {
      try{
          const response = axiosPrivate.get(Compounds_URL).then(res => {
            var data = res.data;
            setCompounds(data);
          });
          
      } catch(err){
          console.log(err);
      }
    }
    
    useEffect(() => {
     getData();
  }, [])

    return (
    <>
      <ul>
        {compounds?.map(comp =>(
          <>
            {/* <ul key={comp.pk}>{comp.fields.name}</ul> */}
            <Compound compData = {comp}/>
          </>
        ))}
      </ul>
    </> 
    );
  }

