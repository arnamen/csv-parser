import {useState} from 'react';

import FileUpload from './components/FileUpload';
import Table from './components/Table';
import ErrorModal from './components/ErrorModal';

import './App.css';

function App() {
  //data received from .csv file
  const [uploadedData, setUploadedData] = useState();
  //message will appear when uploading failed
  const [errorMessage, setErrorMessage] = useState();

  const dataValidationError = (error) => {
    setUploadedData();
    setErrorMessage(error);
  }

  return (
    <div className="App">
        <FileUpload onSuccess={setUploadedData} onError={setErrorMessage} onReset={() => setUploadedData()}/>
        {uploadedData && <Table data={uploadedData} onError={dataValidationError}/>}
        {errorMessage && <ErrorModal error={errorMessage} onClear={() => setErrorMessage(null)}/>}
    </div>
  );
}

export default App;
