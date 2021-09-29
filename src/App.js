import React, { useState } from 'react'

import Header from './Component/Header'
import Content from './Component/Content'
import Block from './Component/Block'
import Card from './Component/Card'
import Button from './Component/SubmitButtion'
import MachineData from './Utilities/MachineData'
import Result from './Component/Result'

function App(props) {
    const [pnpMachineData, setPnpMachineData] = useState(MachineData)
    const [materialInfo, setMaterialInfo] = useState([])
    const [bom, setBom] = useState({})
    const [result, setResult] = useState([])

    const receivedMachineData = (obj) => {
        const updateMachineData = {
            ...pnpMachineData,
            [obj.machineName]: obj.data,
        }
        console.log(updateMachineData)
        setPnpMachineData(updateMachineData)
    }

    const receivedMaterialInfo = (obj) => {
        setMaterialInfo(obj)
    }

    const receivedBOM = (obj) => {
        setBom(obj)
    }

    const generateReport = () => {
        const Machine = [
            pnpMachineData['A1-X4S'].data,
            pnpMachineData['A2-X4S'].data,
            pnpMachineData['A3-SX2'].data,
            pnpMachineData['B1-X4S'].data,
            pnpMachineData['B2-X4S'].data,
            pnpMachineData['B3-X4S'].data,
            pnpMachineData['B4-SX2'].data,
            pnpMachineData['B5-SX2'].data,
        ]
        let data = {}
        let isExist = false
        const compareResult = []

        bom.updatedBOM.forEach((part) => {
            // console.log('1. start from part number: ', part)

            part.reference.forEach((ref) => {
                // console.log("2. then next from ref: ", ref);
                Machine.forEach((machine) => {
                    // console.log("3. loop the machine json");
                    machine.TraceabilityDataDetail.MaterialTraceabilityDetail.PanelList[0].PackagingUnitRefList.forEach(
                        (pList) => {
                            // console.log("4. loop the machine packaking list");
                            const matchPn = pList.PlaceRefList.filter(
                                (obj) =>
                                    obj.PlaceRefID.replace(/\s/g, '') ===
                                    ref.replace(/\s/g, '')
                            )

                            const mfgPn = materialInfo.Sheet1.find(
                                (obj) => obj.HH_PN === part.HHPN
                            )
                            console.log(mfgPn)

                            //  console.log("5. ,match", matchPn);
                            if (matchPn.length) {
                                isExist = true
                                data = {
                                    part_item_number: part.HHPN,
                                    part_item_name: part.description,
                                    machine_name:
                                        machine.TraceabilityDataDetail
                                            .MachineName,
                                    boardSide:
                                        machine.TraceabilityDataDetail
                                            .BoardSide,
                                    manufacturePN: pList.ManufacturePartNumber,
                                    manufactureComponentName:
                                        pList.ComponentName,
                                    msd: pList.MsdLevel,
                                    DateBegin:
                                        machine.TraceabilityDataDetail
                                            .DateBegin,
                                    DateCompleted:
                                        machine.TraceabilityDataDetail
                                            .DateCompleted,
                                    isSame:
                                        part.HHPN === pList.ComponentName
                                            ? 'Y'
                                            : 'N',
                                    MFGPN: mfgPn,
                                    isMFGPNCorrect: bom.supplerObj[
                                        part.HHPN
                                    ].includes(mfgPn)
                                        ? 'Y'
                                        : 'N',
                                }
                            }
                        }
                    )
                })

                if (isExist) {
                    const updateData = { ref, ...data }
                    compareResult.push(updateData)
                    //const upload = Pnpdata.create({ ...updateData })
                    isExist = false
                    data = {}
                } else {
                    const updateData = {
                        ref,
                        part_item_number: part.item_number,
                        part_item_name: part.item_name,
                        machine_name: '',
                        boardSide: '',
                        manufacturePN: '',
                        manufactureComponentName: '',
                        msd: '',
                        DateBegin: null,
                        DateCompleted: null,
                    }
                    compareResult.push(updateData)
                    //              const upload = Pnpdata.create({ ...updateData })
                }
            })
        })

        setResult(compareResult)
    }

    return (
        <div>
            <Header />

            <Content>
                <Block title="Bottom Side">
                    <Card
                        title="A1-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="A2-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="A3-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                </Block>
                <Block title="Top Side">
                    <Card
                        title="B1-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="B2-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="B3-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="B4-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                    <Card
                        title="B5-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                    />
                </Block>
                <Block title="Material Data">
                    <Card
                        title="Material Info"
                        fileType="csv"
                        callback={(obj) => receivedMaterialInfo(obj)}
                    />
                </Block>
                <Block title="Production BOM">
                    <Card
                        title="BOM"
                        fileType="xls"
                        callback={(obj) => receivedBOM(obj)}
                    />
                </Block>
                <div style={{ height: '20px' }}></div>
                <Button onClick={() => generateReport()}>
                    {' '}
                    Generate Report
                </Button>
                {result.length ? <Result data={result} /> : null}
            </Content>
        </div>
    )
}

export default App
