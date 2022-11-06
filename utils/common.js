let tmpArray = [];

function itemCheck(item) {
    if (tmpArray.indexOf(item) === -1) {
        tmpArray.push(item);
        return true
    }
    return false;
}

const getSelling = (data) => {//надо будет умножать на кол-во
    if(isEmptyObject(data)) return 0
    
    return data.map(el => el.retail_amount).reduce((sum, prev) => sum + prev, 0)
}

const getToPay = (data) => {//надо будет умножать на кол-во
    if(isEmptyObject(data)) return 0
    
    return data.map(el => el.ppvz_for_pay).reduce((sum, prev) => sum + prev, 0)
}

const getQuantity = (data) => {
    if(isEmptyObject(data)) return 0
    
    return data.map(el => el.quantity).reduce((sum, prev) => sum + prev, 0)
}

const getCountDelivery = (data) => {
    if(isEmptyObject(data)) return 0
    
    return data.map(el => el.delivery_amount).reduce((sum, prev) => sum + prev, 0)
}

const getSummDelivery = (data) => {
    if(isEmptyObject(data)) return 0

    return data.reduce((sum, prev) => sum + prev.delivery_amount * prev.delivery_rub, 0)
}

const getCountReturn = (data) => {
    if(isEmptyObject(data)) return 0

    return data.reduce((sum, prev) => sum + prev.return_amount, 0)
}

const getSummReturnCost = (data) => {
    if(isEmptyObject(data)) return 0

    return data.reduce((sum, prev) => sum + prev.return_amount * prev.delivery_rub, 0)
}

const getSummPenalties = (data) => {
    if(isEmptyObject(data)) return 0

    return data.reduce((sum, prev) => sum + prev.penalty, 0)
}

const getAdditionalPayment = (data) => {
    if(isEmptyObject(data)) return 0

    return data.reduce((sum, prev) => sum + prev.additional_payment, 0)
}

