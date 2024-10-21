import React, { useEffect, useState } from 'react';
import getWeb3 from './web3';
import PatientRecordsABI from './PatientRecordsABI.json';
import PatientCard from './components/PatientCard';

//address of our deployed contract
const CONTRACT_ADDRESS = "0x31DA629804919Ad2fEb8D16507dcae4f357D4dc1"; // Paste your contract address here

function App() {

  const [account, setAccount] = useState(''); //state to store account
  const [contract, setContract] = useState(null); //state to save contract
  const [patients, setPatients] = useState([]); //state to save list of patients
  const [page, setPage] = useState("Add"); //state to set page (Add, Show)
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    diagnosis: ""
  }); //state to store patient form details

  //runs when the app loads
  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3(); //initialize web3
      const accounts = await web3.eth.getAccounts(); //get all accounts from metamask
      setAccount(accounts[0]); //set the first account
      const networkId = await web3.eth.net.getId(); 
      const deployedNetwork = PatientRecordsABI.networks[networkId]; //get the current network
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(PatientRecordsABI.abi, CONTRACT_ADDRESS);
        setContract(instance);
      }
    };
    init();
  }, []);

  //runs whenever any field inside the form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //runs whenever the user clicks on add button
  const addPatient = async () => {
    console.log(form)
    if (contract) {
      await contract.methods
        .addPatient(form.name, form.age, form.height, form.weight, form.gender, form.diagnosis)
        .send({ from: account });
    }
  };
  const getPatients = async () => {
    if (contract) {
      const patientsCount = await contract.methods.getPatientsCount().call();
      const patientsList = [];
      for (let i = 0; i < patientsCount; i++) {
        const patient = await contract.methods.getPatient(i).call();
        const formattedPatient = {
          name: patient[0],
          age: Number(patient[1].toString()),     // Convert BigInt to number
          height: Number(patient[2].toString()),  // Convert BigInt to number
          weight: Number(patient[3].toString()),  // Convert BigInt to number
          gender: patient[4],
          diagnosis: patient[5],
        };
        patientsList.push(formattedPatient);
      }
      setPatients(patientsList);
    }
  };

  console.log(patients);

  return (
    <div className='container p-4'>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <p className={`nav-link ${page === 'Add' ? 'active' : ''}`} onClick={() => setPage('Add')}>
            Add Record
          </p>
      </li>
      <li class="nav-item">
        <p className={`nav-link ${page === 'Show' ? 'active' : ''}`} onClick={() => setPage('Show')}>
          Check Records
        </p>
      </li>
    </ul>
    {page === 'Add' && (
      <div className='container p-4'>
      <h1>Add Patient Record</h1>
        <form>
        <div class="mb-3">
          <input type="text" id='name' class="form-control" name="name" placeholder="Patient Name" onChange={handleChange} />
        </div>
        <div class="mb-3">
          <input type="number" id='age' class="form-control" name="age" placeholder="Patient Age" onChange={handleChange} />
        </div>
        <div class="mb-3">
          <input type="number" id='height' class="form-control" name="height" placeholder="Patient Height" onChange={handleChange} />
        </div>
        <div class="mb-3">
          <input type="text" id='weight' class="form-control" name="weight" placeholder="Patient Weight" onChange={handleChange} />
        </div>
        <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="gender"
          id="male"
          value="Male"
          onChange={handleChange}
          checked={form.gender === "Male"}
        />
        <label class="form-check-label" htmlFor="male">
          Male
        </label>
      </div>

      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="gender"
          id="female"
          value="Female"
          onChange={handleChange}
          checked={form.gender === "Female"}
        />
        <label class="form-check-label" htmlFor="female">
          Female
        </label>
      </div>

        <div class="mb-3">
          <textarea class="form-control" name='diagnosis' id="Patient Diagnosis" rows="5" placeholder='diagnosis' onChange={handleChange}></textarea>
        </div>
  
        <button className='btn btn-primary' type="button" onClick={addPatient}>Add Patient</button>
        </form>
  
      </div>
    )}
    {page === 'Show' && (
      <div className='container p-4'>
        <button className='btn btn-primary' onClick={getPatients}>Get Patients</button>
        <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Weight</th>
            <th scope="col">Height</th>
            <th scope="col">Gender</th>
            <th scope="col">Diagnosis</th>
          </tr>
        </thead>
        <tbody>
        {patients.map((patient, index) => (
          <tr key={index}>
            <td scope="row">{patient.name}</td>
            <td scope="row">{patient.age}</td>
            <td scope="row">{patient.weight}</td>
            <td scope="row">{patient.height}</td>
            <td scope="row">{patient.gender}</td>
            <td scope="row">{patient.diagnosis}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    )}

    </div>
  );
}

export default App;
