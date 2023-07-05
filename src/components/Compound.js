import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Compounds_URL="/compound/"

export default function Compound(compData) {
    const [showCompound, setShowCompound] = useState(false);
    console.log(compData);
    const handleClickCompound = () => {
      setShowCompound(!showCompound);
    };
    const handleSpanClick = () => {

    }

    return (
      <>
        <div onClick={handleClickCompound} style={{ marginBottom: "10px" }}>
          <span>{compData.compData.fields.name}</span>
        </div>
        <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" } }>
          {showCompound ? (
            <div>
              <span onClick={handleSpanClick}>Mesurements</span>
              <button>Load</button>
              <button>Delete</button>
              <br/>
              <span>Frequency Fits Single</span>
              <br/>
              <span>Frequency Fits Double</span>
              <br/>
            </div>
          ) : <div />}
        </ul>
      </>
    );
  }