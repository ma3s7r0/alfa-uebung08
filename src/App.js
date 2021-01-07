import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const EMPTYDATA = {titel: "", jahr: "", publisher: "", preis: ""}

  const [formData, setFormData] = useState(EMPTYDATA)
  const [data, setData] = useState([])
  const [mode, setMode] = useState("add")

  // adress of JsonServer
  const PORT = "3001"
  const SERVER = "localhost"
  const baseURL = `http://${SERVER}:${PORT}`


  useEffect(() => {
    axios.get(`${baseURL}/spiele`)
      .then((response) => {
        setData([...response.data])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  let deleteItem = (itemType, id) => {
    axios.delete(`${baseURL}/${itemType}/${id}/`)
      .then(response => {
        setData(prevState => prevState.filter(ele => ele.id !== id))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let addItem = (itemType) => {
    axios.post(`${baseURL}/${itemType}`, {...formData})
      .then(response => {
        setData(prevState => [...prevState, response.data])
        setFormData(EMPTYDATA)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let updateItem = (itemType) => {
    let updatedItem = {...formData}
    delete updatedItem.id
    axios.put(`${baseURL}/${itemType}/${formData.id}/`, updatedItem)
    .then(response => {
      const updatedData = data.map(ele => (ele.id === formData.id ? response.data : ele))
      setData([...updatedData])
      switchMode("add")
    })
    .catch(error => {
      console.log(error)
    })
}

  let handleInput = (event) => {
    setFormData(prevState => {return {...prevState, [event.target.name]: event.target.value}})
  }

  let switchMode = (newMode, id) => {
    switch (newMode) {
      case "add":
        setFormData(EMPTYDATA)
        setMode("add")
        break;
      case "edit":
        setFormData(data.find(ele => ele.id === id))
        setMode("edit")
        break;
      default:
        break;
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
      {mode === "add" && <h3>Neuer Artikel</h3>}
      {mode === "edit" && <h3>Artikel bearbeiten</h3>}
        <input type="text" placeholder="Titel" name="titel" value={formData.titel} onChange={handleInput}/>
        <input type="text" placeholder="Jahr" name="jahr" value={formData.jahr} onChange={handleInput}/>
        <input type="text" placeholder="Publisher" name="publisher" value={formData.publisher} onChange={handleInput}/>
        <input type="text" placeholder="Preis" name="preis" value={formData.preis} onChange={handleInput}/>
        {mode === "add" && <button onClick={() => addItem("spiele")}>Hinzufügen</button>}
        {mode === "edit" && <button onClick={() => updateItem("spiele")}>Bestätigen</button>}
      </form>
      <table>
        <thead>
          <tr>
              <th>Titel</th>
              <th>Jahr</th>
              <th>Publisher</th>
              <th>Preis</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(ele => 
          (<tr key={ele.id}>
            <td onClick={() => switchMode("edit", ele.id)}>{ele.titel}</td>
            <td>{ele.jahr}</td>
            <td>{ele.publisher}</td>
            <td>{ele.preis} EUR</td>
            <td onClick={() => deleteItem("spiele", ele.id)}>Löschen</td>  
          </tr>))
          }
        </tbody>
      </table>
    </>
  );
}

export default App;
