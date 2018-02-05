import React from 'react';
import { Table } from 'reactstrap';
import { get } from 'lodash';
import classnames from 'classnames';


const ProtocolRequest = ({request, rowClasses, rotaSequence, index}) => {
  let status = get(request, 'currentState.code');
  let future = index > (rotaSequence - 1);
  let current = (rotaSequence - 1) == index;
  let succeeded = (status === 'SHIPPED');
  let classes = {
    'table-danger': (status === 'NOT SUPPLIED'),
    'table-success': (succeeded),
    'table-active': (!succeeded && current),
    'text-muted': (future)
  };
  
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
           <ProtocolRequest key={index} index={index} request={req} rotaSequence={rotaSequence} /> )) }
      </tbody>
    </Table>
  )
};


export { ProtocolRequest };
export default ProtocolRequests;
