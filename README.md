# Log-to-route (l2r)

## l2r.config.json
Create a l2r.config.json in the root of your app and add the following.
```json
{
    "logFile": {
      "format": "styled",
      "enabled": true,
      "fileName": "app.log",
      "location": "./",
      "timeType": "epoch",
      "colorizeStyledLog": false
    },
    "console": {
      "format": "styled",
      "enabled": true,
      "timeType": "locale",
      "colorizeStyledLog": true
    }
  }
```
### Config Options
format: "styled" or "ndjson"
    Styled either logs or displays a formated line 
    ndjson either logs or displays a newline delimited JSON string
    
enabled: true or false
    sets whether the console output or logfile output is enabled
    
filename: "<filename>.<ext>"
    filename you wish to use for the log file
    
location: "./"
    Log file location
    
timeType: "epoch" or "iso" or "dateTime"
    Display the time in varying formats;
        epoch: The epoch time in seconds since 1/1/1970 (i.e. 17627282892)
        iso: The ISO 8743 specificed timestamp typically used in SQL databases (i.e. 12/12/2025T00:00:00Z)
        dateTime: Displays your locale date in time in a formated string (i.e. 12/12/2025, 01:25:00PM) 

colorizedStyledLog:
    Adds coloring via Chalk to the formated log for either console or logfile    

colorizeStyledLog: true f
