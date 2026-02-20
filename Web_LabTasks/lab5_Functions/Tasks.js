//Task-1

var arr=[4500, 6200, 5800, 7100, 4900, 8300, 6700]
function addSteps(dayIndex, steps) //Updates the step count for a specific day (0-based index).
{
arr[dayIndex]+=steps;
}
function getHighestSteps() //Returns the highest step count of the week.
{
var max=-1;
arr.forEach(num=>{if (num>max){max=num}})
return max;
}
function getLowestSteps() //Returns the lowest step count of the week.
{
var min=getHighestSteps();
arr.forEach(num=>
    {if (num<min){min=num}
})
return min;
}
function getAverageSteps() //Calculates and returns the average steps.
{
var sum=0;
arr.forEach(num=>sum+=num)
return (sum/arr.length);
}
function getAboveAverageDays() //Returns an array of step counts that are above the weeklyaverage (use filter).
{
var avg=getAverageSteps();
let arr2=arr.filter(num=>num>avg)
return arr2
}

//Task-2
var attendee=[]
function addAttendee(name, email, ticketType) //Adds a new attendee if capacity not reached.
{
attendee.push({name:name, email: email, ticketType: ticketType})
}
function isFull()// Returns true if the number of registered attendees has reached 100, otherwise false.
{
    if(attendee.length>100)
    {return true;}
    else
    {return false;}
}
function  listAttendees()//Logs all registered attendees in a formatted list (use forEach)
{
console.log(attendee);
}
function countByTicketType(type)//Returns the number of attendees with a given ticket type(use filter).
{
var num=0;
attendee.forEach(a=>{
if(a.ticketType=type)
{num++;}
});
return num;
}

//Task-3
var movies=[]
function addMovie(title, director, genre, year)// Adds a new movie to the collection.
{
    movies.push({title:title, director:director, genre:genre, year:year})
}
function listMovies()// Displays all movies in a readable format (use map and join to create a formatted string).
{console.log(movies)}
function searchByDirector(director) //Returns an array of movies by a given director (use filter and string methods for case-insensitive comparison).
{var dir;
    movies.forEach(m => {
        if(m.director.toLowerCase()==director.toLowerCase()){dir =m.director;}
    });
return dir;
}
function searchByGenre(genre) //Returns an array of movies of a given genre (case-insensitive).
{var dir;
    movies.forEach(m => {
        if(m.genre.toLowerCase()==genre.toLowerCase()){dir =m.genre;}
    });
return dir;
}

//Task-4 Fixed
console.log("\nOutput Task-4")
const getAverage = (arr) => {
let sum = 0;
arr.map(num => sum +=num);
return sum / arr.length;
};
console.log(getAverage([10,20,30]));
function findLongestWord(str){
let words = str.split(" ");
return words.reduce((a,b)=>{
if(a.length > b.length)
return a
});
}
console.log(findLongestWord("JavaScript is very powerful language"));
const checkPass = (marks)=>{
if(marks.filter(m => m >= 50).length>0)
return "Pass"
else
return "Fail"
}
console.log(checkPass([20,30,40]));


//Task-5
function cleanUsername(name){
let nm=name.trim().replace(/\s/g, "")
nm=nm.toLowerCase()
return nm;
}

function validateUsername(name){
f1=name.charAt(0)
if((name.length>5 && name.length<=20)&& (f1.toLowerCase==f1.toUpperCase)&& (name.replace(/[_a-z0-9]/gi, '')==undefined))
{return true}
else
{return false}
}



console.log("\nOutput Task-1")
addSteps(0,10);
console.log(arr);
console.log(getHighestSteps());
console.log(getLowestSteps());
console.log(getAverageSteps());
console.log(getAboveAverageDays());

console.log("\nOutput Task-2")
addAttendee("a", "a@gmail.com", "enterprise")
console.log(isFull())
listAttendees()
console.log(countByTicketType("enterprise"))

console.log("\nOutput Task-3")
addMovie("a","b","c","d");
listMovies();
console.log(searchByDirector("b"))
console.log(searchByGenre("c"))

console.log("\nOutput Task-5")
console.log(cleanUsername(" AHMAD_kHan123 "))
console.log(validateUsername(" AHMAD_kHan123 "))