const buidlHeader = (sum) => {
    const first_row = [
        //A B C D E
        {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
        //F G H
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        //I J K
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: sum.sumJ, s: { fill: { fgColor: { rgb: 'ffda66' } } , font: { italic: true, sz: 12 }, alignment: { horizontal: 'center' } }, f: "ROUND(SUM(J4:J9999)-C11-C12-C14;0)"},
        {v: 0, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true}, alignment: { horizontal: 'center' }}, f: "ROUND(SUM(K4:K9999)-C11-C12-C14;0)"},
        //L M N O P Q R
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: Math.floor(sum.sumM), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumN), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumO, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(O4:O9999);0)'},
        {v: sum.sumP, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumQ, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumR), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //S T U V W X Y Z AA
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: Math.floor(sum.sumT/sum.count || 0), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(AVERAGE(T4:T9999);0)'},
        {v: Math.floor(sum.sumU/sum.count || 0), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumV/sum.count || 0), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: Math.ceil(sum.sumW/sum.count || 0), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumX, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumY, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(Y4:Y9999);0)'},
        {v: Math.floor(sum.sumZ), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: 0, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(AVERAGE(AA4:AA9999);0)'},
        //AB AC AD AE
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: sum.sumAC, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v:  Math.floor(sum.sumAD), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v:  Math.floor(sum.sumAE), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //AF AG
        {v: sum.sumAF, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumAG, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //AH AI AJ
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: sum.sumAI, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumAJ, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //AK AL AM
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: sum.sumAL, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumAM, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //AN AO AP AQ AR AS AT
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: sum.sumAO, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AO4:AO9999);0)'},
        {v: sum.sumAP, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AP4:AP9999);0)'},
        {v: sum.sumAQ, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AQ4:AQ9999);0)'},
        {v: sum.sumAR, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AR4:AR9999);0)'},
        {v: sum.sumAS, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AS4:AS9999);0)'},
        {v: sum.sumAT, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AT4:AT9999);0)'},
        //AU AV AW AX AY
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: Math.floor(sum.sumAV), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumAW, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        {v: sum.sumAX, s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}, f: 'ROUND(SUM(AX4:AX9999);0)'},
        {v: Math.floor(sum.sumAY), s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {italic: true, sz: 12}, alignment: { horizontal: 'center' }}},
        //AZ BA BB BC BD BE BF BG BH BI BJ BK BL BM BN BO BP BQ BR
        {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
        {v: Math.floor(sum.sumBA), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBB), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBC), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBD, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBE, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBF, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBG), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBH), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBI, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBJ), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBK, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: Math.floor(sum.sumBL), s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBM, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBN, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBO, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBP, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBQ, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
        {v: sum.sumBR, s: {fill: {fgColor: { rgb: '3f3f3f' }}, font: {italic: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'center' }}},
    ]
    const second_row = [
        {v: 'ОТЧЁТ', s: {fill: {fgColor: { rgb: 'CC66FF' } }, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: { sz: 12, name: 'Nunito'}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},

        {v: null, s: {fill: {fgColor: { rgb: '262626' }}}},
        {v: null, s: {fill: {fgColor: { rgb: '262626' }}}},
        {v: null, s: {fill: {fgColor: { rgb: '262626' }}}},

        {v: 'чистая ↓', s: {fill: {fgColor: { rgb: '66ff99' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Чистый доход', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,

        {v: 'основные ↓', s: { fill: {fgColor: { rgb: '6ea1fe' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Основные данные по товарам', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,
        null,
        null,
        null,
        null,

        {v: 'статистика ↓', s: {fill: {fgColor: { rgb: 'ffff85' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Статистика по товарам', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,
        null,
        null,
        null,
        null,
        null,
        null,

        {v: 'возвраты ↓', s: {fill: {fgColor: { rgb: 'f67272' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Возвраты', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,
        null,
        {v: 'Обратные доставки', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,

        {v: 'штрафы ↓', s: {fill: {fgColor: { rgb: 'f99d9d' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Штрафы', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,

        {v: 'брак ↓', s: {fill: {fgColor: { rgb: 'c5e0b3' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Брак', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,

        {v: 'cамовыкуп ↓', s: {fill: {fgColor: { rgb: 'ffcc66' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        {v: 'Самовыкупы', s: { alignment: { horizontal: 'center', vertical: 'center' } } },
        null,
        null,
        null,
        null,
        null,

        {v: 'остальное ↓', s: {fill: {fgColor: { rgb: 'd0cece' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito'}}},
        null,
        null,
        null,
        {v: '7', s: {fill: {fgColor: { rgb: 'ffe598' }}, alignment: { horizontal: 'right', vertical: 'center' }}},//Формула

        {v: 'исходные ↓', s: {fill: {fgColor: { rgb: '262626' }}, alignment: { horizontal: 'center', textRotation: 90, vertical: 'top' }, font: {name: 'Nunito', color: { rgb: 'ffffff' }}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
        {v: null, s: {fill: {fgColor: { rgb: '3f3f3f'}}}},
    ]
    const third_row = [
        null,
        null,
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},
        {v: null, s: {fill: {fgColor: { rgb: 'd8d8d8' }}}},

        {v: 'НОМ', s: {fill: {fgColor: { rgb: '262626' }},  font: {bold: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},
        {v: 'ШК', s: {fill: {fgColor: { rgb: '262626' }},  font: {bold: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},
        {v: 'АРТИКУЛ', s: {fill: {fgColor: { rgb: '262626' }},  font: {bold: true, sz: 12, color: { rgb: 'ffffff' }}, alignment: { horizontal: 'left' }}},

        null,
        {v: 'Чистая прибыль\n(с расходом на выкупы)', s: {fill: {fgColor: { rgb: '66ff99' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Чистая прибыль\n(по органике)', s: {fill: {fgColor: { rgb: '66ff99' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'ВБ Реализовал', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },
        {v: 'К оплате за вычетом комиссий', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },
        {v: 'Пришло за вычетом лог.и возв.', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },
        {v: 'ЗАК', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },
        {v: 'ВЫК', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },
        {v: 'Стоимость логистики', s: { fill: {fgColor: { rgb: '6ea1fe' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } } },

        null,
        {v: 'СР ПРИБ С ЕД', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'СР ЛОГ', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'СР Цена', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Заказ. В ДЕНЬ', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'НЕВЫК', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'ТОВАР СТОИМ', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Удерж ЛОГ', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: '% ВОЗВ', s: {fill: {fgColor: { rgb: 'ffff85' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'Возвраты', s: {fill: {fgColor: { rgb: 'f67272' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сумма Возврата Реализ', s: {fill: {fgColor: { rgb: 'f67272' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сумма Возврата к переч', s: {fill: {fgColor: { rgb: 'f67272' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        
        {v: 'Обратная Логистика', s: {fill: {fgColor: { rgb: 'f99d9d' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Возврат Доставка', s: {fill: {fgColor: { rgb: 'f99d9d' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'Штрафы', s: {fill: {fgColor: { rgb: 'f99d9d' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сумма штрафов', s: {fill: {fgColor: { rgb: 'f99d9d' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'Компенсация брака', s: {fill: {fgColor: { rgb: 'c5e0b3' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сумма компенсации', s: {fill: {fgColor: { rgb: 'c5e0b3' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'САМОВЫКУП', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'ФИКТИВН ДОХОД', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'ПОЛН РАСХОД ВЫКУП', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Лог Выкуп', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Налог Выкуп', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Комисс выкуп', s: {fill: {fgColor: { rgb: 'ffcc66' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'Ком ВБ', s: {fill: {fgColor: { rgb: '00cc99' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Доплаты', s: {fill: {fgColor: { rgb: '00cc99' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Недоприход / Переприход', s: {fill: {fgColor: { rgb: 'ff9999' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'НАЛОГ', s: {fill: {fgColor: { rgb: 'aeabab' }}, font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},

        null,
        {v: 'Реализ', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'К оплате', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'КОМ ВБ', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Выкупов', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'КР.пр.', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Реализ', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'К оплате', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сторно ед', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Реализ', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'К оплате', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Доставок', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Стоимость', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Возвратов', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Стоимость', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Доставок сторно', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Доставка сумма', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Возвратов сторно', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
        {v: 'Сумма Лог Возвр сторн', s: { font: {bold: true, sz: 10}, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }}},
    ]

    return [first_row, second_row, third_row]
}

const getStartCol = (ind, sum) => {
    const C5 = sum.sumBA + sum.sumBF - sum.sumBI - sum.sumAD + sum.sumAM
    const C6 = sum.sumBB + sum.sumBG - sum.sumBJ - sum.sumAE + sum.sumAM
    const C7 = sum.sumBL + sum.sumBN - sum.sumBP - sum.sumBR
    const C8 = sum.sumBL - sum.sumBP
    const C9 = sum.sumBN - sum.sumBR
    const C10 = sum.sumAJ
    const C11 = 0//////////////
    const C12 = 0//////////////
    const C13 =  sum.sumAW
    const C14 = 0//////////////
    const C18 = 0//////////////

    const C21 = 0
    const C22 = (sum.sumQ).toFixed(2)
    const C23 = (sum.sumP).toFixed(2)
    const C24 = (sum.sumP - sum.sumQ).toFixed(2)
    const C25 = (sum.sumAD).toFixed(2)
    const C26 = (sum.sumAC).toFixed(2)
    const C27 = sum.sumAO
    const C28 = 0

    const C30 = 0
    const C31 = (sum.sumV/sum.count || 0).toFixed(2)
    const C32 = (sum.sumU/sum.count || 0).toFixed(2)

    const C34 = sum.sumAV
    const C35 = sum.sumAY
    const C36 = sum.sumAQ

    const C40 = sum.sumK
    const C43 = sum.sumJ
    switch (ind) {
        case 0:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Данные ВБ:', s: {fill: {fgColor: { rgb: 'CC66FF' }},  font: {bold: true}}},
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                null
            ]
        case 1:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'ВБ Реализовал:',
                {v: C5, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 2: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'К перечислению:',
                {v: C6, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 3: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Логистика:',
                {v: C7, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 4: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}}, 
                'К клиенту:', 
                {v: C8, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ', 
                null
            ]
        case 5: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'От клиента:',
                {v: C9, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ', 
                null
            ]
        case 6:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Штрафы:',
                {v: C10, t: "n", s: { font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 7: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Хранение:',
                {v: C11, t: "n", s: {fill: {fgColor: { rgb: 'ffe598' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 8: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Удержание:',
                {v: C12, t: "n", s: {fill: {fgColor: { rgb: 'ffe598' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 9: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Доплата:',
                {v: C13, t: "n", s: {font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 10: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Платная приемка:',
                {v: C14, t: "n", s: {fill: {fgColor: { rgb: 'ffe598' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 12: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'К перечислению:',
                {v: 0, t: "n", s: {font: {bold: true}, alignment: { horizontal: 'right' }}, f: 'ROUND(C6-C7-C11-C10-C12-C14-C13;2)'},
                'РУБ',
                null
            ]
        case 13:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'Недоприход:',
                { v: 0, t: "n", s: {font: {bold: true}, alignment: { horizontal: 'right' }}, f: 'ROUND(C16-C18;2)'},
                'РУБ',
                null
            ]
        case 14:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                'ФАКТИЧЕСКИЙ ПРИХОД:',
                {v: C18, t: "n", s: {fill: {fgColor: { rgb: 'ffe598' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                'РУБ',
                null
            ]
        case 16: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Данные расчетов:', s: {fill: {fgColor: { rgb: 'ffda66' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffda66' }}}},
                null
            ]
        case 17: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Товара продано на:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C21, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!Y1"},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 18: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Ед. продано:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C22, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'ШТ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 19: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Ед. отправлено:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C23, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'ШТ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 20:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Не выкупили ед.:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C24, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'ШТ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 21:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Возвратов на сумму:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C25, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 22: 
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Возвратов шт.:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C26, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'ШТ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 23:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Самовыкупов ед.:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C27, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!AO1"},
                {v: 'ШТ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 24:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Расход на выкупы:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C28, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!AQ1"},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 25:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 26:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Ср. прибыль с ед.:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C30, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!T1"},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 27:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Ср. цена:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C31, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 28:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Ср. логистика:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C32, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 29:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 30:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Комиссия ВБ/СПП/Поверенный:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C34, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 31:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Налог:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C35, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 32:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'Расход на самовыкуп:', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: C36, t: "n", s: {fill: {fgColor: { rgb: 'ffffcc' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!AQ1"},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 33:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 34:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 35:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 36:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'ЧИСТАЯ ПРИБЫЛЬ:', s: {fill: {fgColor: { rgb: 'ffda66' }}}},
                {v: C40, t: "n", s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: 'K1'},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 37:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: '(по органике-хранение)', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 38:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 39:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: 'ЧИСТАЯ ПРИБЫЛЬ ФАКТ:', s: {fill: {fgColor: { rgb: 'ffda66' }}}},
                {v: C43, t: "n", s: {fill: {fgColor: { rgb: 'ffda66' }}, font: {bold: true}, alignment: { horizontal: 'right' }}, f: "'ИТОГИ'!J1"},
                {v: 'РУБ', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        case 40:
            return [
                {v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}},
                {v: '(за вычетом расхода на самовык)', s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                {v: null, s: {fill: {fgColor: { rgb: 'ffffcc' }}}},
                null
            ]
        default:
            return [{v: null, s: {fill: {fgColor: { rgb: 'CC66FF' }}}}, null, null, null, null]
    }
}

const getRange = () => {
    return [
        { s: {c: 0, r: 1}, e: {c: 0, r: 2} },
        { s: {c: 8, r: 1}, e: {c: 8, r: 2 } },
        { s: {c: 11, r: 1}, e: {c: 11, r: 2 } },
        { s: {c: 18, r: 1}, e: {c: 18, r: 2 } },
        { s: {c: 27, r: 1}, e: {c: 27, r: 2 } },
        { s: {c: 33, r: 1}, e: {c: 33, r: 2 } },
        { s: {c: 36, r: 1}, e: {c: 36, r: 2 } },
        { s: {c: 39, r: 1}, e: {c: 39, r: 2 } },
        { s: {c: 46, r: 1}, e: {c: 46, r: 2 } },
        { s: {c: 51, r: 1}, e: {c: 51, r: 2 } },
        { s: {c: 9, r: 1}, e: {c: 10, r: 1 } },
        { s: {c: 12, r: 1}, e: {c: 17, r: 1 } },
        { s: {c: 19, r: 1}, e: {c: 26, r: 1 } },
        { s: {c: 28, r: 1}, e: {c: 30, r: 1 } },
        { s: {c: 31, r: 1}, e: {c: 32, r: 1 } },
        { s: {c: 34, r: 1}, e: {c: 35, r: 1 } },
        { s: {c: 37, r: 1}, e: {c: 38, r: 1 } },
        { s: {c: 40, r: 1}, e: {c: 45, r: 1 } },
    ]
}

const getCols = () => {
    return [
        { wch: 3 },//A
        { wch: 30, level: 1 },//B
        { wch: 13, level: 1 },//C
        { wch: 5, level: 1 },//D
        { wch: 13, level: 1 },//E

        { wch: 12 },//F
        { wch: 17 },//G
        { wch: 24 },//H

        { wch: 2 },//I
        { wch: 14, level: 1 },//J
        { wch: 14, level: 1 },//K

        { wch: 2 },//L
        { wch: 10, level: 1 },//M
        { wch: 10, level: 1 },//N
        { wch: 10, level: 1 },//O
        { wch: 8, level: 1 },//P
        { wch: 8, level: 1 },//Q
        { wch: 10, level: 1 },//R

        { wch: 2 },//S
        { wch: 7, level: 1 },//T
        { wch: 7, level: 1 },//U
        { wch: 7, level: 1 },//V
        { wch: 7, level: 1 },//W
        { wch: 7, level: 1 },//X
        { wch: 9, level: 1 },//Y
        { wch: 7, level: 1 },//Z
        { wch: 7, level: 1 },//AA

        { wch: 2 },//AB
        { wch: 10, level: 1 },//AC
        { wch: 10, level: 1 },//AD
        { wch: 10, level: 1 },//AE
        { wch: 12, level: 1 },//AF
        { wch: 12, level: 1 },//AG

        { wch: 2 },//AH
        { wch: 8, level: 1 },//AI
        { wch: 8, level: 1 },//AJ

        { wch: 2 },//AK
        { wch: 13, level: 1 },//AL
        { wch: 13, level: 1 },//AM

        { wch: 2 },//AN
        { wch: 8, level: 1 },//AO
        { wch: 8, level: 1 },//AP
        { wch: 8, level: 1 },//AQ
        { wch: 8, level: 1 },//AR
        { wch: 8, level: 1 },//AS
        { wch: 8, level: 1 },//AT

        { wch: 2 },//AU
        { wch: 9, level: 1 },//AV
        { wch: 9, level: 1 },//AW
        { wch: 13, level: 1 },//AX
        { wch: 9, level: 1 },//AY

        { wch: 2 },//AZ
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
        { wch: 8, level: 1 },
    ]
}

const getRows = () => {
    return [
        { hpx: 18 },
        { hpx: 22 },
        { hpx: 96 },
    ]
}


const isEmptyObject = (obj) => {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    itemCheck: itemCheck,
    isEmptyObject: isEmptyObject,
    getSelling: getSelling,
    getToPay: getToPay,
    getQuantity: getQuantity,
    getCountDelivery: getCountDelivery,
    getSummDelivery: getSummDelivery,
    getCountReturn: getCountReturn,
    getSummReturnCost: getSummReturnCost,
    getSummPenalties: getSummPenalties,
    getAdditionalPayment: getAdditionalPayment,
    buidlHeader: buidlHeader,
    getStartCol: getStartCol,
    getRange: getRange,
    getCols: getCols,
    getRows: getRows,


}