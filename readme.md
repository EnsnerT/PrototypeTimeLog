# PrototypeTimeLog
by [ensnerT@github](https://github.com/EnsnerT/)

## What is it for
This Webpage was Created to give an easy way to track the Worktime.  

## How do i use it
Test it on the [Live Page](https://ensnert.github.io/PrototypeTimeLog/)  
  
### Today
This displays the Current Date and the Day of the Week in German.

### Daily Total
This Sums up the Shifts for Today in hh:mm:ss. 
   
A **Shift** is the Time difference between a Start block and a Break/End block.  
If the last Element in the List is a Start block, the Shift did not end yet, which calculates a End Block with the Current Time.

### Estimated End
I used in this Page a default of **8 Hours Work Day** and **42 Hours Work Week**.  
This Timer tells the Remaining Time for today plus the Current Time.  
For Example its 08:00:00 and in 8 Hours will be 16:00:00, so it displays that.

### Weekly Total
Like Daily Total, but this Sums up the Complete List.

### Weekly Overtime
Like Estimated End, except its subtracts from 42 Hours the Weekly Total.  

### Start Button
Add to the List an Start Shift Element.  
This will Signalize that a Working Shift has begun now.

### Break Button
Add to the List an Break Shift Element.  
This will Signalize that a Working Shift has been paused.  

### End Button
Add to the List an End Shift Element.  
This will Signalize that a Working Shift has been ended.

### The List
This is a List with the newest Element at the top.  
It is Colored like the Element Type, has its Element type Written on and Shows the Day and Time of that Element.  

### Reset Week
This will get rid of all Shifts in the List. (Needs to be Confirmed before it is removed)

### Export Week
Download all Elements in the List as an .json file.  
This can also be imported again.

### Import Data
The exported .json file can be **drag and dropped** into the page and will be loaded.  
There is an Option to Save the data into the storage system or to just Preview the Elements.  
The Preview disapears when Reloaded.

### Storage System
This Page works with the localstorage system.  
By adding or removing elements from the List, this storage is automatically updated.  
Reloading the Page at any time will save the Elements and Load it back again.  

## What did change since First Upload?

### Bugfix & Features, Update 0.0.1
Date : 2022-07-02  
Bugfixes
- "Today" is now Displaying the Current Date, even if no data is loaded (was not updating).
- "Estimated End" Text Displays now the time in 24h Scale and wraps back to 00:00:00 after 24h.
- The internal "zero" datetime was trying to subtract timezone offset, which was useless with that Implementation. 
- "global_storage" variable aka "localstorage key" now has now a more Descriptive value.

Features
- Export and Reset Buttons Switched places for less accidental presses.
- You can Drag'n Drop the Exported Files into the Page to load the Exported Data.
  - You can also chose to Preview the data (not save it in storage), or to import it into the Active Timer.
  - This will not be sortet, but will sort automaticly if the page is refreshed.
- Renamed time.html to index.html
### Initial Commit
Date : 2022-07-01
- Uploaded time.html and script_tl.js
