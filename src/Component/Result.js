import React from 'react'
import { Table } from 'react-bootstrap'
import './Result.css'
export default function App({ data }) {
    return (
        <Table
            striped
            bordered
            hover
            size="sm"
            style={{
                width: '100%',
                fontSize: '8px',
                margin: '0 auto',
                marginTop: '20px',
            }}
            id="table"
        >
            <thead>
                <tr>
                    <th>ref</th>
                    <th>part_item_number</th>
                    <th>isSame</th>
                    <th>part_item_name</th>
                    <th>machine_name</th>
                    <th>manufacturePN</th>
                    <th>manufactureComponentName</th>
                    <th>Package ID</th>
                    <th>MFGPN</th>
                    <th>Vendor</th>
                    <th>Lot Code</th>
                    <th>Date Code</th>
                    <th>Feeder Number</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={item.ref + index}>
                        <td>{item.ref}</td>
                        <td>{item.part_item_number}</td>
                        <td>{item.isSame}</td>
                        <td>{item.part_item_name}</td>
                        <td>{item.machine_name}</td>
                        <td>{item.manufacturePN}</td>
                        <td>{item.manufactureComponentName}</td>
                        <td>{item.PKG_ID}</td>
                        <td>{item.MFGPN}</td>
                        <td>{item.Vendor}</td>
                        <td>{item.LotCode}</td>
                        <td>{item.DateCode}</td>
                        <td>{item.FeederNumber}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

// PKG_ID: materialInfo[pkid]
// ? materialInfo[pkid][' Pkg_ID']
// : '',
// LotCode: materialInfo[pkid]
// ? materialInfo[pkid][' Lot_No']
// : '',
// MFGPN: materialInfo[pkid]
// ? materialInfo[pkid][' MFG_PN']
// : '',
// DateCode: materialInfo[pkid]
// ? materialInfo[pkid][' Date_Code']
// : '',
// Vendor: materialInfo[pkid]
// ? materialInfo[pkid][' Vendor']
// : '',
// FeederNumber: materialInfo[pkid]
// ? materialInfo[pkid][' Feeder_No']
