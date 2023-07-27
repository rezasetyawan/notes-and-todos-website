const formatTimestampWithTimeZone = (millisecondsTimestamp: string, timeZone: string):string => {
    const dateObject = new Date(parseInt(millisecondsTimestamp));
    const options: object = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone,
        hour12: false,
    };
    const formattedDate = dateObject.toLocaleString(undefined, options);
    return formattedDate;
}

export { formatTimestampWithTimeZone }