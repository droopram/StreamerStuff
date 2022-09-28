var newSubs = 0;
var newBits = 0;
var newFollowers = 0;
window.addEventListener('onWidgetLoad', function (obj) {
    let data=obj["detail"]["session"]["data"];
    renderCurrentStats(data);
});

window.addEventListener('onSessionUpdate', function (obj) {
    let data = obj.detail.session;
    renderCurrentStats(data);
});

function renderCurrentStats(data){
  	newSubs = data["subscriber-new-session"]["count"];//data["subscriber-total"]["count"];
  	newBits = data["cheer-session"]["amount"];//data["cheer-total"]["count"];
  	newFollowers = data["follower-session"]["count"];//data["follower-total"]["count"];
	document.querySelector('[data-binding="subsGoalText"]').innerHTML = newSubs+'/'+{subGoal}+' Subs goal';
	document.querySelector('[data-binding="bitsGoalText"]').innerHTML = newBits+'/'+{bitsGoal}+' Bits goal';
	document.querySelector('[data-binding="followerGoalText"]').innerHTML = newFollowers+'/'+{followerGoal}+' Follower goal';
   
	var r = document.querySelector(':root');
    r.style.setProperty('--subsStrokeOffset', 440 - 440 * (newSubs/{subGoal}));
    r.style.setProperty('--bitsStrokeOffset', 314 - 314 * (newBits/{bitsGoal}));
    r.style.setProperty('--followsStrokeOffset', 190 - 190 * (newFollowers/{followerGoal}));
}