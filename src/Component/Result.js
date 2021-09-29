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
                fontSize: '12px',
                margin: '0 auto',
                marginTop: '20px',
            }}
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
                    <th>MFGPN</th>
                    <th>isMFGPNCorrect</th>
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
                        <td>{item.MFGPN}</td>
                        <td>{item.isMFGPNCorrect}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
