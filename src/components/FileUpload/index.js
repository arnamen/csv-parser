import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'styled-components';

import { ReactComponent as FileSVG } from '../../assets/file.svg';

const FileUploadEl = _.div`
    margin: 2vh 5vw;
    border: ${({ active }) => !active ? "5px dashed #2860A4;" : "5px solid #0f0;"};
    height: 10vh;
    min-height: 200px;
    max-height: 500px;
    cursor: pointer;
    :focus {
      outline: none;
  }
`

const FileUploadInput = _.input`
    :focus {
        outline: none;
        border: none;
    }
`

const FileUploadInfoWrapper = _.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    :focus {
      outline: none;
    }
`

const FileUploadMessage = _.p`
    font-weight: 500;
    font-size: 24px;
`

const FileUpload = ({ onSuccess, onError, onReset }) => {
  //after file was accepted
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {

      if (file.name.split('.').pop() !== "csv") {
        onReset();
        return onError
          ? onError('Incorrect file extension')
          : console.log('Incorrect file extension');
      }

      const reader = new FileReader()

      reader.onabort = () => onError ? onError('file reading was aborted') : console.log('file reading was aborted');
      reader.onerror = () => onError ? onError('file reading has failed') : console.log('file reading has failed');
      reader.onloadstart = () => onReset();
      reader.onload = () => {
        // do whatever you want with the file contents
        const data = reader.result
        onSuccess(data);
      }
      reader.readAsText(file);
    })
  }, [onError, onSuccess, onReset])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop,/*  accept: ".csv" */ })

  return (
    <FileUploadEl {...getRootProps()} active={isDragActive}>
      <FileUploadInput {...getInputProps()} />
      <FileUploadInfoWrapper>
        <FileSVG style={{ width: "50px", height: "50px" }} />
        {
          isDragActive ?
            <FileUploadMessage>Drop the file here ...</FileUploadMessage> :
            <FileUploadMessage>Drag 'n' drop .csv file here, or click to select file</FileUploadMessage>
        }
      </FileUploadInfoWrapper>
    </FileUploadEl>
  )
}

export default FileUpload;