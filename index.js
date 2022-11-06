const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, inline_buttons, try_again, select_date, auth_inline, get_report_button} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');
const Api = require('./apis');

var XLSX = require('xlsx-js-style');

const { getSelling, itemCheck, getToPay, getQuantity, getCountDelivery, getSummDelivery, getCountReturn, getSummReturnCost, getAdditionalPayment, getSummPenalties, buidlHeader, getStartCol, getRange, getCols, getRows } = require('./utils/common');
const token = '5742477796:AAEPuZBxroVV1pI-16NjIqZdYXr2yTed9ps'

const bot = new TelegramApi(token, {polling: true})

const getReport = async (chatId, dateTo, dateFrom) => {
    const user = await UserModel.findOne({chatId}) || {}
    console.log("user", JSON.stringify(user, null, '\t'))
    const key = user.key_API //'MDQ1YzEzOWQtNzliMy00NGRlLWEzNDYtMWJiZmZhMzIyYmFm'
    const limit = 99999
    var allSum = {
        count: 0,
        sumJ: 0,//
        sumK: 0,//
        sumM: 0,
        sumN: 0,
        sumO: 0,//
        sumP: 0,
        sumQ: 0,
        sumR: 0,
        sumT: 0,// 
        sumU: 0,
        sumV: 0,
        sumW: 0,
        sumX: 0,
        sumY: 0,//
        sumZ: 0,
        sumAA: 0,//
        sumAC: 0,
        sumAD: 0,
        sumAE: 0,
        sumAF: 0,
        sumAG: 0,
        sumAI: 0,
        sumAJ: 0,
        sumAL: 0,
        sumAM: 0,
        sumAO: 0,//
        sumAP: 0,//
        sumAQ: 0,//
        sumAR: 0,//
        sumAS: 0,//
        sumAT: 0,//
        sumAV: 0,
        sumAW: 0,
        sumAX: 0,//
        sumAY: 0,
        sumBA: 0,
        sumBB: 0,
        sumBC: 0,
        sumBD: 0,
        sumBE: 0,
        sumBF: 0,
        sumBG: 0,
        sumBH: 0,
        sumBI: 0,
        sumBJ: 0,
        sumBK: 0,
        sumBL: 0,
        sumBM: 0,
        sumBN: 0,
        sumBO: 0,
        sumBP: 0,
        sumBQ: 0,
        sumBR: 0,
    }

    if(!key) return bot.sendMessage(chatId, 'Чтобы получить отчёт, нужно авторизоваться', auth_inline)
    if(!dateTo || !dateFrom) return bot.sendMessage(chatId, 'Выберите время', select_date)

    await bot.sendMessage(chatId, `Скачиваю отчёт...`)

    var report
    try {
        report = await Api.reports.reportDetailByPeriod({ key, limit, dateFrom, dateTo })
    } catch (error) {
        console.error('ERROR FETCH Report', error)
        return bot.sendMessage(chatId, 'Ошибка получения отчёта от сервисов WB', try_again)
    }

    if(!report) return bot.sendMessage(chatId, 'За указанный интервал времени у вас не было продаж', try_again)

    const uniqueNmId = report.map(({nm_id}) => nm_id).filter((item) => itemCheck(item))//[23542398, 59349211, 34874389, ...]// нужен ещё артикул поставщика sa_name и ШК
    
    if(!uniqueNmId.length) return bot.sendMessage(chatId, 'Нет ни одной записи за указанный период времени', try_again)

    bot.sendMessage(chatId, 'Формирую таблицы...')

    const uniqueSupplierOperName = ['Продажа', 'Возврат', 'Корректная продажа', 'Логистика', 'Логистика сторно', 'Оплата брака', 'Сторно продаж', 'Штрафы', 'Доплаты' ]
    const reppp = uniqueNmId.map((unique, ind) => {
        const dataNm_id = report.filter(({nm_id}) => unique === nm_id)//все данные по одной номенклатуре
        //формируем данные по массиву uniqueSupplierOperName
        const calculationsData = uniqueSupplierOperName.map((uniqueOperName) => ({
            [uniqueOperName]: dataNm_id.filter(({supplier_oper_name}) => supplier_oper_name === uniqueOperName)
                                        .map((item) => {
                                            return {
                                                quantity: item.quantity,//кол-во                                                //Продажа, Корр. прод, Сторно прод, Возврат, Оплата брака,
                                                retail_amount: item.retail_amount,//реализ                                      //Продажа, Корр. прод, Сторно прод, Возврат,
                                                ppvz_for_pay: item.ppvz_for_pay,//к перечислению                                //Продажа, Корр. прод, Сторно прод, Возврат, Оплата брака,
                                                delivery_amount: item.delivery_amount,//кол-во доставок                         //Логистика, Логистика сторно,
                                                delivery_rub: item.delivery_rub,//Услуги по доставке товара покупателю(сумм)    //Логистика, Логистика возвр., Логистика сторно, Сторно обр.,
                                                return_amount: item.return_amount,//кол-во возвратов                            //Логистика возвр., Сторно обр., Штрафы, 
                                                penalty: item.penalty,//штрафы                                                  //Штрафы, 
                                                additional_payment: item.additional_payment,//доплаты                           //Доплаты
                                            }
                                        })
        }))
        const table1 = calculationsData.find(elem => Object.keys(elem) == 'Продажа')['Продажа']
        const table2 = calculationsData.find(elem => Object.keys(elem) == 'Корректная продажа')['Корректная продажа']
        const table3 = calculationsData.find(elem => Object.keys(elem) == 'Сторно продаж')['Сторно продаж']
        const table4 = calculationsData.find(elem => Object.keys(elem) == 'Логистика')['Логистика']
        const table5 = calculationsData.find(elem => Object.keys(elem) == 'Логистика сторно')['Логистика сторно']
        const table6 = calculationsData.find(elem => Object.keys(elem) == 'Возврат')['Возврат']
        const table7 = calculationsData.find(elem => Object.keys(elem) == 'Штрафы')['Штрафы']
        const table8 = calculationsData.find(elem => Object.keys(elem) == 'Оплата брака')['Оплата брака']

        const selling = getSelling(table1)
        const toPay = getToPay(table1)
        const ransoms = getQuantity(table1)
        const numberCorrectSale = getQuantity(table2)
        const sellingCorrectSale = getSelling(table2)
        const toPayCorrectSale = getToPay(table2)
        const numberReversal = getQuantity(table3)
        const sellingReversal = getSelling(table3)
        const toPayReversal = getToPay(table3)
        const countDelivery = getCountDelivery(table4)
        const summDelivery = getSummDelivery(table4)
        const countReturnLog = getCountReturn(table4)
        const summReturnCost = getSummReturnCost(table4)
        const countStornoDelivery = getCountDelivery(table5)
        const summStornoDelivery = getSummDelivery(table5)
        const countStornoReturn = getCountReturn(table5)
        const summStornoReturn = getSummReturnCost(table5)
        const countReturn = getQuantity(table6)
        const summRealizationReturn = getSelling(table6)
        const summToPayReturn = getToPay(table6)
        const countPenalties = getCountReturn(table7)
        const summPenalties = getSummPenalties(table7)
        const countRejects = getQuantity(table8) 
        const summRejects = getToPay(table8)
        const WBImplemented = selling + sellingCorrectSale - sellingReversal - summRealizationReturn + summRejects
        const toBePaidMinusTheCommission = toPay + toPayCorrectSale - toPayReversal - summToPayReturn + summRejects
        // const itCameMinusLogisticsAndRefunds =  toBePaidMinusTheCommission - summDelivery - summReturnCost + summStornoDelivery + summStornoReturn - summPenalties - 'AX4'
        // const ax = 
        const additionalPayment = getAdditionalPayment(calculationsData.find(elem => Object.keys(elem) == 'Доплаты')['Доплаты'])

        const U = summDelivery / (countDelivery - countStornoDelivery) || 0
        const P = countDelivery - countStornoDelivery
        const Q = ransoms + numberCorrectSale - numberReversal - countReturn
        const R = summDelivery - summStornoDelivery
        const V = selling/ransoms || 0
        const W = countDelivery / 7//это если недельный отчёт
        const X = countDelivery - ransoms || 0
        const Z = (countDelivery - ransoms)*U
        const AF = countReturnLog - countStornoReturn
        const AG = summReturnCost - summStornoReturn
        const AV = WBImplemented - toBePaidMinusTheCommission
        const AY = WBImplemented / 100 * 7//вместо 7 должна быть переменная налога
        const BC = selling - toPay

        allSum.count++
        allSum.sumM += WBImplemented
        allSum.sumN += toBePaidMinusTheCommission
        allSum.sumP += P
        allSum.sumQ += Q
        allSum.sumR += R
        // allSum.sumT += 
        allSum.sumU += U
        allSum.sumV += V
        allSum.sumW += W
        allSum.sumX += X
        allSum.sumZ += Z
        allSum.sumAC += countReturn
        allSum.sumAD += summRealizationReturn
        allSum.sumAE += summToPayReturn
        allSum.sumAF += AF
        allSum.sumAG += AG
        allSum.sumAI += countPenalties
        allSum.sumAJ += summPenalties
        allSum.sumAL += countRejects
        allSum.sumAM += summRejects
        allSum.sumAV += AV
        allSum.sumAW += additionalPayment
        allSum.sumAY += AY
        allSum.sumBA += selling
        allSum.sumBB += toPay
        allSum.sumBC += BC
        allSum.sumBD += ransoms
        allSum.sumBE += numberCorrectSale
        allSum.sumBF += sellingCorrectSale
        allSum.sumBG += toPayCorrectSale
        allSum.sumBH += numberReversal
        allSum.sumBI += sellingReversal
        allSum.sumBJ += toPayReversal
        allSum.sumBK += countDelivery
        allSum.sumBL += summDelivery
        allSum.sumBM += countReturnLog
        allSum.sumBN += summReturnCost
        allSum.sumBO += countStornoDelivery
        allSum.sumBP += summStornoDelivery
        allSum.sumBQ += countStornoReturn
        allSum.sumBR += summStornoReturn

        // console.log("fff", dataNm_id)
        return [
            {v: unique, t: 'n', s: {fill: {fgColor: { rgb: '262626' }},  font: {color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},
            {v: dataNm_id[0].barcode, t: 'n', s: {fill: {fgColor: { rgb: '262626' }},  font: {color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},
            {v: dataNm_id[0].sa_name, t: 's', s: {fill: {fgColor: { rgb: '262626' }},  font: {color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},

            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: 0, t: 'n', s: { font: { bold: true }, alignment: { horizontal: 'center' } }, f: `ROUND(K${ind + 4}-AS${ind + 4}-AR${ind + 4}-AT${ind + 4};0)`},
            {v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR((IFERROR(((O${ind + 4}/Q${ind + 4}*(Q${ind + 4}-AO${ind + 4})));"0")-IFERROR(((Y${ind + 4}/Q${ind + 4}*(Q${ind + 4}-AO${ind + 4})));"0")-IFERROR(((AY${ind + 4}/Q${ind + 4}*(Q${ind + 4}-AO${ind + 4})));"0"));"0")-AJ${ind + 4}+AX${ind + 4};0)`},

            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: Math.floor(WBImplemented), t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }},
            {v: Math.floor(toBePaidMinusTheCommission), t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }},
            {v: 0, t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }, f: `ROUND(N${ind + 4}-BL${ind + 4}-BN${ind + 4}+BP${ind + 4}+BR${ind + 4}-AJ${ind + 4}-AX${ind + 4};0)`},
            {v: P, t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }},
            {v: Q, t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }},
            {v: Math.floor(R), t: 'n', s: {fill: {fgColor: { rgb: 'eef6fc'}}, alignment: {horizontal: 'center'} }},
            
            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: 0, t: 'n', s: {fill: {fgColor: { rgb: 'ffffcc'}}, alignment: {horizontal: 'center'}, font: { bold: true } }, f: `ROUND(IFERROR((K${ind + 4}/Q${ind + 4});"0");0)`},
            {v: Math.floor(U), t: 'n', s: {fill: {fgColor: { rgb: 'ffffcc'}}, alignment: {horizontal: 'center'}, font: { bold: true } }},
            {v: Math.floor(V), t: 'n', s: {fill: {fgColor: { rgb: 'ffffcc'}}, alignment: {horizontal: 'center'}, font: { bold: true } }},
            {v: Math.ceil(W), t: 'n', s: {fill: {fgColor: { rgb: 'ffffcc'}}, alignment: {horizontal: 'center'}, font: { bold: true } }},
            {v: X, t: 'n', s: {fill: {fgColor: { rgb: 'ffffcc'}}, alignment: {horizontal: 'center'}, font: { bold: true } }},
            {v: 0, t: 'n', s: { alignment: { horizontal: 'center' } }, f: `ROUND(IFERROR(VLOOKUP(F${ind + 4};'ЗАПОЛНЕНИЕ'!A:B;2;0)*(Q${ind + 4}+AL${ind + 4});"");0)`},
            {v: Math.floor(Z), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: 0, t: 'n', s: { alignment: { horizontal: 'center' } }, f: `ROUND(IFERROR(((100/(BD${ind + 4}-AO${ind + 4})*AC${ind + 4}));"0");0)`},
            
            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: countReturn, t: 'n', s: {fill: {fgColor: { rgb: 'f7bfbf'}}, alignment: {horizontal: 'center'} }},
            {v: summRealizationReturn, t: 'n', s: {fill: {fgColor: { rgb: 'f7bfbf'}}, alignment: {horizontal: 'center'} }},
            {v: summToPayReturn, t: 'n', s: {fill: {fgColor: { rgb: 'f7bfbf'}}, alignment: {horizontal: 'center'} }},
            {v: AF, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: AG, t: 'n', s: { alignment: { horizontal: 'center' } }},
            
            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: countPenalties, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: summPenalties, t: 'n', s: { alignment: { horizontal: 'center' } }},

            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: countRejects, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: summRejects, t: 'n', s: { alignment: { horizontal: 'center' } }},
            
            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR(VLOOKUP(F${ind + 4};'ЗАПОЛНЕНИЕ'!A:C;3;0);"0");0)`},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR((AO${ind + 4}*T${ind + 4});"0");0)`},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR((AR${ind + 4}+AS${ind + 4}+AT${ind + 4});"");0)`},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR((AO${ind + 4}*U${ind + 4});"");0)`},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR((((M${ind + 4}/Q${ind + 4})/100*7)*AO${ind + 4});"0");0)`},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' }}, f: `ROUND(IFERROR(((AV${ind + 4}/Q${ind + 4})*AO${ind + 4});"0");0)`},

            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: Math.floor(AV), t: 'n', s: {fill: {fgColor: { rgb: 'e9f7ee'}}, alignment: {horizontal: 'center'} }},
            {v: additionalPayment, t: 'n', s: {fill: {fgColor: { rgb: 'e9f7ee'}}, alignment: {horizontal: 'center'} }},
            { v: 0, t: 'n', s: { alignment: { horizontal: 'center' } }, f: `ROUND(IFERROR(('ИТОГИ'!$C$17/$Q$1*Q${ind + 4});"0");0)`},
            {v: Math.ceil(AY), t: 'n', s: { alignment: { horizontal: 'center' } }},

            {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8'}}}},
            {v: Math.ceil(selling), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(toPay), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(BC), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: ransoms, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: numberCorrectSale, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(sellingCorrectSale), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(toPayCorrectSale), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: numberReversal, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: sellingReversal, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(toPayReversal), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: countDelivery, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v:  Math.ceil(summDelivery), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: countReturnLog, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(summReturnCost), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: countStornoDelivery, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(summStornoDelivery), t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: countStornoReturn, t: 'n', s: { alignment: { horizontal: 'center' } }},
            {v: Math.ceil(summStornoReturn), t: 'n', s: { alignment: { horizontal: 'center' } }},
        ]
    })
//если start_col больше чем reppp, надо поменять их местами
    const finalReport = reppp.map((item, ind) => {
        const start_col = getStartCol(ind, allSum)

        return [...start_col, ...item]
    })

    const fillingSheet = uniqueNmId.map((unique) => {
        return [
            {v: unique, t: 'n', s: {fill: {fgColor: { rgb: '424242'}}, alignment: {horizontal: 'center'}, font: {color: { rgb: 'ffffff'}} }},
            {v: null, t: 'n', s: {fill: {fgColor: { rgb: '424242'}}, alignment: {horizontal: 'center'}, font: {color: { rgb: 'ffffff'}} }},
            {v: null, t: 'n', s: {fill: {fgColor: { rgb: 'ccecff'}}, alignment: {horizontal: 'center'} }},
        ]
    })

    // console.log("finalReport", JSON.stringify(finalReport, null, '\t'))
    

    await buildXLSX(chatId, finalReport, allSum, fillingSheet)

    return await bot.sendMessage(chatId, 'Меню', get_report_button)
    // console.log("REEEEEPP", JSON.stringify(reppp, null, '\t'))

}

