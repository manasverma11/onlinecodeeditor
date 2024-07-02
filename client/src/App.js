import axios from 'axios';
import './App.css';
import React, { useState, useRef } from 'react';
import Editor from "@monaco-editor/react"
import Navbar from './Navbar.js';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [input, setInput] = useState('');
  const textFieldRef = useRef(null);
  const handleSubmit = () =>{
    const payload = {
      language : language,
      code,
      input,
    };
    console.log(code);
    try {
      axios.post("https://codewiz-backend.onrender.com/run",payload)
    .then((response) => {
      console.log(response);
      setOutput(response.data.output);
    })
    .catch((error) => {
      console.log("checkpoint");
      console.log(error.response.data.output);
      setOutput("Errors.. Check your code");
    });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      <h2 style={{marginBottom: "10px"}}>Code Wizard</h2><h4 style={{margin:"0",marginBottom:"15px",border: "0"}}>By Manas</h4>
      <Navbar
        language={language} setLanguage={setLanguage}
        theme={theme} setTheme={setTheme}
      />

      <div id='editor'>
      <Editor
        width="100%"
        height="300px"
        language={language}
        theme={theme}
        fon
        value={code}
        onChange={setCode}
      />
      </div>
      <div id='run'>
        <Button onClick={handleSubmit} variant="contained" color="success">Run</Button>

        <TextareaAutosize
          className='textinput'
          value={input}
          minRows={3}
          onChange={(e) => setInput(e.target.value)}
          ref={textFieldRef}
          id="outlined-basic"
          label="Custom Input"
          variant="outlined"
          placeholder='Enter your Custom Input'
        />
      </div>
      <pre>{output}</pre>
    </div>
  );
}

export default App;