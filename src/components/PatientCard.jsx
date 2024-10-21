import React from 'react'

export default function PatientCard({patient}) {
  return (
    <div className='d-flex flex-row  row justify-content-start align-items-start'>
        <div className='col-2'>
          <p>{patient.name}</p>
        </div>
        <div className='col-2'>
          <p>{patient.age}</p>
        </div>
        <div className='col-2'>
          <p>{patient.height}</p>
        </div>
        <div className='col-2'>
          <p>{patient.weight}</p>
        </div>
        <div className='col-2'>
          <p>{patient.gender}</p>
        </div>
        <div className='col-2'>
          <p>{patient.diagnosis}</p>
        </div>
      </div>
  )
}
