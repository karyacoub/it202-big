function militaryToStandardTime(time)
{
    var hours = parseInt(time.substring(0, 2));
    var minutes = time.substring(2, 4);
    var amOrPm = 'AM';

    if(hours >= 12)
    {
        amOrPm = 'PM'
        
        if(hours > 12)
        {
            hours -= 11;
        }
    }
    else if(hours === 0)
    {
        hours = 12;
    }

    return hours + ':' + minutes + ' ' + amOrPm;
}