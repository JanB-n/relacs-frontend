import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Compound from './Compound';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Compounds_URL="/compounds/"

export default function Compounds() {    

    const { axiosPrivate } = useAxiosPrivate();
    const [compounds, setCompounds] = useState([]);

    const getData = (e) => {
      try{
          const response = axiosPrivate.get(Compounds_URL).then(res => {
            var data = res.data;
            console.log(data[0].name)
            console.log(data[0]['_id']['$oid'])
            console.log('Tu sa dane ' + data[0]['_id']['$oid'])
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
            {/* <Compound compData = {comp}/> */}
            <Link to={'/compounds/' + comp['_id']['$oid'] + '/'}>
              <Button>{comp.name}</Button>
            </Link>
          </>
        ))}
      </ul>
    </> 
    );
  }