const buildXLSX = async (chatId, report, allSum, fillingSheet) => {
    const header = buidlHeader(allSum)
    const header2 = [{v: 'ВСТАВИТЬ ЦЕНУ И ВЫКУП', s: {fill: {fgColor: { rgb: 'CC66FF' }}}}]
    const range = getRange()
    const colsWidth = getCols()
    const rowsHeigth = getRows()
    const options = { cellStyles: true, type: 'buffer' }
    
    const wb = XLSX.utils.book_new()

    const ws = XLSX.utils.aoa_to_sheet([...header, ...report])
    ws['!cols'] = colsWidth
    ws['!merges'] = range
    ws['!rows'] = rowsHeigth


    const ws2 = XLSX.utils.aoa_to_sheet([header2, ...fillingSheet])
    ws2['!cols'] = [{ wch: 25 }, { wch: 18 }]
    ws2['!merges'] = [{ s: {c: 0, r: 0}, e: {c: 2, r: 0} }]
    
    XLSX.utils.book_append_sheet(wb, ws, "ИТОГИ")
    XLSX.utils.book_append_sheet(wb, ws2, "ЗАПОЛНЕНИЕ")
    
    // const buffer = XLSX.write(wb, options)
    const buffer = XLSX.write(wb, options)
    
    try {
        await bot.sendDocument(chatId, buffer, {}, {filename: `reports.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    } catch (e) {
        console.error("Build Xlsx Error", e)
    }


    // const ws = XLSX.utils.aoa_to_sheet([row], options);
    // XLSX.writeFile(wb, "report.xlsx", options);

    // try {
        // const buffer = xlsx.build([{ name: 'ИТОГИ', data: [...header, ...report] }], {sheetOptions, writeOptions })

    //     bot.sendDocument(chatId, buffer, {}, {filename: 'reports.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    // } catch (e) {
    //     console.error("Build Xlsx Error", e)
    // }

}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        // {command: '/info', description: 'Получить информацию о пользователе'},
        // { command: '/auth', description: 'Указать API-ключ' },
        // {command: '/getreport', description: 'Получить отчёт (пока только за неделю)'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                const isUserCreate = await UserModel.findOne({chatId})
                console.log('/start', JSON.stringify(isUserCreate, null, '\t'))
                if(!isUserCreate) await UserModel.create({chatId})

                await bot.sendMessage(chatId, `Добро пожаловать в телеграм бот!`);
                return bot.sendMessage(chatId, 'Выберите', inline_buttons)
            }
            if (text === '/info') {
            const info = sales.find(elem => Object.keys(elem) == 'Продажа')

            console.log("info", info)
               
                // const user = await UserModel.findOne({chatId})
                // return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}, API ${user.key_API}`);
            }
            // return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            console.log("START ERROR", e)
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        const cbq_id = msg.id
        console.log("chatId", chatId)
        // console.log("finalReport", JSON.stringify(msg, null, '\t'))

        let params = data.split("_");

        if (params[0] === "cal") {
            // выведем календарь на экран по переданным параметрам
            viewCal(params[1], params[2], chatId, cbq_id, msg.message.message_id);
        }

        else if (params[0] === "info") {
            // выведем информацию
            notice(cbq_id, params[1])
            const dateTo = new Date()
            const dateFrom = new Date (params[1])
            // console.log("getTimezoneOffset()", dateTo.getTimezoneOffset())
            // console.log("dateTo", dateTo)
            // console.log("dateFrom", dateFrom)
            // return
            return getReport(chatId, dateTo, dateFrom)
        } else {
            // заглушим просто запрос
            notice(cbq_id, "This is notice for bot");
        }

        if(data === 'getReport') {
            return bot.sendMessage(chatId, `Выберите время, за которое нужен отчёт`, select_date)
        }
        if(data === 'getReportDay') {
            const dateTo = new Date()
            const dateFrom = new Date(dateTo - 86400000)
            return getReport(chatId, dateTo, dateFrom)
        }
        if(data === 'getReportWeek') {
            const dateTo = new Date()
            const dateFrom = new Date(dateTo - 604800000)
            return getReport(chatId, dateTo, dateFrom)
        }
        if(data === 'getReportMonth') {
            const dateTo = new Date()
            const dateFrom = new Date(dateTo - 2592000000)
            return getReport(chatId, dateTo, dateFrom)
        }
        if(data === 'getReportInputDate') {
            // await bot.sendMessage(chatId, 'Выбери дату', )
            viewCal((new Date()).getFullYear(), (new Date()).getMonth(), chatId)
        }
        if(data === 'auth') {
            let listenerReply
            const user = await UserModel.findOne({chatId})

            let contentMessage = await bot.sendMessage(chatId, 'Введите ключ для работы с API статистики x64', {
                'reply_markup': {
                    'force_reply': true
                }
            })

            listenerReply = (async (replyHandler) => {
                bot.removeReplyListener(listenerReply)
                user.key_API = replyHandler.text

                await user.save()
                await bot.sendMessage(replyHandler.chat.id, `Ваш API-ключ ${replyHandler.text}`, {"reply_markup": {"force_reply": false}})
                await bot.sendMessage(chatId,'Получение отчёта', get_report_button)
            })
            bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply)
            return 
        }
        // const user = await UserModel.findOne({chatId})
        // if (data == chats[chatId]) {
            // user.right += 1;
            // await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        // } else {
            // user.wrong += 1;
            // await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        // }
        // await user.save();
    })
}

