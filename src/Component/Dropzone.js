import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { readxlsx } from '../Utilities/PickUpXls'
import { parseObject } from '../Utilities/PickUpXls'
import { parseSupplierPn } from '../Utilities/PickUpXls.js'
import './Zone.css'
// import { parseForYieldRate } from '../ParsingData/ParsingCMData'

export default function Dropzone({ title, callback, fileType }) {
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
                            const machineName =
                                json.TraceabilityDataDetail.MachineName
                            if (title !== machineName) {
                                alert(`The Machine name is wrong`)
                                setFileValid(false)
                            } else {
                                setFileValid(true)
                                callback({
                                    machineName,
                                    data: { data: json, valid: true },
                                })
                            }
                            break

                        case 'csv':
                            const csvJson = readxlsx(data)
                            console.log(csvJson)
                            callback(csvJson)

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
