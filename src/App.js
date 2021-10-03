import React, { useState } from 'react'

import Header from './Component/Header'
import Content from './Component/Content'
import Block from './Component/Block'
import Card from './Component/Card'
import Button from './Component/SubmitButtion'
import MachineData from './Utilities/MachineData'
import Result from './Component/Result'
import CopyButton from './Component/CopyButton'

function App(props) {
    const [pnpMachineData, setPnpMachineData] = useState(MachineData)
    const [materialInfo, setMaterialInfo] = useState({})
    const [bom, setBom] = useState({})
    const [result, setResult] = useState([])
    const [boardNumber, setBoardNumber] = useState('000000-0000')
    const [copied, setCopied] = useState('')
    const [isActive, setIsActive] = useState(false)

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
    const copyTable = () => {
        const elTable = document.querySelector('table')

        let range, sel

        // Ensure that range and selection are supported by the browsers
        if (document.createRange && window.getSelection) {
            range = document.createRange()
            sel = window.getSelection()
            // unselect any element in the page
            sel.removeAllRanges()

            try {
                range.selectNodeContents(elTable)
                sel.addRange(range)
            } catch (e) {
                range.selectNode(elTable)
                sel.addRange(range)
            }

            document.execCommand('copy')
        }

        sel.removeAllRanges()

        setCopied('Copied!!')
    }
    // main data calculating here
    const generateReport = () => {
        console.log('starting...')
        if (
            !(
                pnpMachineData['A1-X4S'].valid &&
                pnpMachineData['A2-X4S'].valid &&
                pnpMachineData['A3-SX2'].valid &&
                pnpMachineData['B1-X4S'].valid &&
                pnpMachineData['B2-X4S'].valid &&
                pnpMachineData['B3-X4S'].valid &&
                pnpMachineData['B4-SX2'].valid &&
                pnpMachineData['B5-SX2'].valid
            )
        ) {
            alert('data is not complete')
            return
        }

        console.log('pass the check 1')
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
        console.log(materialInfo)
        bom.updatedBOM.forEach((part) => {
            // console.log('1. start from part number: ', part)

            part.reference.forEach((ref) => {
                // console.log("2. then next from ref: ", ref);
                Machine.forEach((machine) => {
                    // console.log("3. loop the machine json");
                    machine.TraceabilityDataDetail.MaterialTraceabilityDetail.PanelList[0].PackagingUnitRefList.forEach(
                        (pList) => {
                            const matchPn = pList.PlaceRefList.filter(
                                (obj) =>
                                    obj.PlaceRefID.replace(/\s/g, '') ===
                                    ref.replace(/\s/g, '')
                            )

                            if (matchPn.length) {
                                const pkid = pList.ManufacturePartNumber.slice(
                                    1,
                                    pList.ManufacturePartNumber.length
                                )

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
                                    PKG_ID: materialInfo[pkid]
                                        ? materialInfo[pkid][' Pkg_ID']
                                        : '',
                                    LotCode: materialInfo[pkid]
                                        ? materialInfo[pkid][' Lot_No']
                                        : '',
                                    MFGPN: materialInfo[pkid]
                                        ? materialInfo[pkid][' MFG_PN']
                                        : '',
                                    DateCode: materialInfo[pkid]
                                        ? String(
                                              materialInfo[pkid][' Date_Code ']
                                          )
                                        : '',
                                    Vendor: materialInfo[pkid]
                                        ? materialInfo[pkid][' Vendor']
                                        : '',
                                    FeederNumber: materialInfo[pkid]
                                        ? materialInfo[pkid][' Feeder_No ']
                                        : '',
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
                        isSame: '',
                        MFGPN: '',
                        PKG_ID: '',
                        LotCode: '',
                        DateCode: '',
                        Vendor: '',
                        FeederNumber: '',
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
                <h2>
                    Board SN:
                    <em> {boardNumber} </em>
                </h2>
                <Block title="Bottom Side">
                    <Card
                        title="A1-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="A2-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="A3-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                </Block>
                <Block title="Top Side">
                    <Card
                        title="B1-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="B2-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="B3-X4S"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="B4-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
                    />
                    <Card
                        title="B5-SX2"
                        fileType="txt"
                        callback={(obj) => receivedMachineData(obj)}
                        receivedSn={(obj) => setBoardNumber(obj)}
                        currentSn={boardNumber}
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

                {result.length ? (
                    <div>
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <CopyButton onClick={() => copyTable()}>
                                Copy tables
                            </CopyButton>
                            <p style={{ padding: '10px' }}>{copied}</p>
                        </div>

                        <Result data={result} />
                    </div>
                ) : null}
            </Content>
        </div>
    )
}

export default App