async function viewCal(year, month, chatId, cbq_id = null, message_id = null) {
    // получаем массив дней месяца
    let dayLines = getDays(year, month);
    // определим переданную дату
    let currentMonthDate = new Date(+year, +month);
    // дата предыдущего месяца
    let prevMonthDate = (new Date((new Date(currentMonthDate)).setMonth(currentMonthDate.getMonth() - 1)))
    // дата следующего месяца
    let nextMonthDate = (new Date((new Date(currentMonthDate)).setMonth(currentMonthDate.getMonth() + 1)))
    // определим параметры переданного месяца
    let current_info = currentMonthDate.getFullYear() +  "-" + setBeforeZero(currentMonthDate.getMonth() + 1);
    // определим кнопки
    let buttons = [];
    // первый ряд кнопок это навигация календаря
    buttons.push([
      {
        text: "<<<",
        callback_data: "cal_" + prevMonthDate.getFullYear() + "_" + prevMonthDate.getMonth()
      },
      {
        text: current_info,
        callback_data: "info_" + current_info
      },
      {
        text: ">>>",
        callback_data: "cal_" + nextMonthDate.getFullYear() + "_" + nextMonthDate.getMonth()
      }
    ]);
    // переберем дни
    dayLines.forEach(function(line) {
      // добавим ряд кнопок
      buttons[buttons.length] = [];
      // переберем линию дней
      line.forEach(function(day) {
        // добавим кнопку
        buttons[buttons.length - 1].push({
          text: day,
          callback_data: day > 0
            ? "info_" + current_info + "-" + setBeforeZero(day)
            : "inline"
        });
      });
    });
    // готовим данные
    let data = {
      chat_id: chatId,
      text: "Календарь:\n\n" + currentMonthDate.toLocaleString('ru', {month: 'long', year: 'numeric'}),
      parse_mode: "html",
      reply_markup: JSON.stringify({inline_keyboard: buttons})
    };
    // проверим как отправлять: как новое или замена содержимого
    if (message_id !== null) {
      // гасим запрос
    //   notice(cbq_id);
      // добавим message_id
      data.message_id = message_id;
      // направим в Телеграм на изменение сообщения
      return await bot.editMessageText(data.text, {chat_id: chatId, message_id: message_id, reply_markup: data.reply_markup} 
      )
    } else {
      // направим сообщение в чат
      return await  bot.sendMessage(chatId, `${data.text}`, {reply_markup: data.reply_markup});
    //   return {text: 'sendMessage', data: data}
    }
}

