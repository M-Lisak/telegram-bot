module.exports = {
     gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
                [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
                [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
                [{text: '0', callback_data: '0'}, {text: 'ccc', callback_data: 'ccc', input_field_placeholder: true }],
            ]
        })
    },

    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Играть еще раз', callback_data: '/again' }],
            ]
        })
    },

    inline_buttons: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Авторизоваться', callback_data: 'auth'}],
                [{text: 'Получить отчёт', callback_data: 'getReport'}],
            ]
        })
    },

    try_again: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Попробовать ещё раз', callback_data: 'getReport'}],
            ]
        })
    },

    select_date: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'За день', callback_data: 'getReportDay'}],
                [{text: 'За неделю', callback_data: 'getReportWeek'}],
                [{text: 'За месяц', callback_data: 'getReportMonth'}],
                [{text: 'Ввести дату', callback_data: 'getReportInputDate'}],
            ]
        })
    },

    auth_inline: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Авторизоваться', callback_data: 'auth'}],
            ]
        })
    },

    get_report_button: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Получить отчёт', callback_data: 'getReport'}],
            ]
        })
    },
}
