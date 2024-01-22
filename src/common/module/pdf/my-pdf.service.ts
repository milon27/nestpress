import { Response } from "express"
import path from "path"
import Pdfmake from "pdfmake"
import { TDocumentDefinitions } from "pdfmake/interfaces"
import DateUtil from "../../../utils/date.util"

const fonts = {
    Hind_Siliguri: {
        normal: path.join(process.cwd(), "public", "fonts", "hind", "HindSiliguri-Regular.ttf"),
        bold: path.join(process.cwd(), "public", "fonts", "hind", "HindSiliguri-Bold.ttf"),
        italics: path.join(process.cwd(), "public", "fonts", "hind", "HindSiliguri-Light.ttf"),
        bolditalics: path.join(process.cwd(), "public", "fonts", "hind", "HindSiliguri-Medium.ttf"),
    },
}

export interface IMessMonthPdfObject {
    name: string
    balance: string
    summary: { data: string[][] }
}

export const MyPdfService = {
    createPdfStream: (doc: TDocumentDefinitions) => {
        const pdfmake = new Pdfmake(fonts)
        const pdfDoc = pdfmake.createPdfKitDocument(doc, {})
        return pdfDoc
    },
    getTable: (arr: string[][]) => {
        return {
            body: arr?.map((row, idx) => {
                // [n1],[v1]
                if (idx === 0) {
                    // { text: item, style: 'table_head' }
                    // return row.map((item) => { }) as Content
                    const ar: { text: string; style: string }[] = []
                    row.forEach((item) => {
                        ar.push({
                            text: item,
                            style: "table_head",
                        })
                    })
                    return [...ar]
                }
                return [...row]
            }),
        }
    },
    generatePdfDefinition: (obj: IMessMonthPdfObject): TDocumentDefinitions => {
        return {
            watermark: { text: "Nestpress", color: "blue", opacity: 0.03, bold: true, italics: false },
            content: [
                // {
                //     image: logo,
                //     width: 55,
                //     height: 55,
                //     style: 'img'
                // },
                {
                    text: "Nestpress",
                    style: "h1",
                },
                {
                    text: "Details Report",
                    style: "header",
                },
                {
                    text: `Title: date or month`,
                    style: "subheader",
                },
                [`Name: ${obj.name}`, `Balance: ${obj.balance}`, "\n"],
                {
                    // Mem summery Table
                    text: "Summery Info Table",
                    style: "table_name",
                },
                {
                    style: "table",
                    table: MyPdfService.getTable(obj?.summary?.data),
                },
            ],
            footer: {
                columns: [
                    {
                        text: `\n By Nestpress, ${DateUtil.getOnlyDate(new Date())}`,
                        link: "http://milon27.com",
                        style: "footer",
                    },
                ],
            },
            styles: {
                h1: {
                    fontSize: 18,
                    margin: [0, 0, 0, 10], // left, top, right, bottom
                    alignment: "center",
                    bold: true,
                    color: "#FC5A55",
                },
                header: {
                    fontSize: 16,
                    margin: [0, 0, 0, 10],
                    color: "#FC5A55",
                    bold: true,
                    alignment: "center",
                },
                subheader: {
                    fontSize: 14,
                    alignment: "center",
                    color: "#FC5A55",
                    margin: [0, 0, 0, 10],
                    decoration: "underline",
                },
                table_name: {
                    fontSize: 13,
                    bold: true,
                    alignment: "left",
                    color: "#FC5A55",
                    margin: [0, 0, 0, 10],
                },
                table_head: {
                    color: "#000",
                    bold: true,
                },
                table: {
                    margin: [0, 0, 0, 10],
                },
                footer: {
                    fontSize: 10,
                    margin: [20, 0, 0, 0], // left, top, right, bottom
                    color: "#FC5A55",
                    alignment: "center",
                },
                list: {
                    alignment: "left",
                    fontSize: 16,
                    margin: [0, 0, 0, 10],
                },
                img: {
                    alignment: "center",
                    margin: [0, 0, 0, 10],
                },
            },
            defaultStyle: {
                font: "Hind_Siliguri",
            },
        }
    },
    sendResponse: (response: Response, docDefinition: IMessMonthPdfObject) => {
        const pdfDocReadStream = MyPdfService.createPdfStream(MyPdfService.generatePdfDefinition(docDefinition))
        response.setHeader("Content-Type", "application/pdf")
        pdfDocReadStream.pipe(response)
        pdfDocReadStream.end()
    },
}
