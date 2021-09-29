import XLSX from 'xlsx'

// read excel file
export function readxlsx(inputData) {
    const workbook = XLSX.read(inputData, { type: 'binary', cellDates: true })
    return toJson(workbook)
}

// parsing excel obj to json
export function toJson(workbook) {
    let result = {}
    workbook.SheetNames.forEach((sheetName) => {
        const roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
        )
        if (roa.length > 0) {
            result[sheetName] = roa
        }
    })

    return result
}

export function parseObject(retJson) {
    let bomObj = []
    retJson.BOM.forEach((row) => {
        if (row.__EMPTY_9 === 'R' && row.__EMPTY_6 !== undefined) {
            const obj = {
                HHPN: row.__EMPTY_1,
                description: row.__EMPTY_3,
                qty: row.__EMPTY_6,
                reference: row.__EMPTY_7 || '',
            }
            bomObj.push(obj)
        }
    })

    return bomObj
}

export function parseSupplierPn(retJson) {
    let n = {}
    retJson.BOM.forEach((row) => {
        if (row.__EMPTY_9 === 'R') {
            const obj = {
                HHPN: row.__EMPTY_1,
                SupplierPN: row.__EMPTY_5,
            }
            if (n[obj.HHPN] === undefined || n[obj.HHPN] === null) {
                n[obj.HHPN] = [obj.SupplierPN]
            } else {
                n[obj.HHPN].push(obj.SupplierPN)
            }
        }
    })

    return n
}
