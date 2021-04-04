import React, { useState, useEffect } from 'react';
import _ from 'styled-components';
import parse from 'csv-parse';

import Row from './Row';
import Column from './Column';
import Head from './Head';
import Body from './Body';

import { validate } from '../../utils/validatePersonInfo';

const StyledTable = _.table`
    width: 100%;
    border-collapse: collapse;
`

const Table = ({ data, onError }) => {
    //combine head and data in one state to prevent additional rerender
    const [parsedData, setParsedData] = useState({
        head: [],
        data: []
    });

    useEffect(() => {
        parse(data.trim(), (_, records, _2) => {
            //split 2D array into body and head
            //and add Index column and Duplicate column
            records[0].unshift("Index");
            records[0].push("Duplicate");
            //fill index column
            for (let i = 1; i < records.length; i++) {
                records[i].unshift(i);
            }
            setParsedData({
                head: records[0],
                data: validate(records.slice(1))
            });
        })
    }, [data]);

    //data will include failed field if some critical error happened during validation
    if(parsedData?.data?.failed) {
        setParsedData();
        parsedData.data.error 
        ? onError(parsedData.data.error) 
        : onError("Error occured during validation. \n CSV file has incorrect data?");
        return <></>
    }

    const TableHead = parsedData ? <Head>
        <Row>
            {parsedData.head.map((headCellValue, index) => <Column key={`${index}-${headCellValue}`}>
                {headCellValue}
            </Column>)}
        </Row>
    </Head> : <></>

    const TableBody = parsedData ? <Body>
            {parsedData.data.map((userData, index) => <Row key={`${index}-${JSON.stringify(userData)}`}>
        
                {userData.map((value, index) => index !== userData.length - 1 ? <Column 
                isValid={userData[userData.length - 1].indexOf(index) === -1}
                key={`${index}-${value}`}>
                    {index === 8 && value.includes("|") 
                    ? value.split("|").map(val => val.slice(0,2)).join(",").toUpperCase() ///* check for License states */
                    : value}
                </Column> : null)}

            </Row>)}
    </Body> : <></>


    return <StyledTable key="Table">
        {TableHead}
        {TableBody}
    </StyledTable>
}

export default Table;
