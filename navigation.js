$(document).ready(function () {
    loadScreen('search');
});

function loadScreen(screenName)
{
    var screenPath = './screens/' + screenName + '.html';
    $('#content').load(screenPath, function()
    {
        console.log(screenName + ' screen loaded');
    });
}