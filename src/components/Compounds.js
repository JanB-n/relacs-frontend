import {useEffect, useState} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Compounds_URL="/compound/"

export default function Compounds({ treeData }) {    

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
        {/* {treeData.map((node) => (
          <TreeNode node={node} key={node.key} />
        ))} */}
      </ul>
      <ul>
        {compounds?.map(d =>(<li key={d.pk}>{d.fields.name}</li>))}
      </ul>
    </> 
    );
  }

// function TreeNode({ node }) {
//     const { children, label } = node;
  
//     const [showChildren, setShowChildren] = useState(false);
  
//     const handleClick = () => {
//       setShowChildren(!showChildren);
//     };

    
//     return (
//       <>
        
//         <div onClick={handleClick} style={{ marginBottom: "10px" }}>
//           <span>{label}</span>
//         </div>
//         <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
//           {showChildren && <Compounds treeData={children} />}
//         </ul>
//       </>
//     );
//   }