function getDays(year, month) {
    // получаем дату
    let d = new Date(year, month);
    // объявляем массив
    let days = [];
    // добавляем первую строку
    days[days.length] = [];
    // добавляем в первую строку пустые значения
    for (let i = 0; i < getNumDayOfWeek(d); i++) {
      days[days.length - 1].push("-");
    }
    // выходим пока месяц не перешел на другой
    while (d.getMonth() === +month) {
      // добавляем в строку дни
      days[days.length - 1].push(d.getDate());
      // вс, последний день - перевод строки
      if (getNumDayOfWeek(d) % 7 === 6) {
        // добавляем новую строку
        days[days.length] = [];
      }
      // переходим на следующий день
      d.setDate(d.getDate() + 1);
    }
    // дозаполняем последнюю строку пустыми значениями
    if (getNumDayOfWeek(d) !== 0) {
      for (let i = getNumDayOfWeek(d); i < 7; i++) {
        days[days.length - 1].push("-");
      }
    }
    // вернем массив
    return days;
}

function getNumDayOfWeek(date) {
    // получим день недели
    let day = date.getDay();
    // вернем на 1 меньше [0 - вск]
    return (day === 0) ? 6 : day - 1;
}

async function notice(cbq_id, text = null) {
    // определим данные
    let data = {
      callback_query_id: cbq_id,
      alert: false,
    };
    // если есть текст то добавим
    if (text !== null) {
      data.text = text;
    }
    return
    // отправим в Телеграм
    // return await bot.sendMessage(chatId, `${data.text}`, {reply_markup: data.reply_markup});
    // query("answerCallbackQuery", data);
}

function setBeforeZero(num) {
    return ("0" + (num)).slice(-2);
  }

start()
