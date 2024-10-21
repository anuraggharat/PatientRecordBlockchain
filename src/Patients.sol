// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string name;
        uint age;
        uint height;
        uint weight;
        string gender;
        string diagnosis;
    }

    Patient[] public patients;

    function addPatient(string memory _name, uint _age, uint _height, uint _weight, string memory _gender, string memory _diagnosis) public {
        patients.push(Patient(_name, _age, _height, _weight, _gender, _diagnosis));
    }

    function getPatient(uint index) public view returns (string memory, uint, uint, uint, string memory, string memory) {
        Patient memory patient = patients[index];
        return (patient.name, patient.age, patient.height, patient.weight, patient.gender, patient.diagnosis);
    }

    function getPatientsCount() public view returns (uint) {
        return patients.length;
    }
}
