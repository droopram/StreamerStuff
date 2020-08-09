let timer = null,
    userLocale = "en-US",
    includeFollowers = true,
    includeRedemptions = true,
    includeHosts = true,
    minHost = 0,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minTip = 0,
    includeCheers = true,
    minCheer = 0;

let alertElements = [];

let userCurrency,
    totalEvents = 0;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    event.amount = event.amount ? event.amount : 0;

    //What we do here is build an array with all the alerts we want and the data it supposed to have.
    //This way we can just loop through the array and call the 'alert'  function.
    let alerts = [
        {
            enabled: includeFollowers,
            text: 'New follower',
            type:'follower',
        },
        {
            enabled: includeRedemptions,
            text: 'Redeemed',
            type:'redemption',
        },
        {
            enabled: includeSubs,
            text: 'New Sub',
            type:'subscriber',
        },
        {
            enabled: includeHosts && minHost <= event.amount,
            text: `Host ${event.amount.toLocaleString()}`,
            type:'host',
        },
        {
            enabled: includeRaids && minRaid <= event.amount,
            text: `${event.amount.toLocaleString()} Bits`,
            type:'cheer',
        },
        {
            enabled: includeTips && minTip <= event.amount,
            text: event.amount.toLocaleString(userLocale, {
                style: 'currency',
                minimumFractionDigits: 0,
                currency: userCurrency.code
            }),
            type:'tip',
        },
        {
            enabled: includeCheers && minCheer <= event.amount,
            text:`Raid ${event.amount.toLocaleString()}`,
            type:'raid',
        }
    ];
    
    alerts.forEach( alert => {
        if (alert.enabled && listener === alert.type) {
            addAlert(alert.type, alert.text, event.name);
        }
    });
});


window.addEventListener('onWidgetLoad', function (obj) {
    //Initialize widget. Load variables from streamelements thingies.
    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
    includeFollowers = (fieldData.includeFollowers === "yes");
    includeRedemptions = (fieldData.includeRedemptions === "yes");
    includeHosts = (fieldData.includeHosts === "yes");
    minHost = fieldData.minHost;
    includeRaids = (fieldData.includeRaids === "yes");
    minRaid = fieldData.minRaid;
    includeSubs = (fieldData.includeSubs === "yes");
    includeTips = (fieldData.includeTips === "yes");
    minTip = fieldData.minTip;
    includeCheers = (fieldData.includeCheers === "yes");
    minCheer = fieldData.minCheer;
    userLocale = fieldData.locale;
    cuttingAnimationDelay = fieldData.cuttingAnimationDelay;
    cuttingAnimationDuration = fieldData.cuttingAnimationDuration;
});

function addAlert(type, text, username) {
    totalEvents += 1;
    let element; 
    
    element = `
    <div id="event-${totalEvents}" class="sub-alert">
        <h2>${text}</h2>
            <div id="cut-wrapper">
                <h1  id="line-1">${username}</h1>
				<h1  id="line-2">${username}</h1>
            </div>
        </div>
    </div>
    `;

    alertElements.push(element);
    if (alertElements.length === 1 && !timer) renderAlerts();
/*
    */
}

function renderAlerts(){
    if (alertElements.length > 0) {
        element = alertElements[0];
        $('.main-container').html(element);
        alertElements.shift();
        console.log('timer set up');
        timer = setTimeout(() => {
            console.log('timer ran out');
            $('.main-container').html('');
            renderAlerts();
            timer = null;
        }, (cuttingAnimationDelay + cuttingAnimationDuration) * 1000);
    }
}

//This function actually removes the alert with a nice little animation :) .
function removeAlert(eventId) {
    $(`#event-${eventId}`).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(`#event-${eventId}`).remove();
    });
}
