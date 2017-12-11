import React from 'react';
import { Table } from 'react-bootstrap';
import { get } from 'lodash';
import classnames from 'classnames';


const ProtocolRequest = ({request, rowClasses}) => {
  let status = get(request, 'currentState.code');
  let classes = Object.assign ({}, rowClasses, {
    'danger': (status === 'NOT SUPPLIED'),
    'success': (status === 'SHIPPED')
  });
  
  return (
    <tr className={ classnames(classes) } >
      <td>{ get(request, 'rotaSequence') }</td>
      <td>{ get(request, 'service.symbol') }</td>
      <td >{ status }</td>
    </tr>
  )
};

const ProtocolRequests = ({requests, current}) => {
  
  let rotaSequence = current ? current.rotaSequence : 0;
  
  // Render the collection as a table.
  return (
    <Table responsive={true} >
      <thead>
        <tr>
          <th>#</th>
          <th>Institution</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        { requests.map((req, index) => ( 
           <ProtocolRequest key={index} request={req} rowClasses={{ 'active': ((rotaSequence - 1) == index), 'text-muted': (index > (rotaSequence - 1)) }} /> )) }
      </tbody>
    </Table>
  )
};


export { ProtocolRequest };
export default ProtocolRequests;
