window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    maskedMode  = fieldData.maskedMode
    document.getElementById('mask').style = 'display:'+(parseInt(maskedMode)?'block':'none');
})