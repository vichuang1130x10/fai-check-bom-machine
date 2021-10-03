import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { readxlsx } from '../Utilities/PickUpXls'
import { parseObject } from '../Utilities/PickUpXls'
import { parseSupplierPn } from '../Utilities/PickUpXls.js'
import './Zone.css'
// import { parseForYieldRate } from '../ParsingData/ParsingCMData'

export default function Dropzone({
    title,
    callback,
    fileType,
    receivedSn,
    currentSn,
}) {
    const [filename, setFilename] = useState('')
    const [isFileValid, setFileValid] = useState(false)

    const onDrop = useCallback(
        (acceptedFiles) => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onabort = () => console.log('file reading was abort')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = (e) => {
                    console.log('received file ...')
                    const data = e.target.result

                    // const retJson = readxlsx(data)
                    // console.log(retJson)
                    //const key = Object.keys(retJson)

                    switch (fileType) {
                        case 'txt':
                            const fixFormat = data.split('¿')[1]
                            const json = JSON.parse(fixFormat)
                            console.log(json)
                            const machineName =
                                json.TraceabilityDataDetail.MachineName
                            const sn =
                                json.TraceabilityDataDetail.PCBBarcode.split(
                                    ' '
                                )[0] || ''

                            if (title !== machineName) {
                                alert(`The Machine name is wrong`)
                                setFileValid(false)
                                break
                            }

                            console.log(currentSn, sn)

                            if (
                                currentSn !== '000000-0000' &&
                                sn !== currentSn
                            ) {
                                alert(`The board SN is different`)
                                setFileValid(false)
                                break
                            }

                            setFileValid(true)
                            callback({
                                machineName,
                                data: { data: json, valid: true },
                            })
                            receivedSn(sn)

                            break

                        case 'csv':
                            const csvJson = readxlsx(data)

                            let updateMInfo = {}
                            // console.log(csvJson.Sheet1)
                            csvJson.Sheet1.forEach((obj) => {
                                // console.log(obj[' Pkg_ID'])
                                const pkId = obj[' Pkg_ID'] || ''

                                if (
                                    updateMInfo[pkId] === undefined ||
                                    updateMInfo[pkId] === null
                                ) {
                                    updateMInfo[pkId] = obj
                                }
                            })

                            // console.log(updateMInfo)
                            callback(updateMInfo)

                            setFileValid(true)
                            break

                        case 'xls':
                            const retJson = readxlsx(data)
                            const bomObj = parseObject(retJson)

                            const updatedBOM = bomObj.map((obj) => ({
                                ...obj,
                                reference: obj.reference
                                    ? obj.reference.split(',')
                                    : [],
                            }))

                            const supplerObj = parseSupplierPn(retJson)

                            callback({ updatedBOM, supplerObj })
                            setFileValid(true)
                            break

                        default:
                            break
                    }
                }
                // reader.readAsArrayBuffer(file)
                reader.readAsBinaryString(file)
            })

            setFilename(acceptedFiles[0].name)
        },
        [callback, fileType, title]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    })

    return (
        <div>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop file here, or click to select files</p>
            </div>
            <div style={{ margin: 0 }}>
                {isFileValid ? <h6>{filename}</h6> : null}
            </div>
        </div>
    )
}
